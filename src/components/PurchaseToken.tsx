import { useState } from 'react'
import { useContractWrite, useAccount, useBalance } from 'wagmi'
import { parseEther } from 'viem'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { useToast } from './ui/use-toast'

const PRESALE_CONTRACT = '0x33B6f94577747E7a859B5b66fB042c76BEe3A3CD'
const USDT_CONTRACT = '0x3616C1a63F5Fc6510Ac4B720c2Ae0b739f69893B'

export const PurchaseToken = () => {
  const [amount, setAmount] = useState('')
  const { address } = useAccount()
  const { toast } = useToast()

  const { data: balance } = useBalance({
    address,
  })

  const { write: purchaseWithBNB } = useContractWrite({
    address: PRESALE_CONTRACT as `0x${string}`,
    abi: [
      {
        name: 'buyWithBNB',
        type: 'function',
        stateMutability: 'payable',
        inputs: [],
        outputs: [],
      },
    ],
    functionName: 'buyWithBNB',
  })

  const handlePurchase = async () => {
    try {
      await purchaseWithBNB({
        value: parseEther(amount),
      })
      toast({
        title: "Purchase Successful",
        description: `Successfully purchased ${amount} MORO tokens!`,
      })
    } catch (error) {
      toast({
        title: "Purchase Failed",
        description: "Failed to purchase tokens. Please try again.",
        variant: "destructive",
      })
    }
  }

  return (
    <div className="space-y-4">
      <Input
        type="number"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        placeholder="Amount of BNB"
        className="max-w-xs mx-auto"
      />
      <Button onClick={handlePurchase} disabled={!address}>
        Buy MORO
      </Button>
    </div>
  )
}