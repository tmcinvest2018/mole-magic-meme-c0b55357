import { WagmiConfig, createConfig } from 'wagmi'
import { bscTestnet } from 'wagmi/chains'
import { http } from 'viem'
import { injected, walletConnect } from 'wagmi/connectors'

const projectId = "YOUR_WALLETCONNECT_PROJECT_ID" // Replace with your actual WalletConnect project ID

const config = createConfig({
  chains: [bscTestnet],
  transports: {
    [bscTestnet.id]: http('https://data-seed-prebsc-1-s1.binance.org:8545'),
  },
  connectors: [
    injected(),
    walletConnect({ projectId })
  ],
})

export function Web3Provider({ children }: { children: React.ReactNode }) {
  return <WagmiConfig config={config}>{children}</WagmiConfig>
}