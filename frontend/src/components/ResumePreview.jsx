import { useState } from 'react';
import useResumeStore from '../store/useResumeStore';
import { FiChevronDown, FiUser, FiMail, FiPhone, FiBook, FiBriefcase } from 'react-icons/fi';

export default function ResumePreview() {
  const { analysis, extractedText } = useResumeStore();
  const [isOpen, setIsOpen] = useState(false);
  const info = analysis?.parsed_info;

  return (
    <div className="rounded-xl bg-[var(--color-surface)] border border-[var(--color-border)] overflow-hidden">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-5 hover:bg-[var(--color-surface-hover)] transition-colors"
      >
        <div className="flex items-center gap-2">
          <FiUser className="w-4 h-4 text-[var(--color-primary)]" />
          <span className="font-semibold text-sm text-[var(--color-text)]">Resume Preview</span>
          {info?.name && (
            <span className="text-sm text-[var(--color-text-secondary)]">— {info.name}</span>
          )}
        </div>
        <FiChevronDown className={`w-4 h-4 text-[var(--color-text-secondary)] transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="px-5 pb-5 space-y-4 animate-slideDown">
          {/* Parsed info */}
          {info && (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {[
                { icon: FiUser, label: 'Name', value: info.name },
                { icon: FiMail, label: 'Email', value: info.email },
                { icon: FiPhone, label: 'Phone', value: info.phone },
                { icon: FiBriefcase, label: 'Experience', value: info.experience_years ? `${info.experience_years} years` : null },
              ].map((item, i) => item.value ? (
                <div key={i} className="p-3 rounded-lg bg-[var(--color-surface-elevated)] border border-[var(--color-border)]">
                  <div className="flex items-center gap-1.5 mb-1">
                    <item.icon className="w-3 h-3 text-[var(--color-text-tertiary)]" />
                    <span className="text-xs text-[var(--color-text-tertiary)]">{item.label}</span>
                  </div>
                  <p className="text-sm font-medium text-[var(--color-text)]">{item.value}</p>
                </div>
              ) : null)}
            </div>
          )}

          {/* Skills extracted */}
          {info?.skills_extracted?.length > 0 && (
            <div>
              <p className="text-xs text-[var(--color-text-tertiary)] mb-2">Extracted Skills ({info.skills_extracted.length})</p>
              <div className="flex flex-wrap gap-1.5">
                {info.skills_extracted.map((skill, i) => (
                  <span key={i} className="px-2 py-1 text-xs rounded-md bg-[var(--color-primary)]/10 text-[var(--color-primary-light)] border border-[var(--color-primary)]/20">
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Education */}
          {info?.education && (
            <div className="flex items-center gap-2 p-3 rounded-lg bg-[var(--color-surface-elevated)] border border-[var(--color-border)]">
              <FiBook className="w-4 h-4 text-[var(--color-text-tertiary)]" />
              <span className="text-sm text-[var(--color-text-secondary)]">{info.education}</span>
            </div>
          )}

          {/* Extracted text */}
          {extractedText && (
            <details>
              <summary className="text-xs text-[var(--color-text-tertiary)] cursor-pointer hover:text-[var(--color-text-secondary)]">
                View extracted raw text
              </summary>
              <pre className="mt-2 text-xs text-[var(--color-text-tertiary)] whitespace-pre-wrap font-mono leading-relaxed max-h-48 overflow-y-auto p-3 rounded-lg bg-[var(--color-bg)] border border-[var(--color-border)]">
                {extractedText}
              </pre>
            </details>
          )}
        </div>
      )}
    </div>
  );
}
