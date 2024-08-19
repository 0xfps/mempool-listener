import { ethers } from "ethers";
import { Abi } from "../types/abi-types";
import { ParsedTransaction, TransactionType } from "../types/transaction-data-types";

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
export function decodeTransactionData(abi: Abi, { data, value }: TransactionType): ParsedTransaction | null {
    const descr = new ethers.Interface(abi)
    const parsedTransaction = descr.parseTransaction({ data, value }) as unknown as ParsedTransaction
    return parsedTransaction
}