"use client";

import { useEffect, useState, useCallback } from "react";
import { publicClient } from "../lib/client";
import { parseAbiItem, Log } from "viem";
import { useAccount } from "wagmi";
import { getNetworkConfig } from "../lib/networkConfig";

/**
 * Use a contract event
 * @param {string} contractAddr The address of the contract
 * @param {string} event The event to listen to (ex: 'event NumberChanged(uint oldValue, uint newValue)')
 * @param {Function} transform Optional function to transform log args
 * @returns {Object} The events and loading state
 */
function useContractEvent<T = any>(
  contractAddr: `0x${string}`, 
  event: string,
  transform?: (log: Log) => T
) {
  const { address } = useAccount();
  const [events, setEvents] = useState<T[]>([]);
  const { fromBlock } = getNetworkConfig()

  /**
   * Get the events from the contract and set the events state
   */
  const getEvents = useCallback(async () => { 
    const numberChangedLog = await publicClient.getLogs({
        address: contractAddr,
        event: parseAbiItem(event) as any,
        fromBlock: fromBlock,
        toBlock: 'latest',
    })

    setEvents(numberChangedLog.map(
      (log: any) => transform ? transform(log) : log.args
    ))
  }, [contractAddr, event, transform]);

  const refetch = useCallback(() => {
    getEvents();
  }, [getEvents]);

  useEffect(() => { 
    const getAllEvents = async () => {
      if(address) {
        await getEvents();
      }
    }
      getAllEvents();
  }, [address]);

  return { events, refetch };
}

export default useContractEvent;