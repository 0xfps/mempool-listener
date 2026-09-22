"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkAddress = checkAddress;
const ethers_1 = require("ethers");
/**
 * Validates the correctness of an address.
 *
 * @param address Address to validate.
 */
function checkAddress(address) {
    if (ethers_1.ethers.isAddress(address))
        return;
    throw new Error(`${address} is not a valid address.`);
}
