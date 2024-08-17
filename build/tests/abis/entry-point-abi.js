"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ENTRY_POINT = void 0;
const EntryPoint_json_1 = __importDefault(require("./json/EntryPoint.json"));
/**
 * Exports for testing the EntryPoint contract on the Sepolia Testnet chain at
 * 0x5FF137D4b0FDCD49DcA30c7CF57E578a026d2789.
 *
 * https://sepolia.etherscan.io/address/0x5FF137D4b0FDCD49DcA30c7CF57E578a026d2789
 */
exports.ENTRY_POINT = {
    abi: EntryPoint_json_1.default
};
