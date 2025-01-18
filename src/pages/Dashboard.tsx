import { useAccount, useBalance, useNetwork, useSwitchNetwork } from 'wagmi'
import { bscTestnet } from 'wagmi/chains'
import { useContractRead } from 'wagmi'
import { parseEther, formatEther } from 'viem'
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Wallet, AlertTriangle, RefreshCw, ChartBar } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import { MORO_TOKEN, PRESALE_CONTRACT, PRESALE_ABI } from '@/config/contracts'

const Dashboard = () => {
  const { address, isConnected } = useAccount()
  const { chain } = useNetwork()
  const { switchNetwork } = useSwitchNetwork()
  const { toast } = useToast()

  // Get BNB balance
  const { data: bnbBalance } = useBalance({
    address: address,
    watch: true,
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
    enabled: !!address,
  })

  // Get presale info
  const { data: tokensAvailable } = useContractRead({
    address: PRESALE_CONTRACT as `0x${string}`,
    abi: PRESALE_ABI,
    functionName: 'getTokensAvailable',
    watch: true,
  })

  const { data: userPurchased } = useContractRead({
    address: PRESALE_CONTRACT as `0x${string}`,
    abi: PRESALE_ABI,
    functionName: 'getUserPurchased',
    args: [address as `0x${string}`],
    enabled: !!address,
  })

  // Switch network if not on BSC Testnet
  const handleSwitchNetwork = async () => {
    try {
      await switchNetwork?.(bscTestnet.id)
    } catch (error) {
      console.error('Failed to switch network:', error)
      toast({
        title: "Network Switch Failed",
        description: "Please try switching networks manually in your wallet",
        variant: "destructive"
      })
    }
  }

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
          <Button onClick={handleSwitchNetwork}>Switch to BSC Testnet</Button>
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
            <p className="font-bold">{moroBalance ? formatEther(moroBalance as bigint) : '0'} MORO</p>
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
            <p className="font-bold">{userPurchased ? formatEther(userPurchased as bigint) : '0'} MORO</p>
            <p className="text-sm text-gray-600 mt-4">Tokens Available</p>
            <p className="font-bold">{tokensAvailable ? formatEther(tokensAvailable as bigint) : '0'} MORO</p>
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

      <div className="mt-6 flex justify-end">
        <Button variant="outline" size="sm" className="gap-2">
          <RefreshCw className="h-4 w-4" />
          Refresh Data
        </Button>
      </div>
    </div>
  )
}

export default Dashboard