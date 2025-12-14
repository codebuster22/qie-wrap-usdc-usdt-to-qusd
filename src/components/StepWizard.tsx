'use client';

import { useState, useCallback, useEffect } from 'react';
import { useAccount } from 'wagmi';
import { StepIndicator } from './StepIndicator';
import { ConnectStep } from './steps/ConnectStep';
import { MintStep } from './steps/MintStep';
import { DepositStep } from './steps/DepositStep';
import { SuccessStep } from './steps/SuccessStep';
import { MUSDC_ADDRESS, MUSDT_ADDRESS } from '@/config/contracts';

const STEP_LABELS = [
  'Connect',
  'Mint USDC',
  'Mint USDT',
  'Deposit USDC',
  'Deposit USDT',
  'Done',
];

export function StepWizard() {
  const { isConnected } = useAccount();
  const [currentStep, setCurrentStep] = useState(0);

  // Check connection status after mount to avoid hydration mismatch
  useEffect(() => {
    if (isConnected && currentStep === 0) {
      setCurrentStep(1);
    }
  }, [isConnected, currentStep]);

  const handleStepComplete = useCallback(() => {
    setCurrentStep((prev) => Math.min(prev + 1, STEP_LABELS.length - 1));
  }, []);

  const renderStep = () => {
    switch (currentStep) {
      case 0:
        return <ConnectStep key="connect" onComplete={handleStepComplete} />;
      case 1:
        return (
          <MintStep
            key="mint-usdc"
            tokenName="mUSDC"
            tokenAddress={MUSDC_ADDRESS}
            onComplete={handleStepComplete}
          />
        );
      case 2:
        return (
          <MintStep
            key="mint-usdt"
            tokenName="mUSDT"
            tokenAddress={MUSDT_ADDRESS}
            onComplete={handleStepComplete}
          />
        );
      case 3:
        return (
          <DepositStep
            key="deposit-usdc"
            tokenName="mUSDC"
            tokenAddress={MUSDC_ADDRESS}
            onComplete={handleStepComplete}
          />
        );
      case 4:
        return (
          <DepositStep
            key="deposit-usdt"
            tokenName="mUSDT"
            tokenAddress={MUSDT_ADDRESS}
            onComplete={handleStepComplete}
          />
        );
      case 5:
        return <SuccessStep key="success" />;
      default:
        return null;
    }
  };

  return (
    <div className="w-full max-w-xl mx-auto">
      <StepIndicator
        currentStep={currentStep}
        totalSteps={STEP_LABELS.length}
        labels={STEP_LABELS}
      />
      <div className="bg-white rounded-xl shadow-lg p-8">{renderStep()}</div>
    </div>
  );
}
