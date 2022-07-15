# FundMe: A funding smart contract made by using hardhat

This project allows users to fund Eth and allows the deployer/owner of the contract to withdraw them.

Some commands to run:

```
yarn hardhat compile
yarn hardhat clean
yarn hardhat test
yarn hardhat node
yarn hardhat coverage
yarn hardhat deploy 
```

# Etherscan verification

To try out Etherscan verification, you first need to deploy a contract to an Ethereum network that's supported by Etherscan, such as Ropsten.

In this project, copy the hardhat.config file, and then edit it to fill in the details.

Make a .env file and edit it, enter your Etherscan API key, your Ropsten/Rinkeby node URL (e.g. from Alchemy), and the private key of the account which will send the deployment transaction. With a valid .env file in place, first deploy your contract:

```
yarn hardhat deploy --network rinkeby
```

As you are deploying to a testnet, the hardhat deploy will automatically verify the contract!
