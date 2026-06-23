import { useMemo } from 'react';
import GlassCard from './ui/GlassCard';
import { useVoice } from '../contexts/VoiceContext';

export default function SimpleExplanation({ analysis }) {
  const tts = useVoice();

  const tips = useMemo(() => {
    if (!analysis?.learningTips?.length) return [];
    return analysis.learningTips;
  }, [analysis]);

  if (!analysis) {
    return (
      <GlassCard className="text-center py-12">
        <div className="flex flex-col items-center gap-3 text-gray-400">
          <svg className="w-10 h-10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
          </svg>
          <p className="text-sm">Upload and analyze an image to see a simple explanation here.</p>
        </div>
      </GlassCard>
    );
  }

  return (
    <div className="space-y-4 animate-in" role="tabpanel" id="panel-explanation" aria-labelledby="tab-explanation">
      <GlassCard>
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-1 flex-1 min-w-0">
            <h2 className="text-xl font-bold text-gray-100 text-balance">
              {analysis.title || 'Analysis Result'}
            </h2>
            <p className="text-sm text-gray-400">
              Plain English &middot; Grade 6 reading level
            </p>
          </div>

          {analysis.simpleSummary && (
            <button
              onClick={() => tts.speak(`Title: ${analysis.title}. ${analysis.simpleSummary}`)}
              className="shrink-0 p-2.5 rounded-xl text-brand-400 hover:bg-brand-900/20 transition-colors focus-visible:outline-2 focus-visible:outline-brand-400"
              aria-label="Read explanation aloud"
              title="Read aloud"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
              </svg>
            </button>
          )}
        </div>
      </GlassCard>

      {analysis.simpleSummary && (
        <GlassCard>
          <h3 className="text-xs font-semibold uppercase tracking-wider text-brand-400 mb-3">
            Simple Summary
          </h3>
          <p className="text-sm leading-relaxed text-gray-300">
            {analysis.simpleSummary}
          </p>
        </GlassCard>
      )}

      {tips.length > 0 && (
        <GlassCard>
          <h3 className="text-xs font-semibold uppercase tracking-wider text-brand-400 mb-3">
            Learning Tips
          </h3>
          <ul className="space-y-2">
            {tips.map((tip, i) => (
              <li key={i} className="flex items-start gap-3 text-sm text-gray-300">
                <span className="shrink-0 flex items-center justify-center w-5 h-5 rounded-full bg-brand-900/30 text-brand-400 text-[10px] font-bold mt-0.5">
                  {i + 1}
                </span>
                <span>{tip}</span>
              </li>
            ))}
          </ul>
        </GlassCard>
      )}

      {analysis.commonMistakes?.length > 0 && (
        <GlassCard>
          <h3 className="text-xs font-semibold uppercase tracking-wider text-amber-400 mb-3">
            Common Mistakes to Avoid
          </h3>
          <ul className="space-y-2">
            {analysis.commonMistakes.map((mistake, i) => (
              <li key={i} className="flex items-start gap-3 text-sm text-gray-300">
                <span className="shrink-0 mt-0.5 text-amber-400">
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                    <circle cx="12" cy="12" r="10" />
                    <path strokeLinecap="round" d="M15 9l-6 6m0-6l6 6" />
                  </svg>
                </span>
                <span>{mistake}</span>
              </li>
            ))}
          </ul>
        </GlassCard>
      )}
    </div>
  );
}
