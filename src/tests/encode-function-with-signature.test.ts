import { expect } from "chai"
import { describe } from "mocha"
import { encodeFunctionWithSignature } from "../utils/encode-function-with-signature"
import { ENTRY_POINT } from "./abis/entry-point-abi"

const VALID_FUNCTION_NAME = "handleOps"
const INVALID_FUNCTION_NAME = "dontHandleOps"

describe("Test Encode Function With Signature", function () {
    it("Should fail when it doesn't find function name in ABI.", function () {
        expect(() => encodeFunctionWithSignature(ENTRY_POINT.abi as any, INVALID_FUNCTION_NAME))
            .to.throw(Error, `${INVALID_FUNCTION_NAME} function does not exist in the ABI.`)
    })

    /**
     * Lines 24 and 25 are not reachable.
     */

    it("Should return a valid function string.", function () {
        expect(() => encodeFunctionWithSignature(ENTRY_POINT.abi as any, VALID_FUNCTION_NAME))
            .to.not.throw()

        expect(encodeFunctionWithSignature(ENTRY_POINT.abi as any, VALID_FUNCTION_NAME))
            .to.not.be.empty
    })
})