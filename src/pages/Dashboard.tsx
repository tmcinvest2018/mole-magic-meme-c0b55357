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
import { useToast } from "@/components/ui/use-toast"

const Dashboard = () => {
  const { address } = useAccount()
  const { toast } = useToast()

  const { data: xpPoints, isLoading, error } = useQuery({
    queryKey: ['xp-points', address],
    queryFn: async () => {
      console.log('Fetching XP points for address:', address)
      if (!address) {
        console.error('No wallet address provided')
        throw new Error('Wallet address is required')
      }

      try {
        const { data, error: supabaseError } = await supabase
          .from('xp_points')
          .select('*')
          .eq('wallet_address', address)

        if (supabaseError) {
          console.error('Supabase error:', supabaseError)
          toast({
            variant: "destructive",
            title: "Error fetching XP points",
            description: supabaseError.message
          })
          throw supabaseError
        }

        console.log('XP points data:', data)
        return data || []
      } catch (err) {
        console.error('Error in XP points query:', err)
        toast({
          variant: "destructive",
          title: "Error loading dashboard data",
          description: "Please try again later"
        })
        throw err
      }
    },
    enabled: !!address,
    retry: 3,
    retryDelay: 1000,
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

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-b from-orange-50 to-white">
        <p className="text-lg text-red-600">Error loading dashboard data. Please try again later.</p>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8 min-h-screen bg-gradient-to-b from-orange-50 to-white">
      <h1 className="text-3xl font-bold mb-8 text-orange-600">Your Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {xpPoints && xpPoints.length > 0 ? (
          xpPoints.map((xp) => (
            <Card key={xp.id} className="bg-white shadow-lg border border-orange-200">
              <CardHeader>
                <CardTitle className="capitalize text-orange-600">{xp.category} XP</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold text-primary">{xp.points}</p>
              </CardContent>
            </Card>
          ))
        ) : (
          <p className="col-span-3 text-center text-gray-600">No XP points found. Start earning points by participating in our community!</p>
        )}
      </div>

      {xpPoints && xpPoints.length > 0 && (
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
                {xpPoints.map((xp) => (
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
      )}
    </div>
  )
}

export default Dashboard