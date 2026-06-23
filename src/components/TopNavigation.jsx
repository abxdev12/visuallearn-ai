const LEFT_TABS = [
  { id: 'home', label: 'Home' },
  { id: 'visual', label: 'Vision Tutor' },
  { id: 'audio', label: 'Voice Tutor' },
  { id: 'study', label: 'Study Hub' },
];

export default function TopNavigation({ activeTab, onTabChange, onOpenSettings }) {
  return (
    <header className="sticky top-0 z-40 w-full glass border-b border-gray-700/30" role="banner">
      <div className="flex items-center justify-between px-3 md:px-6 h-14 sm:h-16 max-w-screen-2xl mx-auto">
        {/* Left: Logo + nav tabs */}
        <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
          <div className="flex items-center gap-2 sm:gap-2.5 shrink-0">
            <div className="flex items-center justify-center w-8 h-8 sm:w-9 sm:h-9 rounded-lg sm:rounded-xl bg-gradient-to-br from-brand-400 via-brand-500 to-brand-600 text-white shadow-lg shadow-brand-500/20 ring-1 ring-white/10">
              <svg className="w-4 h-4 sm:w-5 sm:h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M12 2L22 12 12 22 2 12 12 2Z" fill="none" opacity="0.3" />
                <path d="M8.5 15L12 7.5 15.5 15" strokeWidth="2.2" />
                <circle cx="12" cy="11" r="1.8" fill="currentColor" stroke="none" />
              </svg>
            </div>
            <span className="text-sm sm:text-base font-bold text-gray-100 tracking-tight hidden sm:block">VisualLearn AI</span>
            {/* Divider */}
            <div className="hidden sm:block w-px h-5 bg-gray-700/50 ml-1" />
          </div>
          <nav className="flex items-center gap-0.5 sm:gap-1 overflow-x-auto scrollbar-thin" role="tablist" aria-label="Main navigation">
            {LEFT_TABS.map((item) => {
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  role="tab"
                  aria-selected={isActive}
                  onClick={() => onTabChange(item.id)}
                  className={`shrink-0 px-2.5 sm:px-4 py-1.5 sm:py-2 rounded-lg text-xs sm:text-sm font-semibold transition-all duration-200 whitespace-nowrap focus-visible:outline-2 focus-visible:outline-brand-400 ${
                    isActive
                      ? 'bg-gray-800 text-brand-400 shadow-sm'
                      : 'text-gray-400 hover:text-gray-200 hover:bg-gray-800/50'
                  }`}
                  aria-label={item.label}
                >
                  {item.label}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Right: Settings */}
        <button
          role="tab"
          aria-label="Settings"
          onClick={onOpenSettings}
          className="shrink-0 px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg text-xs sm:text-sm font-semibold transition-all duration-200 text-gray-400 hover:text-gray-200 hover:bg-gray-800/50 focus-visible:outline-2 focus-visible:outline-brand-400"
        >
          Settings
        </button>
      </div>
    </header>
  );
}
