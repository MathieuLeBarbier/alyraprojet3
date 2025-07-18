'use client';

import Voting from '@/components/shared/Voting';
import NotConnected from '@/components/shared/NotConnected';

import { useAccount } from 'wagmi';


export default function Home() {
  const { isConnected, address } = useAccount();

  return (
    <>
      {isConnected ? (
        <Voting />
      ) : (
        <NotConnected />
      )}
    </>
  );
}