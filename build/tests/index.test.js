"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const mocha_1 = require("mocha");
const __1 = __importDefault(require(".."));
const constants_1 = require("./constants");
const encode_function_with_signature_1 = require("../utils/encode-function-with-signature");
const URL = constants_1.ChainListenerConfigs.sepolia.url;
const address = constants_1.ChainListenerConfigs.sepolia.address;
const ABI = constants_1.ChainListenerConfigs.sepolia.abis[0];
(0, mocha_1.describe)("MempoolListener Test", function () {
    it("Should fail to start endpoint with empty string.", function () {
        (0, chai_1.expect)(() => { new __1.default("   "); }).to.throw();
    });
    it("Should set the endpoint and the provider.", function () {
        const mempoolListener = new __1.default(URL);
        (0, chai_1.expect)(mempoolListener.ENDPOINT).to.be.eq(URL);
        (0, chai_1.expect)(mempoolListener.PROVIDER).to.not.be.undefined;
    });
    it("Should throw an error because function name is not in ABI.", function () {
        return __awaiter(this, void 0, void 0, function* () {
            const mempoolListener = new __1.default(URL);
            try {
                yield mempoolListener.listen({ abi: ABI, address, functionName: "dontHandleOps" }, (args) => { });
                throw new Error("Expected error but none was thrown.");
            }
            catch (error) {
                (0, chai_1.expect)(error).to.be.an("error");
            }
        });
    });
    it("Should start listening.", function () {
        return __awaiter(this, void 0, void 0, function* () {
            const mempoolListener = new __1.default(URL);
            yield mempoolListener.listen({ abi: ABI, address, functionName: "handleOps" }, (args) => { console.log(args); });
            (0, chai_1.expect)(mempoolListener.address).to.be.eq(address);
            (0, chai_1.expect)(mempoolListener.functionName).to.be.eq("handleOps");
            (0, chai_1.expect)(mempoolListener.executableFunction).to.not.be.undefined;
            (0, chai_1.expect)(mempoolListener.selector).to.be.eq((0, encode_function_with_signature_1.encodeFunctionWithSignature)(ABI, "handleOps"));
            mempoolListener.stopListener();
        });
    });
});
