import { PresaleClient } from '@/components/PresaleClient';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Launch Stream Token Presale | Four.Meme',
  description: 'Buy Launch Stream Token (LST) at presale price. 0.0001 ETH per token. Limited supply of 3M tokens.',
  openGraph: {
    title: 'Launch Stream Token Presale',
    description: 'Buy Launch Stream Token (LST) at presale price. 0.0001 ETH per token.',
  },
};

export default function PresalePage() {
  return (
    <div className="min-h-screen pt-32 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-blue-500/10 to-purple-600/10 border border-blue-500/20 rounded-full mb-6">
            <span className="text-blue-400 text-sm font-medium">🚀 Limited Presale Opportunity</span>
          </div>
          
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
            Launch Stream Token
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-600">
              Presale
            </span>
          </h1>
          
          <p className="text-xl text-gray-400 max-w-3xl mx-auto mb-8">
            Get LST tokens at presale price before public launch. Fair pricing, transparent distribution, and immediate delivery.
          </p>

          <div className="flex flex-wrap justify-center gap-4 text-sm text-gray-400">
            <div className="flex items-center">
              <svg className="w-5 h-5 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span>Instant Token Delivery</span>
            </div>
            <div className="flex items-center">
              <svg className="w-5 h-5 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span>No Vesting or Locks</span>
            </div>
            <div className="flex items-center">
              <svg className="w-5 h-5 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span>Verified Smart Contract</span>
            </div>
          </div>
        </div>

        {/* Presale Component */}
        <PresaleClient />

        {/* Token Information */}
        <div className="mt-16 grid md:grid-cols-2 gap-8">
          <div className="card p-8">
            <h3 className="text-2xl font-bold text-white mb-4">📊 Token Details</h3>
            <div className="space-y-3 text-gray-300">
              <div className="flex justify-between border-b border-white/10 pb-3">
                <span className="text-gray-400">Token Name</span>
                <span className="font-medium text-white">Launch Stream Token</span>
              </div>
              <div className="flex justify-between border-b border-white/10 pb-3">
                <span className="text-gray-400">Token Symbol</span>
                <span className="font-medium text-white">LST</span>
              </div>
              <div className="flex justify-between border-b border-white/10 pb-3">
                <span className="text-gray-400">Presale Price</span>
                <span className="font-medium text-white">0.0001 ETH</span>
              </div>
              <div className="flex justify-between border-b border-white/10 pb-3">
                <span className="text-gray-400">Total Supply</span>
                <span className="font-medium text-white">3,000,000 LST</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Token Standard</span>
                <span className="font-medium text-white">ERC-20</span>
              </div>
            </div>
          </div>

          <div className="card p-8">
            <h3 className="text-2xl font-bold text-white mb-4">💎 Why Buy LST?</h3>
            <ul className="space-y-3 text-gray-300">
              <li className="flex items-start">
                <svg className="w-6 h-6 text-blue-500 mr-3 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
                <span>Early access to platform governance and features</span>
              </li>
              <li className="flex items-start">
                <svg className="w-6 h-6 text-blue-500 mr-3 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>Fixed presale price - no price increases or tiers</span>
              </li>
              <li className="flex items-start">
                <svg className="w-6 h-6 text-blue-500 mr-3 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
                <span>Audited smart contract with transparent distribution</span>
              </li>
              <li className="flex items-start">
                <svg className="w-6 h-6 text-blue-500 mr-3 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                <span>Immediate token delivery to your wallet</span>
              </li>
            </ul>
          </div>
        </div>

        {/* FAQ */}
        <div className="mt-16 card p-8">
          <h3 className="text-3xl font-bold text-white mb-8 text-center">Frequently Asked Questions</h3>
          
          <div className="space-y-6 max-w-3xl mx-auto">
            <div>
              <h4 className="text-lg font-semibold text-white mb-2">How does the presale work?</h4>
              <p className="text-gray-400">
                Connect your wallet, enter the amount of ETH you want to spend, and click "Buy Tokens". 
                You'll receive LST tokens instantly at the rate of 10,000 LST per 1 ETH (0.0001 ETH per token).
              </p>
            </div>

            <div>
              <h4 className="text-lg font-semibold text-white mb-2">What is the minimum purchase?</h4>
              <p className="text-gray-400">
                The minimum purchase is 0.0001 ETH, which gets you 1 LST token. There is no maximum limit.
              </p>
            </div>

            <div>
              <h4 className="text-lg font-semibold text-white mb-2">Are there any fees?</h4>
              <p className="text-gray-400">
                Yes, there is a 2.5% platform fee on all purchases. This fee is automatically deducted and split: 
                97.5% goes to the project creator, 2.5% goes to the platform treasury.
              </p>
            </div>

            <div>
              <h4 className="text-lg font-semibold text-white mb-2">When will I receive my tokens?</h4>
              <p className="text-gray-400">
                Tokens are delivered immediately upon purchase confirmation. No waiting period or vesting schedule.
              </p>
            </div>

            <div>
              <h4 className="text-lg font-semibold text-white mb-2">What happens after the presale ends?</h4>
              <p className="text-gray-400">
                LST tokens will be available for trading on decentralized exchanges. Early presale participants 
                get the best price before public launch.
              </p>
            </div>
          </div>
        </div>

        {/* Disclaimer */}
        <div className="mt-8 text-center">
          <p className="text-sm text-gray-500 max-w-3xl mx-auto">
            ⚠️ Disclaimer: Cryptocurrency investments carry risk. Do your own research before purchasing. 
            This is not financial advice. Token prices may fluctuate after presale.
          </p>
        </div>
      </div>
    </div>
  );
}
