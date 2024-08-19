"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const mocha_1 = require("mocha");
const encode_function_with_signature_1 = require("../utils/encode-function-with-signature");
const entry_point_abi_1 = require("./abis/entry-point-abi");
const VALID_FUNCTION_NAME = "handleOps";
const INVALID_FUNCTION_NAME = "dontHandleOps";
(0, mocha_1.describe)("Test Encode Function With Signature", function () {
    it("Should fail when it doesn't find function name in ABI.", function () {
        (0, chai_1.expect)(() => (0, encode_function_with_signature_1.encodeFunctionWithSignature)(entry_point_abi_1.ENTRY_POINT.abi, INVALID_FUNCTION_NAME))
            .to.throw(Error, `${INVALID_FUNCTION_NAME} function does not exist in the ABI.`);
    });
    /**
     * Lines 24 and 25 are not reachable.
     */
    it("Should return a valid function string.", function () {
        (0, chai_1.expect)(() => (0, encode_function_with_signature_1.encodeFunctionWithSignature)(entry_point_abi_1.ENTRY_POINT.abi, VALID_FUNCTION_NAME))
            .to.not.throw();
        (0, chai_1.expect)((0, encode_function_with_signature_1.encodeFunctionWithSignature)(entry_point_abi_1.ENTRY_POINT.abi, VALID_FUNCTION_NAME))
            .to.not.be.empty;
    });
});
