'use client';

import { useState, useEffect } from 'react';
import { useAccount, useDisconnect, useSwitchChain } from 'wagmi';
import { StepWizard } from '@/components/StepWizard';
import { qieMainnet } from '@/config/chains';

export default function Home() {
  const [mounted, setMounted] = useState(false);
  const { address, isConnected, chainId } = useAccount();
  const { disconnect } = useDisconnect();
  const { switchChain } = useSwitchChain();

  useEffect(() => {
    setMounted(true);
  }, []);

  const isWrongNetwork = mounted && isConnected && chainId !== qieMainnet.id;

  const truncateAddress = (addr: string) =>
    `${addr.slice(0, 6)}...${addr.slice(-4)}`;

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">x402 Test Token Guide</h1>
            <p className="text-gray-600">Get test tokens for QIE Blockchain</p>
          </div>
          {mounted && isConnected && (
            <div className="flex items-center gap-3">
              <span className="text-sm text-gray-600 bg-white px-3 py-2 rounded-lg shadow-sm">
                {truncateAddress(address!)}
              </span>
              <button
                onClick={() => disconnect()}
                className="text-sm text-red-500 hover:text-red-600 font-medium"
              >
                Disconnect
              </button>
            </div>
          )}
        </div>

        {/* Network Warning */}
        {isWrongNetwork && (
          <div className="mb-6 bg-yellow-100 border border-yellow-300 rounded-lg p-4 flex items-center justify-between">
            <div>
              <p className="text-yellow-800 font-medium">Wrong Network</p>
              <p className="text-yellow-700 text-sm">
                Please switch to QIE Mainnet to continue.
              </p>
            </div>
            <button
              onClick={() => switchChain({ chainId: qieMainnet.id })}
              className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded-lg font-medium transition-colors"
            >
              Switch Network
            </button>
          </div>
        )}

        {/* Wizard */}
        <StepWizard />

        {/* Footer */}
        <div className="mt-8 text-center text-gray-500 text-sm">
          <p>
            Network: QIE Mainnet (Chain ID: 1990) |{' '}
            <a
              href="https://mainnet.qie.digital/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-500 hover:underline"
            >
              Block Explorer
            </a>
          </p>
        </div>
      </div>
    </main>
  );
}
