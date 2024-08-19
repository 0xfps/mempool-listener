import { ENTRY_POINT } from "./abis/entry-point-abi";

/**
 * Configurations for different chains for testing.
 * `functionName` is left out for the purposes of flexibility.
 */
export const ChainListenerConfigs = {
    sepolia: {
        abis: [ENTRY_POINT.abi],
        url: "https://eth-sepolia-public.unifra.io",
        address: "0x5FF137D4b0FDCD49DcA30c7CF57E578a026d2789"
    }
}