import { ethers } from "ethers";
import { Abi } from "../types/abi-types";

/**
 * Return the function selector for `functionName`.
 * 
 * @param abi           Contract ABI.
 * @param functionName  Function name.
 * 
 * @returns string Function selector. 
 */

export function encodeFunctionWithSignature(abi: Abi, functionName: string): string {
    const selectedAbi = abi.find(function (abi) {
        return ((abi.type == "function") && (abi.name == functionName))
    })

    if (!selectedAbi)
        throw new Error(`${functionName} function not found in ABI.`)

    const contractInterface = new ethers.Interface(abi)
    const functionString = contractInterface.getFunction(functionName)?.format("sighash")

    if (!functionString)
        throw new Error(`Function string for ${functionName} inexistent!`)

    return ethers.id(functionString).slice(0, 10)
}