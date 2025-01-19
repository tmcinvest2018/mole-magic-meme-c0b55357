import { WagmiConfig, createConfig } from 'wagmi'
import { bscTestnet } from 'wagmi/chains'
import { http } from 'viem'
import { injected } from 'wagmi/connectors'
import { createWeb3Modal, defaultWagmiConfig } from '@web3modal/wagmi'

const projectId = 'YOUR_PROJECT_ID' // You'll need to get this from WalletConnect

const metadata = {
  name: 'MORO Token Presale',
  description: 'MORO Token Presale DApp',
  url: 'https://your-website.com',
  icons: ['https://avatars.githubusercontent.com/u/37784886']
}

const config = defaultWagmiConfig({
  chains: [bscTestnet],
  projectId,
  metadata,
  transports: {
    [bscTestnet.id]: http('https://data-seed-prebsc-1-s1.binance.org:8545'),
  },
})

// Initialize modal
createWeb3Modal({ wagmiConfig: config, projectId, chains: [bscTestnet] })

export function Web3Provider({ children }: { children: React.ReactNode }) {
  return <WagmiConfig config={config}>{children}</WagmiConfig>
}