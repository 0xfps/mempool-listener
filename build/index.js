"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const ethers_1 = require("ethers");
const check_address_1 = require("./utils/check-address");
const return_functions_from_abi_1 = require("./utils/return-functions-from-abi");
const decode_transaction_data_1 = require("./utils/decode-transaction-data");
const encode_function_with_signature_1 = require("./utils/encode-function-with-signature");
class MempoolListener {
    /**
     * Sets the endpoint and starts up the provider.
     *
     * @param endpoint RPC Endpoint.
     */
    constructor(endpoint) {
        let subEndpoint = endpoint.replace(/ /g, '');
        if (subEndpoint.length == 0)
            throw new Error("Endpoint is an empty string.");
        this.ENDPOINT = endpoint;
        this.PROVIDER = new ethers_1.ethers.JsonRpcProvider(endpoint);
        this.handlePendingTransaction = this.handlePendingTransaction.bind(this);
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
    listen(config, executableFunction) {
        return __awaiter(this, void 0, void 0, function* () {
            const { address, abi, functionName } = config;
            (0, check_address_1.checkAddress)(address);
            const functionNames = (0, return_functions_from_abi_1.returnFunctionsFromAbi)(abi);
            if (!functionNames.includes(functionName))
                throw new Error(`${functionName} is not existent in ABI.\nFunctions in ABI: ${functionNames}.`);
            this.ABI = abi;
            this.functionName = functionName;
            this.selector = (0, encode_function_with_signature_1.encodeFunctionWithSignature)(abi, functionName);
            this.address = address;
            this.executableFunction = executableFunction;
            this.PROVIDER.on("pending", this.handlePendingTransaction);
        });
    }
    /**
     * Stops the listening process. This doesn't remove the `executableFunction`,
     * neither does it remove any class state.
     */
    stopListener() {
        if (this.PROVIDER)
            this.PROVIDER.off("pending", this.handlePendingTransaction);
    }
    /**
     * Restarts the listening process. Since the `address`, `abi` and `functionName`
     * are stored in the class already, it simply only turns on the listener again,
     * preventing repassing the config and executable function.
     */
    restartListener() {
        if (this.PROVIDER)
            this.PROVIDER.on("pending", this.handlePendingTransaction);
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
    handlePendingTransaction(txHash) {
        return __awaiter(this, void 0, void 0, function* () {
            const tx = yield this.PROVIDER.getTransaction(txHash);
            if (tx) {
                const { data, value, to, gasPrice } = tx;
                const transactionFunctionSignature = data.slice(0, 10);
                const selector = this.selector;
                if (selector && (transactionFunctionSignature == selector) && (to == this.address)) {
                    const decodedData = (0, decode_transaction_data_1.decodeTransactionData)(this.ABI, { data, value });
                    if (decodedData) {
                        const { args: txArgs } = decodedData;
                        const args = { args: txArgs, value, gasPrice };
                        this.executableFunction(args);
                    }
                }
            }
        });
    }
}
exports.default = MempoolListener;
