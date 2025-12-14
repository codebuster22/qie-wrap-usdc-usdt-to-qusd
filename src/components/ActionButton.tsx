'use client';

interface ActionButtonProps {
  onClick: () => void;
  disabled?: boolean;
  loading?: boolean;
  children: React.ReactNode;
  variant?: 'primary' | 'secondary';
}

export function ActionButton({
  onClick,
  disabled = false,
  loading = false,
  children,
  variant = 'primary',
}: ActionButtonProps) {
  const baseStyles =
    'w-full py-3 px-6 rounded-lg font-medium transition-all duration-200 flex items-center justify-center gap-2';

  const variants = {
    primary:
      'bg-blue-500 hover:bg-blue-600 text-white disabled:bg-gray-400 disabled:cursor-not-allowed',
    secondary:
      'bg-gray-200 hover:bg-gray-300 text-gray-800 disabled:bg-gray-100 disabled:text-gray-400 disabled:cursor-not-allowed',
  };

  return (
    <button
      onClick={onClick}
      disabled={disabled || loading}
      className={`${baseStyles} ${variants[variant]}`}
    >
      {loading && (
        <svg
          className="animate-spin h-5 w-5"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          />
        </svg>
      )}
      {children}
    </button>
  );
}
