import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import * as dotenv from "dotenv";

dotenv.config();
// Sepolia
const SEPOLIA_PRIVATE_KEY = process.env.SEPOLIA_PRIVATE_KEY || "";
const SEPOLIA_URL = process.env.SEPOLIA_RPC_URL || "";

// Holesky
const HOLESKY_URL = process.env.HOLESKY_RPC_URL || "";
const HOLESKY_PRIVATE_KEY = process.env.HOLESKY_PRIVATE_KEY || "";

// ETHERSCAN
const ETHERSCAN_API_KEY = process.env.ETHERSCAN_API_KEY || "";

const config: HardhatUserConfig = {
  solidity: "0.8.28",
  networks: {
    sepolia: {
      url: SEPOLIA_URL,
      accounts: [`0x${SEPOLIA_PRIVATE_KEY}`],
      chainId: 11155111,
    },
    holesky: {
      url: HOLESKY_URL,
      accounts: [`0x${HOLESKY_PRIVATE_KEY}`],
      chainId: 17000,
    },
  },
  etherscan: {
    apiKey: {
      sepolia: ETHERSCAN_API_KEY,
      holesky: ETHERSCAN_API_KEY,
    },
  },
};

export default config;
