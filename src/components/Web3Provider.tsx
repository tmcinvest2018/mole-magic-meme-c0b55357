import { WagmiConfig, createConfig } from 'wagmi'
import { bscTestnet } from 'wagmi/chains'
import { http } from 'viem'
import { injected } from 'wagmi/connectors'
import { walletConnect } from 'wagmi/connectors'

const config = createConfig({
  chains: [bscTestnet],
  transports: {
    [bscTestnet.id]: http('https://data-seed-prebsc-1-s1.binance.org:8545'),
  },
  connectors: [
    injected(),
    walletConnect({ 
      projectId: 'YOUR_PROJECT_ID', // You'll need to get this from WalletConnect
      showQrModal: true,
    })
  ],
})

export function Web3Provider({ children }: { children: React.ReactNode }) {
  return <WagmiConfig config={config}>{children}</WagmiConfig>
}