export default function ATSBreakdown({ data }) {
  if (!data) return null;

  const items = [
    { label: 'Formatting', key: 'formatting_score' },
    { label: 'Keyword Optimization', key: 'keyword_optimization' },
    { label: 'Section Completeness', key: 'section_completeness' },
    { label: 'Readability', key: 'readability' },
    { label: 'Achievement Focus', key: 'achievement_focus' },
  ];

  return (
    <div className="p-5 rounded-xl bg-[var(--color-surface)] border border-[var(--color-border)] card-hover">
      <div className="flex items-center gap-2 mb-4">
        <div className="w-8 h-8 rounded-lg bg-[var(--color-primary)]/10 flex items-center justify-center">
          <svg className="w-4 h-4 text-[var(--color-primary)]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M12 20V10M18 20V4M6 20v-4" />
          </svg>
        </div>
        <h3 className="font-semibold text-sm text-[var(--color-text)]">ATS Breakdown</h3>
        <span className="ml-auto text-xs text-[var(--color-text-tertiary)]">
          Avg: {Math.round(items.reduce((s, i) => s + (data[i.key] || 0), 0) / items.length)}%
        </span>
      </div>

      <div className="space-y-3">
        {items.map((item) => {
          const score = data[item.key] || 0;
          const color = score >= 80 ? 'var(--color-success)' : score >= 60 ? 'var(--color-warning)' : 'var(--color-danger)';
          return (
            <div key={item.key}>
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs text-[var(--color-text-secondary)]">{item.label}</span>
                <span className="text-xs font-medium" style={{ color }}>{score}%</span>
              </div>
              <div className="w-full h-2 rounded-full bg-[var(--color-border)] overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-1000 ease-out"
                  style={{ width: `${score}%`, backgroundColor: color }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
