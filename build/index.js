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
        this.ENDPOINT = endpoint;
        this.PROVIDER = new ethers_1.ethers.JsonRpcProvider(endpoint);
        this.handlePendingTransaction = this.handlePendingTransaction.bind(this);
    }
    /**
     * Starts up and listens for transaction made by calling a specific
     * function `config.functionName` at a deployed contract at `config.address`.
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
                throw new Error(`${functionName} is not existent in ABI.\nFunctions in ABI, ${functionNames}`);
            this.ABI = abi;
            this.functionName = functionName;
            this.executableFunction = executableFunction;
            this.PROVIDER.on("pending", this.handlePendingTransaction);
        });
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
    handlePendingTransaction(txHash) {
        return __awaiter(this, void 0, void 0, function* () {
            const tx = yield this.PROVIDER.getTransaction(txHash);
            if (tx) {
                const { data, value } = tx;
                const transactionFunctionSignature = data.slice(0, 10);
                const selector = (0, encode_function_with_signature_1.encodeFunctionWithSignature)(this.ABI, this.functionName);
                if (transactionFunctionSignature == selector) {
                    const decodedData = (0, decode_transaction_data_1.decodeTransactionData)(this.ABI, { data, value });
                    if (decodedData) {
                        const { args: txArgs } = decodedData;
                        const args = { args: txArgs, value };
                        this.executableFunction(args);
                    }
                }
            }
        });
    }
}
exports.default = MempoolListener;
