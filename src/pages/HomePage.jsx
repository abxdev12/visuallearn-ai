import { useAccessibility } from '../contexts/AccessibilityContext';

/* ═══════════════════════════════════════════════
   PREMIUM CUSTOM SVG ICONS (all hand-crafted)
   ═══════════════════════════════════════════════ */

function SvgWrapper({ viewBox = "0 0 40 40", defs, children, className }) {
  return (
    <svg className={className} viewBox={viewBox} fill="none" aria-hidden="true">
      {defs && <defs>{defs}</defs>}
      {children}
    </svg>
  );
}
function Defs(children) { return <defs>{children}</defs>; }
function Glow(id, cx = "50%", cy = "50%", r = "50%") {
  return <radialGradient id={id} cx={cx} cy={cy} r={r}>
    <stop stopColor="currentColor" />
    <stop offset="1" stopColor="currentColor" stopOpacity="0" />
  </radialGradient>;
}

/* ── Quick Action Icons ── */
function EyeIcon({ className }) {
  return (
    <SvgWrapper className={className}>
      <circle cx="20" cy="18" r="14" fill="url(#e1)" opacity="0.2" />
      <path d="M4 18C4 18 10 6 20 6S36 18 36 18 30 30 20 30 4 18 4 18Z" stroke="currentColor" strokeWidth="2.2" fill="currentColor" fillOpacity="0.06" />
      <circle cx="20" cy="18" r="5" fill="currentColor" opacity="0.3" />
      <circle cx="20" cy="18" r="2.5" fill="currentColor" />
      <circle cx="17.5" cy="15.5" r="1.2" fill="white" opacity="0.5" />
      <path d="M28 10L30 8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" opacity="0.4" />
      <defs><radialGradient id="e1" cx="50%" cy="50%" r="50%"><stop stopColor="currentColor"/><stop offset="1" stopColor="currentColor" stopOpacity="0"/></radialGradient></defs>
    </SvgWrapper>
  );
}

function MicPremiumIcon({ className }) {
  return (
    <SvgWrapper className={className}>
      <path d="M8 20S10 14 14 14" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" opacity="0.25" />
      <path d="M32 20S30 14 26 14" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" opacity="0.25" />
      <path d="M6 20S8 10 14 10" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" opacity="0.14" />
      <path d="M34 20S32 10 26 10" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" opacity="0.14" />
      <path d="M20 8C17.2 8 15 10.2 15 13V19C15 21.8 17.2 24 20 24S25 21.8 25 19V13C25 10.2 22.8 8 20 8Z" stroke="currentColor" strokeWidth="2" fill="currentColor" fillOpacity="0.06" />
      <path d="M12 20C12 24.4 15.6 28 20 28S28 24.4 28 20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <path d="M20 28V34" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <path d="M15 34H25" stroke="currentColor" strokeWidth="2" strokeLinecap="round" opacity="0.6" />
      <circle cx="20" cy="34" r="1.5" fill="currentColor" opacity="0.4" />
    </SvgWrapper>
  );
}

function BookPremiumIcon({ className }) {
  return (
    <SvgWrapper className={className}>
      <rect x="8" y="6" width="24" height="28" rx="3" fill="url(#b1)" opacity="0.15" />
      <rect x="8" y="6" width="24" height="28" rx="3" stroke="currentColor" strokeWidth="2" fill="currentColor" fillOpacity="0.04" />
      <line x1="12" y1="14" x2="28" y2="14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" opacity="0.12" />
      <line x1="12" y1="18" x2="28" y2="18" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" opacity="0.12" />
      <line x1="12" y1="22" x2="24" y2="22" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" opacity="0.12" />
      <path d="M28 6V12L26 10.5L24 12V6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" opacity="0.5" />
      <path d="M16 6V12L14 10.5L12 12V6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" opacity="0.2" />
      <circle cx="20" cy="28" r="2" fill="currentColor" opacity="0.15" />
      <circle cx="20" cy="28" r="1" fill="currentColor" opacity="0.3" />
      <defs><radialGradient id="b1" cx="50%" cy="50%" r="50%"><stop stopColor="currentColor"/><stop offset="1" stopColor="currentColor" stopOpacity="0"/></radialGradient></defs>
    </SvgWrapper>
  );
}

/* ── Why Students Love Icons ── */
function BrainCrownIcon({ className }) {
  return (
    <SvgWrapper className={className}>
      <circle cx="20" cy="20" r="14" fill="url(#bcg)" opacity="0.2" />
      <path d="M20 8C16 8 13 11.5 13 15.5C13 17.2 13.7 18.7 14.8 19.8C12.8 20.5 11.5 22.3 11.5 24.5C11.5 27.5 14 30 17 30H23C26 30 28.5 27.5 28.5 24.5C28.5 22.3 27.2 20.5 25.2 19.8C26.3 18.7 27 17.2 27 15.5C27 11.5 24 8 20 8Z" stroke="currentColor" strokeWidth="1.8" fill="currentColor" fillOpacity="0.06" />
      <path d="M16 22L20 18L24 22" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" opacity="0.6" />
      <path d="M12 13C12 13 13.5 11 16 11" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" opacity="0.3" />
      <path d="M28 13C28 13 26.5 11 24 11" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" opacity="0.3" />
      <circle cx="20" cy="26" r="2.5" fill="currentColor" opacity="0.15" />
      <circle cx="20" cy="26" r="1" fill="currentColor" opacity="0.3" />
      <path d="M20 16V22" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" opacity="0.4" />
      <defs><radialGradient id="bcg" cx="50%" cy="50%" r="50%"><stop stopColor="currentColor"/><stop offset="1" stopColor="currentColor" stopOpacity="0"/></radialGradient></defs>
    </SvgWrapper>
  );
}

function BoltPremiumIcon({ className }) {
  return (
    <SvgWrapper className={className}>
      <circle cx="20" cy="20" r="14" fill="url(#blt)" opacity="0.2" />
      <path d="M15 5L7 18H15L13 24L23 14H16L17 5H15Z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" fill="currentColor" fillOpacity="0.06" />
      <path d="M18 19L20 16L17 20H19L17 23L20 19H18Z" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" opacity="0.4" />
      <defs><radialGradient id="blt" cx="50%" cy="50%" r="50%"><stop stopColor="currentColor"/><stop offset="1" stopColor="currentColor" stopOpacity="0"/></radialGradient></defs>
    </SvgWrapper>
  );
}

function TargetPremiumIcon({ className }) {
  return (
    <SvgWrapper className={className}>
      <circle cx="20" cy="20" r="14" fill="url(#t1)" opacity="0.2" />
      <circle cx="20" cy="20" r="11" stroke="currentColor" strokeWidth="1.6" fill="currentColor" fillOpacity="0.04" />
      <circle cx="20" cy="20" r="7" stroke="currentColor" strokeWidth="1.4" opacity="0.4" />
      <circle cx="20" cy="20" r="3.5" fill="currentColor" opacity="0.25" />
      <circle cx="20" cy="20" r="1.5" fill="currentColor" />
      <path d="M28 12L31 9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" opacity="0.3" />
      <path d="M12 28L9 31" stroke="currentColor" strokeWidth="2" strokeLinecap="round" opacity="0.3" />
      <defs><radialGradient id="t1" cx="50%" cy="50%" r="50%"><stop stopColor="currentColor"/><stop offset="1" stopColor="currentColor" stopOpacity="0"/></radialGradient></defs>
    </SvgWrapper>
  );
}

function SpeakerPremiumIcon({ className }) {
  return (
    <SvgWrapper className={className}>
      <circle cx="20" cy="20" r="14" fill="url(#sp1)" opacity="0.2" />
      <path d="M10 15H13L18 10V30L13 25H10C8.9 25 8 24.1 8 23V17C8 15.9 8.9 15 10 15Z" stroke="currentColor" strokeWidth="1.8" fill="currentColor" fillOpacity="0.06" />
      <path d="M22 14C22 14 25 16.5 25 20S22 26 22 26" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" opacity="0.5" />
      <path d="M25 10C25 10 29 14 29 20S25 30 25 30" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" opacity="0.25" />
      <defs><radialGradient id="sp1" cx="50%" cy="50%" r="50%"><stop stopColor="currentColor"/><stop offset="1" stopColor="currentColor" stopOpacity="0"/></radialGradient></defs>
    </SvgWrapper>
  );
}

function MemoryPremiumIcon({ className }) {
  return (
    <SvgWrapper className={className}>
      <circle cx="20" cy="20" r="14" fill="url(#m1)" opacity="0.2" />
      <rect x="12" y="8" width="16" height="22" rx="2.5" stroke="currentColor" strokeWidth="1.6" fill="currentColor" fillOpacity="0.04" />
      <line x1="15" y1="14" x2="25" y2="14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" opacity="0.15" />
      <line x1="15" y1="18" x2="25" y2="18" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" opacity="0.3" />
      <line x1="15" y1="22" x2="22" y2="22" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" opacity="0.15" />
      <path d="M27 8L27 14L25.5 12.5L24 14L24 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" opacity="0.4" />
      <circle cx="20" cy="26" r="1.8" fill="currentColor" opacity="0.2" />
      <defs><radialGradient id="m1" cx="50%" cy="50%" r="50%"><stop stopColor="currentColor"/><stop offset="1" stopColor="currentColor" stopOpacity="0"/></radialGradient></defs>
    </SvgWrapper>
  );
}

function GlobePremiumIcon({ className }) {
  return (
    <SvgWrapper className={className}>
      <circle cx="20" cy="20" r="14" fill="url(#g1)" opacity="0.2" />
      <circle cx="20" cy="20" r="10" stroke="currentColor" strokeWidth="1.6" fill="currentColor" fillOpacity="0.04" />
      <ellipse cx="20" cy="20" rx="4.5" ry="10" stroke="currentColor" strokeWidth="1.3" opacity="0.35" />
      <line x1="10" y1="20" x2="30" y2="20" stroke="currentColor" strokeWidth="1.3" opacity="0.35" />
      <circle cx="20" cy="12" r="1.2" fill="currentColor" opacity="0.3" />
      <circle cx="20" cy="28" r="1.2" fill="currentColor" opacity="0.3" />
      <circle cx="12" cy="15" r="1" fill="currentColor" opacity="0.2" />
      <circle cx="28" cy="25" r="1" fill="currentColor" opacity="0.2" />
      <defs><radialGradient id="g1" cx="50%" cy="50%" r="50%"><stop stopColor="currentColor"/><stop offset="1" stopColor="currentColor" stopOpacity="0"/></radialGradient></defs>
    </SvgWrapper>
  );
}

/* ── How It Works Icons ── */
function UploadPremiumIcon({ className }) {
  return (
    <SvgWrapper className={className}>
      <circle cx="20" cy="20" r="14" fill="url(#up1)" opacity="0.2" />
      <path d="M20 8V24" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <path d="M14 14L20 8L26 14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <rect x="12" y="24" width="16" height="2" rx="1" fill="currentColor" opacity="0.3" />
      <rect x="12" y="28" width="16" height="2" rx="1" fill="currentColor" opacity="0.15" />
      <defs><radialGradient id="up1" cx="50%" cy="50%" r="50%"><stop stopColor="currentColor"/><stop offset="1" stopColor="currentColor" stopOpacity="0"/></radialGradient></defs>
    </SvgWrapper>
  );
}

function SparklePremiumIcon({ className }) {
  return (
    <SvgWrapper className={className}>
      <circle cx="20" cy="20" r="14" fill="url(#sk1)" opacity="0.2" />
      <path d="M20 6L22 14L30 16L22 18L20 26L18 18L10 16L18 14L20 6Z" fill="currentColor" opacity="0.9" />
      <circle cx="20" cy="16" r="3" fill="white" opacity="0.35" />
      <path d="M28 28L30 30" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" opacity="0.3" />
      <path d="M10 10L12 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" opacity="0.3" />
      <defs><radialGradient id="sk1" cx="50%" cy="50%" r="50%"><stop stopColor="currentColor"/><stop offset="1" stopColor="currentColor" stopOpacity="0"/></radialGradient></defs>
    </SvgWrapper>
  );
}

function GraduationPremiumIcon({ className }) {
  return (
    <SvgWrapper className={className}>
      <circle cx="20" cy="20" r="14" fill="url(#gr1)" opacity="0.2" />
      <path d="M20 10L8 16L20 22L32 16L20 10Z" stroke="currentColor" strokeWidth="1.6" fill="currentColor" fillOpacity="0.06" />
      <path d="M8 16V22" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
      <path d="M32 16V22" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
      <path d="M14 19V24.5C14 26 16.7 27 20 27S26 26 26 24.5V19" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
      <defs><radialGradient id="gr1" cx="50%" cy="50%" r="50%"><stop stopColor="currentColor"/><stop offset="1" stopColor="currentColor" stopOpacity="0"/></radialGradient></defs>
    </SvgWrapper>
  );
}

/* ── Feature Highlight Icons ── */
function SearchIcon({ className }) {
  return (
    <SvgWrapper className={className}>
      <circle cx="18" cy="18" r="7" stroke="currentColor" strokeWidth="2" fill="currentColor" fillOpacity="0.06" />
      <path d="M23 23L29 29" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" opacity="0.5" />
      <circle cx="16" cy="16" r="1.5" fill="currentColor" opacity="0.2" />
    </SvgWrapper>
  );
}

function DocPremiumIcon({ className }) {
  return (
    <SvgWrapper className={className}>
      <path d="M12 6H22L28 12V32C28 33.1 27.1 34 26 34H12C10.9 34 10 33.1 10 32V8C10 6.9 10.9 6 12 6Z" stroke="currentColor" strokeWidth="1.6" fill="currentColor" fillOpacity="0.04" />
      <path d="M22 6V12H28" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
      <line x1="14" y1="16" x2="26" y2="16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" opacity="0.15" />
      <line x1="14" y1="20" x2="26" y2="20" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" opacity="0.3" />
      <line x1="14" y1="24" x2="22" y2="24" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" opacity="0.15" />
    </SvgWrapper>
  );
}

function MicSmallIcon({ className }) {
  return (
    <SvgWrapper className={className}>
      <path d="M20 8C17.8 8 16 9.8 16 12V16C16 18.2 17.8 20 20 20S24 18.2 24 16V12C24 9.8 22.2 8 20 8Z" stroke="currentColor" strokeWidth="1.8" fill="currentColor" fillOpacity="0.06" />
      <path d="M14 16C14 19.3 16.7 22 20 22S26 19.3 26 16" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
      <path d="M20 22V28" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" opacity="0.5" />
    </SvgWrapper>
  );
}

function ChatPremiumIcon({ className }) {
  return (
    <SvgWrapper className={className}>
      <path d="M8 8C8 6.9 8.9 6 10 6H30C31.1 6 32 6.9 32 8V22C32 23.1 31.1 24 30 24H16L10 30V24H8C6.9 24 6 23.1 6 22V8Z" stroke="currentColor" strokeWidth="1.6" fill="currentColor" fillOpacity="0.04" />
      <line x1="13" y1="12" x2="27" y2="12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" opacity="0.25" />
      <line x1="13" y1="16" x2="23" y2="16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" opacity="0.4" />
      <line x1="13" y1="20" x2="18" y2="20" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" opacity="0.2" />
    </SvgWrapper>
  );
}

function CheckPremiumIcon({ className }) {
  return (
    <SvgWrapper className={className}>
      <rect x="9" y="7" width="22" height="26" rx="3" stroke="currentColor" strokeWidth="1.6" fill="currentColor" fillOpacity="0.04" />
      <path d="M14 20L18 24L26 14" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" opacity="0.7" />
      <line x1="13" y1="11" x2="27" y2="11" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" opacity="0.12" />
    </SvgWrapper>
  );
}

function CardsPremiumIcon({ className }) {
  return (
    <SvgWrapper className={className}>
      <rect x="6" y="10" width="18" height="22" rx="2.5" stroke="currentColor" strokeWidth="1.6" fill="currentColor" fillOpacity="0.04" />
      <rect x="14" y="8" width="18" height="22" rx="2.5" stroke="currentColor" strokeWidth="1.6" fill="currentColor" fillOpacity="0.04" opacity="0.6" />
      <line x1="10" y1="16" x2="20" y2="16" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" opacity="0.2" />
      <line x1="18" y1="14" x2="28" y2="14" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" opacity="0.15" />
    </SvgWrapper>
  );
}

/* ── Welcome card icon ── */
function WelcomeStarIcon({ className }) {
  return (
    <SvgWrapper className={className}>
      <circle cx="20" cy="20" r="14" fill="url(#wsg)" opacity="0.25" />
      {/* Star burst */}
      <path d="M20 6L22 13L29 15L22 17L20 24L18 17L11 15L18 13L20 6Z" fill="currentColor" opacity="0.95" />
      <circle cx="20" cy="15" r="2.8" fill="white" opacity="0.4" />
      {/* Sparkle dots */}
      <circle cx="13" cy="10" r="1" fill="currentColor" opacity="0.3" />
      <circle cx="27" cy="10" r="1" fill="currentColor" opacity="0.3" />
      <circle cx="13" cy="20" r="0.8" fill="currentColor" opacity="0.2" />
      <circle cx="27" cy="20" r="0.8" fill="currentColor" opacity="0.2" />
      <circle cx="20" cy="28" r="1" fill="currentColor" opacity="0.3" />
      <defs><radialGradient id="wsg" cx="50%" cy="50%" r="50%"><stop stopColor="currentColor"/><stop offset="1" stopColor="currentColor" stopOpacity="0"/></radialGradient></defs>
    </SvgWrapper>
  );
}

/* ── Hero Float Icons ── */
function BrainFloatIcon({ className }) {
  return <BrainCrownIcon className={className} />;
}
function ZapFloatIcon({ className }) {
  return (
    <SvgWrapper className={className}>
      <path d="M14 4L8 16H14L13 22L22 12H16L17 4H14Z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" fill="currentColor" fillOpacity="0.06" />
    </SvgWrapper>
  );
}
function ImageFloatIcon({ className }) {
  return (
    <SvgWrapper className={className}>
      <rect x="5" y="6" width="18" height="16" rx="2.5" stroke="currentColor" strokeWidth="1.6" fill="currentColor" fillOpacity="0.04" />
      <path d="M5 16L9 12L13 15L17 11L23 17" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" opacity="0.5" />
      <circle cx="10.5" cy="10" r="1.5" stroke="currentColor" strokeWidth="1.5" opacity="0.5" />
    </SvgWrapper>
  );
}

/* ───── Floating icon wrapper ───── */
function FloatIcon({ children, x, y, delay = 0, duration = 6 }) {
  return (
    <div className="absolute pointer-events-none text-white"
      style={{ left: `${x}%`, top: `${y}%`, animation: `float ${duration}s ease-in-out ${delay}s infinite`, opacity: 0.1 }}
      aria-hidden="true">{children}</div>
  );
}

/* ───── Accent helper ───── */
const ACCENTS = {
  brand:  { from: 'from-brand-900/30', to: 'to-brand-800/5',  border: 'border-brand-800/20', dot: 'bg-brand-500', icon: 'text-brand-400 group-hover:text-brand-300' },
  amber:  { from: 'from-amber-900/30', to: 'to-amber-800/5',  border: 'border-amber-800/20', dot: 'bg-amber-500', icon: 'text-amber-400 group-hover:text-amber-300' },
  emerald:{ from: 'from-emerald-900/30', to: 'to-emerald-800/5', border: 'border-emerald-800/20', dot: 'bg-emerald-500', icon: 'text-emerald-400 group-hover:text-emerald-300' },
  sky:    { from: 'from-sky-900/30', to: 'to-sky-800/5',    border: 'border-sky-800/20', dot: 'bg-sky-500', icon: 'text-sky-400 group-hover:text-sky-300' },
  violet: { from: 'from-violet-900/30', to: 'to-violet-800/5', border: 'border-violet-800/20', dot: 'bg-violet-500', icon: 'text-violet-400 group-hover:text-violet-300' },
  rose:   { from: 'from-rose-900/30', to: 'to-rose-800/5',  border: 'border-rose-800/20', dot: 'bg-rose-500', icon: 'text-rose-400 group-hover:text-rose-300' },
};

export default function HomePage({ onNavigate }) {
  const { settings } = useAccessibility();
  const activeCount = Object.values(settings).filter(Boolean).length;

  return (
    <div className="max-w-screen-2xl mx-auto px-3 sm:px-5 md:px-8 py-4 sm:py-6 pb-8 space-y-7 sm:space-y-10 animate-in">

      {/* ═══════════════════════════════════════
         HERO (Quick Action card style)
         ═══════════════════════════════════════ */}
      <section className="group relative overflow-hidden rounded-2xl sm:rounded-3xl bg-gradient-to-br from-brand-700 via-brand-600 to-violet-800 border border-brand-400/20 p-6 sm:p-8 md:p-12 lg:p-14 transition-all duration-300 hover:shadow-2xl hover:shadow-brand-500/15 hover:-translate-y-1 cursor-default">
        {/* Glass highlight overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-white/[0.03] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        {/* Decor orbs */}
        <div className="absolute -top-10 -right-10 w-36 h-36 rounded-full bg-white/[0.04] group-hover:bg-white/[0.06] blur-2xl transition-all duration-500" />
        <div className="absolute -bottom-8 -left-8 w-28 h-28 rounded-full bg-white/[0.03] group-hover:bg-white/[0.05] blur-2xl transition-all duration-500" />
        <div className="absolute inset-0 opacity-[0.06]" style={{backgroundImage:'url("data:image/svg+xml,%3Csvg width=\'28\' height=\'28\' viewBox=\'0 0 28 28\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Ccircle cx=\'14\' cy=\'14\' r=\'1.2\' fill=\'white\'/%3E%3C/svg%3E")'}} />
        {/* Neural lines */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-[0.06]" viewBox="0 0 800 400" preserveAspectRatio="none" aria-hidden="true">
          <path d="M100,50 C200,100 300,20 400,80 C500,140 600,60 700,120" stroke="white" strokeWidth="1" fill="none" className="[animation:neural-pulse_4s_ease-in-out_infinite]" />
          <path d="M50,150 C150,200 250,130 350,190 C450,250 550,170 650,230" stroke="white" strokeWidth="0.8" fill="none" className="[animation:neural-pulse_6s_ease-in-out_infinite_1s]" />
          <path d="M80,250 C180,300 280,220 380,280 C480,340 580,260 680,320" stroke="white" strokeWidth="0.6" fill="none" className="[animation:neural-pulse_5s_ease-in-out_infinite_0.5s]" />
        </svg>
        {/* Floating icons */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <FloatIcon x={4} y={8} delay={0} duration={7}><BrainFloatIcon className="w-6 h-6" /></FloatIcon>
          <FloatIcon x={88} y={5} delay={1.5} duration={8}><BookPremiumIcon className="w-6 h-6" /></FloatIcon>
          <FloatIcon x={6} y={72} delay={2.5} duration={6}><ImageFloatIcon className="w-6 h-6" /></FloatIcon>
          <FloatIcon x={86} y={68} delay={0.8} duration={7.5}><MicPremiumIcon className="w-6 h-6" /></FloatIcon>
          <FloatIcon x={93} y={38} delay={1.2} duration={5.5}><ZapFloatIcon className="w-5 h-5" /></FloatIcon>
          <FloatIcon x={2} y={44} delay={3.2} duration={9}><GlobePremiumIcon className="w-5 h-5" /></FloatIcon>
        </div>
        {/* Large glow orbs */}
        <div className="absolute -top-24 -left-24 w-60 h-60 rounded-full bg-brand-400/15 blur-[100px] animate-[pulse_6s_ease-in-out_infinite]" />
        <div className="absolute -bottom-20 -right-20 w-52 h-52 rounded-full bg-violet-400/10 blur-[90px] animate-[pulse_8s_ease-in-out_infinite_1s]" />
        <div className="relative">
          <div className="flex flex-col gap-1 mb-5 sm:mb-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-white/15 ring-1 ring-white/25 flex items-center justify-center text-brand-200 group-hover:scale-105 group-hover:bg-white/20 transition-all duration-200">
                <WelcomeStarIcon className="w-5 h-5 sm:w-5.5 sm:h-5.5" />
              </div>
              <h1 className="text-lg sm:text-2xl md:text-3xl lg:text-4xl font-extrabold text-white tracking-tight leading-tight">Welcome back to<br className="hidden sm:hidden" /> VisualLearn AI</h1>
            </div>
            <p className="text-xs sm:text-sm md:text-base text-white/70 max-w-2xl leading-relaxed ml-0 sm:ml-14">Transform images, textbooks, diagrams, lectures, and audio into personalized learning with AI.</p>
          </div>
          <div className="flex flex-wrap gap-2.5 sm:gap-4">
            <button onClick={() => onNavigate('visual')}
              className="group/btn relative flex items-center gap-2 sm:gap-2.5 px-4 sm:px-6 md:px-7 py-2.5 sm:py-3 md:py-3.5 rounded-xl sm:rounded-2xl bg-white hover:bg-white/90 text-brand-700 text-xs sm:text-sm md:text-base font-bold transition-all duration-200 shadow-2xl shadow-black/20 hover:shadow-xl hover:-translate-y-0.5 focus-visible:outline-2 focus-visible:outline-white overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-brand-500/10 to-violet-500/10 opacity-0 group-hover/btn:opacity-100 transition-opacity" />
              <EyeIcon className="w-4 h-4 sm:w-5 sm:h-5 relative" />
              <span className="relative">Start with Vision Tutor</span>
            </button>
            <button onClick={() => onNavigate('audio')}
              className="group/btn relative flex items-center gap-2 sm:gap-2.5 px-4 sm:px-6 md:px-7 py-2.5 sm:py-3 md:py-3.5 rounded-xl sm:rounded-2xl bg-white/15 hover:bg-white/25 text-white text-xs sm:text-sm md:text-base font-bold backdrop-blur-sm transition-all duration-200 ring-1 ring-white/20 hover:ring-white/30 hover:-translate-y-0.5 focus-visible:outline-2 focus-visible:outline-white overflow-hidden">
              <div className="absolute inset-0 bg-white/5 opacity-0 group-hover/btn:opacity-100 transition-opacity" />
              <MicPremiumIcon className="w-4 h-4 sm:w-5 sm:h-5 relative" />
              <span className="relative">Start with Voice Tutor</span>
            </button>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════
         QUICK ACTIONS
         ═══════════════════════════════════════ */}
      <section>
        <div className="flex items-center gap-3 mb-4 sm:mb-5 md:mb-6">
          <div className="w-1.5 h-6 sm:h-7 rounded-full bg-gradient-to-b from-brand-400 to-violet-500" />
          <div className="flex-1">
            <h2 className="text-sm sm:text-base md:text-lg font-extrabold text-gray-200 uppercase tracking-[0.12em]">Quick Actions</h2>
            <p className="text-[10px] sm:text-xs text-gray-600 mt-0.5">Jump into your learning tools</p>
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 md:gap-5">
          {[{ id:'visual', label:'Vision Tutor', desc:'Upload diagrams, textbook pages, notes, charts, and images for instant AI explanations.',
             accent:'from-blue-600/20 to-violet-600/10', border:'border-blue-800/25 hover:border-blue-600/35',
             shadow:'hover:shadow-blue-500/10', color:'text-blue-400 group-hover:text-blue-300', Icon:EyeIcon },
           { id:'audio', label:'Voice Tutor', desc:'Upload audio files or speak directly to generate transcripts, summaries, and learning insights.',
             accent:'from-emerald-600/20 to-teal-600/10', border:'border-emerald-800/25 hover:border-emerald-600/35',
             shadow:'hover:shadow-emerald-500/10', color:'text-emerald-400 group-hover:text-emerald-300', Icon:MicPremiumIcon },
           { id:'study', label:'Study Hub', desc:'Review previous sessions, notes, and AI-generated study materials.',
             accent:'from-amber-600/20 to-orange-600/10', border:'border-amber-800/25 hover:border-amber-600/35',
             shadow:'hover:shadow-amber-500/10', color:'text-amber-400 group-hover:text-amber-300', Icon:BookPremiumIcon },
          ].map((c) => (
            <button key={c.id} onClick={() => onNavigate(c.id)}
              className={`group relative rounded-xl sm:rounded-2xl border bg-gradient-to-br ${c.accent} ${c.border} p-5 sm:p-6 md:p-7 text-left transition-all duration-300 ${c.shadow} hover:shadow-2xl hover:-translate-y-1 focus-visible:outline-2 focus-visible:outline-brand-400 overflow-hidden`}>
              <div className="absolute inset-0 bg-gradient-to-b from-white/[0.02] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <div className="absolute -top-10 -right-10 w-32 h-32 rounded-full bg-white/[0.03] group-hover:bg-white/[0.05] blur-2xl transition-all duration-500" />
              <div className="absolute -bottom-8 -left-8 w-24 h-24 rounded-full bg-white/[0.02] group-hover:bg-white/[0.04] blur-2xl transition-all duration-500" />
              <div className="relative">
                <div className={`w-14 h-14 sm:w-16 sm:h-16 mb-4 sm:mb-5 rounded-2xl bg-gray-900/60 ring-1 ring-white/[0.06] flex items-center justify-center ${c.color} group-hover:scale-105 group-hover:ring-white/[0.12] transition-all duration-300`}>
                  <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-white/[0.06] to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  <c.Icon className="w-7 h-7 sm:w-8 sm:h-8 relative" />
                </div>
                <h3 className="text-sm sm:text-base md:text-lg font-bold text-gray-100 mb-1.5 group-hover:text-white transition-colors">{c.label}</h3>
                <p className="text-xs sm:text-sm text-gray-500 group-hover:text-gray-400 leading-relaxed mb-4 sm:mb-5 transition-colors">{c.desc}</p>
                <div className="flex items-center gap-1.5 sm:gap-2 pt-3 sm:pt-4 border-t border-white/[0.05] group-hover:border-white/[0.1] transition-colors">
                  <span className={`text-xs sm:text-sm font-bold ${c.color} transition-colors`}>Open {c.label}</span>
                  <svg className={`w-4 h-4 sm:w-5 sm:h-5 ${c.color} group-hover:translate-x-1 transition-all`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M9 5l7 7-7 7" /></svg>
                </div>
              </div>
            </button>
          ))}
        </div>
      </section>

      {/* ═══════════════════════════════════════
         WHY STUDENTS LOVE  (custom icons + hover)
         ═══════════════════════════════════════ */}
      <section>
        <div className="flex items-center gap-3 mb-4 sm:mb-5 md:mb-6">
          <div className="w-1.5 h-6 sm:h-7 rounded-full bg-gradient-to-b from-amber-400 to-orange-500" />
          <div className="flex-1">
            <h2 className="text-sm sm:text-base md:text-lg font-extrabold text-gray-200 uppercase tracking-[0.12em]">Why Students Love VisualLearn AI</h2>
            <p className="text-[10px] sm:text-xs text-gray-600 mt-0.5">Built by learners, for learners</p>
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4">
          {[
            { accent:'brand',  title:'Simplify Complex Topics', desc:'Turn difficult content into easy-to-understand explanations.', Icon:BrainCrownIcon },
            { accent:'amber',  title:'Learn Faster', desc:'Get instant summaries, key concepts, and study guides in seconds.', Icon:BoltPremiumIcon },
            { accent:'emerald',title:'Personalized Learning', desc:'AI adapts explanations to your level and learning style.', Icon:TargetPremiumIcon },
            { accent:'sky',    title:'Listen & Learn', desc:'Convert educational content into spoken lessons with TTS.', Icon:SpeakerPremiumIcon },
            { accent:'violet', title:'Better Retention', desc:'Generate revision notes and summaries automatically.', Icon:MemoryPremiumIcon },
            { accent:'rose',   title:'Learn Anywhere', desc:'Works with images, documents, screenshots, and audio.', Icon:GlobePremiumIcon },
          ].map((item, i) => {
            const a = ACCENTS[item.accent];
            return (
              <div key={i} className={`group relative overflow-hidden rounded-xl sm:rounded-2xl bg-gradient-to-br ${a.from} ${a.to} border ${a.border} p-4 sm:p-5 md:p-6 transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5`}>
                <div className="absolute inset-0 bg-gradient-to-b from-white/[0.02] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="absolute top-0 right-0 w-28 h-28 rounded-full bg-white/[0.02] blur-xl" />
                <div className={`absolute top-3 right-3 w-1.5 h-1.5 rounded-full ${a.dot} opacity-30 group-hover:opacity-60 transition-opacity`} />
                <div className="relative">
                  <div className={`w-10 h-10 sm:w-11 sm:h-11 mb-2.5 sm:mb-3 rounded-xl bg-gray-900/60 ring-1 ring-white/[0.05] flex items-center justify-center ${a.icon} transition-colors group-hover:scale-105 group-hover:ring-white/[0.1] transition-all duration-200`}>
                    <item.Icon className="w-5 h-5 sm:w-5.5 sm:h-5.5" />
                  </div>
                  <h3 className="text-xs sm:text-sm font-bold text-gray-200 mb-1 group-hover:text-white transition-colors">{item.title}</h3>
                  <p className="text-[11px] sm:text-xs text-gray-500 group-hover:text-gray-400 leading-relaxed transition-colors">{item.desc}</p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* ═══════════════════════════════════════
         HOW IT WORKS  (custom icons + hover)
         ═══════════════════════════════════════ */}
      <section>
        <div className="flex items-center gap-3 mb-4 sm:mb-5 md:mb-6">
          <div className="w-1.5 h-6 sm:h-7 rounded-full bg-gradient-to-b from-brand-400 to-violet-500" />
          <div className="flex-1">
            <h2 className="text-sm sm:text-base md:text-lg font-extrabold text-gray-200 uppercase tracking-[0.12em]">How It Works</h2>
            <p className="text-[10px] sm:text-xs text-gray-600 mt-0.5">Three simple steps to start learning</p>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-5">
          {[
            { step:'01', accent:'brand',  title:'Upload Content', Icon:UploadPremiumIcon,
              items:['Textbook pages','Diagrams','Screenshots','Lecture audio','Voice recordings'] },
            { step:'02', accent:'violet', title:'AI Analysis', Icon:SparklePremiumIcon,
              desc:'VisualLearn AI analyzes your content and extracts:',
              items:['Main ideas','Key concepts','Important relationships','Learning insights'] },
            { step:'03', accent:'brand',  title:'Learn Smarter', Icon:GraduationPremiumIcon,
              desc:'Receive:',
              items:['Simple explanations','Visual breakdowns','Key concepts','AI tutoring'] },
          ].map((step, i) => {
            const a = ACCENTS[step.accent === 'brand' ? 'brand' : 'violet'];
            return (
              <div key={i} className={`group relative overflow-hidden rounded-xl sm:rounded-2xl bg-gradient-to-br ${a.from} ${a.to} border ${a.border} p-4 sm:p-5 md:p-6 transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5`}>
                <div className="absolute inset-0 bg-gradient-to-b from-white/[0.02] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="absolute top-0 right-0 w-28 h-28 rounded-full bg-white/[0.02] blur-2xl" />
                <div className="relative">
                  <div className="flex items-center gap-2 sm:gap-2.5 mb-3 sm:mb-4">
                    <span className={`inline-flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-gray-900/60 ring-1 ring-white/[0.05] ${a.icon} text-xs sm:text-sm font-mono font-bold group-hover:scale-105 group-hover:ring-white/[0.1] transition-all duration-200`}>{step.step}</span>
                    <div className={`w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gray-900/60 ring-1 ring-white/[0.05] flex items-center justify-center ${a.icon} group-hover:scale-105 group-hover:ring-white/[0.1] transition-all duration-200`}>
                      <step.Icon className="w-5 h-5 sm:w-5.5 sm:h-5.5" />
                    </div>
                  </div>
                  <h3 className="text-sm sm:text-base font-bold text-gray-200 mb-1.5 group-hover:text-white transition-colors">{step.title}</h3>
                  {step.desc && <p className="text-[11px] sm:text-xs text-gray-500 group-hover:text-gray-400 mb-2 sm:mb-3 leading-relaxed transition-colors">{step.desc}</p>}
                  <ul className="space-y-1 sm:space-y-1.5">
                    {step.items.map((item, j) => (
                      <li key={j} className="flex items-center gap-1.5 sm:gap-2 text-[11px] sm:text-xs text-gray-400 group-hover:text-gray-300 transition-colors">
                        <svg className="w-3 h-3 sm:w-3.5 sm:h-3.5 shrink-0 text-brand-500/60" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* ═══════════════════════════════════════
         FEATURE HIGHLIGHTS  (custom icons + hover)
         ═══════════════════════════════════════ */}
      <section>
        <div className="flex items-center gap-3 mb-4 sm:mb-5 md:mb-6">
          <div className="w-1.5 h-6 sm:h-7 rounded-full bg-gradient-to-b from-emerald-400 to-green-500" />
          <div className="flex-1">
            <h2 className="text-sm sm:text-base md:text-lg font-extrabold text-gray-200 uppercase tracking-[0.12em]">Feature Highlights</h2>
            <p className="text-[10px] sm:text-xs text-gray-600 mt-0.5">Everything you need to learn smarter</p>
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4">
          {[
            { title:'AI Diagram Interpreter', desc:'Understand complex diagrams instantly.', Icon:SearchIcon },
            { title:'Smart Summaries', desc:'Grade-level explanations anyone can understand.', Icon:DocPremiumIcon },
            { title:'Voice Learning Assistant', desc:'Ask questions using your microphone.', Icon:MicSmallIcon },
            { title:'Interactive AI Tutor', desc:'Get personalized answers in real time.', Icon:ChatPremiumIcon },
            { title:'Knowledge Check', desc:'Reinforce your understanding with smart reviews.', Icon:CheckPremiumIcon },
            { title:'Study Notes', desc:'Auto-generated revision notes for efficient review.', Icon:CardsPremiumIcon },
          ].map((item, i) => (
            <div key={i} className="group flex items-center gap-3 sm:gap-4 p-3 sm:p-4 rounded-xl sm:rounded-2xl bg-gray-900/50 border border-gray-800/30 transition-all duration-300 hover:bg-gray-900/70 hover:border-gray-700/40 hover:shadow-lg hover:-translate-y-0.5">
              <div className="shrink-0 w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-gray-800/70 ring-1 ring-white/[0.05] flex items-center justify-center text-brand-400 group-hover:text-brand-300 group-hover:scale-105 group-hover:ring-white/[0.1] transition-all duration-200">
                <item.Icon className="w-5 h-5 sm:w-5.5 sm:h-5.5" />
              </div>
              <div>
                <h3 className="text-xs sm:text-sm font-bold text-gray-200 group-hover:text-white transition-colors">{item.title}</h3>
                <p className="text-[11px] sm:text-xs text-gray-500 group-hover:text-gray-400 mt-0.5 leading-relaxed transition-colors">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ─── Accessibility badges ─── */}
      {activeCount > 0 && (
        <div className="flex flex-wrap items-center gap-1.5">
          {['dyslexiaMode','highContrast','readingFocus'].filter((k) => settings[k]).map((k) => (
            <span key={k} className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-brand-900/20 text-[9px] font-semibold text-brand-300 border border-brand-800/25">
              {k === 'dyslexiaMode' ? '📖' : k === 'highContrast' ? '🌓' : '🎯'}
              <span>{k === 'dyslexiaMode' ? 'Dyslexia' : k === 'highContrast' ? 'Contrast' : 'Focus'}</span>
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
