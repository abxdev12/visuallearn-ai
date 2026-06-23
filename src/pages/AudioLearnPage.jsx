import { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import { useVoice } from '../contexts/VoiceContext';
import GlassCard from '../components/ui/GlassCard';
import MarkdownRenderer from '../components/ui/MarkdownRenderer';

/* ─── Audio file types ─── */
const AUDIO_TYPES = ['audio/mpeg', 'audio/wav', 'audio/ogg', 'audio/mp4', 'audio/webm', 'audio/x-m4a', 'audio/aac'];
const AUDIO_EXT = '.mp3,.wav,.ogg,.m4a,.webm,.aac';

/* ─── Waveform Player ─── */
function WaveformPlayer({ audioUrl, audioBlob, onClear, fileName }) {
  const [playing, setPlaying] = useState(false);
  const [currentTime, setCurrent] = useState(0);
  const [duration, setDuration] = useState(0);
  const [waveform, setWaveform] = useState(null);
  const audioRef = useRef(null);

  useEffect(() => {
    if (!audioBlob) return;
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const reader = new FileReader();
    reader.onload = async (e) => {
      try {
        const buffer = await ctx.decodeAudioData(e.target.result);
        const channel = buffer.getChannelData(0);
        const samples = 60;
        const block = Math.floor(channel.length / samples);
        const peaks = [];
        for (let i = 0; i < samples; i++) {
          let sum = 0;
          for (let j = 0; j < block; j++) sum += Math.abs(channel[i * block + j] || 0);
          peaks.push(sum / block);
        }
        const max = Math.max(...peaks, 0.01);
        setWaveform(peaks.map((p) => p / max));
        setDuration(buffer.duration);
      } catch {}
    };
    reader.readAsArrayBuffer(audioBlob instanceof Blob ? audioBlob : audioBlob);
  }, [audioBlob]);

  const togglePlay = useCallback(() => {
    const el = audioRef.current;
    if (!el) return;
    if (playing) { el.pause(); setPlaying(false); }
    else { el.play().catch(() => {}); setPlaying(true); }
  }, [playing]);

  useEffect(() => {
    const el = audioRef.current;
    if (!el) return;
    const onTime = () => setCurrent(el.currentTime);
    const onEnd = () => { setPlaying(false); setCurrent(0); };
    el.addEventListener('timeupdate', onTime);
    el.addEventListener('ended', onEnd);
    return () => { el.removeEventListener('timeupdate', onTime); el.removeEventListener('ended', onEnd); };
  }, [audioUrl]);

  const fmt = (s) => { const m = Math.floor(s / 60); const sec = Math.floor(s % 60); return `${m}:${sec.toString().padStart(2, '0')}`; };
  const size = audioBlob ? ((audioBlob.size || audioBlob.length || 0) / 1024).toFixed(0) : '0';

  return (
    <div className="space-y-2">
      {fileName && <p className="text-[11px] text-gray-500 font-medium truncate px-0.5">{fileName}</p>}
      <div className="flex items-center gap-3 px-4 py-3 bg-gray-900/60 rounded-2xl border border-gray-700/30">
        <audio ref={audioRef} src={audioUrl || ''} preload="auto" />
        {/* WhatsApp-style play button */}
        <button onClick={togglePlay}
          className="shrink-0 flex items-center justify-center w-11 h-11 rounded-full bg-white/10 ring-1 ring-white/25 text-white hover:bg-white/20 hover:ring-white/40 active:scale-95 transition-all focus-visible:outline-2 focus-visible:outline-brand-400"
          aria-label={playing ? 'Pause' : 'Play'}>
          {playing ? (
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M6 4h4v16H6zM14 4h4v16h-4z" /></svg>
          ) : (
            <svg className="w-4 h-4 ml-0.5" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M8 5v14l11-7z" /></svg>
          )}
        </button>
        {/* Waveform */}
        <div className="flex-1 flex items-end gap-[3px] h-10 py-1">
          {waveform ? waveform.map((h, i) => {
            const progress = i / waveform.length;
            const isPlayed = duration > 0 && (currentTime / duration) > progress;
            return <div key={i} className="flex-1 rounded-sm transition-all"
              style={{
                height: `${Math.max(6, h * 72)}%`,
                background: isPlayed
                  ? 'linear-gradient(to top, #818cf8, #a5b4fc)'
                  : 'linear-gradient(to top, #374151, #4b5563)',
                opacity: isPlayed ? 1 : 0.6,
              }} />;
          }) : Array.from({ length: 50 }).map((_, i) => (
            <div key={i} className="flex-1 rounded-sm bg-gray-700/40" style={{ height: `${15 + Math.random() * 55}%` }} />
          ))}
        </div>
        {/* Time + Clear */}
        <div className="shrink-0 flex items-center gap-2">
          <span className="text-[11px] font-mono font-medium text-gray-400 min-w-[2.5rem] text-right tabular-nums">
            {duration ? fmt(currentTime) : '0:00'}
          </span>
          <div className="relative group">
            <button onClick={onClear}
              className="flex items-center justify-center w-6 h-6 rounded-full text-gray-600 hover:text-red-400 hover:bg-gray-800/60 transition-all focus-visible:outline-2 focus-visible:outline-red-400"
              aria-label="Remove">
              <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
            <div className="tooltip-up">Remove</div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─── Voice Changer ─── */
function VoiceChanger({ voice, text }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="relative group z-10">
      <button onClick={() => setOpen(!open)}
        className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-[11px] font-medium text-gray-400 hover:text-brand-400 hover:bg-gray-800 transition-all focus-visible:outline-2 focus-visible:outline-brand-400">
        <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" d="M12 18h.01M8 21h8M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" d="M12 2v2m0 16v2M4.93 4.93l1.41 1.41m11.32 11.32l1.41 1.41M2 12h2m16 0h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41" /></svg>
        <span className="truncate max-w-[80px]">{voice.selectedVoice?.name.replace('Microsoft ','').replace('Google ','').replace('Premium ','') || 'Voice'}</span>
        <svg className={`w-3 h-3 transition-transform ${open ? 'rotate-180' : ''}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" /></svg>
      </button>
      <div className="tooltip-up">Voice</div>
      {open && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
          <div className="absolute top-full right-0 mt-2 w-56 z-50 animate-in-fast">
            <div className="bg-gray-900 border border-gray-700 rounded-xl shadow-2xl shadow-black/40 p-2 space-y-1">
              <div className="flex items-center justify-between px-2.5 py-1.5 border-b border-gray-800 mb-1">
                <span className="text-[9px] font-bold text-gray-400 uppercase tracking-wider">Voice Engine</span>
                <span className="text-[8px] text-gray-600">{voice.voices.length} available</span>
              </div>
              <div className="max-h-52 overflow-y-auto scrollbar-thin space-y-0.5">
                {voice.voices.filter((v) => v.lang.startsWith('en')).map((v) => (
                  <button key={v.name} onClick={() => { voice.setSelectedVoice(v); if (text) voice.speak(text); setOpen(false); }}
                    className={`w-full text-left text-[10px] px-2.5 py-2 rounded-lg flex items-center gap-2 transition-colors ${
                      voice.selectedVoice?.name === v.name ? 'bg-brand-900/30 text-brand-300' : 'text-gray-400 hover:bg-gray-800 hover:text-gray-200'
                    }`}>
                    <span className={`shrink-0 w-1.5 h-1.5 rounded-full ${voice.selectedVoice?.name === v.name ? 'bg-brand-400' : 'bg-gray-600'}`} />
                    <span className="flex-1 truncate">{v.name.replace('Microsoft ','').replace('Google ','').replace('Premium ','')}</span>
                    {v.name.includes('Natural')||v.name.includes('Premium') ? <span className="shrink-0 px-1 py-0.5 rounded text-[7px] font-bold bg-amber-900/20 text-amber-400 border border-amber-800/20">HD</span> : null}
                    {v.name.includes('Google') ? <span className="shrink-0 px-1 py-0.5 rounded text-[7px] font-bold bg-brand-900/20 text-brand-400 border border-brand-800/20">G</span> : null}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

/* ─── Main Page ─── */
export default function AudioLearnPage({ apiKey, model, analysis, chatHistory, onOpenSettings }) {
  const voice = useVoice();
  const [fileName, setFileName] = useState(null);
  const fileInputRef = useRef(null);

  const handleRecord = () => { if (voice.isRecording) voice.stopRecording(); else voice.startRecording(); };
  const handleProcess = async () => { if (voice.micSupported && apiKey) await voice.processAudioWithAI(apiKey, model, analysis, chatHistory); };

  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!AUDIO_TYPES.includes(file.type) && !file.name.match(/\.(mp3|wav|ogg|m4a|webm|aac)$/i)) {
      alert('Please upload an audio file (MP3, WAV, OGG, M4A, WEBM, AAC).');
      return;
    }
    setFileName(file.name);
    voice.loadAudioFile(file);
  };

  return (
    <div className="max-w-screen-2xl mx-auto px-3 sm:px-4 md:px-6 py-4 sm:py-6 pb-6 space-y-4 animate-in">
      {/* Page header */}
      <div className="flex items-center gap-3 mb-2">
        <div className="flex items-center justify-center w-9 h-9 rounded-xl bg-gradient-to-br from-brand-500 to-brand-600 text-white shadow-sm">
          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m-4 0h8m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" /></svg>
        </div>
        <div className="flex-1">
          <h1 className="text-lg font-bold text-gray-100">Audio Learning</h1>
          <p className="text-xs text-gray-500">Record, upload, transcribe &amp; learn with AI</p>
        </div>
        {/* Voice changer in header */}
        {voice.voices.length > 0 && <VoiceChanger voice={voice} />}
      </div>

      {/* Input section */}
      <GlassCard>
        <div className="space-y-4">
          {/* Record + Upload row */}
          <div className="flex flex-wrap items-center gap-3">
            <div className="relative group">
              <button onClick={handleRecord} disabled={voice.aiProcessing}
                className={`flex items-center gap-2.5 px-5 py-3 rounded-xl text-sm font-bold transition-all focus-visible:outline-2 focus-visible:outline-brand-400 ${
                  voice.isRecording
                    ? 'bg-gradient-to-r from-red-600 to-rose-600 text-white shadow-lg shadow-red-500/30 scale-105'
                    : 'bg-gradient-to-r from-brand-600 to-violet-600 text-white hover:from-brand-500 hover:to-violet-500 shadow-lg shadow-brand-500/25 disabled:opacity-40'
                }`}>
                <svg className={`w-5 h-5 ${voice.isRecording ? 'animate-pulse-soft' : ''}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m-4 0h8m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                </svg>
                {voice.isRecording ? '■ Stop' : '● Record'}
              </button>
              <div className="tooltip-up">{voice.isRecording ? 'Stop' : 'Record voice'}</div>
            </div>

            {/* Upload button */}
            <div className="relative group">
              <button onClick={() => fileInputRef.current?.click()}
                className="flex items-center gap-2 px-4 py-3 rounded-xl text-sm font-semibold bg-gray-800 text-gray-300 hover:bg-gray-700 hover:text-white border border-gray-700 transition-all focus-visible:outline-2 focus-visible:outline-brand-400">
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" /></svg>
                Upload Audio
              </button>
              <div className="tooltip-up">Upload MP3, WAV, OGG, M4A</div>
              <input ref={fileInputRef} type="file" accept={AUDIO_EXT} className="sr-only" onChange={handleFileUpload} aria-hidden="true" tabIndex={-1} />
            </div>

            {voice.isRecording && (
              <>
                <div className="flex items-end gap-[3px] h-7">
                  {[2,3,1,4,2,5,3,4,1,3,2,4].map((h,i) => (
                    <span key={i} className="w-[3px] rounded-full bg-gradient-to-t from-red-500/60 to-red-400/80 animate-bounce"
                      style={{height:`${25+h*8}%`,animationDelay:`${i*50}ms`,animationDuration:'0.5s'}} />
                  ))}
                </div>
                <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-red-900/30 border border-red-800/40 text-[11px] font-semibold text-red-300">
                  <span className="w-2 h-2 rounded-full bg-red-400 animate-pulse-soft" /> Recording
                </span>
              </>
            )}
          </div>

          {/* Audio player */}
          {voice.audioBlob && voice.audioUrl && !voice.isRecording && !voice.aiProcessing && (
            <WaveformPlayer audioUrl={voice.audioUrl} audioBlob={voice.audioBlob} onClear={voice.clearAiResponse} fileName={fileName} />
          )}
        </div>
      </GlassCard>

      {/* Process button */}
      {voice.audioBlob && !voice.isRecording && !voice.aiProcessing && (
        <GlassCard className="!p-0 overflow-hidden">
          <button onClick={() => { if (!apiKey) onOpenSettings?.(); else handleProcess(); }}
            className={`w-full flex items-center justify-center gap-3 py-4 text-sm font-bold transition-all focus-visible:outline-2 focus-visible:outline-brand-400 ${
              apiKey
                ? 'bg-gradient-to-r from-brand-600 via-brand-500 to-violet-600 text-white hover:from-brand-500 hover:via-brand-400 hover:to-violet-500'
                : 'bg-amber-900/30 text-amber-300 hover:bg-amber-900/40'
            }`}>
            {!apiKey ? (
              <><svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.066 2.573c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.573 1.066c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.066-2.573c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /></svg>
                Open Settings → Add API Key
              </>
            ) : voice.aiProcessing ? (
              <><svg className="w-5 h-5 animate-spin" viewBox="0 0 24 24" fill="none" aria-hidden="true"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg>
                Gemini is analyzing your audio...
              </>
            ) : (
              <><svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" /></svg>
                Transcribe &amp; Analyze with Gemini
              </>
            )}
          </button>
        </GlassCard>
      )}

      {/* Response */}
      {voice.lastAiResponse && !voice.aiProcessing && (
        <div className="space-y-4 animate-in">
          <GlassCard>
            <div className="flex items-start gap-3 mb-3">
              <div className="shrink-0 w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 via-brand-400 to-violet-500 flex items-center justify-center text-white shadow-sm">
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                  <path d="M12 2L14.5 9.5L22 12L14.5 14.5L12 22L9.5 14.5L2 12L9.5 9.5L12 2Z" fill="currentColor" opacity="0.9" />
                  <circle cx="12" cy="12" r="2" fill="white" opacity="0.4" />
                </svg>
              </div>
              <div className="flex-1">
                <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Analysis Result</p>
              </div>
              <div className="flex items-center gap-1">
                <div className="relative group">
                  <button onClick={() => voice.speak(voice.lastAiResponse)} className="p-2 rounded-lg text-gray-500 hover:text-brand-400 hover:bg-gray-800 transition-all" aria-label="Read aloud">
                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" /></svg>
                  </button>
                  <div className="tooltip-up">Read aloud</div>
                </div>
                <div className="relative group">
                  <button onClick={voice.clearAiResponse} className="p-2 rounded-lg text-gray-500 hover:text-gray-300 hover:bg-gray-800 transition-all" aria-label="Clear">
                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" d="M6 18L18 6M6 6l12 12" /></svg>
                  </button>
                  <div className="tooltip-up">Clear</div>
                </div>
              </div>
            </div>
            <MarkdownRenderer content={voice.lastAiResponse} />
          </GlassCard>
        </div>
      )}

      {/* Empty state */}
      {!voice.audioBlob && !voice.isRecording && !voice.lastAiResponse && !voice.aiProcessing && (
        <GlassCard className="text-center py-10">
          <div className="flex flex-col items-center gap-3">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-brand-900/40 to-brand-800/20 flex items-center justify-center ring-1 ring-brand-800/30">
              <svg className="w-7 h-7 text-brand-400/60" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m-4 0h8m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
              </svg>
            </div>
            <p className="text-sm text-gray-400 max-w-sm">Record a voice note or <span className="text-gray-200 font-semibold cursor-pointer hover:text-brand-400 transition-colors" onClick={() => fileInputRef.current?.click()}>upload an audio file</span>. Gemini will transcribe, summarize, and extract key points from your audio.</p>
            {!apiKey && (
              <button onClick={() => onOpenSettings?.()} className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-semibold bg-brand-900/30 text-brand-300 border border-brand-800/40 hover:bg-brand-900/40 transition-all">
                <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.066 2.573c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.573 1.066c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.066-2.573c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /></svg>
                Add API Key in Settings
              </button>
            )}
          </div>
        </GlassCard>
      )}

      {/* Processing */}
      {voice.aiProcessing && (
        <GlassCard className="text-center py-8">
          <div className="flex flex-col items-center gap-3">
            <svg className="w-8 h-8 animate-spin text-brand-400" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
            <p className="text-sm text-gray-400">Gemini is analyzing your audio...</p>
            <p className="text-[11px] text-gray-600">Transcribing, summarizing &amp; extracting key points</p>
          </div>
        </GlassCard>
      )}
    </div>
  );
}
