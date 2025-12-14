'use client';

interface StepIndicatorProps {
  currentStep: number;
  totalSteps: number;
  labels: string[];
}

export function StepIndicator({ currentStep, totalSteps, labels }: StepIndicatorProps) {
  return (
    <div className="w-full mb-8">
      <div className="flex justify-between items-center">
        {Array.from({ length: totalSteps }, (_, i) => (
          <div key={i} className="flex flex-col items-center flex-1">
            <div className="flex items-center w-full">
              {i > 0 && (
                <div
                  className={`h-1 flex-1 ${
                    i <= currentStep ? 'bg-blue-500' : 'bg-gray-300'
                  }`}
                />
              )}
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                  i < currentStep
                    ? 'bg-green-500 text-white'
                    : i === currentStep
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-300 text-gray-600'
                }`}
              >
                {i < currentStep ? '✓' : i + 1}
              </div>
              {i < totalSteps - 1 && (
                <div
                  className={`h-1 flex-1 ${
                    i < currentStep ? 'bg-blue-500' : 'bg-gray-300'
                  }`}
                />
              )}
            </div>
            <span
              className={`mt-2 text-xs text-center ${
                i <= currentStep ? 'text-blue-600 font-medium' : 'text-gray-500'
              }`}
            >
              {labels[i]}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
