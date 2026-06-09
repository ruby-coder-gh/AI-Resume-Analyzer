import useResumeStore from '../store/useResumeStore';
import HeroSection from './HeroSection';
import AnalysisGrid from './AnalysisGrid';
import ResumePreview from './ResumePreview';
import ExportSection from './ExportSection';

export default function Dashboard() {
  const { analysis, error } = useResumeStore();
  if (!analysis) return null;

  return (
    <div className="space-y-8 animate-fadeIn">
      {error && (
        <div className="p-4 rounded-xl bg-[var(--color-danger-bg)] border border-[var(--color-danger)]/20 text-[var(--color-danger)] text-sm">
          {error}
        </div>
      )}

      <HeroSection />
      <AnalysisGrid />
      <ResumePreview />
      <ExportSection />
    </div>
  );
}
