export const getWorkflowStatusName = (status: number) => {
  const statusNames = {
    0: 'Registering Voters',
    1: 'Proposals Registration Started',
    2: 'Proposals Registration Ended',
    3: 'Voting Session Started',
    4: 'Voting Session Ended',
    5: 'Votes Tallied'
  };
  return statusNames[status as keyof typeof statusNames] || 'Unknown';
};