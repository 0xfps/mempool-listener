# mempool-listener
A mempool listener for contract specific transactions.

## ⚠️ Warning
This implementation is for educational purposes and not for production use. The tests carried out with this listener were all done on testnet networks and uses specific RPC endpoints that support the `eth_newPendingTransaction` API. It is nice to note that not all RPC or WSS endpoints support this API.

## Links
[GitHub Repository](https://github.com/0xfps/mempool-listener)<br>
[Node Package Manager (NPM)](https://www.npmjs.com/package/mempool-listener)

## Quick Explanation
Assuming we want to set up such a mempool listener for transactions that were sent due to a call on the [`handleOps()`](https://sepolia.etherscan.io/writecontract/index?m=light&v=21.10.1.1&a=0x5FF137D4b0FDCD49DcA30c7CF57E578a026d2789&n=sepolia&p=#collapse5) function at [this contract address](https://sepolia.etherscan.io/writecontract/index?m=light&v=21.10.1.1&a=0x5FF137D4b0FDCD49DcA30c7CF57E578a026d2789) on Ethereum Sepolia, this listener will only pick up transactions that the data key of their transaction object starts with the function signature `0x1fad948c` and call a set `executableFunction` the listener has been configured with. This is achieved by setting up a provider with a user chosen Ethereum Sepolia WSS or RPC endpoint, and using the provider's event listeners, filter out and work with only the [`handleOps()`](https://sepolia.etherscan.io/writecontract/index?m=light&v=21.10.1.1&a=0x5FF137D4b0FDCD49DcA30c7CF57E578a026d2789&n=sepolia&p=#collapse5) transactions sent to that contract address that are in the mempool. We can use the ABI for the configured transaction to be listened for to try to extract the values sent as arguments to the transaction and we can try to do stuff with that in the `executableFunction` as the user desires. Refer to [this article](https://www.showwcase.com/article/14647/how-to-listen-to-pending-transactions-using-ethersjs) on how this can be achieved.

## Collaborating
If you happen to use this package, and run into some bug, or have some ideas on how I can improve the functionalities, please reach out by opening an [issue](https://github.com/0xfps/mempool-listener/issues). You can also fix it yourself and make a pull request. Thanks, and I appreciate your use of this package.

## How To Use
Import package from NPM.
```shell
npm install mempool-listener
```

Import `MempoolListener` into your code file and initialize it with your chosen RPC or WSS endpoint URL. Your RPC or WSS URL should support the [`eth_newPendingTransaction`](https://etclabscore.github.io/core-geth/JSON-RPC-API/modules/eth/#eth_newpendingtransactions) API.
```ts
// TypeScript.
import MempoolListener from "mempool-listener"
const mempoolListener = new MempoolListener("RPC or WSS URL")
```

```js
// JavaScript.
const MempoolListener = require("mempool-listener").default
const mempoolListener = new MempoolListener("RPC or WSS URL")
```

OR

```js
// JavaScript.
const { default: MempoolListener } = require("mempool-listener")
const mempoolListener = new MempoolListener("RPC or WSS URL")
```

Configure the ABI of the contract, the contract address and function name to listen to. Also, configure your executable function, in this case called `executableFunc`. This is the function that gets called whenever a transaction that matches the `functionName` is picked up by the listener. `executableFunc` **MUST** have one parameter, `args` that is an object containing the arguments in the picked up pending transaction, the value sent to the call, and the gas price paid for the transaction.

```ts
// TypeScript.
import { Abi } from "mempool-listener/build/types/abi-types"
import { ListenerConfig } from "mempool-listener/build/types/listener-config-types"

const config = {
    address: "0xabcdef",
    abi: ["Contract Abi"] as Abi,
    functionName: "functionName"
}

function executableFunc(args) {
    console.log(args)
}
```

```js
// JavaScript.
import { Abi } from "mempool-listener/build/types/abi-types"
import { ListenerConfig } from "mempool-listener/build/types/listener-config-types"

const config = {
    address: "0xabcdef",
    abi: ["Contract Abi"] as Abi,
    functionName: "functionName"
}

function executableFunc(args) {
    console.log(args)
}
```

Finally, you can start up your listener passing the `config` and `executableFunc` as arguments.

```ts
// TypeScript.
import MempoolListener from "mempool-listener"
const mempoolListener = new MempoolListener("RPC or WSS URL")
mempoolListener.listen(config, executableFunc)
```

```js
// JavaScript.
const MempoolListener = require("mempool-listener").default
const mempoolListener = new MempoolListener("RPC or WSS URL")
mempoolListener.listen(config, executableFunc)
```

Whenever a pending transaction is picked up, it checks for the first four bytes of the `data` key in the transaction data and tries to match it with the selector of the function name you passed in your config. If these two selectors match, the `executableFunc` is called.

You can stop the listener temporarily by calling the `stopListener` function, and, you can restart the listener by calling the `restartListener` function.

```ts
// TypeScript.
import MempoolListener from "mempool-listener"
const mempoolListener = new MempoolListener("RPC or WSS URL")
mempoolListener.listen(config, executableFunc)
mempoolListener.stopListener()
mempoolListener.restartListener()
```

```js
// JavaScript.
const MempoolListener = require("mempool-listener").default
const mempoolListener = new MempoolListener("RPC or WSS URL")
mempoolListener.listen(config, executableFunc)
mempoolListener.stopListener()
mempoolListener.restartListener()
```

Trying to stop or restart an undefined listener will do nothing.

## License
GPL-3.0.