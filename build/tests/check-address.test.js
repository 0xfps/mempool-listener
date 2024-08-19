"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const mocha_1 = require("mocha");
const check_address_1 = require("../utils/check-address");
const VALID_ADDRESS_WITHOUT_0X = "5FF137D4b0FDCD49DcA30c7CF57E578a026d2789";
const INCOMPLETE_LENGTH_ADDRESS = "5FF137D4b0FDCD49DcA30c7CF57E578a026d278";
const EXTENDED_LENGTH_ADDRES = "5FF137D4b0FDCD49DcA30c7CF57E578a026d2785FF137D4b0FDCD49DcA30c7CF57E578a026d278";
const INVALID_ADDRESS = "Hello there!";
(0, mocha_1.describe)("Test Check Address", function () {
    it("Should fail while testing an address of incomplete length.", function () {
        (0, chai_1.expect)(() => (0, check_address_1.checkAddress)(INCOMPLETE_LENGTH_ADDRESS)).to.throw();
    });
    it("Should fail while testing an address of extended length.", function () {
        (0, chai_1.expect)(() => (0, check_address_1.checkAddress)(EXTENDED_LENGTH_ADDRES)).to.throw();
    });
    it("Should fail while testing an invalid address.", function () {
        (0, chai_1.expect)(() => (0, check_address_1.checkAddress)(INVALID_ADDRESS)).to.throw();
    });
    it("Should not throw an error because address is valid, even without '0x'.", function () {
        (0, chai_1.expect)(() => (0, check_address_1.checkAddress)(VALID_ADDRESS_WITHOUT_0X)).to.not.throw();
    });
    it("Should not throw an error because address is valid.", function () {
        (0, chai_1.expect)(() => (0, check_address_1.checkAddress)(`0x${VALID_ADDRESS_WITHOUT_0X}`)).to.not.throw();
    });
});
