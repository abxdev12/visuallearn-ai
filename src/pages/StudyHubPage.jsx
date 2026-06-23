import { useState, useMemo, useCallback, useEffect, useRef } from 'react';
import { useVoice } from '../contexts/VoiceContext';
import { useToast } from '../contexts/ToastContext';
import { savePendingSession } from '../utils/saveSession';

/* ═══════════════════════════════════════════════
   CUSTOM SVG ICONS
   ═══════════════════════════════════════════════ */

function Svg({ viewBox = "0 0 24 24", children, className, strokeWidth = 1.8, fill = "none" }) {
  return <svg className={className} viewBox={viewBox} fill={fill} stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{children}</svg>;
}

/* Stat icons */
function StatImageIcon({ c }) { return <Svg className={c}><path d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/></Svg>; }
function StatMicIcon({ c }) { return <Svg className={c}><path d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m-4 0h8m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"/></Svg>; }
function StatNoteIcon({ c }) { return <Svg className={c}><path d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/></Svg>; }
function StatBookmarkIcon({ c }) { return <Svg className={c}><path d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"/></Svg>; }
function StatClockIcon({ c }) { return <Svg className={c}><path d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/></Svg>; }

/* Action icons */
function SearchIcon({ c }) { return <Svg className={c}><circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/></Svg>; }
function PlusIcon({ c }) { return <Svg className={c} strokeWidth={2}><path d="M12 5v14M5 12h14"/></Svg>; }
function CloseIcon({ c }) { return <Svg className={c} strokeWidth={2}><path d="M18 6L6 18M6 6l12 12"/></Svg>; }
function EditIcon({ c }) { return <Svg className={c}><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/></Svg>; }
function PinIcon({ c }) { return (
  <svg className={c} viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.8" fill="currentColor" fillOpacity="0.04" />
    <path d="M12 5L13.5 9.5L18 10.5L14.5 13.5L15.5 18L12 15.5L8.5 18L9.5 13.5L6 10.5L10.5 9.5L12 5Z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" fill="currentColor" fillOpacity="0.9" />
    <circle cx="12" cy="11" r="1.5" fill="white" opacity="0.4" />
  </svg>
); }
function HeartIcon({ c, fill: f }) { return (
  <svg className={c} viewBox="0 0 24 24" fill={f || "none"} aria-hidden="true">
    <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.8" fill={f || "none"} fillOpacity={f ? 0.15 : 0} />
    <path d="M12 7.5C12 7.5 10.5 5 8 5C5.5 5 4 6.8 4 9.2C4 12.5 7 15 12 19C17 15 20 12.5 20 9.2C20 6.8 18.5 5 16 5C13.5 5 12 7.5 12 7.5Z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" fill={f || "none"} fillOpacity={f ? 0.95 : 0.04} />
    {f && <circle cx="12" cy="11" r="2.5" fill="white" opacity="0.3" />}
  </svg>
); }
function TrashIcon({ c }) { return <Svg className={c} strokeWidth={2}><path d="M3 6h18M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2"/></Svg>; }
function FolderIcon({ c }) { return <Svg className={c}><path d="M22 19a2 2 0 01-2 2H4a2 2 0 01-2-2V5a2 2 0 012-2h5l2 3h9a2 2 0 012 2z"/></Svg>; }
function LayoutIcon({ c }) { return <Svg className={c}><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/></Svg>; }
function ListIcon({ c }) { return <Svg className={c}><line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/></Svg>; }
function BookOpenIcon({ c }) { return <Svg className={c}><path d="M2 3h6a4 4 0 014 4v14a3 3 0 00-3-3H2z"/><path d="M22 3h-6a4 4 0 00-4 4v14a3 3 0 013-3h7z"/></Svg>; }
function CalendarIcon({ c }) { return <Svg className={c}><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></Svg>; }
function ExportIcon({ c }) { return <Svg className={c}><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></Svg>; }
function CopyIcon({ c }) { return <Svg className={c}><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1"/></Svg>; }
function ActivityIcon({ c }) { return <Svg className={c}><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></Svg>; }
function LightbulbIcon({ c }) { return <Svg className={c}><path d="M9 18h6M10 22h4M15.09 14c.18-.98.65-1.74 1.41-2.5A4.65 4.65 0 0018 8 6 6 0 006 8c0 1 .23 2.23 1.5 3.5A4.61 4.61 0 008.91 14"/></Svg>; }
function TagIcon({ c }) { return <Svg className={c}><path d="M20.59 13.41l-7.17 7.17a2 2 0 01-2.83 0L2 12V2h10l8.59 8.59a2 2 0 010 2.82z"/><line x1="7" y1="7" x2="7.01" y2="7"/></Svg>; }
function UserIcon({ c }) { return <Svg className={c}><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/></Svg>; }

/* ═══════════════════════════════════════════════
   LOCAL STORAGE HOOK
   ═══════════════════════════════════════════════ */
const STORAGE_KEY = 'visuallearn_studyhub';
const NOTES_KEY = 'visuallearn_notes';

function loadData() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    const data = raw ? JSON.parse(raw) : {};
    return {
      sessions: data.sessions || [],
      bookmarks: data.bookmarks || [],
      activityLog: data.activityLog || [],
      sessionsCount: data.sessionsCount || { image: 3, audio: 2 },
      totalStudyMinutes: data.totalStudyMinutes || 42,
      lastVisit: data.lastVisit || null,
    };
  } catch { return { sessions: [], bookmarks: [], activityLog: [], sessionsCount: { image: 3, audio: 2 }, totalStudyMinutes: 42, lastVisit: null }; }
}

function saveData(data) {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(data)); } catch {}
}

function loadNotes() {
  try { return JSON.parse(localStorage.getItem(NOTES_KEY)) || []; } catch { return []; }
}
function saveNotes(notes) {
  try { localStorage.setItem(NOTES_KEY, JSON.stringify(notes)); } catch {}
}

let nextId = Date.now();
function uid() { return (nextId++).toString(36); }

/* ═══════════════════════════════════════════════
   DATE HELPERS
   ═══════════════════════════════════════════════ */
function timeAgo(d) {
  const now = Date.now();
  const diff = now - new Date(d).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'Just now';
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  if (days === 1) return 'Yesterday';
  if (days < 7) return `${days}d ago`;
  return new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

function formatDate(d) {
  const date = new Date(d);
  const today = new Date();
  const yesterday = new Date(today); yesterday.setDate(yesterday.getDate() - 1);
  if (date.toDateString() === today.toDateString()) return 'Today';
  if (date.toDateString() === yesterday.toDateString()) return 'Yesterday';
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

function dateGroup(d) {
  const now = new Date(); const date = new Date(d);
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const yesterday = new Date(today); yesterday.setDate(yesterday.getDate() - 1);
  const weekAgo = new Date(today); weekAgo.setDate(weekAgo.getDate() - 7);
  if (date >= today) return 'Today';
  if (date >= yesterday) return 'Yesterday';
  if (date >= weekAgo) return 'This Week';
  return 'Earlier';
}

/* ═══════════════════════════════════════════════
   COMPONENTS
   ═══════════════════════════════════════════════ */

/* ── Empty State ── */
function EmptyState({ icon: Icon, title, desc, action, onAction, actionLabel }) {
  return (
    <div className="flex flex-col items-center justify-center py-12 sm:py-16 text-center px-4">
      <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-gradient-to-br from-brand-900/40 to-brand-800/20 border border-brand-800/20 flex items-center justify-center mb-4">
        {Icon && <Icon c="w-7 h-7 sm:w-8 sm:h-8 text-brand-400/60" />}
      </div>
      <p className="text-sm sm:text-base font-bold text-gray-200 mb-1.5">{title}</p>
      <p className="text-xs sm:text-sm text-gray-500 max-w-xs mb-4 leading-relaxed">{desc}</p>
      {action && onAction && (
        <button onClick={onAction} className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-semibold bg-brand-900/30 text-brand-300 border border-brand-800/40 hover:bg-brand-900/40 transition-all">
          {actionLabel}
        </button>
      )}
    </div>
  );
}

/* ── Stat Card ── */
function StatCard({ icon: Icon, label, value, trend, accent }) {
  const a = accent || 'brand';
  const dotMap = { brand: 'bg-brand-500', emerald: 'bg-emerald-500', amber: 'bg-amber-500', sky: 'bg-sky-500', violet: 'bg-violet-500' };
  return (
    <div className="group relative rounded-xl sm:rounded-2xl border border-gray-800/30 bg-gradient-to-br from-gray-900/60 to-gray-900/30 p-4 sm:p-5 transition-all duration-300 hover:shadow-xl hover:shadow-brand-500/5 hover:-translate-y-0.5 hover:border-gray-700/40">
      <div className="absolute inset-0 rounded-xl sm:rounded-2xl bg-gradient-to-b from-white/[0.02] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
      <div className="relative flex items-start justify-between">
        <div className={`w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gray-800/70 ring-1 ring-white/[0.05] flex items-center justify-center ${accent === 'emerald' ? 'text-emerald-400' : accent === 'amber' ? 'text-amber-400' : accent === 'sky' ? 'text-sky-400' : accent === 'violet' ? 'text-violet-400' : 'text-brand-400'} group-hover:scale-105 transition-all duration-200`}>
          {Icon && <Icon c="w-4 h-4 sm:w-5 sm:h-5" />}
        </div>
        {trend !== undefined && (
          <span className={`text-[10px] font-semibold flex items-center gap-0.5 ${trend >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
            <svg className={`w-3 h-3 ${trend >= 0 ? '' : 'rotate-180'}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M18 15l-6-6-6 6"/></svg>
            {Math.abs(trend)}%
          </span>
        )}
      </div>
      <div className="relative mt-3">
        <p className="text-xl sm:text-2xl font-extrabold text-gray-100 tracking-tight">{value}</p>
        <p className="text-[10px] sm:text-xs text-gray-500 mt-0.5 font-medium">{label}</p>
      </div>
      <div className={`absolute bottom-0 left-0 right-0 h-0.5 rounded-full ${dotMap[a]} opacity-0 group-hover:opacity-30 transition-opacity`} />
    </div>
  );
}

/* ── Inline Export Dropdown ── */
function ExportDropdown({ onExport, className }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  const [pos, setPos] = useState(() => typeof window !== 'undefined' && window.innerWidth < 640 ? 'right-full' : 'right-0');
  useEffect(() => {
    const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);
  // Smart positioning on open
  useEffect(() => {
    if (!open || !ref.current) return;
    const r = ref.current.getBoundingClientRect();
    setPos(window.innerWidth - r.right < 150 ? 'right-full' : 'right-0');
  }, [open]);

  return (
    <div className={`relative ${className || ''}`} ref={ref}>
      <button onClick={(e) => { e.stopPropagation(); setOpen(!open); }}
        className={`p-1 rounded-lg transition-all duration-200 ${open ? 'bg-brand-900/30 text-brand-400' : 'text-gray-500 hover:text-brand-400 hover:bg-gray-800/50'}`}
        aria-label="Export" aria-expanded={open}>
        <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" />
          <polyline points="7 10 12 15 17 10" />
          <line x1="12" y1="15" x2="12" y2="3" />
        </svg>
      </button>
      {open && (
        <div className={`absolute ${pos} top-full mt-1.5 z-50 animate-in-fast`} style={{ minWidth: '152px' }}>
          <div className="bg-gray-900/95 backdrop-blur-md border border-gray-700/50 rounded-xl shadow-2xl shadow-black/50 p-1.5">
            {[
              { label: 'PDF', fmt: 'pdf', icon: 'M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8zM14 2v6h6', sub: 'M12 18v-6m-3 3l3-3 3 3' },
              { label: 'TXT', fmt: 'txt', icon: 'M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8zM14 2v6h6', sub: 'M9 15h6M9 11h6M9 19h4' },
              { label: 'Markdown', fmt: 'md', icon: 'M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8zM14 2v6h6', sub: 'M9 13l3-3 3 3M9 17l3 3 3-3' },
              { label: 'Copy', fmt: 'clipboard', icon: 'M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2', sub: 'M16 10h-4a2 2 0 00-2 2v4a2 2 0 002 2h6a2 2 0 002-2v-4a2 2 0 00-2-2z' },
            ].map((opt) => (
              <button key={opt.fmt} onClick={(e) => { e.stopPropagation(); onExport(opt.fmt); setOpen(false); }}
                className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-[11px] sm:text-xs font-medium text-gray-400 hover:text-gray-200 hover:bg-gray-800/80 transition-all text-left group/opt">
                <span className="shrink-0 w-7 h-7 rounded-lg bg-gray-800/90 border border-gray-700/40 flex items-center justify-center text-gray-500 group-hover/opt:text-brand-400 group-hover/opt:border-brand-700/50 group-hover/opt:bg-gray-800 transition-all">
                  <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <path d={opt.icon} />
                    <path d={opt.sub} />
                  </svg>
                </span>
                <span className="flex-1 truncate">{opt.label}</span>
                <span className="text-[7px] sm:text-[8px] font-mono text-gray-600 uppercase px-1 py-0.5 rounded bg-gray-800/50">{opt.fmt === 'clipboard' ? '⎘' : '.' + opt.fmt}</span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

/* ── Session Card ── */
function SessionCard({ session, onOpen, onBookmark, onDelete, bookmarked, onExport }) {
  const isImage = session.type === 'image' || session.type === 'vision';
  return (
    <div className="group relative rounded-xl sm:rounded-2xl border border-gray-800/30 bg-gradient-to-br from-gray-900/60 to-gray-900/30 p-4 sm:p-5 transition-all duration-300 hover:shadow-xl hover:shadow-brand-500/5 hover:-translate-y-0.5 hover:border-gray-700/40">
      <div className="absolute inset-0 rounded-xl sm:rounded-2xl bg-gradient-to-b from-white/[0.02] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
      <div className="relative flex items-start gap-3">
        <div className={`shrink-0 w-9 h-9 sm:w-10 sm:h-10 rounded-xl ${isImage ? 'bg-blue-900/30 text-blue-400' : 'bg-emerald-900/30 text-emerald-400'} ring-1 ring-white/[0.05] flex items-center justify-center`}>
          {isImage ? <StatImageIcon c="w-4 h-4 sm:w-5 sm:h-5" /> : <StatMicIcon c="w-4 h-4 sm:w-5 sm:h-5" />}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-0.5">
            <h3 className="text-xs sm:text-sm font-bold text-gray-200 truncate group-hover:text-white transition-colors">{session.title || 'Untitled Session'}</h3>
            <span className={`shrink-0 px-1.5 py-0.5 rounded text-[8px] font-bold uppercase ${isImage ? 'bg-blue-900/20 text-blue-300 border border-blue-800/30' : 'bg-emerald-900/20 text-emerald-300 border border-emerald-800/30'}`}>{isImage ? 'Vision' : 'Audio'}</span>
          </div>
          <p className="text-[10px] sm:text-[11px] text-gray-500 mb-2 leading-relaxed line-clamp-2">{session.preview || 'No preview available.'}</p>
          <div className="flex items-center justify-between">
            <span className="text-[9px] sm:text-[10px] text-gray-600 font-medium">{formatDate(session.date)}</span>
            <div className="flex items-center gap-0.5">
              <button onClick={() => onOpen?.(session)} className="px-2.5 py-1 rounded-lg text-[10px] font-semibold text-brand-400 hover:bg-brand-900/30 transition-all">Open</button>
              <button onClick={() => onBookmark?.(session.id)} className={`p-1 rounded-lg transition-all ${bookmarked ? 'text-amber-400 hover:text-amber-300' : 'text-gray-600 hover:text-gray-400'}`} aria-label={bookmarked ? 'Bookmarked' : 'Bookmark'}>
                <StatBookmarkIcon c={`w-3.5 h-3.5 ${bookmarked ? 'fill-amber-400' : ''}`} />
              </button>
              <ExportDropdown onExport={(fmt) => onExport?.(session, fmt)} />
              <button onClick={() => onDelete?.(session.id)} className="p-1 rounded-lg text-gray-600 hover:text-red-400 transition-all" aria-label="Delete">
                <TrashIcon c="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ── Note Viewer Modal ── */
function NoteViewer({ note, onClose, onEdit }) {
  const wordCount = note.content ? note.content.split(/\s+/).filter(Boolean).length : 0;
  const charCount = note.content ? note.content.length : 0;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-0 sm:p-4 bg-black/70 backdrop-blur-sm animate-in" onClick={onClose}>
      <div className="w-full h-full sm:h-auto sm:max-h-[85vh] sm:max-w-2xl sm:rounded-2xl border-0 sm:border sm:border-gray-700/40 bg-gray-950 sm:bg-gray-900 shadow-2xl shadow-black/50 animate-slide-up overflow-y-auto scrollbar-thin" onClick={(e) => e.stopPropagation()}>
        {/* Premium header with gradient */}
        <div className="relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-brand-900/20 via-transparent to-transparent" />
          {note.pinned && <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-amber-400 via-amber-500 to-amber-400" />}
          {note.favorite && !note.pinned && <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-red-400 via-rose-500 to-red-400" />}
          <div className="relative px-5 sm:px-6 pt-5 sm:pt-6 pb-4">
            <div className="flex items-start justify-between gap-3">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1.5">
                  {note.pinned && <span className="px-1.5 py-0.5 rounded-md text-[8px] font-bold uppercase bg-amber-900/30 text-amber-300 border border-amber-800/30">Pinned</span>}
                  {note.favorite && <span className="px-1.5 py-0.5 rounded-md text-[8px] font-bold uppercase bg-red-900/30 text-red-300 border border-red-800/30">Favorite</span>}
                  <span className="px-1.5 py-0.5 rounded-md text-[8px] font-bold uppercase bg-gray-800/70 text-gray-500 border border-gray-700/30">Note</span>
                </div>
                <h2 className="text-base sm:text-lg font-extrabold text-gray-100 leading-tight">{note.title || 'Untitled'}</h2>
              </div>
              <div className="flex items-center gap-1 shrink-0">
                <button onClick={(e) => { e.stopPropagation(); onEdit?.(note); onClose(); }} className="p-2 rounded-lg text-gray-500 hover:text-brand-400 hover:bg-gray-800 transition-all" aria-label="Edit">
                  <EditIcon c="w-4 h-4" />
                </button>
                <button onClick={onClose} className="p-2 rounded-lg text-gray-500 hover:text-gray-300 hover:bg-gray-800 transition-all" aria-label="Close">
                  <CloseIcon c="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
        {/* Meta bar */}
        <div className="px-5 sm:px-6 pb-4 border-b border-gray-800/50">
          <div className="flex flex-wrap items-center gap-2 text-[10px] sm:text-xs text-gray-500">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-brand-900/20 text-brand-300 border border-brand-800/30">
              <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/></svg>
              {formatDate(note.date)}
            </span>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-gray-800/60 text-gray-500 border border-gray-700/30">
              <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>
              {wordCount} words
            </span>
            {note.tags?.map((t, i) => (
              <span key={i} className="px-2 py-0.5 rounded-md bg-gray-800/70 text-gray-500 border border-gray-700/30">#{t}</span>
            ))}
          </div>
        </div>
        {/* Note body */}
        <div className="px-5 sm:px-6 py-5 sm:py-6">
          <div className="relative rounded-xl bg-gradient-to-br from-gray-800/30 to-gray-900/20 border border-gray-700/25 p-5 sm:p-6">
            <div className="absolute top-0 right-0 w-32 h-32 rounded-full bg-brand-500/5 blur-3xl pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-24 h-24 rounded-full bg-violet-500/5 blur-3xl pointer-events-none" />
            <div className="relative whitespace-pre-wrap text-sm sm:text-base text-gray-200 leading-relaxed font-light tracking-wide">
              {note.content || <span className="text-gray-600 italic">No content written yet.</span>}
            </div>
          </div>
        </div>
        {/* Footer stats */}
        <div className="px-5 sm:px-6 pb-5 sm:pb-6">
          <div className="flex items-center justify-between text-[10px] text-gray-600 pt-3 border-t border-gray-800/40">
            <div className="flex items-center gap-3">
              <span>{wordCount} words</span>
              <span className="w-1 h-1 rounded-full bg-gray-700"/>
              <span>{charCount} characters</span>
            </div>
            {note.favorite && (
              <span className="flex items-center gap-1 text-red-400">
                <HeartIcon c="w-3 h-3 fill-current" />
                Favorited
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ── Note Card ── */
function NoteCard({ note, onEdit, onDelete, onPin, onFavorite, onExport, onOpen }) {
  const wordCount = note.content ? note.content.split(/\s+/).filter(Boolean).length : 0;
  return (
    <div className="group relative rounded-xl sm:rounded-2xl border border-gray-800/30 bg-gradient-to-br from-gray-900/60 to-gray-900/30 p-4 sm:p-5 transition-all duration-300 hover:shadow-xl hover:shadow-brand-500/5 hover:-translate-y-0.5 hover:border-gray-700/40">
      {/* Top accent line */}
      <div className={`absolute top-0 left-3 right-3 h-0.5 rounded-full transition-opacity ${note.pinned ? 'bg-amber-500/60' : note.favorite ? 'bg-red-500/40' : 'bg-transparent group-hover:bg-brand-500/30'}`} />
      <div className="absolute inset-0 rounded-xl sm:rounded-2xl bg-gradient-to-b from-white/[0.02] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
      <div className="relative">
        <div className="flex items-start justify-between mb-2.5">
          <div className="flex items-center gap-2 min-w-0 flex-1">
            {note.pinned && <PinIcon c="w-3.5 h-3.5 text-amber-400 shrink-0" />}
            <h3 className="text-xs sm:text-sm font-bold text-gray-200 truncate group-hover:text-white transition-colors">{note.title || 'Untitled'}</h3>
          </div>
          <div className="flex items-center gap-0.5 shrink-0 ml-2">
            <button onClick={() => onOpen?.(note)} className="px-2 py-1 rounded-lg text-[10px] font-semibold text-brand-400 hover:bg-brand-900/30 transition-all">Open</button>
            <ExportDropdown onExport={(fmt) => onExport?.(note, fmt)} />
            <button onClick={() => onPin?.(note.id)} className={`p-1 rounded-lg transition-all ${note.pinned ? 'text-amber-400' : 'text-gray-600 hover:text-amber-400'}`} aria-label="Pin">
              <PinIcon c="w-3 h-3" />
            </button>
            <button onClick={() => onFavorite?.(note.id)} className={`p-1 rounded-lg transition-all ${note.favorite ? 'text-red-400' : 'text-gray-600 hover:text-red-400'}`} aria-label="Favorite">
              <HeartIcon c="w-3 h-3" fill={note.favorite ? 'currentColor' : 'none'} />
            </button>
            <button onClick={() => onEdit?.(note)} className="p-1 rounded-lg text-gray-600 hover:text-brand-400 transition-all" aria-label="Edit">
              <EditIcon c="w-3 h-3" />
            </button>
            <button onClick={() => onDelete?.(note.id)} className="p-1 rounded-lg text-gray-600 hover:text-red-400 transition-all" aria-label="Delete">
              <TrashIcon c="w-3 h-3" />
            </button>
          </div>
        </div>
        <p className="text-[10px] sm:text-[11px] text-gray-500 leading-relaxed line-clamp-3 mb-3 whitespace-pre-wrap">{note.content || <span className="text-gray-600 italic">No content.</span>}</p>
        <div className="flex items-center justify-between text-[9px] sm:text-[10px] text-gray-600">
          <div className="flex items-center gap-2 min-w-0">
            <span className="shrink-0">{formatDate(note.date)}</span>
            {note.tags?.length > 0 && <span className="w-1 h-1 rounded-full bg-gray-700 shrink-0"/>}
            {note.tags?.slice(0, 2).map((t, i) => <span key={i} className="px-1.5 py-0.5 rounded bg-gray-800/50 text-gray-500 truncate">#{t}</span>)}
          </div>
          <span className="shrink-0 text-gray-600">{wordCount > 0 ? `${wordCount}w` : ''}</span>
        </div>
      </div>
    </div>
  );
}

/* ── Activity Timeline Item ── */
function TimelineItem({ icon: Icon, title, desc, date, color }) {
  const c = color || 'brand';
  const dotMap = { brand: 'bg-brand-500 ring-brand-900/40', emerald: 'bg-emerald-500 ring-emerald-900/40', amber: 'bg-amber-500 ring-amber-900/40', sky: 'bg-sky-500 ring-sky-900/40', violet: 'bg-violet-500 ring-violet-900/40' };
  const textMap = { brand: 'text-brand-400', emerald: 'text-emerald-400', amber: 'text-amber-400', sky: 'text-sky-400', violet: 'text-violet-400' };
  return (
    <div className="relative flex gap-4 pb-6 last:pb-0 group">
      {/* Vertical line */}
      <div className="absolute left-[11px] top-4 bottom-0 w-px bg-gray-800 group-last:hidden" />
      {/* Dot */}
      <div className={`shrink-0 w-[22px] h-[22px] rounded-full ring-[3px] ${dotMap[c]} flex items-center justify-center z-10`}>
        <div className={`w-2 h-2 rounded-full ${c === 'brand' ? 'bg-brand-400' : c === 'emerald' ? 'bg-emerald-400' : c === 'amber' ? 'bg-amber-400' : c === 'sky' ? 'bg-sky-400' : 'bg-violet-400'}`} />
      </div>
      <div className="flex-1 min-w-0 pt-0.5">
        <div className="flex items-center gap-2 mb-0.5">
          <span className={`${textMap[c]}`}>{Icon && <Icon c="w-3.5 h-3.5" />}</span>
          <p className="text-xs sm:text-sm font-semibold text-gray-200">{title}</p>
        </div>
        {desc && <p className="text-[10px] sm:text-xs text-gray-500 leading-relaxed">{desc}</p>}
        <p className="text-[9px] text-gray-600 mt-0.5">{timeAgo(date)}</p>
      </div>
    </div>
  );
}

/* ── Insight Card ── */
function InsightCard({ icon: Icon, label, value, accent }) {
  const a = accent || 'brand';
  const gradMap = { brand: 'from-brand-900/25 to-brand-800/5 border-brand-800/20', emerald: 'from-emerald-900/25 to-emerald-800/5 border-emerald-800/20', amber: 'from-amber-900/25 to-amber-800/5 border-amber-800/20', sky: 'from-sky-900/25 to-sky-800/5 border-sky-800/20', violet: 'from-violet-900/25 to-violet-800/5 border-violet-800/20' };
  const texMap = { brand: 'text-brand-400', emerald: 'text-emerald-400', amber: 'text-amber-400', sky: 'text-sky-400', violet: 'text-violet-400' };
  return (
    <div className={`group relative rounded-xl bg-gradient-to-br ${gradMap[a]} border p-4 sm:p-5 transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5`}>
      <div className="absolute inset-0 bg-gradient-to-b from-white/[0.02] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      <div className="relative flex items-start gap-3">
        <div className={`shrink-0 w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gray-900/60 ring-1 ring-white/[0.05] flex items-center justify-center ${texMap[a]} group-hover:scale-105 transition-all duration-200`}>
          {Icon && <Icon c="w-4 h-4 sm:w-5 sm:h-5" />}
        </div>
        <div className="min-w-0">
          <p className="text-[10px] sm:text-xs text-gray-500 font-medium mb-0.5">{label}</p>
          <p className="text-sm sm:text-base font-bold text-gray-200 truncate">{value || '—'}</p>
        </div>
      </div>
    </div>
  );
}

/* ── Note Editor Modal ── */
function NoteEditor({ note, onSave, onClose }) {
  const [title, setTitle] = useState(note?.title || '');
  const [content, setContent] = useState(note?.content || '');
  const [tags, setTags] = useState(note?.tags?.join(', ') || '');
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" onClick={onClose}>
      <div className="w-full max-w-lg rounded-2xl border border-gray-700/40 bg-gray-900 shadow-2xl shadow-black/40 overflow-hidden" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-800">
          <h3 className="text-sm font-bold text-gray-200">{note ? 'Edit Note' : 'New Note'}</h3>
          <button onClick={onClose} className="p-1.5 rounded-lg text-gray-500 hover:text-gray-300 hover:bg-gray-800 transition-all"><CloseIcon c="w-4 h-4" /></button>
        </div>
        <div className="p-5 space-y-3">
          <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Note title..." className="w-full px-3 py-2.5 rounded-xl bg-gray-800 border border-gray-700 text-sm text-gray-200 placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-brand-500/40 focus:border-brand-500/60 transition-all" autoFocus />
          <textarea value={content} onChange={(e) => setContent(e.target.value)} placeholder="Write your note..." rows={5} className="w-full px-3 py-2.5 rounded-xl bg-gray-800 border border-gray-700 text-sm text-gray-200 placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-brand-500/40 focus:border-brand-500/60 transition-all resize-none" />
          <input value={tags} onChange={(e) => setTags(e.target.value)} placeholder="Tags (comma separated)..." className="w-full px-3 py-2.5 rounded-xl bg-gray-800 border border-gray-700 text-sm text-gray-200 placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-brand-500/40 focus:border-brand-500/60 transition-all" />
        </div>
        <div className="flex items-center justify-end gap-2 px-5 py-4 border-t border-gray-800">
          <button onClick={onClose} className="px-4 py-2 rounded-xl text-xs font-semibold text-gray-400 hover:text-gray-200 hover:bg-gray-800 transition-all">Cancel</button>
          <button onClick={() => onSave({ title: title.trim() || 'Untitled', content: content || '', tags: tags.split(',').map((t) => t.trim()).filter(Boolean) })} className="px-5 py-2 rounded-xl text-xs font-bold bg-gradient-to-r from-brand-600 to-violet-600 text-white hover:from-brand-500 hover:to-violet-500 transition-all shadow-lg shadow-brand-500/20">Save Note</button>
        </div>
      </div>
    </div>
  );
}

/* ── Session Editor Modal ── */
function SessionEditor({ session, onSave, onClose }) {
  const [title, setTitle] = useState(session?.title || '');
  const [type, setType] = useState(session?.type || 'image');
  const [preview, setPreview] = useState(session?.preview || '');
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in" onClick={onClose}>
      <div className="w-full max-w-lg rounded-2xl border border-gray-700/40 bg-gray-900 shadow-2xl shadow-black/40 overflow-hidden animate-slide-up" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-800">
          <h3 className="text-sm font-bold text-gray-200">{session ? 'Edit Session' : 'New Session'}</h3>
          <button onClick={onClose} className="p-1.5 rounded-lg text-gray-500 hover:text-gray-300 hover:bg-gray-800 transition-all"><CloseIcon c="w-4 h-4" /></button>
        </div>
        <div className="p-5 space-y-3">
          <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Session title..." className="w-full px-3 py-2.5 rounded-xl bg-gray-800 border border-gray-700 text-sm text-gray-200 placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-brand-500/40 focus:border-brand-500/60 transition-all" />
          <div className="flex gap-2">
            <button onClick={() => setType('image')} className={`flex-1 flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl text-xs font-semibold border transition-all ${type === 'image' ? 'bg-blue-900/30 text-blue-300 border-blue-800/40' : 'bg-gray-800 text-gray-500 border-gray-700 hover:bg-gray-700'}`}>
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg>
              Vision
            </button>
            <button onClick={() => setType('audio')} className={`flex-1 flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl text-xs font-semibold border transition-all ${type === 'audio' ? 'bg-emerald-900/30 text-emerald-300 border-emerald-800/40' : 'bg-gray-800 text-gray-500 border-gray-700 hover:bg-gray-700'}`}>
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m-4 0h8m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"/></svg>
              Audio
            </button>
          </div>
          <textarea value={preview} onChange={(e) => setPreview(e.target.value)} placeholder="Session preview or notes..." rows={4} className="w-full px-3 py-2.5 rounded-xl bg-gray-800 border border-gray-700 text-sm text-gray-200 placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-brand-500/40 focus:border-brand-500/60 transition-all resize-none" />
        </div>
        <div className="flex items-center justify-end gap-2 px-5 py-4 border-t border-gray-800">
          <button onClick={onClose} className="px-4 py-2 rounded-xl text-xs font-semibold text-gray-400 hover:text-gray-200 hover:bg-gray-800 transition-all">Cancel</button>
          <button onClick={() => onSave({ title: title.trim(), type, preview })} disabled={!title.trim()} className="px-5 py-2 rounded-xl text-xs font-bold bg-gradient-to-r from-brand-600 to-violet-600 text-white hover:from-brand-500 hover:to-violet-500 transition-all shadow-lg shadow-brand-500/20 disabled:opacity-40">Save Session</button>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════
   MAIN PAGE
   ═══════════════════════════════════════════════ */
export default function StudyHubPage({ onNavigate }) {
  const voice = useVoice();
  const toast = useToast();
  const [data, setData] = useState(loadData);
  const [notes, setNotes] = useState(loadNotes);
  const [search, setSearch] = useState('');
  const [view, setView] = useState('grid');
  const [sort, setSort] = useState('newest');
  const [noteEditor, setNoteEditor] = useState(null);
  const [noteViewer, setNoteViewer] = useState(null);
  const [sessionEditor, setSessionEditor] = useState(null);
  const [bookmarkView, setBookmarkView] = useState('grid');
  const [activeTab, setActiveTab] = useState('sessions');
  const [notesFilter, setNotesFilter] = useState('all');
  const searchRef = useRef(null);

  // Persist
  useEffect(() => { saveData(data); }, [data]);
  useEffect(() => { saveNotes(notes); }, [notes]);

  // Search across sessions, notes, bookmarks
  const query = search.toLowerCase().trim();
  const filteredSessions = useMemo(() => {
    let s = data.sessions;
    if (query) s = s.filter((x) => (x.title || '').toLowerCase().includes(query) || (x.preview || '').toLowerCase().includes(query));
    if (sort === 'oldest') s = [...s].sort((a, b) => new Date(a.date) - new Date(b.date));
    else s = [...s].sort((a, b) => new Date(b.date) - new Date(a.date));
    return s;
  }, [data.sessions, query, sort]);

  const filteredNotes = useMemo(() => {
    let n = notes;
    if (notesFilter === 'favorites') n = n.filter((x) => x.favorite);
    if (notesFilter === 'pinned') n = n.filter((x) => x.pinned);
    if (query) n = n.filter((x) => (x.title || '').toLowerCase().includes(query) || (x.content || '').toLowerCase().includes(query));
    return n;
  }, [notes, query, notesFilter]);

  const filteredBookmarks = useMemo(() => {
    let b = data.bookmarks;
    if (query) b = b.filter((x) => (x.title || '').toLowerCase().includes(query));
    return b;
  }, [data.bookmarks, query]);

  // Stats
  const stats = useMemo(() => {
    const totalSessions = data.sessions.length;
    const totalNotes = notes.length;
    const totalBookmarks = data.bookmarks.length;
    const imgCount = data.sessionsCount?.image || 0;
    const audioCount = data.sessionsCount?.audio || 0;
    const hrs = Math.floor((data.totalStudyMinutes || 0) / 60);
    return { imgCount, audioCount, totalNotes, totalBookmarks, totalHours: hrs };
  }, [data, notes]);

  // Bookmark helpers
  const isBookmarked = useCallback((id) => data.bookmarks.some((b) => b.sessionId === id), [data.bookmarks]);
  const toggleBookmark = useCallback((sessionId) => {
    setData((prev) => {
      const exists = prev.bookmarks.find((b) => b.sessionId === sessionId);
      if (exists) {
        toast.info('Bookmark removed');
        return { ...prev, bookmarks: prev.bookmarks.filter((b) => b.sessionId !== sessionId) };
      }
      const session = prev.sessions.find((s) => s.id === sessionId);
      if (!session) return prev;
      toast.success('Session bookmarked!');
      const newBm = { id: uid(), sessionId, title: session.title, type: session.type, date: new Date().toISOString(), source: session.type === 'image' ? 'Vision Tutor' : 'Voice Tutor' };
      return { ...prev, bookmarks: [...prev.bookmarks, newBm], activityLog: [{ title: 'Session bookmarked', desc: session.title, date: new Date().toISOString(), color: 'brand' }, ...(prev.activityLog || [])].slice(0, 50) };
    });
  }, [toast]);

  // Session helpers
  const deleteSession = useCallback((id) => {
    setData((prev) => ({ ...prev, sessions: prev.sessions.filter((s) => s.id !== id), bookmarks: prev.bookmarks.filter((b) => b.sessionId !== id) }));
    toast.info('Session removed');
  }, [toast]);

  // Bookmark remove
  const removeBookmark = useCallback((id) => {
    setData((prev) => ({ ...prev, bookmarks: prev.bookmarks.filter((b) => b.id !== id) }));
    toast.info('Bookmark removed');
  }, [toast]);

  // Notes
  const saveNote = useCallback(({ title, content, tags }) => {
    if (noteEditor?.id) {
      setNotes((prev) => prev.map((n) => n.id === noteEditor.id ? { ...n, title: title || 'Untitled', content, tags, date: new Date().toISOString() } : n));
      toast.success('Note updated');
    } else {
      setNotes((prev) => [{ id: uid(), title: title || 'Untitled', content, tags: tags || [], pinned: false, favorite: false, date: new Date().toISOString() }, ...prev]);
      setData((prev) => ({ ...prev, activityLog: [{ title: 'Note created', desc: title || 'Untitled', date: new Date().toISOString(), color: 'violet' }, ...(prev.activityLog || [])].slice(0, 50) }));
      toast.success('Note created!');
    }
    setNoteEditor(null);
  }, [noteEditor, toast]);

  const deleteNote = useCallback((id) => { setNotes((prev) => prev.filter((n) => n.id !== id)); toast.info('Note deleted'); }, [toast]);
  const togglePin = useCallback((id) => {
    setNotes((prev) => prev.map((n) => n.id === id ? { ...n, pinned: !n.pinned } : n));
    const wasPinned = notes.find((n) => n.id === id)?.pinned;
    toast.info(wasPinned ? 'Note unpinned' : 'Note pinned');
  }, [toast, notes]);
  const toggleFavorite = useCallback((id) => {
    setNotes((prev) => prev.map((n) => n.id === id ? { ...n, favorite: !n.favorite } : n));
    const wasFav = notes.find((n) => n.id === id)?.favorite;
    toast.success(wasFav ? 'Removed from favorites' : 'Added to favorites!');
  }, [toast, notes]);

  // Session CRUD (like Notes)
  const saveSession = useCallback(({ title, type, preview }) => {
    if (sessionEditor?.id) {
      setData((prev) => ({
        ...prev,
        sessions: prev.sessions.map((s) => s.id === sessionEditor.id ? { ...s, title, type, preview, date: new Date().toISOString() } : s),
        sessionsCount: { ...prev.sessionsCount },
      }));
      toast.success('Session updated');
    } else {
      const newSession = { id: uid(), title: title || 'Untitled Session', type: type || 'image', preview: preview || 'No preview.', date: new Date().toISOString() };
      setData((prev) => ({
        ...prev,
        sessions: [newSession, ...prev.sessions],
        sessionsCount: { ...prev.sessionsCount, [type]: (prev.sessionsCount?.[type] || 0) + 1 },
        totalStudyMinutes: (prev.totalStudyMinutes || 0) + Math.floor(Math.random() * 10) + 5,
        activityLog: [{ title: `${type === 'image' ? 'Image' : 'Audio'} analyzed`, desc: title || 'Untitled Session', date: new Date().toISOString(), color: type === 'image' ? 'sky' : 'emerald' }, ...(prev.activityLog || [])].slice(0, 50),
      }));
      toast.success('Session created!');
    }
    setSessionEditor(null);
  }, [sessionEditor, toast]);

  // Open session: save pending content, navigate to tool
  const openSession = useCallback((session) => {
    if (!session) return;
    savePendingSession(session);
    const target = session.type === 'image' ? 'visual' : 'audio';
    onNavigate(target);
  }, [onNavigate]);

  // Export single item
  function escapeHtml(str) { if (!str) return ''; return str.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;'); }
  const handleItemExport = useCallback((item, format, source) => {
    const title = item.title || 'Untitled';
    const dateStr = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' });
    const body = item.content || item.preview || item.body || '';

    let content = '';
    if (source === 'Note') {
      content = `# ${title}\n\n*Created: ${formatDate(item.date)}*\n\n${item.content || ''}\n\n${(item.tags || []).length > 0 ? `**Tags:** ${item.tags.join(', ')}` : ''}`;
    } else if (source === 'Session') {
      content = `# ${title}\n\n*${item.type === 'image' ? 'Vision' : 'Audio'} Session • ${formatDate(item.date)}*\n\n${body}`;
    } else {
      content = `# ${title}\n\n*Bookmarked from ${item.source || 'Study Hub'} • ${formatDate(item.date)}*`;
    }

    const full = `${content}\n\n---\n*Exported from VisualLearn AI on ${dateStr}*`;

    if (format === 'clipboard') {
      navigator.clipboard.writeText(full).then(() => toast.success('Copied to clipboard!')).catch(() => toast.error('Failed to copy.'));
      return;
    }

    if (format === 'pdf') {
      const html = `<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><title>${escapeHtml(title)}</title>
<style>
  @page{margin:20mm 15mm;size:A4}
  *{margin:0;padding:0;box-sizing:border-box}
  body{font-family:'Inter',-apple-system,'Segoe UI',sans-serif;color:#1e1e2e;background:#fff;line-height:1.6;padding:20px}
  .header{border-bottom:2px solid #6366f1;padding-bottom:12px;margin-bottom:20px}
  .header h1{font-size:22px;font-weight:800;color:#4338ca}
  .header .meta{font-size:12px;color:#6b7280;margin-top:4px}
  .content{font-size:14px;color:#374151;white-space:pre-wrap;line-height:1.8;padding:12px 0}
  .footer{margin-top:24px;padding-top:12px;border-top:1px solid #e2e8f0;font-size:11px;color:#94a3b8;text-align:center}
  @media print{body{-webkit-print-color-adjust:exact;print-color-adjust:exact}}
</style></head><body>
<div class="header"><h1>${escapeHtml(title)}</h1><div class="meta">${escapeHtml(dateStr)}</div></div>
<div class="content">${escapeHtml(full)}</div>
<div class="footer">VisualLearn AI &mdash; Making Learning Accessible for Everyone.</div>
<script>setTimeout(()=>window.print(),300)</script></body></html>`;
      const win = window.open('', '_blank');
      if (!win) { toast.error('Please allow popups to export as PDF.'); return; }
      win.document.write(html);
      win.document.close();
      toast.success('PDF preview opened. Click "Save as PDF" in the print dialog.');
      return;
    }

    const ext = format === 'md' ? 'md' : 'txt';
    const mime = format === 'md' ? 'text/markdown;charset=utf-8' : 'text/plain;charset=utf-8';
    const blob = new Blob([full], { type: mime });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a'); a.href = url; a.download = `${title.toLowerCase().replace(/\s+/g, '_')}.${ext}`; a.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
    toast.success(`Exported as ${format.toUpperCase()}`);
  }, [toast]);

  // Insights generation — fully computed from real data
  const insights = useMemo(() => {
    const sessions = data.sessions || [];
    const allNotes = notes || [];
    const allBookmarks = data.bookmarks || [];
    const imgCount = sessions.filter((s) => s.type === 'image' || s.type === 'vision').length;
    const audioCount = sessions.filter((s) => s.type === 'audio').length;

    // Tags analysis
    const tagCounts = {};
    allNotes.forEach((n) => (n.tags || []).forEach((t) => { tagCounts[t.toLowerCase()] = (tagCounts[t.toLowerCase()] || 0) + 1; }));
    const sortedTags = Object.entries(tagCounts).sort((a, b) => b[1] - a[1]);
    const mostStudied = sortedTags[0]?.[0] || 'General';

    // Title keyword extraction for topics
    const wordCounts = {};
    sessions.forEach((s) => (s.title || '').toLowerCase().split(/\s+/).filter((w) => w.length > 3).forEach((w) => { wordCounts[w] = (wordCounts[w] || 0) + 1; }));
    allNotes.forEach((n) => (n.title || '').toLowerCase().split(/\s+/).filter((w) => w.length > 3).forEach((w) => { wordCounts[w] = (wordCounts[w] || 0) + 1; }));
    const topKeyword = Object.entries(wordCounts).sort((a, b) => b[1] - a[1])[0]?.[0] || 'learning';

    // Session frequency (per week)
    const oldest = sessions.length > 1 ? sessions.reduce((a, b) => new Date(a.date) < new Date(b.date) ? a : b) : sessions[0];
    const daysSinceFirst = oldest ? Math.max(1, Math.ceil((Date.now() - new Date(oldest.date).getTime()) / 86400000)) : 1;
    const weeksSinceFirst = Math.max(1, Math.ceil(daysSinceFirst / 7));
    const sessionsPerWeek = sessions.length > 0 ? (sessions.length / weeksSinceFirst).toFixed(1) : '0';

    // Most active day
    const dayCounts = [0, 0, 0, 0, 0, 0, 0];
    sessions.forEach((s) => { const d = new Date(s.date).getDay(); dayCounts[d]++; });
    allNotes.forEach((n) => { const d = new Date(n.date).getDay(); dayCounts[d]++; });
    const maxDay = dayCounts.indexOf(Math.max(...dayCounts));
    const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

    // Total content words
    const sessionWords = sessions.reduce((sum, s) => sum + ((s.content || s.preview || '').split(/\s+/).filter(Boolean).length), 0);
    const noteWords = allNotes.reduce((sum, n) => sum + ((n.content || '').split(/\s+/).filter(Boolean).length), 0);
    const totalWords = sessionWords + noteWords;

    // Streak calculation (consecutive days with activity)
    const allDates = [...sessions.map((s) => new Date(s.date).toDateString()), ...allNotes.map((n) => new Date(n.date).toDateString()), ...(data.activityLog || []).map((a) => new Date(a.date).toDateString())];
    const uniqueDays = [...new Set(allDates)].sort();
    let streak = 0;
    const today = new Date().toDateString();
    for (let i = uniqueDays.length - 1; i >= 0; i--) {
      const expected = new Date();
      expected.setDate(expected.getDate() - (uniqueDays.length - 1 - i));
      if (uniqueDays[i] === expected.toDateString()) streak++;
      else break;
    }

    // Favorite method
    const favMethod = allNotes.filter((n) => n.favorite).length > 2 ? 'Creating Notes' : sessions.length > 3 ? 'Active Learning' : allNotes.length > 0 ? 'Reviewing Notes' : 'Exploring Content';

    // Most productive time (rough: morning/afternoon/evening)
    const timeSlots = { morning: 0, afternoon: 0, evening: 0 };
    sessions.forEach((s) => {
      const h = new Date(s.date).getHours();
      if (h < 12) timeSlots.morning++;
      else if (h < 17) timeSlots.afternoon++;
      else timeSlots.evening++;
    });
    const bestTime = Object.entries(timeSlots).sort((a, b) => b[1] - a[1])[0]?.[0] || 'morning';

    // Bookmarks ratio
    const bookmarkRatio = sessions.length > 0 ? Math.round((allBookmarks.length / sessions.length) * 100) : 0;

    return {
      mostStudied,
      mostActive: imgCount >= audioCount ? 'Vision Tutor' : 'Voice Tutor',
      latestTopic: sessions.sort((a, b) => new Date(b.date) - new Date(a.date))[0]?.title || 'Start learning',
      totalSessions: sessions.length,
      totalNotes: allNotes.length,
      favMethod,
      streak,
      totalWords,
      sessionsPerWeek,
      mostActiveDay: dayNames[maxDay] || '—',
      bestTime: bestTime.charAt(0).toUpperCase() + bestTime.slice(1),
      bookmarkRatio,
      topKeyword: topKeyword.charAt(0).toUpperCase() + topKeyword.slice(1),
      imgCount,
      audioCount,
      totalMinutes: data.totalStudyMinutes || 0,
    };
  }, [data, notes]);

  // Activity timeline
  const timeline = useMemo(() => {
    const items = (data.activityLog || []).map((a) => ({
      title: a.title, desc: a.desc, date: a.date,
      color: a.color || 'brand', icon: a.icon || ActivityIcon,
    }));
    items.sort((a, b) => new Date(b.date) - new Date(a.date));
    return items.slice(0, 50);
  }, [data.activityLog]);

  // Group timeline
  const groupedTimeline = useMemo(() => {
    const groups = {};
    timeline.forEach((item) => {
      const g = dateGroup(item.date);
      if (!groups[g]) groups[g] = [];
      groups[g].push(item);
    });
    return groups;
  }, [timeline]);

  // Export
  // Keyboard shortcut
  useEffect(() => {
    const handler = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') { e.preventDefault(); searchRef.current?.focus(); }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []);

  const tabs = [
    { id: 'sessions', label: 'Sessions' },
    { id: 'notes', label: 'Notes' },
    { id: 'bookmarks', label: 'Bookmarks' },
    { id: 'timeline', label: 'Activity' },
  ];

  return (
    <div className="max-w-screen-2xl mx-auto px-3 sm:px-5 md:px-8 py-4 sm:py-6 pb-8 space-y-6 sm:space-y-8 animate-in">

      {/* ═══════════════════════════════════════
         HEADER
         ═══════════════════════════════════════ */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4">
        <div className="flex items-center gap-3 sm:gap-4 flex-1 min-w-0">
          <div className="flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-gradient-to-br from-brand-500 to-violet-600 text-white shadow-lg shadow-brand-500/20">
            <BookOpenIcon c="w-5 h-5 sm:w-6 sm:h-6" />
          </div>
          <div className="min-w-0">
            <h1 className="text-lg sm:text-xl md:text-2xl font-extrabold text-gray-100 tracking-tight">Study Hub</h1>
            <p className="text-[10px] sm:text-xs text-gray-500 mt-0.5">Manage your learning journey, notes, sessions, and insights in one place.</p>
          </div>
        </div>
      </div>

      {/* ═══════════════════════════════════════
         SEARCH BAR
         ═══════════════════════════════════════ */}
      <div className="relative group">
        <div className="absolute inset-0 rounded-xl sm:rounded-2xl bg-gradient-to-r from-brand-500/5 via-violet-500/5 to-brand-500/5 opacity-0 group-focus-within:opacity-100 transition-opacity" />
        <div className="relative flex items-center gap-3 px-4 sm:px-5 py-3 sm:py-3.5 rounded-xl sm:rounded-2xl bg-gray-900/70 border border-gray-700/30 group-focus-within:border-brand-500/40 group-focus-within:shadow-lg group-focus-within:shadow-brand-500/5 transition-all duration-200">
          <SearchIcon c="w-4 h-4 sm:w-5 sm:h-5 text-gray-500 shrink-0" />
          <input ref={searchRef} value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search everything — sessions, notes, bookmarks..." className="flex-1 bg-transparent text-xs sm:text-sm text-gray-200 placeholder-gray-600 focus:outline-none min-w-0" />
          {search && (
            <button onClick={() => setSearch('')} className="p-1 rounded-lg text-gray-600 hover:text-gray-400 transition-all"><CloseIcon c="w-3.5 h-3.5" /></button>
          )}
          <kbd className="hidden sm:inline-flex items-center gap-1 px-2 py-1 rounded-lg bg-gray-800 text-[9px] font-mono text-gray-600 border border-gray-700/40">⌘K</kbd>
        </div>
      </div>

      {/* ═══════════════════════════════════════
         STATS DASHBOARD
         ═══════════════════════════════════════ */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2.5 sm:gap-3">
        <StatCard icon={StatImageIcon} label="Images Processed" value={stats.imgCount} trend={12} accent="sky" />
        <StatCard icon={StatMicIcon} label="Audio Sessions" value={stats.audioCount} trend={8} accent="emerald" />
        <StatCard icon={StatNoteIcon} label="Saved Notes" value={stats.totalNotes} trend={stats.totalNotes > 0 ? 20 : 0} accent="brand" />
        <StatCard icon={StatBookmarkIcon} label="Bookmarks" value={stats.totalBookmarks} accent="amber" />
        <StatCard icon={StatClockIcon} label="Study Hours" value={stats.totalHours} trend={15} accent="violet" />
      </div>

      {/* ═══════════════════════════════════════
         TAB NAVIGATION
         ═══════════════════════════════════════ */}
      <div className="flex items-center gap-1 overflow-x-auto scrollbar-thin border-b border-gray-800/50 pb-0.5">
        {tabs.map((tab) => (
          <button key={tab.id} onClick={() => setActiveTab(tab.id)}
            className={`shrink-0 px-3 sm:px-4 py-2.5 text-xs sm:text-sm font-semibold transition-all duration-200 border-b-2 -mb-px whitespace-nowrap ${
              activeTab === tab.id ? 'text-brand-400 border-brand-500' : 'text-gray-500 border-transparent hover:text-gray-300 hover:border-gray-600'
            }`}>
            {tab.label}
          </button>
        ))}
      </div>

      {/* ═══════════════════════════════════════
         TAB: SESSIONS
         ═══════════════════════════════════════ */}
      {activeTab === 'sessions' && (
        <div className="space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-1.5">
              <span className="text-xs text-gray-500 font-medium">{filteredSessions.length} session{filteredSessions.length !== 1 ? 's' : ''}</span>
              {data.sessions.length > 0 && (
                <select value={sort} onChange={(e) => setSort(e.target.value)} className="text-[10px] px-2 py-1 rounded-lg bg-gray-800 border border-gray-700 text-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-500/30">
                  <option value="newest">Newest</option>
                  <option value="oldest">Oldest</option>
                </select>
              )}
            </div>
            <div className="flex items-center gap-1.5">
              <button onClick={() => setView('grid')} className={`p-1.5 rounded-lg transition-all ${view === 'grid' ? 'text-brand-400 bg-gray-800' : 'text-gray-600 hover:text-gray-400'}`}><LayoutIcon c="w-3.5 h-3.5" /></button>
              <button onClick={() => setView('list')} className={`p-1.5 rounded-lg transition-all ${view === 'list' ? 'text-brand-400 bg-gray-800' : 'text-gray-600 hover:text-gray-400'}`}><ListIcon c="w-3.5 h-3.5" /></button>
            </div>
          </div>
          {filteredSessions.length === 0 ? (
            <EmptyState icon={StatImageIcon} title="No sessions yet" desc="Create a session to track your learning. You can add sessions from Vision Tutor or manually here." action onAction={() => setSessionEditor({})} actionLabel="Create Session" />
          ) : (
            <div className={view === 'grid' ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4' : 'space-y-3'}>
              {filteredSessions.map((s) => (
                <SessionCard key={s.id} session={s} onOpen={() => openSession(s)} onBookmark={toggleBookmark} onDelete={deleteSession} bookmarked={isBookmarked(s.id)} onExport={(session, fmt) => handleItemExport(session, fmt, 'Session')} />
              ))}
            </div>
          )}
          {sessionEditor && (
            <SessionEditor session={sessionEditor?.id ? sessionEditor : null} onSave={saveSession} onClose={() => setSessionEditor(null)} />
          )}
        </div>
      )}

      {/* ═══════════════════════════════════════
         TAB: NOTES
         ═══════════════════════════════════════ */}
      {activeTab === 'notes' && (
        <div className="space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-1.5">
              <span className="text-xs text-gray-500 font-medium">{filteredNotes.length} note{filteredNotes.length !== 1 ? 's' : ''}</span>
              {['all', 'favorites', 'pinned'].map((f) => (
                <button key={f} onClick={() => setNotesFilter(f)}
                  className={`px-2 py-1 rounded-lg text-[9px] font-semibold transition-all ${
                    notesFilter === f
                      ? f === 'favorites' ? 'bg-red-900/30 text-red-300 border border-red-800/30' : f === 'pinned' ? 'bg-amber-900/30 text-amber-300 border border-amber-800/30' : 'bg-brand-900/30 text-brand-300 border border-brand-800/30'
                      : 'text-gray-600 hover:text-gray-400'
                  }`}>
                  {f === 'favorites' ? <span className="inline-flex items-center gap-1"><HeartIcon c="w-3 h-3 shrink-0" fill="currentColor" /> Favorites</span> : f === 'pinned' ? <span className="inline-flex items-center gap-1"><PinIcon c="w-3 h-3 shrink-0" /> Pinned</span> : 'All'}
                </button>
              ))}
            </div>
            <button onClick={() => setNoteEditor({})} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[10px] sm:text-xs font-semibold bg-gradient-to-r from-brand-600 to-violet-600 text-white hover:from-brand-500 hover:to-violet-500 transition-all shadow-lg shadow-brand-500/20">
              <PlusIcon c="w-3.5 h-3.5" /> New Note
            </button>
          </div>
          {filteredNotes.length === 0 ? (
            <EmptyState icon={StatNoteIcon} title="No notes saved yet" desc="Create your first note to capture important learning insights." action onAction={() => setNoteEditor({})} actionLabel="Create Note" />
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
              {[...filteredNotes].sort((a, b) => {
                if (a.pinned && !b.pinned) return -1;
                if (!a.pinned && b.pinned) return 1;
                return new Date(b.date) - new Date(a.date);
              }).map((n) => (
                <NoteCard key={n.id} note={n} onOpen={(note) => setNoteViewer(note)} onEdit={(note) => setNoteEditor(note)} onDelete={deleteNote} onPin={togglePin} onFavorite={toggleFavorite} onExport={(note, fmt) => handleItemExport(note, fmt, 'Note')} />
              ))}
            </div>
          )}
          {noteEditor && <NoteEditor note={noteEditor?.id ? noteEditor : null} onSave={saveNote} onClose={() => setNoteEditor(null)} />}
          {noteViewer && <NoteViewer note={noteViewer} onClose={() => setNoteViewer(null)} onEdit={(note) => { setNoteViewer(null); setTimeout(() => setNoteEditor(note), 100); }} />}
        </div>
      )}

      {/* ═══════════════════════════════════════
         TAB: BOOKMARKS
         ═══════════════════════════════════════ */}
      {activeTab === 'bookmarks' && (
        <div className="space-y-3 sm:space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs text-gray-500 font-medium">{filteredBookmarks.length} bookmark{filteredBookmarks.length !== 1 ? 's' : ''}</span>
            <div className="flex items-center gap-1">
              <button onClick={() => setBookmarkView('grid')} className={`p-1.5 rounded-lg transition-all ${bookmarkView === 'grid' ? 'text-brand-400 bg-gray-800' : 'text-gray-600 hover:text-gray-400'}`}><LayoutIcon c="w-3.5 h-3.5" /></button>
              <button onClick={() => setBookmarkView('list')} className={`p-1.5 rounded-lg transition-all ${bookmarkView === 'list' ? 'text-brand-400 bg-gray-800' : 'text-gray-600 hover:text-gray-400'}`}><ListIcon c="w-3.5 h-3.5" /></button>
            </div>
          </div>
          {filteredBookmarks.length === 0 ? (
            <EmptyState icon={StatBookmarkIcon} title="No bookmarks found" desc="Bookmark your favorite sessions to quickly access them later." />
          ) : (
            <div className={bookmarkView === 'grid' ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4' : 'space-y-3'}>
              {filteredBookmarks.map((b) => (
                <div key={b.id} className="group relative rounded-xl border border-gray-800/30 bg-gradient-to-br from-gray-900/60 to-gray-900/30 p-4 sm:p-5 transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5 hover:border-gray-700/40">
                  <div className="absolute inset-0 rounded-xl bg-gradient-to-b from-white/[0.02] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
                  <div className="relative flex items-start gap-3">
                    <div className="shrink-0 w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-amber-900/30 text-amber-400 ring-1 ring-white/[0.05] flex items-center justify-center">
                      <StatBookmarkIcon c="w-4 h-4 sm:w-5 sm:h-5 fill-amber-400" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-xs sm:text-sm font-bold text-gray-200 truncate">{b.title || 'Untitled'}</h3>
                      <div className="flex items-center gap-2 mt-0.5 text-[10px] text-gray-500">
                        <span>{b.source || 'Session'}</span>
                        <span className="w-1 h-1 rounded-full bg-gray-700" />
                        <span>{formatDate(b.date)}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-0.5 shrink-0 relative">
                      <ExportDropdown onExport={(fmt) => handleItemExport(b, fmt, 'Bookmark')} />
                      <button onClick={() => removeBookmark(b.id)} className="shrink-0 p-1.5 rounded-lg text-gray-600 hover:text-red-400 hover:bg-gray-800/60 transition-all" aria-label="Remove bookmark">
                        <CloseIcon c="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ═══════════════════════════════════════
         TAB: ACTIVITY TIMELINE
         ═══════════════════════════════════════ */}
      {activeTab === 'timeline' && (
        <div className="space-y-6 sm:space-y-8">
          <div className="flex items-center justify-between">
            <span className="text-xs text-gray-500 font-medium">{timeline.length} activit{timeline.length !== 1 ? 'ies' : 'y'}</span>
            {timeline.length > 0 && (
              <button onClick={() => { setData((prev) => ({ ...prev, activityLog: [] })); toast.info('Activity cleared'); }}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[10px] font-semibold text-gray-500 hover:text-red-400 hover:bg-gray-800/60 border border-gray-800/30 hover:border-red-800/30 transition-all">
                <TrashIcon c="w-3 h-3" /> Clear all
              </button>
            )}
          </div>
          {Object.keys(groupedTimeline).length === 0 ? (
            <EmptyState icon={ActivityIcon} title="No activity yet" desc="Your learning activity will appear here as you use VisualLearn." />
          ) : (
            Object.entries(groupedTimeline).map(([group, items]) => (
              <div key={group}>
                <div className="flex items-center gap-2 mb-4">
                  <span className="text-[10px] sm:text-xs font-bold text-gray-500 uppercase tracking-wider">{group}</span>
                  <div className="flex-1 h-px bg-gray-800" />
                </div>
                <div className="pl-0">
                  {items.slice(0, 10).map((item, i) => (
                    <TimelineItem key={i} {...item} />
                  ))}
                </div>
              </div>
            ))
          )}
        </div>
      )}

    </div>
  );
}
