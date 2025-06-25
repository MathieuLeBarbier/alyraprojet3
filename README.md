# Voting Dapp (Project 3 Alyra)

A decentralized voting application built with Solidity & NextJS

## Features

- Voter registration
- Proposal submission by allowed voters
- Real-time voting status updates
- Vote tallying and winner determination
- Role-based access control (Owner/Voter)

## Workflow States

1. **Registering Voters** - Only owner can register voters
2. **Proposals Registration Started** - Registered voters can submit proposals
3. **Proposals Registration Ended** - No more proposals can be submitted
4. **Voting Session Started** - Registered voters can vote for proposals
5. **Voting Session Ended** - Voting period is closed
6. **Votes Tallied** - Final results are calculated and winner is highlight in the proposal table

## Getting Started

### Prerequisites

- Node.js >= 16
- npm or yarn
- MetaMask wallet


### Environment

#### 2. Smart Contract (Backend)
##### 2.1 - Start Local Blockchain & Deploy Contract
```sh
cd backend
npm install

#Run on a separate terminal
npx hardhat node

# Deploy contract locally
npx hardhat run ./scripts/deploy.ts --network localhost
```

##### 2.1 Deploy to Public Testnet
See ```backend/hardhat.config.ts``` for available network
```sh
npx hardhat run ./scripts/deploy.ts --network sepolia
npx hardhat run ./scripts/deploy.ts --network holesky
```

##### Deployed Contracts
Sepolia Address: [0x9fBAe69250C23283A3E72e161bbe68D1806CDd27](https://sepolia.etherscan.io/address/0x9fBAe69250C23283A3E72e161bbe68D1806CDd27)
Holesky Address: [0x69A244ed5FEcFC6a9CBbcdBb64c02d5E09a1e207](https://holesky.etherscan.io/address/0x69A244ed5FEcFC6a9CBbcdBb64c02d5E09a1e207)


#### 3. NextJS Frontend Application
```sh
cd frontend
npm install
npm run dev
```
## TODOs
- Fix the problem with the number of proposals when tallied (Loop) 
- Transaction error handling in the front
- Deploy contract on testnet like Sepolia or Holesky
- Deploy front application to Vercel

