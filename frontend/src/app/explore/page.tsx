import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Explore Tokens - Four.Meme Launchpad',
  description: 'Discover and explore the latest meme tokens on BNB Chain.',
};

export default function ExplorePage() {
  return (
    <div className="min-h-screen pt-32 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-4">
            Explore Tokens
          </h1>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            Discover trending meme tokens created on our platform. Filter, sort, and find your next investment opportunity.
          </p>
        </div>

        {/* Filters & Search */}
        <div className="mb-12">
          <div className="card p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <input
                  type="text"
                  placeholder="Search tokens..."
                  className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 transition-colors"
                />
              </div>
              <div>
                <select className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-white focus:outline-none focus:border-blue-500 transition-colors">
                  <option value="">Sort by: Latest</option>
                  <option value="volume">Highest Volume</option>
                  <option value="marketcap">Market Cap</option>
                  <option value="holders">Most Holders</option>
                </select>
              </div>
              <div>
                <select className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-white focus:outline-none focus:border-blue-500 transition-colors">
                  <option value="">All Categories</option>
                  <option value="meme">Meme</option>
                  <option value="gaming">Gaming</option>
                  <option value="defi">DeFi</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Token Grid - Placeholder */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="card card-hover p-6">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold mr-4">
                  {i}
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-white">Token {i}</h3>
                  <p className="text-sm text-gray-400">SYMBOL{i}</p>
                </div>
              </div>
              <div className="space-y-2 mb-4">
                <div className="flex justify-between">
                  <span className="text-gray-400">Market Cap:</span>
                  <span className="text-white font-semibold">$1.5M</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Volume 24h:</span>
                  <span className="text-green-400 font-semibold">$250K</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Holders:</span>
                  <span className="text-white font-semibold">1,234</span>
                </div>
              </div>
              <button className="w-full px-4 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg font-semibold hover:from-blue-600 hover:to-purple-700 transition-all">
                View Details
              </button>
            </div>
          ))}
        </div>

        {/* Coming Soon Message */}
        <div className="mt-16 text-center">
          <div className="inline-block px-6 py-3 bg-white/5 border border-white/10 rounded-lg">
            <p className="text-gray-400">
              🚀 Real token data integration coming soon. Connect your wallet to see live tokens!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
