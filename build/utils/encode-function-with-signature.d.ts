import { Abi } from "../types/abi-types";
/**
 * Return the function selector for `functionName` using its parameters.
 *
 * @param abi           Contract ABI.
 * @param functionName  Function name.
 *
 * @returns string Function selector.
 */
export declare function encodeFunctionWithSignature(abi: Abi, functionName: string): string;
