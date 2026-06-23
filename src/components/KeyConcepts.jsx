import { useState, useMemo } from 'react';
import GlassCard from './ui/GlassCard';

export default function KeyConcepts({ analysis }) {
  const [flipped, setFlipped] = useState({});

  const keywords = useMemo(() => {
    if (!analysis?.threeKeywords?.length) return [];
    return analysis.threeKeywords.map((kw) => {
      if (typeof kw === 'string') return { term: kw, definition: '' };
      if (typeof kw === 'object') {
        return {
          term: kw.term || kw.word || kw.keyword || kw.name || '',
          definition: kw.definition || kw.meaning || kw.explanation || kw.description || '',
        };
      }
      return { term: String(kw), definition: '' };
    });
  }, [analysis]);

  const toggleFlip = (i) => {
    setFlipped((prev) => ({ ...prev, [i]: !prev[i] }));
  };

  if (!keywords.length) {
    return (
      <GlassCard className="text-center py-12" role="tabpanel" id="panel-concepts" aria-labelledby="tab-concepts">
        <div className="flex flex-col items-center gap-3 text-gray-400 dark:text-gray-500">
          <svg className="w-10 h-10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
          </svg>
          <p className="text-sm">No keywords extracted from this content.</p>
        </div>
      </GlassCard>
    );
  }

  return (
    <div className="space-y-3 animate-in" role="tabpanel" id="panel-concepts" aria-labelledby="tab-concepts">
      <GlassCard>
        <h3 className="text-xs font-semibold uppercase tracking-wider text-brand-600 dark:text-brand-400 mb-4">
          Key Concepts &middot; {keywords.length}
        </h3>

        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {keywords.map((kw, i) => (
            <button
              key={i}
              onClick={() => toggleFlip(i)}
              className="relative group text-left"
              aria-label={`${kw.term}${kw.definition ? `. Click to ${flipped[i] ? 'hide' : 'show'} definition` : ''}`}
            >
              <div
                className={`
                  relative p-4 rounded-xl border transition-all duration-300 min-h-[100px]
                  ${flipped[i]
                    ? 'bg-brand-50 dark:bg-brand-900/20 border-brand-200 dark:border-brand-800'
                    : 'bg-gray-50 dark:bg-gray-800/50 border-gray-200 dark:border-gray-700 hover:border-brand-200 dark:hover:border-brand-700 hover:shadow-md'
                  }
                  focus-visible:outline-2 focus-visible:outline-brand-500
                `}
              >
                {!flipped[i] ? (
                  <div className="flex flex-col h-full">
                    <span className="inline-flex items-center justify-center w-7 h-7 rounded-lg bg-brand-100 dark:bg-brand-900/30 text-brand-600 dark:text-brand-400 text-xs font-bold mb-2">
                      {i + 1}
                    </span>
                    <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                      {kw.term}
                    </p>
                    {kw.definition && (
                      <p className="text-[10px] text-gray-400 dark:text-gray-500 mt-auto pt-2">
                        Tap to reveal definition
                      </p>
                    )}
                  </div>
                ) : (
                  <div className="flex flex-col h-full">
                    <span className="text-xs font-medium text-brand-600 dark:text-brand-400 mb-1">
                      {kw.term}
                    </span>
                    <p className="text-xs leading-relaxed text-gray-700 dark:text-gray-300">
                      {kw.definition || 'No definition available.'}
                    </p>
                  </div>
                )}

                {/* Flip icon */}
                <div className={`absolute top-2 right-2 transition-transform duration-300 ${flipped[i] ? 'rotate-180' : ''}`}>
                  <svg className="w-3.5 h-3.5 text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                </div>
              </div>
            </button>
          ))}
        </div>
      </GlassCard>
    </div>
  );
}
