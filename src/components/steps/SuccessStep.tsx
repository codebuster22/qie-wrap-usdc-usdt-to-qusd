'use client';

import { useAccount, useReadContract, useWatchAsset } from 'wagmi';
import { formatUnits } from 'viem';
import { ActionButton } from '../ActionButton';
import { qUSDAbi } from '@/abis/qUSDAbi';
import { QUSD_ADDRESS, TOKEN_DECIMALS, X402_TEST_URL } from '@/config/contracts';

export function SuccessStep() {
  const { address } = useAccount();
  const { watchAsset, isPending, isSuccess } = useWatchAsset();

  const { data: qUsdBalance } = useReadContract({
    address: QUSD_ADDRESS,
    abi: qUSDAbi,
    functionName: 'balanceOf',
    args: address ? [address] : undefined,
  });

  const formattedBalance = qUsdBalance ? formatUnits(qUsdBalance, TOKEN_DECIMALS) : '0';

  const handleAddToWallet = () => {
    watchAsset({
      type: 'ERC20',
      options: {
        address: QUSD_ADDRESS,
        symbol: 'qUSD',
        decimals: TOKEN_DECIMALS,
      },
    });
  };

  const getButtonText = () => {
    if (isSuccess) return 'Token Added!';
    if (isPending) return 'Confirm in Wallet...';
    return 'Add qUSD to Wallet';
  };

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
              d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </div>
        <h2 className="text-2xl font-bold text-gray-800 mb-2">You&apos;re All Set!</h2>
        <p className="text-gray-600 mb-4">
          You now have qUSD tokens ready to use with x402 Facilitator.
        </p>
        <div className="bg-green-100 rounded-lg p-4 inline-block mb-6">
          <span className="text-gray-600">Your qUSD Balance: </span>
          <span className="font-bold text-green-700 text-xl">{formattedBalance} qUSD</span>
        </div>
      </div>

      <div className="space-y-3">
        <ActionButton
          onClick={handleAddToWallet}
          variant="secondary"
          loading={isPending}
          disabled={isSuccess}
        >
          {getButtonText()}
        </ActionButton>

        <a
          href={X402_TEST_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="block w-full py-3 px-6 rounded-lg font-medium bg-blue-500 hover:bg-blue-600 text-white transition-all duration-200 text-center"
        >
          Go to x402 Test
        </a>
      </div>
    </div>
  );
}
