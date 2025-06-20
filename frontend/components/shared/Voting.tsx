'use client';

import { useAccount } from 'wagmi';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

const Voting = () => {
  return (
    <div className="flex flex-col items-center justify-center h-screen">
      Voting
      <Button onClick={() => {
        console.log('Vote');
        toast.success('Vote successful');
      }}>
        Vote
      </Button>
    </div>
  )
}

export default Voting