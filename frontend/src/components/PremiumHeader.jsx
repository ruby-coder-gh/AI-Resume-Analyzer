import { useState, useRef, useEffect } from 'react';
import useResumeStore from '../store/useResumeStore';
import { FiSun, FiMoon, FiClock, FiSettings, FiPlus, FiChevronDown, FiFileText, FiTrash2 } from 'react-icons/fi';

export default function PremiumHeader() {
  const { darkMode, toggleDarkMode, history, loadFromHistory, clearHistory, clearAnalysis, currentView, analysis } = useResumeStore();
  const [showHistory, setShowHistory] = useState(false);
  const historyRef = useRef(null);

  useEffect(() => {
    const handleClick = (e) => {
      if (historyRef.current && !historyRef.current.contains(e.target)) setShowHistory(false);
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  return (
    <header className="sticky top-0 z-50 glass border-b border-[var(--color-border)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-[var(--color-primary)] flex items-center justify-center shadow-lg shadow-[var(--color-primary-glow)]">
            <FiFileText className="text-white w-5 h-5" />
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className="text-lg font-bold text-[var(--color-text)] tracking-tight">Resume</span>
            <span className="text-lg font-bold text-[var(--color-primary)] tracking-tight">IQ</span>
            <span className="hidden sm:inline ml-2 px-2 py-0.5 text-[10px] font-medium text-[var(--color-text-tertiary)] bg-[var(--color-surface)] border border-[var(--color-border)] rounded-md">AI</span>
          </div>
        </div>

        {/* Right side */}
        <div className="flex items-center gap-1.5">
          {currentView === 'results' && (
            <button
              onClick={clearAnalysis}
              className="hidden sm:flex items-center gap-1.5 px-3.5 py-2 text-sm font-medium rounded-lg bg-[var(--color-surface)] border border-[var(--color-border)] text-[var(--color-text-secondary)] hover:text-[var(--color-text)] hover:border-[var(--color-border-light)] transition-all card-hover"
            >
              <FiPlus className="w-4 h-4" />
              New Analysis
            </button>
          )}

          {/* History Dropdown */}
          <div className="relative" ref={historyRef}>
            <button
              onClick={() => setShowHistory(!showHistory)}
              className="p-2.5 rounded-lg text-[var(--color-text-secondary)] hover:text-[var(--color-text)] hover:bg-[var(--color-surface-hover)] transition-all"
            >
              <FiClock className="w-4 h-4" />
            </button>
            {showHistory && (
              <div className="absolute right-0 top-full mt-2 w-80 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-xl shadow-2xl shadow-black/50 animate-scaleIn origin-top-right z-50">
                <div className="flex items-center justify-between p-3 border-b border-[var(--color-border)]">
                  <span className="text-sm font-semibold text-[var(--color-text)]">History</span>
                  {history.length > 0 && (
                    <button onClick={clearHistory} className="text-xs text-[var(--color-text-tertiary)] hover:text-[var(--color-danger)] transition-colors flex items-center gap-1">
                      <FiTrash2 className="w-3 h-3" /> Clear
                    </button>
                  )}
                </div>
                <div className="max-h-72 overflow-y-auto p-2">
                  {history.length === 0 ? (
                    <p className="text-sm text-[var(--color-text-tertiary)] text-center py-6">No previous analyses</p>
                  ) : (
                    history.map((entry) => (
                      <button
                        key={entry.id}
                        onClick={() => { loadFromHistory(entry); setShowHistory(false); }}
                        className="w-full text-left p-3 rounded-lg hover:bg-[var(--color-surface-hover)] transition-all mb-0.5 group"
                      >
                        <div className="flex items-center justify-between">
                          <p className="text-sm font-medium text-[var(--color-text)] truncate flex-1">{entry.filename}</p>
                          <span className={`text-xs font-medium ml-2 ${
                            (entry.score || 0) >= 80 ? 'text-[var(--color-success)]' :
                            (entry.score || 0) >= 60 ? 'text-[var(--color-warning)]' : 'text-[var(--color-danger)]'
                          }`}>{entry.score}/100</span>
                        </div>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-xs text-[var(--color-text-tertiary)]">{new Date(entry.date).toLocaleDateString()}</span>
                          <span className="text-[10px] px-1.5 py-0.5 rounded bg-[var(--color-surface-elevated)] text-[var(--color-text-tertiary)]">{entry.readiness || 'N/A'}</span>
                        </div>
                      </button>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Settings */}
          <button className="p-2.5 rounded-lg text-[var(--color-text-secondary)] hover:text-[var(--color-text)] hover:bg-[var(--color-surface-hover)] transition-all">
            <FiSettings className="w-4 h-4" />
          </button>

          {/* Theme Toggle */}
          <button
            onClick={toggleDarkMode}
            className="p-2.5 rounded-lg text-[var(--color-text-secondary)] hover:text-[var(--color-text)] hover:bg-[var(--color-surface-hover)] transition-all"
          >
            {darkMode ? <FiSun className="w-4 h-4" /> : <FiMoon className="w-4 h-4" />}
          </button>
        </div>
      </div>
    </header>
  );
}
