'use client';

import React, { useMemo, useState } from 'react';
import { useAccount, useReadContract, useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { parseUnits, formatEther } from 'viem';
import toast from 'react-hot-toast';
import { ERC20FactoryAbi } from '@/lib/abis';
import { ERC20_FACTORY_ADDRESS } from '@/lib/contracts';

export function CreateTokenFormClient() {
  const { address, isConnected } = useAccount();
  const [name, setName] = useState('');
  const [symbol, setSymbol] = useState('');
  const [totalSupply, setTotalSupply] = useState(''); // human units
  const [liquidityEth, setLiquidityEth] = useState('0.001');

  const factoryAddress = ERC20_FACTORY_ADDRESS;

  const { data: creationFee } = useReadContract({
    abi: ERC20FactoryAbi,
    address: factoryAddress,
    functionName: 'creationFee',
    query: { enabled: !!factoryAddress },
  });

  const creationFeeEth = useMemo(() => (creationFee ? formatEther(creationFee as bigint) : '0.01'), [creationFee]);
  const totalEth = useMemo(() => {
    const fee = Number(creationFeeEth);
    const liq = Number(liquidityEth || '0');
    if (Number.isNaN(fee) || Number.isNaN(liq)) return '0';
    return (fee + liq).toFixed(6);
  }, [creationFeeEth, liquidityEth]);

  const { writeContract, data: txHash, isPending, error: writeError } = useWriteContract();
  const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({
    hash: txHash,
  });

  // Handle transaction status changes
  React.useEffect(() => {
    if (isConfirmed && txHash) {
      toast.success('Token created successfully!');
      // Reset form
      setName('');
      setSymbol('');
      setTotalSupply('');
    }
  }, [isConfirmed, txHash]);

  React.useEffect(() => {
    if (writeError) {
      toast.error(writeError.message || 'Transaction failed');
    }
  }, [writeError]);

  React.useEffect(() => {
    if (isConfirming) {
      toast.loading('Confirming transaction...', { id: 'confirming' });
    } else {
      toast.dismiss('confirming');
    }
  }, [isConfirming]);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isConnected) {
      toast.error('Connect your wallet first');
      return;
    }
    if (!factoryAddress) {
      toast.error('Factory address not configured. Set NEXT_PUBLIC_ERC20_FACTORY_ADDRESS');
      return;
    }
    if (!name || !symbol || !totalSupply) {
      toast.error('Please fill in name, symbol, and total supply');
      return;
    }

    try {
      const supplyWei = parseUnits(totalSupply, 18);
      const owner = address!;
  const value = creationFee ? (creationFee as bigint) : parseUnits('0.01', 18);
      
      writeContract({
        abi: ERC20FactoryAbi,
        address: factoryAddress,
        functionName: 'createToken',
        args: [name, symbol, supplyWei, owner],
        value,
      } as any);
    } catch (err: any) {
      toast.error(err?.message || 'Failed to prepare transaction');
    }
  };

  return (
    <form className="space-y-6" onSubmit={onSubmit}>
      {/* Token Information */}
      <div>
        <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
          <span className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center text-white mr-3">1</span>
          Token Information
        </h2>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Token Name *</label>
            <input
              type="text"
              placeholder="e.g., Doge Killer"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 transition-colors"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Token Symbol *</label>
            <input
              type="text"
              placeholder="e.g., MTKN"
              value={symbol}
              onChange={(e) => setSymbol(e.target.value.toUpperCase())}
              className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 transition-colors"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Total Supply *</label>
            <input
              type="number"
              placeholder="e.g., 1000000000"
              value={totalSupply}
              onChange={(e) => setTotalSupply(e.target.value)}
              className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 transition-colors"
              min="1"
              required
            />
            <p className="text-xs text-gray-400 mt-1">Supply uses 18 decimals. Example: 1,000,000,000 → mints 1B tokens.</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Description</label>
            <textarea
              rows={4}
              placeholder="Tell people about your token..."
              className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 transition-colors resize-none"
            />
          </div>
        </div>
      </div>

      {/* Tokenomics */}
      <div className="pt-6 border-t border-white/10">
        <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
          <span className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center text-white mr-3">2</span>
          Tokenomics
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Buy Tax (%)</label>
            <input type="number" min="0" max="25" defaultValue="5" className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 transition-colors" />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Sell Tax (%)</label>
            <input type="number" min="0" max="25" defaultValue="5" className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 transition-colors" />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Max Wallet (%)</label>
            <input type="number" min="0" max="100" defaultValue="2" className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 transition-colors" />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Max Transaction (%)</label>
            <input type="number" min="0" max="100" defaultValue="1" className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 transition-colors" />
          </div>
        </div>
      </div>

      {/* Liquidity */}
      <div className="pt-6 border-t border-white/10">
        <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
          <span className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center text-white mr-3">3</span>
          Initial Liquidity
        </h2>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">ETH Amount</label>
          <input
            type="number"
            step="0.001"
            placeholder="e.g., 0.001"
            value={liquidityEth}
            onChange={(e) => setLiquidityEth(e.target.value)}
            className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 transition-colors"
          />
          <p className="text-sm text-gray-400 mt-2">Minimum 0.001 ETH required for initial liquidity</p>
        </div>
      </div>

      {/* Summary */}
      <div className="pt-6 border-t border-white/10">
        <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-white mb-4">Creation Fee Summary</h3>
          <div className="space-y-2">
            <div className="flex justify-between text-gray-300">
              <span>Platform Fee:</span>
              <span className="text-white font-semibold">{creationFeeEth} ETH</span>
            </div>
            <div className="flex justify-between text-gray-300">
              <span>Initial Liquidity:</span>
              <span className="text-white font-semibold">{liquidityEth || '0'} ETH</span>
            </div>
            <div className="flex justify-between text-lg font-bold text-white pt-2 border-t border-white/10">
              <span>Total:</span>
              <span>{totalEth} ETH</span>
            </div>
          </div>
          {!factoryAddress && (
            <p className="mt-3 text-xs text-amber-400">Set NEXT_PUBLIC_ERC20_FACTORY_ADDRESS to enable on-chain creation.</p>
          )}
        </div>
      </div>

      {/* Action Button */}
      <button
        type="submit"
        disabled={!isConnected || isPending || isConfirming || !factoryAddress}
        className="w-full px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white text-lg font-semibold rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {!isConnected ? 'Connect Wallet to Create Token' : isPending || isConfirming ? 'Processing...' : 'Create Token'}
      </button>

      {isConfirmed && (
        <p className="text-sm text-green-400">Token created successfully!</p>
      )}
    </form>
  );
}
