import { ethers } from "ethers";

/**
 * Validates the correctness of an address.
 * 
 * @param address Address to validate.
 */

export function checkAddress(address: string) {
    if (ethers.isAddress(address)) return
    throw new Error(`${address} is not a valid address.`)
}