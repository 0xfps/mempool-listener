"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.encodeFunctionWithSignature = void 0;
const ethers_1 = require("ethers");
/**
 * Return the function selector for `functionName` using its parameters.
 *
 * @param abi           Contract ABI.
 * @param functionName  Function name.
 *
 * @returns string Function selector.
 */
function encodeFunctionWithSignature(abi, functionName) {
    var _a;
    const selectedAbi = abi.find(function (abi) {
        return ((abi.type == "function") && (abi.name == functionName));
    });
    if (!selectedAbi)
        throw new Error(`${functionName} function does not exist in the ABI.`);
    const contractInterface = new ethers_1.ethers.Interface(abi);
    const functionString = (_a = contractInterface.getFunction(functionName)) === null || _a === void 0 ? void 0 : _a.format("sighash");
    if (!functionString)
        throw new Error(`Function string for ${functionName} is inexistent.`);
    return ethers_1.ethers.id(functionString).slice(0, 10);
}
exports.encodeFunctionWithSignature = encodeFunctionWithSignature;
