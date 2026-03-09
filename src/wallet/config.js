import { getDefaultConfig } from '@rainbow-me/rainbowkit'
import { http } from 'wagmi'

// Avalanche Fuji Testnet chain definition
const avalancheFuji = {
  id: 43113,
  name: 'Avalanche Fuji',
  nativeCurrency: { name: 'AVAX', symbol: 'AVAX', decimals: 18 },
  rpcUrls: {
    default: { http: ['https://api.avax-test.network/ext/bc/C/rpc'] },
  },
  blockExplorers: {
    default: { name: 'SnowTrace', url: 'https://testnet.snowtrace.io' },
  },
  testnet: true,
}

export const config = getDefaultConfig({
  appName: 'Glade',
  projectId: 'glade-farming-game', // WalletConnect project ID placeholder
  chains: [avalancheFuji],
  transports: {
    [avalancheFuji.id]: http('https://api.avax-test.network/ext/bc/C/rpc'),
  },
})

export { avalancheFuji }
