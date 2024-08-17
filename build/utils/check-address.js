"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkAddress = void 0;
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
exports.checkAddress = checkAddress;
