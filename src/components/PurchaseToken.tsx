import { useState } from 'react'
import { useContractWrite, useAccount, useBalance, useWriteContract, useChainId } from 'wagmi'
import { parseEther } from 'viem'
import { bscTestnet } from 'viem/chains'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { useToast } from './ui/use-toast'
import { PRESALE_CONTRACT, PRESALE_ABI, USDT_CONTRACT } from '@/config/contracts'

export const PurchaseToken = () => {
  const [amount, setAmount] = useState('')
  const { address } = useAccount()
  const chainId = useChainId()
  const { toast } = useToast()
  const { writeContractAsync } = useWriteContract()

  // Get BNB balance
  const { data: bnbBalance } = useBalance({
    address,
  })

  // Get USDT balance
  const { data: usdtBalance } = useBalance({
    address,
    token: USDT_CONTRACT as `0x${string}`,
  })

  const handleBuyWithBNB = async () => {
    if (!amount || !address) return

    try {
      if (chainId !== bscTestnet.id) {
        toast({
          title: "Wrong Network",
          description: "Please switch to BSC Testnet",
          variant: "destructive",
        })
        return
      }

      await writeContractAsync({
        address: PRESALE_CONTRACT as `0x${string}`,
        abi: PRESALE_ABI,
        functionName: 'buyWithBNB',
        value: parseEther(amount),
      })

      toast({
        title: "Purchase Successful",
        description: "You have successfully purchased MORO tokens with BNB",
      })
    } catch (error) {
      console.error('Error buying with BNB:', error)
      toast({
        title: "Purchase Failed",
        description: "Failed to purchase tokens. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleBuyWithUSDT = async () => {
    if (!amount || !address) return

    try {
      if (chainId !== bscTestnet.id) {
        toast({
          title: "Wrong Network",
          description: "Please switch to BSC Testnet",
          variant: "destructive",
        })
        return
      }

      // First approve USDT spending
      await writeContractAsync({
        address: USDT_CONTRACT as `0x${string}`,
        abi: [
          {
            inputs: [
              { name: "spender", type: "address" },
              { name: "amount", type: "uint256" },
            ],
            name: "approve",
            outputs: [{ name: "", type: "bool" }],
            stateMutability: "nonpayable",
            type: "function",
          },
        ],
        functionName: 'approve',
        args: [PRESALE_CONTRACT, parseEther(amount)],
      })

      // Then buy with USDT
      await writeContractAsync({
        address: PRESALE_CONTRACT as `0x${string}`,
        abi: PRESALE_ABI,
        functionName: 'buyWithUSDT',
        args: [parseEther(amount)],
      })

      toast({
        title: "Purchase Successful",
        description: "You have successfully purchased MORO tokens with USDT",
      })
    } catch (error) {
      console.error('Error buying with USDT:', error)
      toast({
        title: "Purchase Failed",
        description: "Failed to purchase tokens. Please try again.",
        variant: "destructive",
      })
    }
  }

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Input
          type="number"
          placeholder="Amount"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
        />
        <div className="text-sm text-gray-500">
          Your BNB Balance: {bnbBalance?.formatted || '0'} BNB
          <br />
          Your USDT Balance: {usdtBalance?.formatted || '0'} USDT
        </div>
      </div>
      <div className="space-x-4">
        <Button onClick={handleBuyWithBNB}>Buy with BNB</Button>
        <Button onClick={handleBuyWithUSDT}>Buy with USDT</Button>
      </div>
    </div>
  )
}