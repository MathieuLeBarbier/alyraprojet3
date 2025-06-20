import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import VotersTable from './voters/VotersTable';

const Voting = () => {

  return (
    <div className="flex flex-col items-center justify-center h-screen gap-4">
      <VotersTable />
    </div>
  )
}

export default Voting