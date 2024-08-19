/**
 * ABI Types.
 * 
 * This is a representation of the components of a Solidity ABI
 * in their respective types.
 */
type AbiInput = {
    indexed?: boolean
    components?: AbiInput[],
    internalType: string
    name: string
    type: string
}

type AbiOutput = {
    components?: AbiInput[]
    internalType: string
    name: string
    type: string
}

type AbiType = {
    anonymous?: boolean
    inputs: AbiInput[]
    stateMutability?: string
    outputs?: AbiOutput[]
    name: string
    type: string
}

export type Abi = AbiType[]