'use client';

import { useEffect } from 'react';
import { useAccount } from 'wagmi';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { useContract } from '@/contexts/useContract';
import { getWorkflowStatusName } from '@/lib/utils';

const Voting = () => {
  const { workflowStatus, workflowIsPending, refetch, changeStatus } = useContract();

  return (
    <div className="flex flex-col items-center justify-center h-screen gap-4">
      <h2 className="text-2xl font-bold">Voting System</h2>
      
      <div className="text-center">
        <p className="text-lg font-semibold">Current Status:</p>
        {workflowIsPending ? (
          <p className="text-xl text-blue-600">Loading...</p>
        ) : (
          <p className="text-xl text-blue-600">
            {getWorkflowStatusName(Number(workflowStatus))}
          </p>
        )}
        <p className="text-sm text-gray-500">Status Code: {workflowStatus?.toString()}</p>
      </div>

      <Button 
        onClick={() => {
          console.log('Vote');
          toast.success('Vote successful');
        }}
      >
        Vote
      </Button>
      <Button 
        onClick={() => {
          changeStatus();
          console.log('Change Status');
          toast.success('Status changed');
        }}
      >
        Change Status
      </Button>
      <Button 
        variant="outline" 
        onClick={() => refetch()}
        className="mt-2"
      >
        Refresh Status
      </Button>
    </div>
  )
}

export default Voting