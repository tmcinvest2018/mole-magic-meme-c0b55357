import { useAccount, useConnect, useDisconnect } from 'wagmi'
import { Button } from './ui/button'
import { useToast } from './ui/use-toast'
import { supabase } from '@/integrations/supabase/client'
import { LogOut } from 'lucide-react'

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

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    toast({
      title: "Signed Out",
      description: "You have been successfully signed out.",
    })
  }

  return (
    <div className="flex gap-2">
      {isConnected ? (
        <>
          <Button onClick={() => disconnect()} variant="outline">
            Disconnect {address?.slice(0, 6)}...{address?.slice(-4)}
          </Button>
          <Button onClick={handleSignOut} variant="destructive">
            <LogOut className="w-4 h-4 mr-2" />
            Sign Out
          </Button>
        </>
      ) : (
        <Button onClick={handleConnect}>Connect Wallet</Button>
      )}
    </div>
  )
}