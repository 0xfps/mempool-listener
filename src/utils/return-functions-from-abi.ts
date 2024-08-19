import { Abi } from "../types/abi-types";

/**
 * This function takes a valid contract ABI and returns all the functions
 * in the ABI in a string array.
 * 
 * @param abi Contract ABI.
 * 
 * @returns string[] Array of function names.
 */
export function returnFunctionsFromAbi(abi: Abi): string[] {
    return abi.filter(function (abi) {
        return abi.type == "function"
    }).map(function (abi) {
        return abi.name
    })
}