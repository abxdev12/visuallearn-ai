import GlassCard from './ui/GlassCard';
import { useVoice } from '../contexts/VoiceContext';

export default function DiagramAnatomy({ analysis }) {
  const tts = useVoice();

  if (!analysis?.diagramBreakdown?.length) {
    return (
      <GlassCard className="text-center py-12" role="tabpanel" id="panel-anatomy" aria-labelledby="tab-anatomy">
        <div className="flex flex-col items-center gap-3 text-gray-400">
          <svg className="w-10 h-10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" />
          </svg>
          <p className="text-sm">No diagram breakdown available for this content.</p>
        </div>
      </GlassCard>
    );
  }

  return (
    <div className="space-y-3 animate-in" role="tabpanel" id="panel-anatomy" aria-labelledby="tab-anatomy">
      <GlassCard>
        <h3 className="text-xs font-semibold uppercase tracking-wider text-brand-400 mb-4">
          Spatial Breakdown
        </h3>

        <div className="relative">
          <div className="absolute left-[17px] top-2 bottom-2 w-0.5 bg-gradient-to-b from-brand-800 to-brand-900/50 rounded-full" aria-hidden="true" />

          <ol className="space-y-4 relative">
            {analysis.diagramBreakdown.map((item, i) => (
              <li key={i} className="relative pl-10 animate-in" style={{ animationDelay: `${i * 50}ms` }}>
                <div className="absolute left-2.5 top-1 w-[9px] h-[9px] rounded-full bg-brand-500 border-2 border-gray-900 shadow-sm" aria-hidden="true" />

                <div className="space-y-1">
                  <p className="text-sm font-medium text-gray-100">
                    {typeof item === 'string' ? item : item.label || item.element || item.name || `Element ${i + 1}`}
                  </p>
                  {(typeof item === 'object' && (item.description || item.detail || item.relationship)) && (
                    <p className="text-xs text-gray-400 leading-relaxed">
                      {item.description || item.detail || item.relationship}
                    </p>
                  )}
                </div>
              </li>
            ))}
          </ol>
        </div>
      </GlassCard>

      <div className="flex justify-end">
        <button
          onClick={() => tts.speak(analysis.diagramBreakdown.map((item) => typeof item === 'string' ? item : (item.label || item.element || item.name || '')).join('. Next, '))}
          className="flex items-center gap-2 text-xs text-brand-400 hover:text-brand-300 transition-colors px-3 py-1.5 rounded-lg hover:bg-brand-900/20 focus-visible:outline-2 focus-visible:outline-brand-400"
          aria-label="Read diagram breakdown aloud"
        >
          <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
          </svg>
          Read aloud
        </button>
      </div>
    </div>
  );
}
