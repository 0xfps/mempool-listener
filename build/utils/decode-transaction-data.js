"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.decodeTransactionData = void 0;
const ethers_1 = require("ethers");
/**
 * Parses a transaction, finding the matching function and extracts the parameter values along with other useful function details.
 * If the matching function cannot be found, return null.
 * cc: <EthersJS>.
 *
 * @param abi               Contract ABI.
 * @param TransactionType   Transaction data and transaction data value.
 *
 * @returns ParsedTransaction | null Parsed transaction data.
 */
function decodeTransactionData(abi, { data, value }) {
    const descr = new ethers_1.ethers.Interface(abi);
    const parsedTransaction = descr.parseTransaction({ data, value });
    return parsedTransaction;
}
exports.decodeTransactionData = decodeTransactionData;
