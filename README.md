# Voting Dapp (Project 3 Alyra)

A decentralized voting application built with Next.js, Solidity and RainbowKit.

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

### Installation

1. Clone the repository

#### Local Environment

2. Start Blockchain & Deploy Contract
```sh
cd backend
npx hardhat node #Run on a separate terminal

# Command to deploy contract locally
npx hardhat ignition deploy ./ignition/modules/Voting.ts --network localhost
```


