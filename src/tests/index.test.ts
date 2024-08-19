import { expect } from "chai";
import { describe } from "mocha";
import MempoolListener from "..";
import { ChainListenerConfigs } from "./constants";
import { encodeFunctionWithSignature } from "../utils/encode-function-with-signature";
import { Abi } from "../types/abi-types";

const URL = ChainListenerConfigs.sepolia.url
const address = ChainListenerConfigs.sepolia.address
const ABI = ChainListenerConfigs.sepolia.abis[0]

describe("MempoolListener Test", function () {
    it("Should fail to start endpoint with empty string.", function () {
        expect(() => { new MempoolListener("   ") }).to.throw()
    })

    it("Should set the endpoint and the provider.", function () {
        const mempoolListener = new MempoolListener(URL)
        expect(mempoolListener.ENDPOINT).to.be.eq(URL)
        expect(mempoolListener.PROVIDER).to.not.be.undefined
    })

    it("Should throw an error because function name is not in ABI.", async function () {
        const mempoolListener = new MempoolListener(URL)

        try {
            await mempoolListener.listen({ abi: ABI as any, address, functionName: "dontHandleOps" }, (args) => { })
            throw new Error("Expected error but none was thrown.");
        } catch (error) {
            expect(error).to.be.an("error")
        }
    })

    it("Should start listening.", async function () {
        const mempoolListener = new MempoolListener(URL)
        await mempoolListener.listen({ abi: ABI as any, address, functionName: "handleOps" }, (args) => { console.log(args) })
        expect(mempoolListener.address).to.be.eq(address)
        expect(mempoolListener.functionName).to.be.eq("handleOps")
        expect(mempoolListener.executableFunction).to.not.be.undefined
        expect(mempoolListener.selector).to.be.eq(encodeFunctionWithSignature(ABI as any, "handleOps"))

        mempoolListener.stopListener()
    })
})