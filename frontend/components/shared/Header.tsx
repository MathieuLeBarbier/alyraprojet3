"use client";

import useHiddenNav from "@/hooks/useHiddenNav";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import Link from "next/link";
import { getWorkflowStatusName } from "@/lib/workflowStatusParser";
import { useContract } from "@/contexts/useContract";
import { Button } from "@/components/ui/button";
import Image from "next/image";

const Header = () => {
  const { workflowStatus, workflowIsPending, isOwner, changeStatus, readyToTally } = useContract();
  const { hidden } = useHiddenNav();

  return (
    <nav className={`fixed top-0 left-0 w-full z-50 flex justify-center transition-transform duration-300 ${hidden ? '-translate-y-full' : 'translate-y-0'}`} style={{pointerEvents: 'none'}}>
      <div className="bg-accent max-w-5xl w-[95%] mt-4 rounded-full shadow-lg flex justify-between items-center px-6 py-2" style={{pointerEvents: 'auto'}}>
        <Link href="/">
          <Image src="/LOGO_white.svg" alt="Logo" width={32} height={32} className="h-10 sm:h-12 w-24 object-contain" priority />
        </Link>
        <div className="flex flex-row items-center gap-2">
          <div className="text-secondary font-bold text-sm bg-primary px-3 py-1 rounded-full">
              {`Status: ${workflowIsPending ? 'Loading...' : getWorkflowStatusName(Number(workflowStatus))}`}
          </div>
          { isOwner() && (
            <Button 
            size="sm" 
            className="rounded-full bg-[var(--accent-secondary)] text-secondary" 
            onClick={() => changeStatus()}
            disabled={workflowIsPending}
            >
              {readyToTally() ? 'Tally' : 'Next'}
            </Button>
          )}
        </div>
        <div>
          <ConnectButton/>
        </div>
      </div>
    </nav>
    )
}

export default Header;