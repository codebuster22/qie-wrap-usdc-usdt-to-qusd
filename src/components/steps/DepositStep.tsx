'use client';

import {
  useWriteContract,
  useWaitForTransactionReceipt,
  useAccount,
  useReadContract,
} from 'wagmi';
import { useEffect, useState } from 'react';
import { formatUnits, maxUint256 } from 'viem';
import { ActionButton } from '../ActionButton';
import { mERC20Abi } from '@/abis/mERC20Abi';
import { qUSDAbi } from '@/abis/qUSDAbi';
import { QUSD_ADDRESS, TOKEN_DECIMALS } from '@/config/contracts';
import type { Address } from 'viem';

interface DepositStepProps {
  tokenName: string;
  tokenAddress: Address;
  onComplete: () => void;
}

export function DepositStep({ tokenName, tokenAddress, onComplete }: DepositStepProps) {
  const { address } = useAccount();
  const [phase, setPhase] = useState<'approve' | 'deposit'>('approve');

  const { data: balance, refetch: refetchBalance } = useReadContract({
    address: tokenAddress,
    abi: mERC20Abi,
    functionName: 'balanceOf',
    args: address ? [address] : undefined,
  });

  const { data: allowance, refetch: refetchAllowance } = useReadContract({
    address: tokenAddress,
    abi: mERC20Abi,
    functionName: 'allowance',
    args: address ? [address, QUSD_ADDRESS] : undefined,
  });

  const { data: qUsdBalance, refetch: refetchQUsdBalance } = useReadContract({
    address: QUSD_ADDRESS,
    abi: qUSDAbi,
    functionName: 'balanceOf',
    args: address ? [address] : undefined,
  });

  const {
    writeContract: writeApprove,
    data: approveHash,
    isPending: isApprovePending,
    error: approveError,
    reset: resetApprove,
  } = useWriteContract();

  const {
    writeContract: writeDeposit,
    data: depositHash,
    isPending: isDepositPending,
    error: depositError,
    reset: resetDeposit,
  } = useWriteContract();

  const { isLoading: isApproveConfirming, isSuccess: isApproveSuccess } =
    useWaitForTransactionReceipt({ hash: approveHash });

  const { isLoading: isDepositConfirming, isSuccess: isDepositSuccess } =
    useWaitForTransactionReceipt({ hash: depositHash });

  // Check if already approved
  useEffect(() => {
    if (allowance && balance && allowance >= balance && balance > 0n) {
      setPhase('deposit');
    }
  }, [allowance, balance]);

  // After approval, move to deposit phase
  useEffect(() => {
    if (isApproveSuccess) {
      refetchAllowance();
      setPhase('deposit');
      resetApprove();
    }
  }, [isApproveSuccess, refetchAllowance, resetApprove]);

  // After deposit success
  useEffect(() => {
    if (isDepositSuccess) {
      refetchBalance();
      refetchQUsdBalance();
      const timer = setTimeout(() => {
        onComplete();
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [isDepositSuccess, onComplete, refetchBalance, refetchQUsdBalance]);

  const handleApprove = () => {
    writeApprove({
      address: tokenAddress,
      abi: mERC20Abi,
      functionName: 'approve',
      args: [QUSD_ADDRESS, maxUint256],
    });
  };

  const handleDeposit = () => {
    if (!balance || balance === 0n) return;
    writeDeposit({
      address: QUSD_ADDRESS,
      abi: qUSDAbi,
      functionName: 'deposit',
      args: [tokenAddress, balance],
    });
  };

  const formattedBalance = balance ? formatUnits(balance, TOKEN_DECIMALS) : '0';
  const formattedQUsdBalance = qUsdBalance ? formatUnits(qUsdBalance, TOKEN_DECIMALS) : '0';

  const isApproving = isApprovePending || isApproveConfirming;
  const isDepositing = isDepositPending || isDepositConfirming;

  return (
    <div className="text-center">
      <div className="mb-6">
        <div className="w-20 h-20 mx-auto mb-4 bg-purple-100 rounded-full flex items-center justify-center">
          <svg
            className="w-10 h-10 text-purple-500"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"
            />
          </svg>
        </div>
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Deposit {tokenName} for qUSD</h2>
        <p className="text-gray-600 mb-4">
          {phase === 'approve'
            ? `First, approve qUSD contract to use your ${tokenName}.`
            : `Now deposit your ${tokenName} to receive qUSD.`}
        </p>
        <div className="flex justify-center gap-4 mb-2">
          <div className="bg-gray-100 rounded-lg p-3">
            <span className="text-gray-600 text-sm">{tokenName}: </span>
            <span className="font-bold text-gray-800">{formattedBalance}</span>
          </div>
          <div className="bg-purple-100 rounded-lg p-3">
            <span className="text-gray-600 text-sm">qUSD: </span>
            <span className="font-bold text-purple-800">{formattedQUsdBalance}</span>
          </div>
        </div>
      </div>

      {phase === 'approve' ? (
        <ActionButton onClick={handleApprove} loading={isApproving}>
          {isApprovePending
            ? 'Confirm in Wallet...'
            : isApproveConfirming
            ? 'Approving...'
            : `Approve ${tokenName}`}
        </ActionButton>
      ) : (
        <ActionButton
          onClick={handleDeposit}
          loading={isDepositing}
          disabled={isDepositSuccess || !balance || balance === 0n}
        >
          {isDepositSuccess
            ? 'Success! qUSD Minted'
            : isDepositPending
            ? 'Confirm in Wallet...'
            : isDepositConfirming
            ? 'Depositing...'
            : `Deposit ${formattedBalance} ${tokenName}`}
        </ActionButton>
      )}

      {(approveError || depositError) && (
        <p className="mt-4 text-red-500 text-sm">
          {approveError?.message || depositError?.message || 'Transaction failed. Please try again.'}
        </p>
      )}
    </div>
  );
}
