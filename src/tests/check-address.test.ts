import { expect } from "chai"
import { describe } from "mocha"
import { checkAddress } from "../utils/check-address"

const VALID_ADDRESS_WITHOUT_0X = "5FF137D4b0FDCD49DcA30c7CF57E578a026d2789"
const INCOMPLETE_LENGTH_ADDRESS = "5FF137D4b0FDCD49DcA30c7CF57E578a026d278"
const EXTENDED_LENGTH_ADDRES = "5FF137D4b0FDCD49DcA30c7CF57E578a026d2785FF137D4b0FDCD49DcA30c7CF57E578a026d278"
const INVALID_ADDRESS = "Hello there!"

describe("Test Check Address", function () {
    it("Should fail while testing an address of incomplete length.", function () {
        expect(() => checkAddress(INCOMPLETE_LENGTH_ADDRESS)).to.throw()
    })

    it("Should fail while testing an address of extended length.", function () {
        expect(() => checkAddress(EXTENDED_LENGTH_ADDRES)).to.throw()
    })

    it("Should fail while testing an invalid address.", function () {
        expect(() => checkAddress(INVALID_ADDRESS)).to.throw()
    })

    it("Should not throw an error because address is valid, even without '0x'.", function () {
        expect(() => checkAddress(VALID_ADDRESS_WITHOUT_0X)).to.not.throw()
    })

    it("Should not throw an error because address is valid.", function () {
        expect(() => checkAddress(`0x${VALID_ADDRESS_WITHOUT_0X}`)).to.not.throw()
    })
})