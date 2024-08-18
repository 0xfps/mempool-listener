"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.decodeTransactionData = void 0;
const ethers_1 = require("ethers");
/**
 * Parses a transaction, finding the matching function and extracts the parameter values along with other useful function details.
 * If the matching function cannot be found, return null.
 * Source: <EthersJS>, https://github.com/ethers-io/ethers.js/blob/main/src.ts/abi/interface.ts#L1187-L1192.
 *
 * @param abi               Contract ABI.
 * @param TransactionType   Transaction data and value sent with transaction.
 *
 * @returns ParsedTransaction | null Parsed transaction data.
 */
function decodeTransactionData(abi, { data, value }) {
    const descr = new ethers_1.ethers.Interface(abi);
    const parsedTransaction = descr.parseTransaction({ data, value });
    return parsedTransaction;
}
exports.decodeTransactionData = decodeTransactionData;
