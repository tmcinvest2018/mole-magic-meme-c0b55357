import { createWeb3Modal } from '@web3modal/wagmi/react'
import { WagmiConfig, createConfig } from 'wagmi'
import { bscTestnet } from 'wagmi/chains'
import { injected } from 'wagmi/connectors'
import { http } from 'viem'

const config = createConfig({
  chains: [bscTestnet],
  transports: {
    [bscTestnet.id]: http('https://data-seed-prebsc-1-s1.binance.org:8545'),
  },
  connectors: [
    injected()
  ],
})

createWeb3Modal({ wagmiConfig: config, projectId: '', chains: [bscTestnet] })

export function Web3Provider({ children }: { children: React.ReactNode }) {
  return <WagmiConfig config={config}>{children}</WagmiConfig>
}