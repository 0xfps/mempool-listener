"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChainListenerConfigs = void 0;
const entry_point_abi_1 = require("./abis/entry-point-abi");
/**
 * Configurations for different chains for testing.
 * `functionName` is left out for the purposes of flexibility.
 */
exports.ChainListenerConfigs = {
    sepolia: {
        abis: [entry_point_abi_1.ENTRY_POINT.abi],
        url: "https://eth-sepolia-public.unifra.io",
        address: "0x5FF137D4b0FDCD49DcA30c7CF57E578a026d2789"
    }
};
