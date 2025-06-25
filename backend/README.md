# Sample Hardhat Project

This project demonstrates a basic Hardhat use case. It comes with a sample contract, a test for that contract, and a Hardhat Ignition module that deploys that contract.

Try running some of the following tasks:

```shell
npx hardhat help
npx hardhat test
REPORT_GAS=true npx hardhat test
```
#### Deploy
See ```hardhat.config.ts``` for available network
```shell
npx hardhat ignition deploy ignition/modules/Voting.ts --network <NETWORK>
npx hardhat run ./scripts/deploy.ts --network <NETWORK>
```

#### Start local blockchain
```shell
npx hardhat node
```