'use client';

import { useConnect, useAccount } from 'wagmi';
import { useEffect } from 'react';
import { ActionButton } from '../ActionButton';

interface ConnectStepProps {
  onComplete: () => void;
}

export function ConnectStep({ onComplete }: ConnectStepProps) {
  const { connect, connectors, isPending, error } = useConnect();
  const { isConnected } = useAccount();

  useEffect(() => {
    if (isConnected) {
      onComplete();
    }
  }, [isConnected, onComplete]);

  const injectedConnector = connectors.find((c) => c.id === 'injected');

  return (
    <div className="text-center">
      <div className="mb-6">
        <div className="w-20 h-20 mx-auto mb-4 bg-blue-100 rounded-full flex items-center justify-center">
          <svg
            className="w-10 h-10 text-blue-500"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z"
            />
          </svg>
        </div>
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Connect Your Wallet</h2>
        <p className="text-gray-600">
          Connect your MetaMask wallet to get started with x402 test tokens on QIE Mainnet.
        </p>
      </div>

      <ActionButton
        onClick={() => injectedConnector && connect({ connector: injectedConnector })}
        loading={isPending}
        disabled={!injectedConnector}
      >
        {isPending ? 'Connecting...' : 'Connect MetaMask'}
      </ActionButton>

      {error && (
        <p className="mt-4 text-red-500 text-sm">
          {error.message || 'Failed to connect. Please try again.'}
        </p>
      )}

      {!injectedConnector && (
        <p className="mt-4 text-yellow-600 text-sm">
          MetaMask not detected. Please install MetaMask to continue.
        </p>
      )}
    </div>
  );
}
