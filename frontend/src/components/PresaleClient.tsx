'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { useAccount, useReadContract, useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { parseEther, formatEther, formatUnits } from 'viem';
import toast from 'react-hot-toast';
import { FixedLSTPresaleAbi } from '@/lib/abis';
import { LST_PRESALE_ADDRESS } from '@/lib/contracts';

export function PresaleClient() {
  const { address, isConnected } = useAccount();
  const [ethAmount, setEthAmount] = useState('0.01');

  const presaleAddress = LST_PRESALE_ADDRESS;

  // Read contract data
  const { data: saleStats, refetch: refetchStats } = useReadContract({
    abi: FixedLSTPresaleAbi,
    address: presaleAddress,
    functionName: 'getSaleStats',
    query: { enabled: !!presaleAddress, refetchInterval: 10000 },
  });

  const { data: userPurchase, refetch: refetchUserPurchase } = useReadContract({
    abi: FixedLSTPresaleAbi,
    address: presaleAddress,
    functionName: 'userPurchases',
    args: address ? [address] : undefined,
    query: { enabled: !!presaleAddress && !!address, refetchInterval: 10000 },
  });

  const { data: isPaused } = useReadContract({
    abi: FixedLSTPresaleAbi,
    address: presaleAddress,
    functionName: 'paused',
    query: { enabled: !!presaleAddress },
  });

  // Parse sale stats
  const stats = useMemo(() => {
    if (!saleStats) return null;
    const [totalRaised, totalFees, tokensRemaining, tokensSold, isActive] = saleStats as [
      bigint,
      bigint,
      bigint,
      bigint,
      boolean
    ];
    return {
      totalRaised: formatEther(totalRaised),
      totalFees: formatEther(totalFees),
      tokensRemaining: formatUnits(tokensRemaining, 18),
      tokensSold: formatUnits(tokensSold, 18),
      isActive,
    };
  }, [saleStats]);

  // Calculate purchase preview
  const preview = useMemo(() => {
    try {
      const eth = parseFloat(ethAmount || '0');
      if (isNaN(eth) || eth <= 0) return null;

      const tokens = eth / 0.0001; // 0.0001 ETH per token
      const platformFee = eth * 0.025; // 2.5%
      const creatorAmount = eth - platformFee;

      return {
        tokens: tokens.toLocaleString(),
        platformFee: platformFee.toFixed(6),
        creatorAmount: creatorAmount.toFixed(6),
      };
    } catch {
      return null;
    }
  }, [ethAmount]);

  // Write contract
  const { writeContract, data: txHash, isPending, error: writeError } = useWriteContract();
  const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({
    hash: txHash,
  });

  // Handle transaction status
  useEffect(() => {
    if (isConfirmed && txHash) {
      toast.success('Tokens purchased successfully!');
      refetchStats();
      refetchUserPurchase();
      setEthAmount('0.01');
    }
  }, [isConfirmed, txHash, refetchStats, refetchUserPurchase]);

  useEffect(() => {
    if (writeError) {
      toast.error(writeError.message || 'Transaction failed');
    }
  }, [writeError]);

  useEffect(() => {
    if (isConfirming) {
      toast.loading('Confirming transaction...', { id: 'confirming' });
    } else {
      toast.dismiss('confirming');
    }
  }, [isConfirming]);

  const handleBuy = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isConnected) {
      toast.error('Connect your wallet first');
      return;
    }

    if (!presaleAddress) {
      toast.error('Presale address not configured. Set NEXT_PUBLIC_LST_PRESALE_ADDRESS');
      return;
    }

    if (isPaused) {
      toast.error('Presale is currently paused');
      return;
    }

    const eth = parseFloat(ethAmount);
    if (isNaN(eth) || eth < 0.0001) {
      toast.error('Minimum purchase is 0.0001 ETH');
      return;
    }

    try {
      const value = parseEther(ethAmount);
      writeContract({
        abi: FixedLSTPresaleAbi,
        address: presaleAddress,
        functionName: 'buyTokens',
        value,
      } as any);
    } catch (err: any) {
      toast.error(err?.message || 'Failed to prepare transaction');
    }
  };

  // Calculate progress
  const progress = useMemo(() => {
    if (!stats) return 0;
    const sold = parseFloat(stats.tokensSold);
    const total = 3000000; // 3M max tokens
    return Math.min((sold / total) * 100, 100);
  }, [stats]);

  return (
    <div className="grid lg:grid-cols-3 gap-8">
      {/* Left Column - Stats */}
      <div className="lg:col-span-1 space-y-6">
        {/* Live Stats Card */}
        <div className="card p-6">
          <h3 className="text-xl font-bold text-white mb-4 flex items-center">
            <span className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></span>
            Live Stats
          </h3>
          
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-400">Tokens Sold</span>
                <span className="text-white font-medium">
                  {stats ? parseFloat(stats.tokensSold).toLocaleString(undefined, { maximumFractionDigits: 0 }) : '...'} LST
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Remaining</span>
                <span className="text-white font-medium">
                  {stats ? parseFloat(stats.tokensRemaining).toLocaleString(undefined, { maximumFractionDigits: 0 }) : '...'} LST
                </span>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="space-y-2">
              <div className="w-full bg-white/5 rounded-full h-2 overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-blue-500 to-purple-600 transition-all duration-500"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <div className="text-right text-sm text-gray-400">
                {progress.toFixed(1)}% sold
              </div>
            </div>

            <div className="border-t border-white/10 pt-4 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Total Raised</span>
                <span className="text-white font-medium">
                  {stats ? `${parseFloat(stats.totalRaised).toFixed(4)} ETH` : '...'}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Platform Fees</span>
                <span className="text-white font-medium">
                  {stats ? `${parseFloat(stats.totalFees).toFixed(4)} ETH` : '...'}
                </span>
              </div>
            </div>

            {stats?.isActive === false && (
              <div className="mt-4 p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
                <p className="text-red-400 text-sm text-center">
                  ⚠️ Presale is not active
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Your Purchases */}
        {isConnected && (
          <div className="card p-6">
            <h3 className="text-lg font-semibold text-white mb-3">Your Purchases</h3>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">ETH Spent</span>
                <span className="text-white font-medium">
                  {userPurchase ? formatEther(userPurchase as bigint) : '0'} ETH
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Tokens Received</span>
                <span className="text-white font-medium">
                  {userPurchase 
                    ? (parseFloat(formatEther(userPurchase as bigint)) / 0.0001).toLocaleString(undefined, { maximumFractionDigits: 0 })
                    : '0'} LST
                </span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Right Column - Purchase Form */}
      <div className="lg:col-span-2">
        <div className="card p-8">
          <h2 className="text-3xl font-bold text-white mb-6">Buy LST Tokens</h2>

          {!presaleAddress ? (
            <div className="p-6 bg-yellow-500/10 border border-yellow-500/20 rounded-lg text-center">
              <p className="text-yellow-400 mb-2">⚠️ Presale Not Configured</p>
              <p className="text-sm text-gray-400">
                Set <code className="bg-white/10 px-2 py-1 rounded">NEXT_PUBLIC_LST_PRESALE_ADDRESS</code> in your environment
              </p>
            </div>
          ) : !isConnected ? (
            <div className="text-center py-8">
              <svg className="w-16 h-16 text-gray-600 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
              <p className="text-gray-400 mb-4">Connect your wallet to participate in the presale</p>
            </div>
          ) : (
            <form onSubmit={handleBuy} className="space-y-6">
              {/* ETH Input */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Amount in ETH
                </label>
                <div className="relative">
                  <input
                    type="number"
                    step="0.0001"
                    min="0.0001"
                    placeholder="0.01"
                    value={ethAmount}
                    onChange={(e) => setEthAmount(e.target.value)}
                    className="w-full px-4 py-4 rounded-lg bg-white/5 border border-white/10 text-white text-lg placeholder-gray-400 focus:outline-none focus:border-blue-500 transition-colors"
                    required
                  />
                  <div className="absolute right-4 top-1/2 -translate-y-1/2">
                    <span className="text-gray-400 text-sm">ETH</span>
                  </div>
                </div>
                <div className="mt-2 flex gap-2">
                  {['0.01', '0.1', '0.5', '1'].map((amount) => (
                    <button
                      key={amount}
                      type="button"
                      onClick={() => setEthAmount(amount)}
                      className="px-3 py-1 text-sm bg-white/5 hover:bg-white/10 border border-white/10 rounded text-gray-300 transition-colors"
                    >
                      {amount} ETH
                    </button>
                  ))}
                </div>
              </div>

              {/* Preview */}
              {preview && (
                <div className="space-y-3 p-4 bg-white/5 border border-white/10 rounded-lg">
                  <h4 className="text-sm font-medium text-gray-300">Purchase Preview</h4>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400">You will receive</span>
                      <span className="text-white font-semibold text-lg">
                        {preview.tokens} LST
                      </span>
                    </div>
                    
                    <div className="border-t border-white/10 pt-2 space-y-1 text-xs">
                      <div className="flex justify-between">
                        <span className="text-gray-500">Platform Fee (2.5%)</span>
                        <span className="text-gray-400">{preview.platformFee} ETH</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">To Project</span>
                        <span className="text-gray-400">{preview.creatorAmount} ETH</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Buy Button */}
              <button
                type="submit"
                disabled={isPending || isConfirming || !preview || Boolean(isPaused)}
                className="w-full py-4 px-6 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-semibold rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-[1.02] active:scale-[0.98]"
              >
                {isPending || isConfirming ? (
                  <span className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    {isConfirming ? 'Confirming...' : 'Processing...'}
                  </span>
                ) : (
                  'Buy LST Tokens'
                )}
              </button>

              {/* Token Address removed per request: do not display contract addresses in UI */}
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
