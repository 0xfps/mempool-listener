import { Abi } from "../types/abi-types";
import { ParsedTransaction, TransactionType } from "../types/transaction-data-types";
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
export declare function decodeTransactionData(abi: Abi, { data, value }: TransactionType): ParsedTransaction | null;
