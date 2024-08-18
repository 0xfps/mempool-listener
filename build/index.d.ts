import { ethers } from "ethers";
import { ListenerConfig } from "./types/listener-config-types";
import { Abi } from "./types/abi-types";
declare class MempoolListener {
    /**
     * RPC Endpoint, used to start up a new `JsonRpcProvider`.
     */
    readonly ENDPOINT: string;
    readonly PROVIDER: ethers.JsonRpcProvider;
    /**
     * The `ABI` stores the ABI of the contract to listen to, while
     * the `functionName` holds a string value of the name of the function
     * to listen for, and the `selector` stores the function selector of
     * the function we're listening for.
     */
    ABI: Abi;
    functionName: string;
    selector: string;
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
    executableFunction: (args: any) => any;
    /**
     * Sets the endpoint and starts up the provider.
     *
     * @param endpoint RPC Endpoint.
     */
    constructor(endpoint: string);
    /**
     * Starts up and listens for transaction made by calling a specific
     * function `config.functionName` at a deployed contract at `config.address`.
     * It is more efficient to calculate and store the function selector to listen
     * for, so that, in cases of every `"pending"` listener reception, we're not
     * recalculating the function selector, instead, comparing with a stored value.
     *
     * @param config                ListenerConfig
     * @param executableFunction    User passed function to be called whenever
     *                              the listener picks up a matching transaction.
     */
    listen(config: ListenerConfig, executableFunction: (args: any) => any): Promise<void>;
    /**
     * Stops the listening process. This doesn't remove the `executableFunction`,
     * neither does it remove any class state.
     */
    stopListener(): void;
    /**
     * This function is called whenever a transaction is picked up by the listener. Then,
     * using the hash returned by the listener, returns the parent transaction and then
     * compares the first four bytes of the transaction data with the stored selector to find a match.
     * If there is a match, the `executableFunction` configured already is called using an object
     * containing the arguments from the transaction and the value sent along the contract call.
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
    private handlePendingTransaction;
}
export default MempoolListener;
