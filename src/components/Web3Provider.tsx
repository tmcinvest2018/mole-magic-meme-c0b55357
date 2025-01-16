import { createWeb3Modal } from '@web3modal/wagmi/react'
import { WagmiConfig, configureChains, createConfig } from 'wagmi'
import { bscTestnet } from 'wagmi/chains'
import { InjectedConnector } from 'wagmi/connectors/injected'
import { WalletConnectConnector } from 'wagmi/connectors/walletConnect'
import { publicProvider } from 'wagmi/providers/public'

const { chains, publicClient } = configureChains(
  [bscTestnet],
  [publicProvider()]
)

const projectId = 'YOUR_WALLET_CONNECT_PROJECT_ID' // Replace with your WalletConnect project ID

const metadata = {
  name: 'MORO Token',
  description: 'Morocco Mole Meme Coin',
  url: 'https://your-website.com', // Replace with your website
  icons: ['https://your-website.com/icon.png'] // Replace with your icon
}

const wagmiConfig = createConfig({
  autoConnect: true,
  connectors: [
    new InjectedConnector({ chains }),
    new WalletConnectConnector({
      chains,
      options: {
        projectId,
        metadata,
      },
    }),
  ],
  publicClient,
})

createWeb3Modal({ wagmiConfig, projectId, chains })

export function Web3Provider({ children }: { children: React.ReactNode }) {
  return <WagmiConfig config={wagmiConfig}>{children}</WagmiConfig>
}