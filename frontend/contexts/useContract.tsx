"use client";

import { createContext, useContext, useEffect } from "react";
import { useAccount, useReadContract, useWaitForTransactionReceipt, useWriteContract } from "wagmi";
import { contractAddress, contractABI } from "@/app/constants/index";

const ContractContext = createContext<any>(null);

/**
 * ContractProvider component
 * This is a context wrapper to use the contract functions
 * @param {*} children The children components
 * @returns {Object} The ContractProvider component
 */
const ContractProvider = ({ children }: { children: React.ReactNode }) => {
  const { address } = useAccount();
  const { data: hash, error, isPending, writeContract } = useWriteContract()
  const { isLoading: isConfirming, isSuccess, error: errorConfirmation } =
    useWaitForTransactionReceipt({
      hash
    })

  const { data: workflowStatus, isPending: workflowIsPending, refetch: refetchWorkflow } = useReadContract({
    address: contractAddress,
    abi: contractABI,
    functionName: 'workflowStatus',
    account: address,
  })

  const { data: voterInfo, isPending: voterIsPending, refetch: refetchVoter } = useReadContract({
    address: contractAddress,
    abi: contractABI,
    functionName: 'getVoter',
    args: [address],
    account: address,
    query: {
      enabled: !!address,
    }
  })

  const { data: winningProposalId, isPending: winningIsPending, refetch: refetchWinning } = useReadContract({
    address: contractAddress,
    abi: contractABI,
    functionName: 'winningProposalID',
    query: {
      enabled: !!address,
    }
  })

  const changeStatus = async () => {
    writeContract({
      address: contractAddress,
      abi: contractABI,
      functionName: 'startProposalsRegistering',
    })
  }

  /** 
   * Write a contract function
   * @param {string} functionName The function name to call
   * @param {any[]} args The function arguments
   * @returns {Promise<void>} The promise of the transaction
  */
  const write = async (functionName: string, args: any[]) => {
    writeContract({
      address: contractAddress,
      abi: contractABI,
      functionName,
      args
    })
  }

  const refetch = async () => {
    await refetchWorkflow();
    await refetchVoter();
    await refetchWinning();
  }

  useEffect(() => {
    console.log("Fetching contract data...");
    console.log("Contract address:", contractAddress);
    console.log("User address:", address);
    
    refetch().then(() => {
      console.log("Data fetched, workflow status:", workflowStatus);
    }).catch(err => {
      console.error("Error fetching data:", err);
    });
  }, [address, isConfirming]);

  const exposed = {
    hash,
    error,
    isPending,
    isConfirming,
    isSuccess,
    errorConfirmation,
    workflowStatus,
    workflowIsPending,
    refetchWorkflow,
    voterInfo,
    voterIsPending,
    refetchVoter,
    winningProposalId,
    winningIsPending,
    refetchWinning,
    write,
    refetch,
    changeStatus
  };

  return (
    <ContractContext.Provider value={exposed}>
      {children}
    </ContractContext.Provider>
  );
};

const useContract = () => useContext(ContractContext);

export { ContractContext, ContractProvider, useContract };