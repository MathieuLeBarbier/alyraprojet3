'use client';

import Voting from '@/components/shared/Voting';
import NotConnected from '@/components/shared/NotConnected';

import { useAccount } from 'wagmi';


export default function Home() {
  const { isConnected, address } = useAccount();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <h1 className="text-4xl font-bold mb-8">Welcome to Voting</h1>
      {isConnected ? (
        <div>
          <p>Connected as: {address}</p>
          <Voting />
        </div>
      ) : (
        <NotConnected />
      )}
    </div>
  );
}