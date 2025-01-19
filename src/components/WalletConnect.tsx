import { useAccount, useConnect, useDisconnect, useChainId } from 'wagmi'
import { Button } from './ui/button'
import { useToast } from './ui/use-toast'
import { bscTestnet } from 'wagmi/chains'
import { w3mConnector } from '@web3modal/wagmi'

export const WalletConnect = () => {
  const { address, isConnected } = useAccount()
  const { connect, connectors } = useConnect()
  const { disconnect } = useDisconnect()
  const chainId = useChainId()
  const { toast } = useToast()

  // Find MetaMask and WalletConnect connectors
  const metaMaskConnector = connectors.find(c => c.id === 'injected')
  const walletConnectConnector = connectors.find(c => c.id === 'w3m') || 
    w3mConnector({ 
      projectId: 'YOUR_PROJECT_ID', // You'll need to get this from WalletConnect
      chains: [bscTestnet],
    })

  const handleConnect = async () => {
    try {
      console.log('Attempting wallet connection...')
      
      // Check if we're on the correct network
      if (chainId !== bscTestnet.id) {
        console.log('Wrong network detected, attempting to switch...')
        try {
          // Request network switch
          await window.ethereum?.request({
            method: 'wallet_switchEthereumChain',
            params: [{ chainId: `0x${bscTestnet.id.toString(16)}` }],
          })
          toast({
            title: "Network Switched",
            description: "Successfully switched to BSC Testnet",
          })
        } catch (error) {
          console.error('Network switch error:', error)
          toast({
            title: "Network Switch Failed",
            description: "Failed to switch to BSC Testnet. Please switch manually.",
            variant: "destructive",
          })
          return
        }
      }

      // Try MetaMask first if available
      if (window.ethereum && metaMaskConnector) {
        console.log('MetaMask detected, connecting...')
        await connect({ connector: metaMaskConnector })
      } 
      // Fallback to WalletConnect
      else if (walletConnectConnector) {
        console.log('Using WalletConnect as fallback...')
        await connect({ connector: walletConnectConnector })
      }

      toast({
        title: "Wallet Connected",
        description: "Your wallet has been successfully connected!",
      })
    } catch (error) {
      console.error('Wallet connection error:', error)
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