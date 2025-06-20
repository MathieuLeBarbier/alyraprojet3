import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import VotersTable from './voters/VotersTable';
import ProposalTable from './proposals/ProposalTable';

const Voting = () => {

  return (
    <div className="container mx-auto space-y-6 flex flex-col items-center">
      <ProposalTable />
      <VotersTable />
    </div>
  )
}

export default Voting