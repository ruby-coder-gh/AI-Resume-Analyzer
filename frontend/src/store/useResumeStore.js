import { create } from 'zustand';

const initialState = {
  file: null,
  extractedText: '',
  analysis: null,
  isAnalyzing: false,
  error: null,
  history: [],
  darkMode: true,
  currentView: 'upload', // 'upload' | 'results'
};

const useResumeStore = create((set, get) => ({
  ...initialState,

  // Hydrate from localStorage on init
  _hydrated: (() => {
    try {
      const saved = JSON.parse(localStorage.getItem('resumeIQ_history') || '[]');
      const dark = localStorage.getItem('resumeIQ_darkMode');
      return { history: saved, darkMode: dark !== null ? dark === 'true' : true };
    } catch { return {}; }
  })(),

  // Merge hydrated values
  ...(() => {
    try {
      const saved = JSON.parse(localStorage.getItem('resumeIQ_history') || '[]');
      const dark = localStorage.getItem('resumeIQ_darkMode');
      return { history: saved, darkMode: dark !== null ? dark === 'true' : true };
    } catch { return {}; }
  })(),

  setFile: (file) => set({ file, error: null, analysis: null, extractedText: '' }),

  setExtractedText: (text) => set({ extractedText: text }),

  setAnalyzing: (val) => set({ isAnalyzing: val }),

  setError: (error) => set({ error, isAnalyzing: false }),

  setAnalysis: (analysis) => {
    const state = get();
    const entry = {
      id: crypto.randomUUID?.() || Date.now().toString(36),
      filename: state.file?.name || 'Unknown',
      date: new Date().toISOString(),
      score: analysis.overall_score,
      atsScore: analysis.ats_compatibility_score,
      readiness: analysis.hiring_readiness,
      analysis,
    };
    const updatedHistory = [entry, ...state.history.filter(h => h.id !== entry.id)].slice(0, 20);
    try { localStorage.setItem('resumeIQ_history', JSON.stringify(updatedHistory)); } catch {}
    set({ analysis, history: updatedHistory, isAnalyzing: false, currentView: 'results' });
  },

  setView: (view) => set({ currentView: view }),

  loadFromHistory: (entry) => set({
    analysis: entry.analysis,
    file: null,
    currentView: 'results',
    error: null,
  }),

  clearAnalysis: () => set({ analysis: null, extractedText: '', file: null, error: null, currentView: 'upload' }),

  clearHistory: () => {
    try { localStorage.removeItem('resumeIQ_history'); } catch {}
    set({ history: [] });
  },

  toggleDarkMode: () => {
    const next = !get().darkMode;
    try { localStorage.setItem('resumeIQ_darkMode', next); } catch {}
    set({ darkMode: next });
  },
}));

export default useResumeStore;
