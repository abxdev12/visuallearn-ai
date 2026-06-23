import { useState } from 'react';
import Modal from './ui/Modal';
import { GEMINI_MODELS, FONT_SIZES } from '../constants/accessibility';
import { useAccessibility } from '../contexts/AccessibilityContext';

const ACC_SETTINGS = [
  {
    key: 'dyslexiaMode', label: 'Dyslexia Mode',
    desc: 'OpenDyslexic font, extra spacing & line height',
    icon: 'M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253',
    grad: 'from-violet-500 to-purple-600', color: 'text-violet-400',
  },
  {
    key: 'highContrast', label: 'High Contrast',
    desc: 'Pure black bg, white text, bold borders',
    icon: 'M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z',
    grad: 'from-gray-900 to-black', color: 'text-gray-300',
  },
  {
    key: 'readingFocus', label: 'Reading Focus',
    desc: 'Dim sidebar, highlight content area',
    icon: 'M15 12a3 3 0 11-6 0 3 3 0 016 0z M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z',
    grad: 'from-amber-500 to-orange-600', color: 'text-amber-400',
  },
];

const TABS = [
  { id: 'key', label: 'API Key', icon: 'M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z' },
  { id: 'model', label: 'Model', icon: 'M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z' },
  { id: 'access', label: 'Accessibility', icon: 'M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z' },
];

export default function SettingsModal({ isOpen, onClose, apiKey, model, onApiKeyChange, onModelChange }) {
  const [tab, setTab] = useState('key');
  const [localKey, setLocalKey] = useState(apiKey || '');
  const [showKey, setShowKey] = useState(false);
  const [saved, setSaved] = useState(false);
  const [animKey, setAnimKey] = useState(0);
  const { settings, toggleSetting, updateSetting } = useAccessibility();

  const handleSave = () => {
    onApiKeyChange(localKey.trim());
    setSaved(true);
    setAnimKey((k) => k + 1);
    setTimeout(() => setSaved(false), 2500);
  };
  const handleClear = () => { setLocalKey(''); onApiKeyChange(''); };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={null} className="max-w-xl">
      {/* ─── Hero ─── */}
      <div className="relative overflow-hidden rounded-t-2xl bg-gradient-to-br from-indigo-700 via-brand-600 to-violet-700">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,rgba(255,255,255,0.12),transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,rgba(129,140,248,0.15),transparent_50%)]" />
        <div className="absolute inset-0" style={{backgroundImage:'url("data:image/svg+xml,%3Csvg width=\'30\' height=\'30\' viewBox=\'0 0 30 30\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Ccircle cx=\'15\' cy=\'15\' r=\'1\' fill=\'rgba(255,255,255,0.05)\'/%3E%3C/svg%3E")'}} />
        <div className="absolute -top-10 -right-10 w-40 h-40 rounded-full bg-white/5 blur-2xl" />
        <div className="relative px-6 pt-6 pb-8">
          <div className="flex items-center gap-4">
            <div className="flex items-center justify-center w-12 h-12 rounded-2xl bg-white/15 backdrop-blur-lg text-white shadow-2xl ring-1 ring-white/15">
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.066 2.573c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.573 1.066c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.066-2.573c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
              </svg>
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-3">
                <h2 className="text-xl font-bold text-white tracking-tight">Settings</h2>
                {saved && (
                  <span key={animKey} className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-400/20 border border-emerald-400/30 success-pop">
                    <svg className="w-3.5 h-3.5 text-emerald-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true">
                      <path className="check-draw" strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="text-[10px] font-bold text-emerald-300">Saved</span>
                  </span>
                )}
              </div>
              <p className="text-sm text-white/50 font-medium">Configure AI, API &amp; accessibility</p>
            </div>
            <button onClick={onClose}
              className="self-start p-1.5 rounded-xl text-white/40 hover:text-white hover:bg-white/10 transition-all focus-visible:outline-2 focus-visible:outline-white/50" aria-label="Close">
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
          </div>
        </div>
      </div>

      {/* ─── Tab bar ─── */}
      <div className="px-6 pt-4">
        <div className="flex gap-1 p-1 bg-gray-800/60 rounded-xl border border-gray-700/30">
          {TABS.map((t) => (
            <button key={t.id} onClick={() => setTab(t.id)}
              className={`flex items-center justify-center gap-1.5 flex-1 px-2 py-2 rounded-lg text-xs font-semibold transition-all duration-200 focus-visible:outline-2 focus-visible:outline-brand-400 ${
                tab === t.id ? 'bg-gray-700 text-brand-300 shadow-sm' : 'text-gray-500 hover:text-gray-300 hover:bg-gray-800/50'
              }`}>
              <svg className="w-3.5 h-3.5 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" d={t.icon} />
              </svg>
              <span className="hidden sm:inline">{t.label}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="px-6 pb-6">
        {/* ─── API Key ─── */}
        {tab === 'key' && (
          <div className="mt-5 space-y-4 animate-in-fast">
            <div className="flex items-center justify-between">
              <label className="text-sm font-bold text-gray-100" htmlFor="api-key">Gemini API Key</label>
              <a href="https://aistudio.google.com/apikey" target="_blank" rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-semibold text-brand-300 bg-brand-900/20 border border-brand-800/30 hover:bg-brand-900/30 hover:text-brand-200 transition-all">
                <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
                Get free key
              </a>
            </div>

            <div className="relative group">
              <input id="api-key" type={showKey ? 'text' : 'password'} value={localKey}
                onChange={(e) => setLocalKey(e.target.value)}
                placeholder="Enter your Gemini API key..."
                className="w-full px-4 py-3.5 pr-14 rounded-xl bg-gray-800/80 border border-gray-700 text-sm text-gray-100 placeholder-gray-500 transition-all focus:outline-none focus:ring-2 focus:ring-brand-500/50 focus:border-brand-400 group-hover:border-gray-600"
                autoComplete="off" aria-describedby="key-status" />
              <button onClick={() => setShowKey(!showKey)}
                className="absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-lg text-gray-500 hover:text-gray-300 hover:bg-gray-700 transition-all" aria-label={showKey ? 'Hide key' : 'Show key'}>
                {showKey ? (
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                    <path strokeLinecap="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
                  </svg>
                ) : (
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                    <path strokeLinecap="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    <circle cx="12" cy="12" r="3" />
                  </svg>
                )}
              </button>
            </div>

            <div id="key-status" className={`flex items-center gap-2.5 px-4 py-3 rounded-xl border transition-all ${
              localKey ? 'bg-emerald-900/20 border-emerald-800/30' : 'bg-amber-900/15 border-amber-800/25'
            }`} role="status">
              <div className={`shrink-0 w-8 h-8 rounded-lg flex items-center justify-center ${
                localKey ? 'bg-emerald-500/20 text-emerald-400' : 'bg-amber-500/20 text-amber-400'
              }`}>
                {localKey ? (
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                ) : (
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
                  </svg>
                )}
              </div>
              <div>
                <p className={`text-xs font-semibold ${localKey ? 'text-emerald-300' : 'text-amber-300'}`}>
                  {localKey ? 'Key is ready' : 'No API key set'}
                </p>
                <p className="text-[10px] text-gray-500 mt-0.5">
                  {localKey ? 'Stored locally in your browser. Never sent to any server except Gemini.' : 'Add your key above to start analyzing educational content.'}
                </p>
              </div>
            </div>

            <div className="flex gap-2.5">
              <button onClick={handleSave} disabled={!localKey.trim()}
                className="flex-1 relative py-3 rounded-xl text-sm font-bold text-white bg-gradient-to-r from-brand-500 to-violet-600 hover:from-brand-400 hover:to-violet-500 disabled:from-gray-800 disabled:text-gray-500 transition-all shadow-lg shadow-brand-500/25 hover:shadow-xl hover:shadow-brand-500/30 disabled:shadow-none active:scale-[0.98] focus-visible:outline-2 focus-visible:outline-brand-400 overflow-hidden group ripple">
                <span className="relative z-0 flex items-center justify-center gap-2">
                  {saved ? (
                    <><svg className="w-4 h-4 text-emerald-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg> Saved!</>
                  ) : (
                    <><svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg> Save Key</>
                  )}
                </span>
              </button>
              <button onClick={handleClear} disabled={!localKey}
                className="px-6 py-3 rounded-xl text-sm font-medium text-gray-400 hover:text-red-400 bg-gray-800 hover:bg-red-900/20 disabled:opacity-30 transition-all border border-gray-700 focus-visible:outline-2 focus-visible:outline-brand-400">
                Clear
              </button>
            </div>
          </div>
        )}

        {/* ─── Model ─── */}
        {tab === 'model' && (
          <div className="mt-5 space-y-3 animate-in-fast">
            <div className="flex items-center justify-between">
              <label className="text-sm font-bold text-gray-100">AI Model</label>
              <span className="text-[10px] text-gray-500 font-mono bg-gray-800/50 px-2 py-1 rounded-md border border-gray-700/50">
                {model}
              </span>
            </div>
            <div className="grid gap-2">
              {GEMINI_MODELS.map((m) => (
                <button key={m.id} onClick={() => onModelChange(m.id)}
                  className={`flex items-start gap-3.5 p-4 rounded-xl text-left transition-all duration-200 border focus-visible:outline-2 focus-visible:outline-brand-400 ${
                    model === m.id
                      ? 'bg-gradient-to-r from-brand-900/25 to-brand-900/10 border-brand-700/50 shadow-md shadow-brand-900/20 ring-1 ring-brand-700/20'
                      : 'bg-gray-800/30 border-gray-700/30 hover:bg-gray-800/50 hover:border-gray-600/50 hover:shadow-sm'
                  }`}>
                  <div className={`shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center mt-0.5 transition-all duration-200 ${
                    model === m.id ? 'border-brand-500 bg-brand-500 shadow-md shadow-brand-500/40 scale-110' : 'border-gray-600'
                  }`}>
                    {model === m.id && (
                      <svg className="w-3 h-3 text-white success-pop" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" aria-hidden="true">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-semibold text-gray-100">{m.name}</p>
                      {m.type === 'stable' && (
                        <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-emerald-900/30 text-emerald-400 border border-emerald-800/30">STABLE</span>
                      )}
                    </div>
                    <p className="text-xs text-gray-400 mt-0.5">{m.description}</p>
                  </div>
                  {model === m.id && (
                    <div className="shrink-0 self-center">
                      <svg className="w-5 h-5 text-brand-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                  )}
                </button>
              ))}
            </div>
            <div className="flex items-center gap-2 px-3 py-2.5 rounded-xl bg-gradient-to-r from-brand-900/10 to-transparent border border-brand-900/20">
              <svg className="w-4 h-4 shrink-0 text-brand-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p className="text-[11px] text-gray-400">All models support image &amp; audio analysis. <span className="text-brand-400 font-medium">Gemini 3.5 Flash</span> is recommended for best results.</p>
            </div>
          </div>
        )}

        {/* ─── Accessibility ─── */}
        {tab === 'access' && (
          <div className="mt-5 space-y-4 animate-in-fast">
            <div className="flex items-center justify-between">
              <p className="text-xs font-bold text-gray-500 uppercase tracking-widest">Visual Adjustments</p>
              <div className="flex items-center gap-1.5">
                {ACC_SETTINGS.filter((s) => settings[s.key]).length > 0 && (
                  <span className="px-2 py-0.5 rounded-full bg-brand-900/30 text-[9px] font-bold text-brand-400 border border-brand-800/30">
                    {ACC_SETTINGS.filter((s) => settings[s.key]).length} active
                  </span>
                )}
              </div>
            </div>

            <div className="space-y-2">
              {ACC_SETTINGS.map((s) => (
                <button key={s.key} onClick={() => toggleSetting(s.key)}
                  className={`w-full flex items-start gap-4 p-4 rounded-xl text-left transition-all duration-200 border focus-visible:outline-2 focus-visible:outline-brand-400 ${
                    settings[s.key]
                      ? 'bg-gradient-to-r from-brand-900/20 to-brand-900/5 border-brand-800/40 shadow-md shadow-brand-900/20'
                      : 'bg-transparent border-transparent hover:bg-gray-800/40 hover:border-gray-700/30'
                  }`}
                  aria-pressed={settings[s.key]}>
                  <div className={`shrink-0 mt-0.5 w-9 h-9 rounded-xl bg-gradient-to-br ${s.grad} flex items-center justify-center text-white shadow-sm transition-all duration-200 ${
                    settings[s.key] ? 'ring-2 ring-white/15 scale-105 shadow-lg shadow-black/30' : 'opacity-60'
                  }`}>
                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" d={s.icon} />
                    </svg>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <p className="text-sm font-semibold text-gray-100">{s.label}</p>
                      <div className={`relative inline-flex h-5 w-9 shrink-0 rounded-full border-2 border-transparent transition-colors duration-200 ${
                        settings[s.key] ? 'bg-brand-500 shadow-sm shadow-brand-500/30' : 'bg-gray-600'
                      }`}>
                        <span className={`inline-block h-4 w-4 rounded-full bg-white shadow-md transform transition-transform duration-200 ${
                          settings[s.key] ? 'translate-x-4' : 'translate-x-0'
                        }`} />
                      </div>
                    </div>
                    <p className="text-xs text-gray-400 mt-0.5 leading-relaxed">{s.desc}</p>
                  </div>
                </button>
              ))}
            </div>

            {/* Font size */}
            <div className="bg-gray-800/30 rounded-xl border border-gray-700/30 p-4 space-y-3">
              <div className="flex items-center gap-2">
                <svg className="w-4 h-4 text-gray-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 6V4h16v2M4 6l4 14h3l4-14M4 6h16" />
                </svg>
                <p className="text-[11px] font-bold text-gray-500 uppercase tracking-widest">Font Size</p>
                <span className="text-[10px] text-gray-600 ml-auto font-mono">{settings.fontSize}</span>
              </div>
              <div className="grid grid-cols-4 gap-2">
                {Object.entries(FONT_SIZES).map(([k, v]) => (
                  <button key={k} onClick={() => updateSetting('fontSize', k)}
                    className={`flex flex-col items-center gap-1.5 py-3 rounded-xl text-[10px] font-semibold transition-all duration-200 focus-visible:outline-2 focus-visible:outline-brand-400 ${
                      settings.fontSize === k
                        ? 'bg-brand-900/30 text-brand-300 ring-2 ring-brand-700/50 shadow-md shadow-brand-900/20 scale-105'
                        : 'text-gray-500 hover:bg-gray-800/50 hover:text-gray-300 border border-gray-700/30'
                    }`} aria-label={v.label} aria-pressed={settings.fontSize === k}>
                    <span className="font-bold leading-none" style={{fontSize: k==='small'?'14px':k==='medium'?'16px':k==='large'?'19px':'23px'}}>A</span>
                    <span>{v.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Active badges */}
            {ACC_SETTINGS.some((s) => settings[s.key]) && (
              <div className="flex flex-wrap gap-1.5">
                <span className="text-[10px] text-gray-600 mr-1 self-center">Active:</span>
                {ACC_SETTINGS.filter((s) => settings[s.key]).map((s) => (
                  <span key={s.key} className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-brand-900/25 text-[10px] font-semibold text-brand-300 border border-brand-800/30 shadow-sm">
                    <span className={`w-1.5 h-1.5 rounded-full bg-gradient-to-br ${s.grad}`} />
                    {s.label}
                    <button onClick={() => toggleSetting(s.key)} className="ml-0.5 text-brand-500 hover:text-brand-300" aria-label={`Disable ${s.label}`}>
                      <svg className="w-2.5 h-2.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path strokeLinecap="round" d="M6 18L18 6M6 6l12 12" /></svg>
                    </button>
                  </span>
                ))}
              </div>
            )}

            {!ACC_SETTINGS.some((s) => settings[s.key]) && (
              <div className="text-center py-3">
                <p className="text-[11px] text-gray-600">No accessibility adjustments active. Toggle any setting above.</p>
              </div>
            )}
          </div>
        )}

        {/* ─── Footer ─── */}
        <div className="mt-6 pt-4 border-t border-gray-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <span className={`relative flex h-2 w-2 ${apiKey ? '' : ''}`}>
              <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${apiKey ? 'bg-green-400' : 'bg-gray-500'}`} />
              <span className={`relative inline-flex rounded-full h-2 w-2 ${apiKey ? 'bg-green-500' : 'bg-gray-600'}`} />
            </span>
            <span className="text-[11px] text-gray-500">{apiKey ? 'API connected' : 'No API key'}</span>
          </div>
          <div className="flex items-center gap-3">
            {apiKey && (
              <span className="text-[10px] text-gray-600">Model: {model}</span>
            )}
            <span className="text-[10px] text-gray-700 font-mono">v1.0.0</span>
          </div>
        </div>
      </div>
    </Modal>
  );
}
