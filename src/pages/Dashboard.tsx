import { useAccount } from 'wagmi'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useQuery } from '@tanstack/react-query'
import { supabase } from '@/integrations/supabase/client'
import { Loader2 } from 'lucide-react'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

const Dashboard = () => {
  const { address } = useAccount()

  const { data: xpPoints, isLoading } = useQuery({
    queryKey: ['xp-points', address],
    queryFn: async () => {
      console.log('Fetching XP points for address:', address)
      const { data, error } = await supabase
        .from('xp_points')
        .select('*')
        .eq('wallet_address', address)
      
      if (error) {
        console.error('Error fetching XP points:', error)
        throw error
      }
      console.log('XP points data:', data)
      return data
    },
    enabled: !!address
  })

  if (!address) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-b from-orange-50 to-white">
        <p className="text-lg text-gray-600">Please connect your wallet to view your dashboard</p>
      </div>
    )
  }

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-b from-orange-50 to-white">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8 min-h-screen bg-gradient-to-b from-orange-50 to-white">
      <h1 className="text-3xl font-bold mb-8 text-orange-600">Your Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {xpPoints?.map((xp) => (
          <Card key={xp.id} className="bg-white shadow-lg border border-orange-200">
            <CardHeader>
              <CardTitle className="capitalize text-orange-600">{xp.category} XP</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-primary">{xp.points}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="bg-white shadow-lg border border-orange-200">
        <CardHeader>
          <CardTitle className="text-orange-600">XP History</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Category</TableHead>
                <TableHead>Points</TableHead>
                <TableHead>Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {xpPoints?.map((xp) => (
                <TableRow key={xp.id}>
                  <TableCell className="capitalize">{xp.category}</TableCell>
                  <TableCell>{xp.points}</TableCell>
                  <TableCell>{new Date(xp.created_at).toLocaleDateString()}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}

export default Dashboard