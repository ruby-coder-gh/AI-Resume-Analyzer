import useResumeStore from '../store/useResumeStore';
import SkillsRadar from './SkillsRadar';
import SectionCard from './SectionCard';
import ATSBreakdown from './ATSBreakdown';
import { FiTarget, FiTrendingUp, FiStar, FiZap } from 'react-icons/fi';

export default function AnalysisGrid() {
  const { analysis } = useResumeStore();
  if (!analysis) return null;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 stagger-children">
      {/* Left Column */}
      <div className="space-y-6">
        <SkillsRadar data={analysis.skills_radar} />
        <SectionCard
          title="Skills Identified"
          icon={FiTarget}
          items={analysis.skills_identified || []}
          renderItem={(s) => (
            <div className="flex items-center justify-between w-full">
              <div>
                <span className="font-medium text-[var(--color-text)]">{s.name}</span>
                <span className="ml-2 text-xs text-[var(--color-text-tertiary)]">{s.category}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className={`text-xs px-1.5 py-0.5 rounded ${
                  s.proficiency === 'Advanced' ? 'bg-[var(--color-success-bg)] text-[var(--color-success)]' :
                  s.proficiency === 'Intermediate' ? 'bg-[var(--color-warning-bg)] text-[var(--color-warning)]' :
                  'bg-[var(--color-surface-elevated)] text-[var(--color-text-tertiary)]'
                }`}>{s.proficiency}</span>
                <div className="w-12 h-1.5 rounded-full bg-[var(--color-border)] overflow-hidden">
                  <div className="h-full rounded-full bg-[var(--color-primary)]" style={{ width: `${s.market_demand || 50}%` }} />
                </div>
              </div>
            </div>
          )}
        />
        <SectionCard
          title="Missing Keywords"
          icon={FiTrendingUp}
          items={analysis.missing_keywords || []}
          renderItem={(k) => (
            <div className="flex items-center justify-between w-full">
              <div>
                <span className="font-medium text-[var(--color-text)]">{k.keyword}</span>
                <span className="ml-2 text-xs text-[var(--color-text-tertiary)]">{k.category}</span>
              </div>
              <span className={`text-xs font-medium px-1.5 py-0.5 rounded ${
                k.importance === 'High' ? 'bg-[var(--color-danger-bg)] text-[var(--color-danger)]' :
                k.importance === 'Medium' ? 'bg-[var(--color-warning-bg)] text-[var(--color-warning)]' :
                'bg-[var(--color-surface-elevated)] text-[var(--color-text-tertiary)]'
              }`}>{k.importance}</span>
            </div>
          )}
        />
      </div>

      {/* Right Column */}
      <div className="space-y-6">
        <ATSBreakdown data={analysis.ats_breakdown} />
        <SectionCard
          title="Strengths"
          icon={FiStar}
          items={analysis.strengths || []}
          renderItem={(s) => (
            <div className="flex items-start justify-between w-full gap-4">
              <span className="text-sm text-[var(--color-text-secondary)]">{s.text}</span>
              <span className={`shrink-0 text-xs font-medium px-1.5 py-0.5 rounded ${
                s.impact === 'High' ? 'bg-[var(--color-success-bg)] text-[var(--color-success)]' :
                'bg-[var(--color-surface-elevated)] text-[var(--color-text-tertiary)]'
              }`}>{s.impact}</span>
            </div>
          )}
        />
        <SectionCard
          title="Areas for Improvement"
          icon={FiZap}
          items={analysis.areas_for_improvement || []}
          renderItem={(a) => (
            <div className="flex items-start justify-between w-full gap-4">
              <span className="text-sm text-[var(--color-text-secondary)]">{a.text}</span>
              <div className="flex gap-1 shrink-0">
                <span className={`text-xs px-1.5 py-0.5 rounded ${
                  a.priority === 'High' ? 'bg-[var(--color-danger-bg)] text-[var(--color-danger)]' :
                  a.priority === 'Medium' ? 'bg-[var(--color-warning-bg)] text-[var(--color-warning)]' :
                  'bg-[var(--color-surface-elevated)] text-[var(--color-text-tertiary)]'
                }`}>{a.priority}</span>
                <span className="text-xs px-1.5 py-0.5 rounded bg-[var(--color-surface-elevated)] text-[var(--color-text-tertiary)]">{a.effort}</span>
              </div>
            </div>
          )}
        />
        <SectionCard
          title="Recommendations"
          icon={FiStar}
          items={analysis.recommendations || []}
          renderItem={(r) => (
            <div className="flex items-start justify-between w-full gap-4">
              <div className="flex-1">
                <span className="text-sm text-[var(--color-text-secondary)]">{r.text}</span>
                <span className="ml-2 text-xs text-[var(--color-text-tertiary)]">{r.category}</span>
              </div>
              <span className={`shrink-0 text-xs font-medium px-1.5 py-0.5 rounded ${
                r.priority === 'High' ? 'bg-[var(--color-danger-bg)] text-[var(--color-danger)]' :
                r.priority === 'Medium' ? 'bg-[var(--color-warning-bg)] text-[var(--color-warning)]' :
                'bg-[var(--color-surface-elevated)] text-[var(--color-text-tertiary)]'
              }`}>{r.priority}</span>
            </div>
          )}
        />
      </div>
    </div>
  );
}
