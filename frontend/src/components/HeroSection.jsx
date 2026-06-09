import useResumeStore from '../store/useResumeStore';
import { FiShield, FiTrendingUp, FiUserCheck } from 'react-icons/fi';

const ScoreRing = ({ score, size = 120, strokeWidth = 6, label }) => {
  const r = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * r;
  const offset = circumference - (score / 100) * circumference;
  const color = score >= 80 ? 'var(--color-success)' : score >= 60 ? 'var(--color-warning)' : 'var(--color-danger)';

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="relative" style={{ width: size, height: size }}>
        <svg width={size} height={size} className="-rotate-90">
          <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="var(--color-border)" strokeWidth={strokeWidth} />
          <circle
            cx={size/2} cy={size/2} r={r} fill="none"
            stroke={color} strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            strokeLinecap="round"
            className="transition-all duration-1000 ease-out"
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-3xl font-bold" style={{ color }}>{score}</span>
        </div>
      </div>
      <span className="text-xs font-medium text-[var(--color-text-secondary)]">{label}</span>
    </div>
  );
};

const ReadinessBadge = ({ readiness }) => {
  const config = {
    Excellent: { color: 'text-[var(--color-success)]', bg: 'bg-[var(--color-success-bg)]', icon: '★' },
    Good: { color: 'text-[var(--color-success)]', bg: 'bg-[var(--color-success-bg)]', icon: '◆' },
    Fair: { color: 'text-[var(--color-warning)]', bg: 'bg-[var(--color-warning-bg)]', icon: '▲' },
    Poor: { color: 'text-[var(--color-danger)]', bg: 'bg-[var(--color-danger-bg)]', icon: '▼' },
  };
  const c = config[readiness] || config.Fair;

  return (
    <div className={`flex items-center gap-2 px-3 py-1.5 rounded-lg ${c.bg}`}>
      <span className={`text-lg ${c.color}`}>{c.icon}</span>
      <span className={`text-sm font-semibold ${c.color}`}>{readiness || 'Fair'}</span>
    </div>
  );
};

export default function HeroSection() {
  const { analysis, file } = useResumeStore();
  if (!analysis) return null;

  return (
    <div className="stagger-children">
      {/* Main hero card */}
      <div className="p-8 rounded-2xl bg-[var(--color-surface)] border border-[var(--color-border)]">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8">
          {/* Left: Main score */}
          <div className="flex items-center gap-8">
            <ScoreRing score={analysis.overall_score || 0} size={140} strokeWidth={8} label="Overall Score" />
            <div className="space-y-2">
              <h2 className="text-2xl font-bold text-[var(--color-text)] tracking-tight">
                {analysis.parsed_info?.name || 'Resume Analysis'}
              </h2>
              <p className="text-sm text-[var(--color-text-secondary)] max-w-md leading-relaxed">
                {analysis.summary}
              </p>
              <div className="flex flex-wrap items-center gap-3 pt-1">
                <ReadinessBadge readiness={analysis.hiring_readiness} />
                <span className="text-xs text-[var(--color-text-tertiary)]">
                  {file?.name || 'Resume'} — {new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                </span>
              </div>
            </div>
          </div>

          {/* Right: Quick stats */}
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-[var(--color-surface-elevated)] border border-[var(--color-border)]">
              <FiShield className="w-5 h-5 text-[var(--color-primary)]" />
              <div>
                <p className="text-xs text-[var(--color-text-tertiary)]">ATS Score</p>
                <p className="text-lg font-bold text-[var(--color-text)]">{analysis.ats_compatibility_score || 0}%</p>
              </div>
            </div>
            <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-[var(--color-surface-elevated)] border border-[var(--color-border)]">
              <FiUserCheck className="w-5 h-5 text-[var(--color-primary)]" />
              <div>
                <p className="text-xs text-[var(--color-text-tertiary)]">Experience</p>
                <p className="text-lg font-bold text-[var(--color-text)]">{analysis.parsed_info?.experience_years || '—'} yrs</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
