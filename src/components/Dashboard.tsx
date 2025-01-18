import { useAccount, useBalance, useContractRead } from 'wagmi'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Wallet, Coins, ArrowRight } from "lucide-react"
import { MORO_TOKEN, PRESALE_CONTRACT, PRESALE_ABI } from '@/config/contracts'
import { useNavigate } from 'react-router-dom'
import { Button } from './ui/button'

export const Dashboard = () => {
  const { address } = useAccount()
  const navigate = useNavigate()

  const { data: bnbBalance } = useBalance({
    address,
  })

  const { data: moroBalance } = useBalance({
    address,
    token: MORO_TOKEN as `0x${string}`,
  })

  const { data: purchasedAmount } = useContractRead({
    address: PRESALE_CONTRACT as `0x${string}`,
    abi: PRESALE_ABI,
    functionName: 'getUserPurchased',
    args: [address as `0x${string}`],
  })

  if (!address) return null

  return (
    <div className="fixed top-4 right-4 z-50">
      <Card className="w-[300px] bg-white/90 backdrop-blur">
        <CardHeader className="space-y-1">
          <CardTitle className="text-sm font-medium flex items-center gap-2">
            <Wallet className="w-4 h-4" />
            {address.slice(0, 6)}...{address.slice(-4)}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-center justify-between text-sm">
            <span className="flex items-center gap-2">
              <Coins className="w-4 h-4" />
              BNB Balance
            </span>
            <span>{bnbBalance?.formatted.slice(0, 6)} BNB</span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="flex items-center gap-2">
              <Coins className="w-4 h-4" />
              MORO Balance
            </span>
            <span>{moroBalance?.formatted || '0'} MORO</span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="flex items-center gap-2">
              <Coins className="w-4 h-4" />
              Purchased
            </span>
            <span>{purchasedAmount ? Number(purchasedAmount) : '0'} MORO</span>
          </div>
          <Button 
            variant="outline" 
            className="w-full mt-2"
            onClick={() => navigate('/dashboard')}
          >
            View Full Dashboard
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}