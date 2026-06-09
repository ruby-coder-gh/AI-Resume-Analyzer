import { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import useResumeStore from '../store/useResumeStore';
import { extractTextFromPdf } from '../services/pdfParser';
import { analyzeResume as apiAnalyze } from '../services/api';
import { FiUploadCloud, FiFile, FiArrowRight, FiCheck } from 'react-icons/fi';
import toast from 'react-hot-toast';

export default function UploadPage() {
  const { file, setFile, setExtractedText, setAnalysis, setAnalyzing, setError } = useResumeStore();

  const onDrop = useCallback((acceptedFiles, rejections) => {
    if (rejections.length > 0) {
      toast.error(rejections[0].errors[0]?.message || 'Please upload a valid PDF file.');
      return;
    }
    if (acceptedFiles.length > 0) {
      setFile(acceptedFiles[0]);
      toast.success('Resume uploaded');
    }
  }, [setFile]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'application/pdf': ['.pdf'] },
    maxFiles: 1,
    maxSize: 10 * 1024 * 1024,
  });

  const handleAnalyze = async () => {
    if (!file) return;
    setError(null);
    setAnalyzing(true);
    try {
      const text = await extractTextFromPdf(file);
      setExtractedText(text);
      if (!text || text.trim().length < 20) throw new Error('Could not extract enough text. The PDF may be a scanned document.');
      const result = await apiAnalyze(file);
      setAnalysis(result.analysis);
      toast.success('Analysis complete!');
    } catch (err) {
      setError(err.message);
      toast.error(err.message);
    }
  };

  const formatSize = (bytes) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] animate-fadeIn">
      {/* Tagline */}
      <div className="text-center mb-10 max-w-xl">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 mb-4 rounded-full bg-[var(--color-primary)]/10 border border-[var(--color-primary)]/20 text-xs font-medium text-[var(--color-primary-light)]">
          <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-primary)] animate-pulse" />
          AI-Powered Resume Intelligence
        </div>
        <h1 className="text-4xl sm:text-5xl font-bold text-[var(--color-text)] tracking-tight mb-3">
          Know your resume's<br />
          <span className="text-[var(--color-primary)]">true potential</span>
        </h1>
        <p className="text-[var(--color-text-secondary)] text-base leading-relaxed">
          Upload your PDF resume and get an instant AI-powered analysis with ATS scoring, skills radar, and actionable recommendations.
        </p>
      </div>

      {/* Dropzone */}
      <div
        {...getRootProps()}
        className={`
          w-full max-w-xl p-10 border-2 border-dashed rounded-2xl cursor-pointer
          transition-all duration-300 text-center relative overflow-hidden
          ${file
            ? 'border-[var(--color-primary)]/50 bg-[var(--color-primary)]/5'
            : isDragActive
              ? 'border-[var(--color-primary)] bg-[var(--color-primary)]/10 scale-[1.02]'
              : 'border-[var(--color-border)] hover:border-[var(--color-primary)]/40 hover:bg-[var(--color-surface-hover)]'
          }
        `}
      >
        <input {...getInputProps()} />
        {file ? (
          <div className="flex flex-col items-center gap-4 py-4">
            <div className="w-16 h-16 rounded-2xl bg-[var(--color-success-bg)] flex items-center justify-center">
              <FiCheck className="w-7 h-7 text-[var(--color-success)]" />
            </div>
            <div>
              <p className="font-semibold text-lg text-[var(--color-text)]">{file.name}</p>
              <p className="text-sm text-[var(--color-text-secondary)]">{formatSize(file.size)}</p>
            </div>
            <p className="text-xs text-[var(--color-text-tertiary)]">Drop another file or click to change</p>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-4 py-8">
            <div className="w-20 h-20 rounded-2xl bg-[var(--color-primary)]/10 flex items-center justify-center">
              <FiUploadCloud className="w-9 h-9 text-[var(--color-primary)]" />
            </div>
            <div>
              <p className="font-semibold text-lg text-[var(--color-text)]">
                {isDragActive ? 'Drop your resume here' : 'Drop your resume here'}
              </p>
              <p className="text-sm text-[var(--color-text-secondary)] mt-1">or <span className="text-[var(--color-primary)] underline underline-offset-2">browse files</span> — PDF up to 10MB</p>
            </div>
          </div>
        )}
      </div>

      {/* Analyze Button */}
      {file && (
        <button
          onClick={handleAnalyze}
          className="mt-8 group px-8 py-3.5 bg-[var(--color-primary)] hover:bg-[var(--color-primary-dark)] text-white font-semibold rounded-xl transition-all duration-200 flex items-center gap-2.5 shadow-xl shadow-[var(--color-primary-glow)] hover:shadow-2xl hover:shadow-[var(--color-primary-glow)] active:scale-[0.98]"
        >
          Analyze Resume
          <FiArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
        </button>
      )}

      {/* Trust badges */}
      <div className="mt-16 flex flex-wrap items-center justify-center gap-6 text-xs text-[var(--color-text-tertiary)]">
        <span className="flex items-center gap-1.5">
          <FiCheck className="w-3 h-3 text-[var(--color-success)]" /> ATS Optimized
        </span>
        <span className="flex items-center gap-1.5">
          <FiCheck className="w-3 h-3 text-[var(--color-success)]" /> GPT-4o Mini
        </span>
        <span className="flex items-center gap-1.5">
          <FiCheck className="w-3 h-3 text-[var(--color-success)]" /> PDF Export
        </span>
        <span className="flex items-center gap-1.5">
          <FiCheck className="w-3 h-3 text-[var(--color-success)]" /> Free
        </span>
      </div>
    </div>
  );
}
