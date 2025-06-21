export type Voter = {
  address: string;
  isRegistered: boolean;
  hasVoted: boolean;
  votedProposalId: number;
};