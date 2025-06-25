import { hardhat as hardhatViem, sepolia as sepoliaViem, holesky as holeskyViem } from 'viem/chains';
import { hardhat as hardhatWagmi, sepolia as sepoliaWagmi, holesky as holeskyWagmi } from 'wagmi/chains';
import { Chain } from 'viem/chains';
import type { Chain as WagmiChain } from 'wagmi/chains';

interface NetworkConfig {
  network: string;
  wagmiChain: WagmiChain;
  defaultChain: Chain;
  rpcUrl?: string;
  fromBlock?: bigint;
  contractAddress?: `0x${string}`;
}

const defaultNetwork = process.env.NEXT_PUBLIC_DEFAULT_NETWORK || 'hardhat';

const networks: Record<string, NetworkConfig> = {
  hardhat: {
    network: defaultNetwork,
    wagmiChain: hardhatWagmi,
    defaultChain: hardhatViem,
    rpcUrl: 'http://127.0.0.1:8545',
    fromBlock: BigInt(0),
    contractAddress: process.env.NEXT_PUBLIC_HARDHAT_CONTRACT_ADDRESS as `0x${string}`,
  },
  sepolia: {
    network: defaultNetwork,
    wagmiChain: sepoliaWagmi,
    defaultChain: sepoliaViem,
    rpcUrl: process.env.NEXT_PUBLIC_SEPOLIA_RPC_URL,
    fromBlock: process.env.NEXT_PUBLIC_SEPOLIA_BLOCKNUMBER_DEPLOYED ? BigInt(process.env.NEXT_PUBLIC_SEPOLIA_BLOCKNUMBER_DEPLOYED) : BigInt(0),
    contractAddress: process.env.NEXT_PUBLIC_SEPOLIA_CONTRACT_ADDRESS as `0x${string}`,
  },
  holesky: {
    network: defaultNetwork,
    wagmiChain: holeskyWagmi,
    defaultChain: holeskyViem,
    rpcUrl: process.env.NEXT_PUBLIC_HOLESKY_RPC_URL,
    fromBlock: process.env.NEXT_PUBLIC_HOLESKY_BLOCKNUMBER_DEPLOYED ? BigInt(process.env.NEXT_PUBLIC_HOLESKY_BLOCKNUMBER_DEPLOYED) : BigInt(0),
    contractAddress: process.env.NEXT_PUBLIC_HOLESKY_CONTRACT_ADDRESS as `0x${string}`,
  }
};  

export const getNetworkConfig = (): NetworkConfig => {
  return networks[defaultNetwork];
};