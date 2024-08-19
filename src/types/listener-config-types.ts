import { Abi } from "./abi-types"

/**
 * Configurations for where and what to listen to.
 * 
 * @param address       Contract address to listen to.
 * @param abi           ABI of contract at `address`.
 * @param functionName  Name of function to listen for.
 */
export type ListenerConfig = {
    address: string,
    abi: Abi,
    functionName: string
}