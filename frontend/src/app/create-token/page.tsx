import { CreateTokenFormClient } from '@/components/CreateTokenFormClient';

export default function CreateTokenPage() {
  return (
    <div className="min-h-screen pt-32 pb-20">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-4">
            Create Your Token
          </h1>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            Launch your token on Ethereum in just a few clicks. No coding required.
          </p>
        </div>

        {/* Form Card */}
        <div className="card p-8 mb-8">
          <CreateTokenFormClient />
        </div>

        {/* Info Notice */}
        <div className="text-center">
          <div className="inline-block px-6 py-3 bg-white/5 border border-white/10 rounded-lg">
            <p className="text-gray-400 text-sm">
              ✅ On-chain token creation is live. Set <code className="bg-white/10 px-1 py-0.5 rounded">NEXT_PUBLIC_ERC20_FACTORY_ADDRESS</code> to your deployed factory.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
