import { useAccount, useConnect, useDisconnect } from 'wagmi'
import { Button } from './ui/button'
import { useToast } from './ui/use-toast'

export const WalletConnect = () => {
  const { address, isConnected } = useAccount()
  const { connect, connectors } = useConnect()
  const { disconnect } = useDisconnect()
  const { toast } = useToast()

  const handleConnect = async () => {
    try {
      await connect({ connector: connectors[0] })
      toast({
        title: "Wallet Connected",
        description: "Your wallet has been successfully connected!",
      })
    } catch (error) {
      toast({
        title: "Connection Failed",
        description: "Failed to connect wallet. Please try again.",
        variant: "destructive",
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