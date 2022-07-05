<!-- TODO: # Put the title -->

<!-- TODO: # Put the description of SC -->

## About

<!--
TODO: Put more info about SC

* It's an **Escrow** contract.
* [**Instruction**](./instruction.md).
* Get the **coverage** report [here](./reports.md#coverage).
* The Escrow SC is **deployed** in Rinkeby testnet. Check the details [here](./reports.md#deployment)
* The Escrow SC is **verified** in Rinkeby testnet. Check the details [here](./reports.md#verify)
-->

## Installation

```console
yarn install
```

## Usage

### Build

```console
yarn compile
```

### Contract size

```console
yarn contract-size
```

### Test

```console
yarn test
```

### TypeChain

Compile the smart contracts and generate TypeChain artifacts:

```console
yarn typechain
```

### Lint Solidity

Lint the Solidity code:

```console
yarn lint:sol
```

### Lint TypeScript

Lint the TypeScript code:

```console
yarn lint:ts
```

### Coverage

Generate the code coverage report:

```console
yarn coverage
```

### Report Gas

See the gas usage per unit test and average gas per method call:

```console
REPORT_GAS=true yarn test
```

### Clean

Delete the smart contract artifacts, the coverage reports and the Hardhat cache:

```console
yarn clean
```

### Verify

```console
yarn verify <network_name> <deployed_contract_address> <constructor params>
// TODO: add your own SC arguments or empty
yarn verify <network_name> <deployed_contract_address> --constructor-args verify/erc20token.args.ts
```

For multiple arguments, follow this [guide](https://hardhat.org/plugins/nomiclabs-hardhat-etherscan.html#multiple-api-keys-and-alternative-block-explorers).

### Deploy

- Environment variables: Create a `.env` file with its values in [.env.example](./.env.example)

#### localhost

```console
// on terminal-1
$ npx hardhat node

// on terminal-2
$ yarn hardhat deploy:Escrow --network localhost
```

#### ETH Testnet - Rinkeby

- Deploy the contracts

```console
yarn hardhat deploy:Escrow --network rinkeby
```

#### ETH Mainnet

- Deploy the contracts

```console
yarn hardhat deploy:Escrow --network mainnet
```
