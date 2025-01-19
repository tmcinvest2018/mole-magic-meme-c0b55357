import { useAccount, useConnect, useDisconnect } from 'wagmi'
import { Button } from './ui/button'
import { useToast } from './ui/use-toast'
import { bscTestnet } from 'wagmi/chains'

export const WalletConnect = () => {
  const { address, isConnected, chainId } = useAccount()
  const { connect, connectors } = useConnect()
  const { disconnect } = useDisconnect()
  const { toast } = useToast()

  const handleConnect = async () => {
    try {
      console.log('Attempting wallet connection...')
      
      // Check if we're on the correct network
      if (chainId !== bscTestnet.id) {
        console.log('Wrong network detected')
        if (window.ethereum) {
          try {
            await window.ethereum.request({
              method: 'wallet_switchEthereumChain',
              params: [{ chainId: `0x${bscTestnet.id.toString(16)}` }],
            })
            toast({
              title: "Network Switched",
              description: "Successfully switched to BSC Testnet"
            })
          } catch (error) {
            console.error('Network switch error:', error)
            toast({
              title: "Network Switch Failed",
              description: "Failed to switch to BSC Testnet. Please switch manually.",
              variant: "destructive"
            })
            return
          }
        }
      }

      // Connect using available connector
      const connector = connectors[0]
      if (connector) {
        await connect({ connector })
        toast({
          title: "Wallet Connected",
          description: "Your wallet has been successfully connected!"
        })
      }
    } catch (error) {
      console.error('Wallet connection error:', error)
      toast({
        title: "Connection Failed",
        description: "Failed to connect wallet. Please try again.",
        variant: "destructive"
      })
    }
  }

  return (
    <div>
      {isConnected ? (
        <Button onClick={() => disconnect()}>
          Disconnect {address?.slice(0, 6)}...{address?.slice(-4)}
        </Button>
      ) : (
        <Button onClick={handleConnect}>Connect Wallet</Button>
      )}
    </div>
  )
}