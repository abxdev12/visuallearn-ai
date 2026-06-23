export default function AnalyzeButton({ onClick, isAnalyzing, disabled }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled || isAnalyzing}
      className={`
        relative w-full py-3.5 px-6 rounded-2xl font-semibold text-sm
        transition-all duration-200 overflow-hidden group
        focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-400
        ${disabled || isAnalyzing
          ? 'bg-gray-800 text-gray-500 cursor-not-allowed'
          : 'bg-gradient-to-r from-brand-600 to-brand-500 hover:from-brand-500 hover:to-brand-400 text-white shadow-lg shadow-brand-500/20 hover:shadow-xl hover:shadow-brand-500/30 active:scale-[0.98]'
        }
      `}
      aria-busy={isAnalyzing}
      aria-label={isAnalyzing ? 'Analyzing image with AI' : 'Analyze image with AI'}
    >
      <span className={`flex items-center justify-center gap-2.5 ${isAnalyzing ? 'opacity-0' : ''}`}>
        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
        </svg>
        Analyze with AI
      </span>

      {isAnalyzing && (
        <span className="absolute inset-0 flex items-center justify-center gap-2.5 text-white">
          <svg className="w-5 h-5 animate-spin" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
          Analyzing...
        </span>
      )}
    </button>
  );
}
