import { useAccount } from 'wagmi'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useQuery } from '@tanstack/react-query'
import { supabase } from '@/integrations/supabase/client'
import { Loader2 } from 'lucide-react'

const Dashboard = () => {
  const { address } = useAccount()

  const { data: xpPoints, isLoading } = useQuery({
    queryKey: ['xp-points', address],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('xp_points')
        .select('*')
        .eq('wallet_address', address)
      
      if (error) throw error
      return data
    },
    enabled: !!address
  })

  if (!address) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-lg text-gray-600">Please connect your wallet to view your dashboard</p>
      </div>
    )
  }

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Your Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {xpPoints?.map((xp) => (
          <Card key={xp.id} className="bg-white shadow-lg">
            <CardHeader>
              <CardTitle className="capitalize">{xp.category} XP</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-primary">{xp.points}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

export default Dashboard