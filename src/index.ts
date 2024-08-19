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
     * to listen for, and the `selector` stores the calculated function selector of
     * the function we're listening for, the `address` is the address of the smart
     * contract we want to pick up pending transactions for.
     */
    public ABI!: Abi
    public functionName!: string
    public selector!: string
    public address!: string

    /**
     * The `executableFunction` is a user declared function that
     * runs whenever a pending transaction made to `functionName` is picked up.
     * 
     * The `executableFunction` requires one parameter, `args`, an object containing
     * the arguments in the picked up pending transaction, the value sent to the call,
     * and the gas price paid for the transaction.
     * 
     * @param args  An object of arguments from the picked up transaction, (`args`),
     *              the value sent along the contract call, (`value`) and the gas price
     *              paid for the transaction, (`gasPrice`).
     */
    public executableFunction!: (args: any) => any

    /** 
     * Sets the endpoint and starts up the provider.
     * 
     * @param endpoint RPC Endpoint.
     */
    constructor(endpoint: string) {
        let subEndpoint = endpoint.replace(/ /g, '')
        if (subEndpoint.length == 0) throw new Error("Endpoint is an empty string.")
        
        this.ENDPOINT = endpoint
        this.PROVIDER = new ethers.JsonRpcProvider(endpoint)
        this.handlePendingTransaction = this.handlePendingTransaction.bind(this)
    }

    /**
     * Starts up and listens for transaction made by calling a specific
     * function `config.functionName` at a deployed contract at `config.address`.
     * It is more efficient to calculate and store the function selector of the function
     * to listen for, so that, in cases of every `"pending"` listener reception, we're
     * not recalculating the function selector, instead, comparing with a stored value.
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
            throw new Error(`${functionName} is not existent in ABI.\nFunctions in ABI: ${functionNames}.`)

        this.ABI = abi
        this.functionName = functionName
        this.selector = encodeFunctionWithSignature(abi, functionName)
        this.address = address
        this.executableFunction = executableFunction

        this.PROVIDER.on("pending", this.handlePendingTransaction)
    }

    /**
     * Stops the listening process. This doesn't remove the `executableFunction`,
     * neither does it remove any class state.
     */
    stopListener() {
        if (this.PROVIDER)
            this.PROVIDER.off("pending", this.handlePendingTransaction)
    }

    /**
     * Restarts the listening process. Since the `address`, `abi` and `functionName`
     * are stored in the class already, it simply only turns on the listener again,
     * preventing repassing the config and executable function.
     */
    restartListener() {
        if (this.PROVIDER)
            this.PROVIDER.on("pending", this.handlePendingTransaction)
    }

    /**
     * This function is called whenever a transaction is picked up by the listener. Then,
     * using the hash returned by the listener, returns the parent transaction and then
     * compares the first four bytes of the transaction data with the stored selector to find a match.
     * If there is a match, and the `to` key of the transaction data is the configured address,
     * the `executableFunction` configured already is called using an object containing the arguments
     * from the transaction and the value sent along the contract call.
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
            const { data, value, to, gasPrice } = tx
            const transactionFunctionSignature = data.slice(0, 10)
            const selector = this.selector

            if (selector && (transactionFunctionSignature == selector) && (to == this.address)) {
                const decodedData = decodeTransactionData(this.ABI, { data, value } as TransactionType)
                if (decodedData) {
                    const { args: txArgs } = decodedData
                    const args = { args: txArgs, value, gasPrice }
                    this.executableFunction(args)
                }
            }
        }
    }
}

export default MempoolListener