import useResumeStore from '../store/useResumeStore';
import { exportAnalysisAsPdf } from '../utils/pdfExport';
import { FiDownload, FiFileText, FiBarChart2, FiShield } from 'react-icons/fi';

export default function ExportSection() {
  const { analysis, file } = useResumeStore();
  if (!analysis) return null;

  const handleExport = () => {
    exportAnalysisAsPdf(analysis, file?.name || 'resume.pdf');
  };

  return (
    <div className="p-6 rounded-xl bg-[var(--color-surface)] border border-[var(--color-border)] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 rounded-xl bg-[var(--color-primary)]/10 flex items-center justify-center">
          <FiFileText className="w-6 h-6 text-[var(--color-primary)]" />
        </div>
        <div>
          <p className="font-semibold text-[var(--color-text)]">Download Report</p>
          <p className="text-sm text-[var(--color-text-secondary)]">
            Includes scores, skills analysis, and recommendations
          </p>
        </div>
        <div className="hidden sm:flex items-center gap-3 ml-4 pl-4 border-l border-[var(--color-border)]">
          <div className="flex items-center gap-1.5 text-xs text-[var(--color-text-tertiary)]">
            <FiBarChart2 className="w-3.5 h-3.5" /> Score {analysis.overall_score}%
          </div>
          <div className="flex items-center gap-1.5 text-xs text-[var(--color-text-tertiary)]">
            <FiShield className="w-3.5 h-3.5" /> ATS {analysis.ats_compatibility_score}%
          </div>
        </div>
      </div>
      <button
        onClick={handleExport}
        className="px-6 py-2.5 bg-[var(--color-primary)] hover:bg-[var(--color-primary-dark)] text-white font-medium rounded-xl transition-all flex items-center gap-2 shadow-lg shadow-[var(--color-primary-glow)] active:scale-[0.98]"
      >
        <FiDownload className="w-4 h-4" />
        Export PDF
      </button>
    </div>
  );
}
