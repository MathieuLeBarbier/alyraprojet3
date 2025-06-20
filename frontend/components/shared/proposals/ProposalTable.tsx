"use client"

import { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
  getPaginationRowModel,
  getSortedRowModel,
  SortingState,
} from '@tanstack/react-table';
import { Button } from '@/components/ui/button';
import { ArrowUpDown, Check, Crown } from 'lucide-react';
import { useContract } from '@/contexts/useContract';
import { useReadContracts } from 'wagmi';
import { contractAddress, contractABI } from "@/app/constants/index";

type Proposal = {
  id: number;
  description: string;
  voteCount: number;
};

function ProposalTable() {
  const { write, isOwner, workflowStatus } = useContract();
  const [proposals, setProposals] = useState<Proposal[]>([]);
  const [sorting, setSorting] = useState<SortingState>([
    {
      id: 'voteCount',
      desc: true
    }
  ]);
  const [loading, setLoading] = useState(true);
  const [totalProposals, setTotalProposals] = useState(0);
  
  const getWinningProposalId = () => {
    if (!proposals.length) return -1;
    return proposals.reduce((maxId, current, idx, arr) => 
      current.voteCount > arr[maxId].voteCount ? idx : maxId, 0
    );
  };

  const columns: ColumnDef<Proposal>[] = [
    {
      accessorKey: 'id',
      header: "ID",
      cell: ({ row }) => <div>#{row.getValue('id')}</div>
    },
    {
      accessorKey: 'description',
      header: "Description",
      cell: ({ row }) => {
        const isWinner = proposals.length > 0 && 
          row.original.voteCount === Math.max(...proposals.map(p => p.voteCount)) &&
          row.original.voteCount > 0;
        
        return (
          <div className="flex items-center">
            {isWinner && (
              <Crown className="h-4 w-4 mr-1 text-secondary" />
            )}
            <span>{row.getValue('description')}</span>
          </div>
        );
      }
    },
    {
      accessorKey: 'voteCount',
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Votes
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => <div className="text-right">{row.getValue('voteCount')}</div>,
    },
    {
      id: 'actions',
      cell: ({ row }) => {
        return workflowStatus === 3 ? (
          <Button 
            size="sm" 
            variant="outline" 
            className="ml-auto flex items-center gap-1"
            onClick={() => handleVote(row.getValue('id'))}
          >
            <Check className="h-4 w-4" /> Vote
          </Button>
        ) : null;
      }
    }
  ];

  const handleVote = async (proposalId: number) => {
    try {
      await write('setVote', [proposalId]);
      // Refresh proposal data after voting
      fetchProposals();
    } catch (err) {
      console.error("Failed to vote:", err);
    }
  };

  const fetchProposals = async () => {
    setLoading(true);
    try {
      // Using mock data instead of contract calls
      const mockProposals = [
        { id: 0, description: "GENESIS", voteCount: 0 },
        { id: 1, description: "Build a community center", voteCount: 5 },
        { id: 2, description: "Create a decentralized voting app", voteCount: 12 },
        { id: 3, description: "Fund open source development", voteCount: 8 },
        { id: 4, description: "Host a blockchain hackathon", voteCount: 3 },
        { id: 5, description: "Develop educational materials", voteCount: 7 },
        { id: 6, description: "Create a DAO treasury", voteCount: 2 },
        { id: 7, description: "Launch community NFT collection", voteCount: 4 }
      ];
      
      setProposals(mockProposals);
      setTotalProposals(mockProposals.length);
      
      // Simulate loading delay
      setTimeout(() => {
        setLoading(false);
      }, 500);
    } catch (error) {
      console.error("Error with mock proposals:", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProposals();
  }, [workflowStatus]);

  const table = useReactTable({
    data: proposals,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    onSortingChange: setSorting,
    state: {
      sorting,
    },
  });

  return (
    <Card className="w-full max-w-5xl">
      <CardHeader className="flex flex-row items-center">
        <div>
          <CardTitle className="text-2xl">Proposals</CardTitle>
          <CardDescription>
            {workflowStatus === 0 && "Proposals registration not started"}
            {workflowStatus === 1 && "Submit your proposal"}
            {workflowStatus === 2 && "Proposals registration ended"}
            {workflowStatus === 3 && "Vote for your favorite proposal"}
            {workflowStatus === 4 && "Voting session ended"}
            {workflowStatus === 5 && "Votes have been tallied"}
          </CardDescription>
        </div>
        <div className="ml-auto text-sm font-bold text-secondary bg-[var(--accent-secondary)] rounded-full px-3 py-1">
          {totalProposals} Proposals
        </div>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="text-center py-4">Loading proposals...</div>
        ) : (
          <>
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  {table.getHeaderGroups().map((headerGroup) => (
                    <TableRow key={headerGroup.id}>
                      {headerGroup.headers.map((header) => (
                        <TableHead key={header.id}>
                          {header.isPlaceholder
                            ? null
                            : flexRender(
                                header.column.columnDef.header,
                                header.getContext()
                              )}
                        </TableHead>
                      ))}
                    </TableRow>
                  ))}
                </TableHeader>
                <TableBody>
                  {table.getRowModel().rows?.length ? (
                    table.getRowModel().rows.map((row) => {
                      const isWinner = proposals.length > 0 && 
                        row.original.voteCount === Math.max(...proposals.map(p => p.voteCount)) &&
                        row.original.voteCount > 0;
                      
                      return (
                        <TableRow 
                          key={row.id}
                          className={isWinner ? "bg-[var(--accent-secondary)] text-secondary font-bold hover:bg-[var(--accent-secondary)]" : ""}
                        >
                          {row.getVisibleCells().map((cell) => (
                            <TableCell key={cell.id}>
                              {flexRender(cell.column.columnDef.cell, cell.getContext())}
                            </TableCell>
                          ))}
                        </TableRow>
                      )
                    })
                  ) : (
                    <TableRow>
                      <TableCell colSpan={columns.length} className="text-center">
                        No proposals found.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
            <div className="flex items-center space-x-2 py-4 justify-end">
              <div className="flex items-center space-x-2">
                {table.getCanPreviousPage() && (
                  <Button
                    variant="outline"
                    onClick={() => table.previousPage()}
                    disabled={!table.getCanPreviousPage()}
                  >
                    Previous
                  </Button>
                )}
                {table.getCanNextPage() && (
                  <Button
                    variant="outline"
                    onClick={() => table.nextPage()}
                    disabled={!table.getCanNextPage()}
                  >
                    Next
                  </Button>
                )}
              </div>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}

export default ProposalTable;