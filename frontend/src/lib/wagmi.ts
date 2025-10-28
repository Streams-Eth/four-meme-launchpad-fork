import { getDefaultConfig } from '@rainbow-me/rainbowkit';
import { bsc, bscTestnet, mainnet, sepolia } from 'wagmi/chains';

export const config = getDefaultConfig({
  appName: 'Four.Meme Launchpad',
  projectId: process.env.NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID || 'your-project-id',
  chains: [mainnet, sepolia, bsc, bscTestnet],
  ssr: true,
});
