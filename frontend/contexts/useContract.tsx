"use client";

import { createContext, useContext, useEffect, useState, useCallback } from "react";
import { useAccount, useReadContract, useWaitForTransactionReceipt, useWriteContract } from "wagmi";
import { contractAddress, contractABI } from "@/app/constants/index";
import useContractEvent from "@/hooks/useContractEvent";
import { Voter } from "@/lib/types/voter";
import { Proposal } from "@/lib/types/proposal";
import { publicClient } from "@/utils/client";

const ContractContext = createContext<any>(null);

const voterRegisteredEventABI = 'event VoterRegistered(address voter)';
const proposalAddedEventABI = 'event ProposalRegistered(uint proposalId)';

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

  const [currentUserVoteInfo, setCurrentUserVoteInfo] = useState<Voter | null>(null);

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

  const { events: voterRegisteredEvents, refetch: refetchVoterEvents } = useContractEvent(contractAddress, voterRegisteredEventABI, (log: any) => {
    return log.args.voter;
  })

  const { events: proposalAddedEvents, refetch: refetchProposalEvents } = useContractEvent(contractAddress, proposalAddedEventABI, (log: any) => {
    return log.args.proposalId;
  })

  const [voters, setVoters] = useState<Voter[]>([]);
  const [proposals, setProposals] = useState<Proposal[]>([]);

  const fetchCurrentUserVoteInfo = useCallback(async () => {
    if (!address) return;
    try {
      const voterData = await publicClient.readContract({
        address: contractAddress,
        abi: contractABI,
        functionName: 'getVoter',
        args: [address],
        account: address,
      }) as any;
      
      setCurrentUserVoteInfo({
        address: address,
        isRegistered: voterData.isRegistered,
        hasVoted: voterData.hasVoted,
        votedProposalId: Number(voterData.votedProposalId)
      });
    } catch (e) {
      setCurrentUserVoteInfo(null);
    }
  }, [address]);

  /**
   * Fetch the voter details from the contract
   * @param {string} voterAddress The address of the voter
   * @returns {Promise<Voter>} The voter details
  */
  const fetchVoterDetails = useCallback(async (voterAddress: string): Promise<Voter> => {
    try {
      const voterData = await publicClient.readContract({
        address: contractAddress,
        abi: contractABI,
        functionName: 'getVoter',
        args: [voterAddress],
        account: address,
      }) as any;
      
      return {
        address: voterAddress,
        isRegistered: voterData.isRegistered,
        hasVoted: voterData.hasVoted,
        votedProposalId: Number(voterData.votedProposalId)
      };
    } catch (error) {
      console.error(`Error fetching voter ${voterAddress}:`, error);
      return {
        address: voterAddress,
        isRegistered: true,
        hasVoted: false,
        votedProposalId: 0
      };
    }
  }, [address]);

  useEffect(() => {
    const fetchVoters = async () => {
      const voters = await Promise.all(voterRegisteredEvents.map(fetchVoterDetails));
      setVoters(voters);
    };
    if (voterRegisteredEvents.length > 0) fetchVoters();
  }, [voterRegisteredEvents, fetchVoterDetails]);

  useEffect(() => {
    const fetchProposals = async () => {
      const proposals = await Promise.all(proposalAddedEvents.map(fetchProposalDetails));
      setProposals(proposals);
    };
    fetchProposals();
  }, [proposalAddedEvents]);

  /**
   * Fetch the proposal details from the contract
   * @param {number} proposalId The id of the proposal
   * @returns {Promise<Proposal>} The proposal details
  */
  const fetchProposalDetails = useCallback(async (proposalId: number): Promise<Proposal> => {
    try {
      const proposalData = await publicClient.readContract({
        address: contractAddress,
        abi: contractABI,
        functionName: 'getOneProposal',
        args: [proposalId],
        account: address,
      }) as any;
      
      return {
        id: proposalId,
        description: proposalData.description,
        voteCount: proposalData.voteCount
      };
    } catch (error) {
      console.error(`Error fetching proposal ${proposalId}:`, error);
      return {
        id: proposalId,
        description: 'error',
        voteCount: 0
      };
    }
  }, [address]);

  /** 
   * Write a contract function
   * @param {string} functionName The function name to call
   * @param {any[]} args The function arguments
   * @returns {Promise<void>} The promise of the transaction
  */
  const write = async (functionName: string, args: any[] = []) => {
    return writeContract({
      address: contractAddress,
      abi: contractABI,
      functionName,
      args
    })
  };

  /**
   * Change the status of the contract
   * @returns {Promise<void>} The promise of the transaction
  */
  const changeStatus = async () => {
    if (workflowStatus === 0) {
      write('startProposalsRegistering')
    } else if (workflowStatus === 1) {
      write('endProposalsRegistering')
    } else if (workflowStatus === 2) {
      write('startVotingSession')
    } else if (workflowStatus === 3) {
      write('endVotingSession')
    }
  };

  /**
   * Add a voter to the contract
   * @param {string} voter The address of the voter
   * @returns {Promise<void>} The promise of the transaction
  */
  const addVoter = async (voter: string) => {
    return write('addVoter', [voter])
  }

  /**
   * Add a proposal to the contract
   * @param {string} proposal The proposal
   * @returns {Promise<void>} The promise of the transaction
  */
  const addProposal = async (proposal: string) => {
    return write('addProposal', [proposal])
  }

  /**
   * Refetch the contract data
   * @returns {Promise<void>} The promise of the refetch
  */
  const refetch = async () => {
    await refetchWorkflow();
    await refetchVoterEvents();
    await refetchProposalEvents();
    await fetchCurrentUserVoteInfo();
  };

  /**
   * Check if the user is the owner of the contract
   * @returns {boolean} True if the user is the owner of the contract, false otherwise
  */
  const isOwner = useCallback(() => {
    return contractOwner === address;
  }, [contractOwner, address]);

  /**
   * Check if the user is a voter
   * @returns {boolean} True if the user is a voter, false otherwise
  */
  const isVoter = useCallback(() => {
    return voters.some((v) => v.address === address);
  }, [voters, address]);

  /**
   * Check if the contract is ready to tally
   * @returns {boolean} True if the contract is ready to tally, false otherwise
  */
  const readyToTally = useCallback(() => {
    return workflowStatus === 4;
  }, [workflowStatus]);

  useEffect(() => {
    if (address) {
      fetchCurrentUserVoteInfo();
    }
  }, [address, fetchCurrentUserVoteInfo]);

  // Refetch when transaction is confirmed
  useEffect(() => {
    if (isSuccess) {
      refetch();
    }
  }, [isSuccess]);

  const exposed = {
    hash,
    error,
    isPending,
    isConfirming,
    isSuccess,
    errorConfirmation,
    workflowStatus,
    workflowIsPending,
    voters,
    proposals,
    refetchWorkflow,
    write,
    refetch,
    changeStatus,
    isOwner,
    isVoter,
    readyToTally,
    addVoter,
    addProposal,
    currentUserVoteInfo,
  };

  return (
    <ContractContext.Provider value={exposed}>
      {children}
    </ContractContext.Provider>
  );
};

const useContract = () => useContext(ContractContext);

export { ContractContext, ContractProvider, useContract };