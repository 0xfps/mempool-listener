"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.returnFunctionsFromAbi = void 0;
/**
 * This function takes a valid contract ABI and returns all the functions
 * in the ABI in a string array.
 *
 * @param abi Contract ABI.
 *
 * @returns string[] Array of function names.
 */
function returnFunctionsFromAbi(abi) {
    return abi.filter(function (abi) {
        return abi.type == "function";
    }).map(function (abi) {
        return abi.name;
    });
}
exports.returnFunctionsFromAbi = returnFunctionsFromAbi;
