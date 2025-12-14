'use client';

import { useWriteContract, useWaitForTransactionReceipt, useAccount, useReadContract } from 'wagmi';
import { useEffect } from 'react';
import { formatUnits } from 'viem';
import { ActionButton } from '../ActionButton';
import { mERC20Abi } from '@/abis/mERC20Abi';
import { TOKEN_DECIMALS } from '@/config/contracts';
import type { Address } from 'viem';

interface MintStepProps {
  tokenName: string;
  tokenAddress: Address;
  onComplete: () => void;
}

export function MintStep({ tokenName, tokenAddress, onComplete }: MintStepProps) {
  const { address } = useAccount();

  const { data: balance, refetch: refetchBalance } = useReadContract({
    address: tokenAddress,
    abi: mERC20Abi,
    functionName: 'balanceOf',
    args: address ? [address] : undefined,
  });

  const { writeContract, data: hash, isPending, error } = useWriteContract();

  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
    hash,
  });

  useEffect(() => {
    if (isSuccess) {
      refetchBalance();
      const timer = setTimeout(() => {
        onComplete();
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [isSuccess, onComplete, refetchBalance]);

  const handleMint = () => {
    if (!address) return;
    writeContract({
      address: tokenAddress,
      abi: mERC20Abi,
      functionName: 'mintTo',
      args: [address],
    });
  };

  const formattedBalance = balance ? formatUnits(balance, TOKEN_DECIMALS) : '0';

  return (
    <div className="text-center">
      <div className="mb-6">
        <div className="w-20 h-20 mx-auto mb-4 bg-green-100 rounded-full flex items-center justify-center">
          <svg
            className="w-10 h-10 text-green-500"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </div>
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Mint Test {tokenName}</h2>
        <p className="text-gray-600 mb-4">
          Mint 100 {tokenName} to your wallet. This is a test token for development.
        </p>
        <div className="bg-gray-100 rounded-lg p-3 inline-block">
          <span className="text-gray-600">Current Balance: </span>
          <span className="font-bold text-gray-800">{formattedBalance} {tokenName}</span>
        </div>
      </div>

      <ActionButton
        onClick={handleMint}
        loading={isPending || isConfirming}
        disabled={isSuccess}
      >
        {isSuccess
          ? `Success! +100 ${tokenName}`
          : isPending
          ? 'Confirm in Wallet...'
          : isConfirming
          ? 'Minting...'
          : `Mint 100 ${tokenName}`}
      </ActionButton>

      {error && (
        <p className="mt-4 text-red-500 text-sm">
          {error.message || 'Transaction failed. Please try again.'}
        </p>
      )}
    </div>
  );
}
