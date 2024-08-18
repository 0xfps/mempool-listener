import { BigNumberish } from "ethers";
/**
 * Returned and parsed transaction data.
 */
export type TransactionType = {
    hash: string;
    from: string;
    to: string;
    data: string;
    value: BigNumberish | number;
    gasLimit: number;
    gasPrice: number;
};
export type ParsedTransaction = {
    args: any[];
    selector: string;
};
