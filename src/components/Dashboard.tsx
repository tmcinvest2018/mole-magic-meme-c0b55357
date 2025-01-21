import { useAccount, useBalance, useContractRead } from 'wagmi'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Wallet, Coins, ArrowRight } from "lucide-react"
import { MORO_TOKEN, PRESALE_CONTRACT, PRESALE_ABI } from '@/config/contracts'
import { useNavigate } from 'react-router-dom'
import { Button } from './ui/button'

interface DashboardProps {
  hideViewDashboardButton?: boolean;
}

export const Dashboard = ({ hideViewDashboardButton = false }: DashboardProps) => {
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
    <div className={hideViewDashboardButton ? "" : "fixed top-4 right-4 z-50"}>
      <Card className="w-[300px] bg-gradient-to-b from-orange-50 to-white border border-orange-200 shadow-lg">
        <CardHeader className="space-y-1 pb-2">
          <CardTitle className="text-sm font-medium flex items-center gap-2 text-orange-600">
            <Wallet className="w-4 h-4" />
            {address.slice(0, 6)}...{address.slice(-4)}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-center justify-between text-sm">
            <span className="flex items-center gap-2 text-gray-600">
              <Coins className="w-4 h-4 text-primary" />
              BNB Balance
            </span>
            <span className="font-medium text-gray-900">{bnbBalance?.formatted.slice(0, 6)} BNB</span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="flex items-center gap-2 text-gray-600">
              <Coins className="w-4 h-4 text-secondary" />
              MORO Balance
            </span>
            <span className="font-medium text-gray-900">{moroBalance?.formatted || '0'} MORO</span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="flex items-center gap-2 text-gray-600">
              <Coins className="w-4 h-4 text-accent" />
              Purchased
            </span>
            <span className="font-medium text-gray-900">{purchasedAmount ? Number(purchasedAmount) : '0'} MORO</span>
          </div>
          {!hideViewDashboardButton && (
            <Button 
              variant="outline" 
              className="w-full mt-2 bg-gradient-to-r from-orange-500 to-orange-600 text-white hover:from-orange-600 hover:to-orange-700 border-none shadow-md"
              onClick={() => navigate('/dashboard')}
            >
              View Full Dashboard
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          )}
        </CardContent>
      </Card>
    </div>
  )
}