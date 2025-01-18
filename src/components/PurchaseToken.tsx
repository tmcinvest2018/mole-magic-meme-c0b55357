import { useState } from 'react'
import { useContractWrite, useAccount, useBalance } from 'wagmi'
import { parseEther } from 'viem'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { useToast } from './ui/use-toast'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

const PRESALE_CONTRACT = '0x33B6f94577747E7a859B5b66fB042c76BEe3A3CD'
const USDT_CONTRACT = '0x3616C1a63F5Fc6510Ac4B720c2Ae0b739f69893B'

// ABI definitions
const PRESALE_ABI = [
  {
    inputs: [],
    name: 'buyWithBNB',
    outputs: [],
    stateMutability: 'payable',
    type: 'function',
  },
  {
    inputs: [{ type: 'uint256', name: 'amount' }],
    name: 'buyWithUSDT',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  }
] as const;

export const PurchaseToken = () => {
  const [amount, setAmount] = useState('')
  const { address } = useAccount()
  const { toast } = useToast()

  const { data: balance } = useBalance({
    address,
  })

  const { writeContract: buyWithBNB } = useContractWrite({
    abi: PRESALE_ABI,
    functionName: 'buyWithBNB',
  })

  const { writeContract: buyWithUSDT } = useContractWrite({
    abi: PRESALE_ABI,
    functionName: 'buyWithUSDT',
  })

  const handlePurchaseWithBNB = async () => {
    try {
      console.log('Attempting BNB purchase...')
      const tx = await buyWithBNB({
        abi: PRESALE_ABI,
        address: PRESALE_CONTRACT as `0x${string}`,
        functionName: 'buyWithBNB',
        args: [],
        value: parseEther(amount)
      })
      console.log('BNB purchase transaction:', tx)
      
      toast({
        title: "Transaction Submitted",
        description: "Please wait for the transaction to be confirmed.",
      })
    } catch (error) {
      console.error('BNB purchase error:', error)
      toast({
        title: "Purchase Failed",
        description: error instanceof Error ? error.message : "Failed to purchase tokens. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handlePurchaseWithUSDT = async () => {
    try {
      console.log('Attempting USDT purchase...')
      const tx = await buyWithUSDT({
        abi: PRESALE_ABI,
        address: PRESALE_CONTRACT as `0x${string}`,
        functionName: 'buyWithUSDT',
        args: [parseEther(amount)]
      })
      console.log('USDT purchase transaction:', tx)
      
      toast({
        title: "Transaction Submitted",
        description: "Please wait for the transaction to be confirmed.",
      })
    } catch (error) {
      console.error('USDT purchase error:', error)
      toast({
        title: "Purchase Failed",
        description: error instanceof Error ? error.message : "Failed to purchase tokens. Please try again.",
        variant: "destructive",
      })
    }
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button disabled={!address}>Buy MORO</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Purchase MORO Tokens</DialogTitle>
        </DialogHeader>
        <Tabs defaultValue="bnb" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="bnb">Buy with BNB</TabsTrigger>
            <TabsTrigger value="usdt">Buy with USDT</TabsTrigger>
          </TabsList>
          <TabsContent value="bnb" className="space-y-4">
            <div className="space-y-4">
              <Input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="Amount of BNB"
              />
              <Button 
                onClick={handlePurchaseWithBNB} 
                className="w-full"
                disabled={!address || !amount}
              >
                Purchase with BNB
              </Button>
            </div>
          </TabsContent>
          <TabsContent value="usdt" className="space-y-4">
            <div className="space-y-4">
              <Input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="Amount of USDT"
              />
              <Button 
                onClick={handlePurchaseWithUSDT}
                className="w-full"
                disabled={!address || !amount}
              >
                Purchase with USDT
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  )
}