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

  const { data: contractOwner, isPending: ownerIsPending, refetch: refetchOwner } = useReadContract({
    address: contractAddress,
    abi: contractABI,
    functionName: 'owner',
    account: address,
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
  }

  const isOwner = () => {
    return contractOwner === address;
  }

  useEffect(() => {
    refetch();
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
    write,
    refetch,
    changeStatus,
    isOwner
  };

  return (
    <ContractContext.Provider value={exposed}>
      {children}
    </ContractContext.Provider>
  );
};

const useContract = () => useContext(ContractContext);

export { ContractContext, ContractProvider, useContract };