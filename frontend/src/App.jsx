import { useEffect } from 'react';
import useResumeStore from './store/useResumeStore';
import PremiumHeader from './components/PremiumHeader';
import UploadPage from './components/UploadPage';
import LoadingScreen from './components/LoadingScreen';
import Dashboard from './components/Dashboard';
import { Toaster } from 'react-hot-toast';

export default function App() {
  const { darkMode, currentView, isAnalyzing } = useResumeStore();

  useEffect(() => {
    document.documentElement.classList.toggle('dark', darkMode);
    document.documentElement.classList.toggle('light', !darkMode);
  }, [darkMode]);

  return (
    <div className="min-h-screen bg-[var(--color-bg)]">
      <Toaster
        position="top-right"
        toastOptions={{
          className: '!bg-[var(--color-surface)] !text-[var(--color-text)] !border !border-[var(--color-border)] !shadow-2xl',
          duration: 4000,
        }}
      />
      <PremiumHeader />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {isAnalyzing ? (
          <LoadingScreen />
        ) : currentView === 'results' ? (
          <Dashboard />
        ) : (
          <UploadPage />
        )}
      </main>
    </div>
  );
}
