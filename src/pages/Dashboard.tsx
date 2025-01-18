import { useAccount, useBalance, useContractRead } from 'wagmi'
import { bscTestnet } from 'wagmi/chains'
import { formatEther } from 'viem'
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Wallet, AlertTriangle, ChartBar } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import { MORO_TOKEN, PRESALE_CONTRACT, PRESALE_ABI } from '@/config/contracts'

const Dashboard = () => {
  const { address, isConnected, chain } = useAccount()
  const { toast } = useToast()

  // Get BNB balance
  const { data: bnbBalance } = useBalance({
    address,
  })

  // Get MORO token balance
  const { data: moroBalance } = useContractRead({
    address: MORO_TOKEN as `0x${string}`,
    abi: [{
      inputs: [{ name: "account", type: "address" }],
      name: "balanceOf",
      outputs: [{ name: "", type: "uint256" }],
      stateMutability: "view",
      type: "function"
    }],
    functionName: 'balanceOf',
    args: [address as `0x${string}`],
  })

  // Get presale info
  const { data: tokensAvailable } = useContractRead({
    address: PRESALE_CONTRACT as `0x${string}`,
    abi: PRESALE_ABI,
    functionName: 'getTokensAvailable',
  })

  const { data: userPurchased } = useContractRead({
    address: PRESALE_CONTRACT as `0x${string}`,
    abi: PRESALE_ABI,
    functionName: 'getUserPurchased',
    args: [address as `0x${string}`],
  })

  if (!isConnected) {
    return (
      <div className="container mx-auto p-6">
        <Card className="p-6 text-center">
          <Wallet className="mx-auto h-12 w-12 text-gray-400 mb-4" />
          <h2 className="text-2xl font-bold mb-2">Connect Your Wallet</h2>
          <p className="text-gray-600">Please connect your wallet to view your dashboard</p>
        </Card>
      </div>
    )
  }

  if (chain?.id !== bscTestnet.id) {
    return (
      <div className="container mx-auto p-6">
        <Card className="p-6 text-center">
          <AlertTriangle className="mx-auto h-12 w-12 text-yellow-400 mb-4" />
          <h2 className="text-2xl font-bold mb-2">Wrong Network</h2>
          <p className="text-gray-600 mb-4">Please switch to BSC Testnet to view your dashboard</p>
          <Button onClick={() => {
            toast({
              title: "Network Switch Required",
              description: "Please switch to BSC Testnet in your wallet",
            })
          }}>Switch to BSC Testnet</Button>
        </Card>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Wallet Info */}
        <Card className="p-6">
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
            <Wallet className="h-5 w-5" />
            Wallet Information
          </h2>
          <div className="space-y-2">
            <p className="text-sm text-gray-600">Address</p>
            <p className="font-mono text-sm truncate">{address}</p>
            <p className="text-sm text-gray-600 mt-4">BNB Balance</p>
            <p className="font-bold">{bnbBalance?.formatted || '0'} BNB</p>
            <p className="text-sm text-gray-600 mt-4">MORO Balance</p>
            <p className="font-bold">{moroBalance ? formatEther(moroBalance) : '0'} MORO</p>
          </div>
        </Card>

        {/* Presale Info */}
        <Card className="p-6">
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
            <ChartBar className="h-5 w-5" />
            Presale Information
          </h2>
          <div className="space-y-2">
            <p className="text-sm text-gray-600">Your Purchased Tokens</p>
            <p className="font-bold">{userPurchased ? formatEther(userPurchased) : '0'} MORO</p>
            <p className="text-sm text-gray-600 mt-4">Tokens Available</p>
            <p className="font-bold">{tokensAvailable ? formatEther(tokensAvailable) : '0'} MORO</p>
          </div>
        </Card>

        {/* Contract Info */}
        <Card className="p-6">
          <h2 className="text-xl font-bold mb-4">Contract Information</h2>
          <div className="space-y-2">
            <p className="text-sm text-gray-600">MORO Token Contract</p>
            <p className="font-mono text-sm truncate">{MORO_TOKEN}</p>
            <p className="text-sm text-gray-600 mt-4">Presale Contract</p>
            <p className="font-mono text-sm truncate">{PRESALE_CONTRACT}</p>
          </div>
        </Card>
      </div>
    </div>
  )
}

export default Dashboard