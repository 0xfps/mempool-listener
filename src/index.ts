import { ethers } from "ethers"
import { ListenerConfig } from "./types/listener-config-types"
import { checkAddress } from "./utils/check-address"
import { returnFunctionsFromAbi } from "./utils/return-functions-from-abi"
import { TransactionType } from "./types/transaction-data-types"
import { Abi } from "./types/abi-types"
import { decodeTransactionData } from "./utils/decode-transaction-data"
import { encodeFunctionWithSignature } from "./utils/encode-function-with-signature"

class MempoolListener {
    /**
     * RPC Endpoint, used to start up a new `JsonRpcProvider`.
     */
    public readonly ENDPOINT: string
    public readonly PROVIDER: ethers.JsonRpcProvider

    /**
     * The `ABI` stores the ABI of the contract to listen to, while
     * the `functionName` holds a string value of the name of the function
     * to listen for.
     */
    public ABI!: Abi
    public functionName!: string

    /**
     * The `executableFunction` is a user declared function that
     * runs whenever a pending transaction made to `functionName` is picked up.
     * 
     * The `executableFunction` requires one parameter, `args`, the arguments
     * in the picked up pending transaction.
     * 
     * @param args  An object of arguments from the picked up transaction, (`args`)
     *              and the value sent along the contract call, (`value`).
     */
    public executableFunction !: (args: any) => any

    /** 
     * Sets the endpoint and starts up the provider.
     * 
     * @param endpoint RPC Endpoint.
     */
    constructor(endpoint: string) {
        this.ENDPOINT = endpoint
        this.PROVIDER = new ethers.JsonRpcProvider(endpoint)
        this.handlePendingTransaction = this.handlePendingTransaction.bind(this)
    }

    /**
     * Starts up and listens for transaction made by calling a specific
     * function `config.functionName` at a deployed contract at `config.address`.
     * 
     * @param config                ListenerConfig
     * @param executableFunction    User passed function to be called whenever
     *                              the listener picks up a matching transaction.
     */
    async listen(config: ListenerConfig, executableFunction: (args: any) => any) {
        const { address, abi, functionName } = config
        checkAddress(address)

        const functionNames = returnFunctionsFromAbi(abi)
        if (!functionNames.includes(functionName))
            throw new Error(`${functionName} is not existent in ABI.\nFunctions in ABI, ${functionNames}`)

        this.ABI = abi
        this.functionName = functionName
        this.executableFunction = executableFunction
        this.PROVIDER.on("pending", this.handlePendingTransaction)
    }

    /**
     * This function is called whenever a transaction is picked up by the listener. Then,
     * using the hash returned by the listener, returns the parent transaction and then
     * compares the first four bytes of the transaction data with the calculated selector
     * from the `functionName` to find a match. If there is a match, the
     * `executableFunction` configured already is called using an object containing the
     * arguments from the transaction and the value sent along the contract call.
     * 
     * `decodeTransactionData` will return a valid parsed transaction data even when the
     * transaction data starts with a selector that is not the one being listened for.
     * Because of this, the `selector` is calculated and matched with the transaction
     * data selector before proceeding with the transaction parsing process.
     * 
     * Study the constituents of `args` first before proceeding with it in your executable function.
     * 
     * @param txHash Transaction hash of picked up transaction.
     */
    private async handlePendingTransaction(txHash: string) {
        const tx: TransactionType = await this.PROVIDER.getTransaction(txHash) as unknown as TransactionType

        if (tx) {
            const { data, value } = tx
            const transactionFunctionSignature = data.slice(0, 10)
            const selector = encodeFunctionWithSignature(this.ABI, this.functionName)

            if (transactionFunctionSignature == selector) {
                const decodedData = decodeTransactionData(this.ABI, { data, value } as TransactionType)
                if (decodedData) {
                    const { args: txArgs } = decodedData
                    const args = { args: txArgs, value }
                    this.executableFunction(args)
                }
            }
        }
    }
}

export default MempoolListener