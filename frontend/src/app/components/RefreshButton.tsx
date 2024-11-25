interface RefreshButtonProps {
  onRefresh: () => void;
  isLoading: boolean;
}

export function RefreshButton({ onRefresh, isLoading }: RefreshButtonProps) {
  return (
    <button
      onClick={onRefresh}
      disabled={isLoading}
      className="p-2 rounded-full bg-white dark:bg-gray-800 shadow-lg hover:shadow-xl disabled:opacity-50"
      aria-label="Refresh users list"
    >
      <svg 
        className={`w-6 h-6 text-blue-600 dark:text-blue-400 ${isLoading ? 'animate-spin' : 'hover:rotate-180'}`}
        fill="none" 
        stroke="currentColor" 
        viewBox="0 0 24 24"
      >
        <path 
          strokeLinecap="round" 
          strokeLinejoin="round" 
          strokeWidth={2} 
          d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" 
        />
      </svg>
    </button>
  );
} 