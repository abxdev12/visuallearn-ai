import { createContext, useContext, useState, useEffect, useCallback, useMemo, useRef } from 'react';

const STORAGE_KEY = 'visuallearn_accessibility';

const DEFAULTS = {
  dyslexiaMode: false,
  fontSize: 'medium',
  highContrast: false,
  readingFocus: false,
};

function loadSettings() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      return { ...DEFAULTS, ...parsed };
    }
  } catch {}
  return { ...DEFAULTS };
}

const AccessibilityContext = createContext(null);
const KeyboardContext = createContext(null);

export function AccessibilityProvider({ children }) {
  const [settings, setSettings] = useState(loadSettings);

  useEffect(() => {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(settings)); } catch {}
  }, [settings]);

  useEffect(() => {
    document.documentElement.classList.toggle('dyslexia-mode', settings.dyslexiaMode);
    document.documentElement.classList.toggle('high-contrast', settings.highContrast);
    document.documentElement.classList.toggle('reading-focus', settings.readingFocus);
    const sizeMap = { small: '14px', medium: '16px', large: '18px', xlarge: '20px' };
    document.documentElement.style.fontSize = sizeMap[settings.fontSize] || '16px';
  }, [settings]);

  const updateSetting = useCallback((key, value) => setSettings((prev) => ({ ...prev, [key]: value })), []);
  const toggleSetting = useCallback((key) => setSettings((prev) => ({ ...prev, [key]: !prev[key] })), []);
  const resetSettings = useCallback(() => setSettings({ ...DEFAULTS }), []);

  const value = useMemo(() => ({ settings, updateSetting, toggleSetting, resetSettings }), [settings, updateSetting, toggleSetting, resetSettings]);

  return (
    <AccessibilityContext.Provider value={value}>
      {children}
    </AccessibilityContext.Provider>
  );
}

export function useAccessibility() {
  const ctx = useContext(AccessibilityContext);
  if (!ctx) throw new Error('useAccessibility must be used within AccessibilityProvider');
  return ctx;
}

/* ─── Keyboard Shortcuts ─── */
const SHORTCUTS = [
  { key: 'd', label: 'Toggle Dyslexia Mode', action: 'toggleDyslexia' },
  { key: 'f', label: 'Toggle Reading Focus', action: 'toggleReadingFocus' },
  { key: 'h', label: 'Toggle High Contrast', action: 'toggleHighContrast' },
  { key: 'Escape', label: 'Close Modal / Panel', action: 'close' },
];

export function KeyboardProvider({ children, onClose }) {
  const { toggleSetting } = useAccessibility();
  const closeRef = useRef(onClose);
  closeRef.current = onClose;

  useEffect(() => {
    function handler(e) {
      const tag = e.target?.tagName;
      if ((tag === 'INPUT' || tag === 'TEXTAREA' || e.target?.isContentEditable) && e.key !== 'Escape') return;
      const s = SHORTCUTS.find((s) => s.key === e.key && !e.ctrlKey && !e.metaKey && !e.altKey);
      if (!s) return;
      e.preventDefault();
      switch (s.action) {
        case 'toggleDyslexia': toggleSetting('dyslexiaMode'); break;
        case 'toggleReadingFocus': toggleSetting('readingFocus'); break;
        case 'toggleHighContrast': toggleSetting('highContrast'); break;
        case 'close': closeRef.current?.(); break;
      }
    }
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [toggleSetting]);

  return <KeyboardContext.Provider value={SHORTCUTS}>{children}</KeyboardContext.Provider>;
}

export function useKeyboardShortcuts() {
  return useContext(KeyboardContext) || [];
}
