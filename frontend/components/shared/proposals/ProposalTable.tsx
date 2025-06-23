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
import { cn } from '@/lib/utils';
import AddProposalDialog from './AddProposalDialog';
import { Proposal } from '@/lib/types/proposal';
import { useAccount } from 'wagmi';
import { Voter } from '@/lib/types/voter';

function ProposalTable() {
  const { write, isVoter, workflowStatus, proposals: proposalsFromContext, currentUserVoteInfo } = useContract();
  const proposals: Proposal[] = proposalsFromContext || [];
  const [sorting, setSorting] = useState<SortingState>([
    {
      id: 'voteCount',
      desc: true
    }
  ]);
  const [loading, setLoading] = useState(true);
  const [totalProposals, setTotalProposals] = useState(0);

  const columns: ColumnDef<Proposal>[] = [
    {
      accessorKey: 'id',
      header: "ID",
      cell: ({ row }) => <div>#{String(row.getValue('id'))}</div>
    },
    {
      accessorKey: 'description',
      header: "Description",
      cell: ({ row }) => {
        const isWinner = proposals.length > 0 && 
          Number(row.original.voteCount) === Math.max(...proposals.map((p: Proposal) => Number(p.voteCount))) &&
          row.original.voteCount > 0;
        
        return (
          <div className="flex items-center">
            {isWinner && (
              <Crown className="h-4 w-4 mr-1 text-[var(--accent-secondary)]" />
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
      cell: ({ row }) => <div className="text-right">{String(row.getValue('voteCount'))}</div>,
    },
    {
      id: 'actions',
      cell: ({ row }) => {
        if (workflowStatus === 3 && isVoter()) {
          if (currentUserVoteInfo.votedProposalId === row.original.id) {
            return <div className="text-sm font-bold text-secondary bg-[var(--accent-secondary)] rounded-full"><Check className="h-4 w-4" /></div>;
          } 

          if (currentUserVoteInfo.hasVoted) {
            return null;
          }

          return (
              <Button 
                size="sm" 
                variant="outline" 
                className={cn("ml-auto flex items-center gap-1")}
                onClick={() => handleVote(row.getValue('id'))}
              >
                <Check className="h-4 w-4" /> Vote
              </Button>
            );
        }
        return null;
      }
    }
  ];

  const handleVote = async (proposalId: number) => {
    try {
      await write('setVote', [proposalId]);

    } catch (err) {
      console.error("Failed to vote:", err);
    }
  };

  const table = useReactTable({
    data: proposals || [],
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    onSortingChange: setSorting,
    state: {
      sorting,
    },
  });

  // Update total proposals count when proposals change
  useEffect(() => {
    setTotalProposals(proposals?.length || 0);
    setLoading(false);
  }, [proposals]);

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
                        Number(row.original.voteCount) === Math.max(...proposals.map((p: Proposal) => Number(p.voteCount))) &&
                        row.original.voteCount > 0;

                      const hasVotedForThis = currentUserVoteInfo?.hasVoted && currentUserVoteInfo.votedProposalId === row.original.id;
                      
                      return (
                        <TableRow 
                          key={row.id}
                          className={cn(
                            { "bg-muted/50": hasVotedForThis && !isWinner }
                          )}
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
            <div className={cn(
            "flex items-center space-x-2 py-4 justify-end", {
            'justify-between': isVoter() && workflowStatus === 1,
          })}>
            {isVoter() && workflowStatus === 1 && (
              <AddProposalDialog />
            )}
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