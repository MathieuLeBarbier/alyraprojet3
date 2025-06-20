"use client";

import useHiddenNav from "@/hooks/useHiddenNav";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import Image from "next/image";
import Link from "next/link";
import { getWorkflowStatusName } from "@/lib/utils";
import { useContract } from "@/contexts/useContract";

const Header = () => {
  const { workflowStatus } = useContract();
  const { hidden } = useHiddenNav();

  return (
    <nav className={`fixed top-0 left-0 w-full z-50 flex justify-center transition-transform duration-300 ${hidden ? '-translate-y-full' : 'translate-y-0'}`} style={{pointerEvents: 'none'}}>
      <div className="bg-accent max-w-5xl w-[95%] mt-4 rounded-full shadow-lg flex justify-between items-center px-6 py-2" style={{pointerEvents: 'auto'}}>
        <div className="flex flex-row items-center gap-2">
          <Link href="/" className="flex flex-row items-center">
            <h1 className="text-2xl font-bold">Voting</h1>
          </Link>
        </div>
        <div className="text-secondary font-bold text-sm bg-[var(--accent-secondary)] px-3 py-1 rounded-full">
            {`Status: ${workflowStatus ? getWorkflowStatusName(Number(workflowStatus)) : 'Loading...'}`}
          </div>
        <div>
          <ConnectButton />
        </div>
      </div>
    </nav>
    )
}

export default Header;