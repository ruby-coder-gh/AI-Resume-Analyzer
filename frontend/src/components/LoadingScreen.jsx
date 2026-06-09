import { useState, useEffect } from 'react';
import { FiFileText } from 'react-icons/fi';

const messages = [
  'Extracting text from your resume...',
  'Analyzing skills and experience...',
  'Evaluating ATS compatibility...',
  'Identifying keyword gaps...',
  'Generating recommendations...',
];

export default function LoadingScreen() {
  const [step, setStep] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setStep((prev) => (prev + 1) % messages.length);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] animate-fadeIn">
      <div className="relative mb-8">
        <div className="w-20 h-20 rounded-2xl bg-[var(--color-primary)]/10 flex items-center justify-center">
          <FiFileText className="w-9 h-9 text-[var(--color-primary)] animate-pulse" />
        </div>
        <div className="absolute -top-1 -right-1 w-5 h-5">
          <div className="w-full h-full rounded-full bg-[var(--color-primary)] animate-ping opacity-75" />
        </div>
      </div>

      <div className="flex gap-1.5 mb-6">
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className="w-2.5 h-2.5 rounded-full bg-[var(--color-primary)]"
            style={{ animation: `bounce 1.2s ease-in-out ${i * 0.15}s infinite` }}
          />
        ))}
      </div>

      <p className="text-[var(--color-text-secondary)] text-sm animate-fadeIn" key={step}>
        {messages[step]}
      </p>

      <style>{`
        @keyframes bounce {
          0%, 80%, 100% { transform: scale(0.6); opacity: 0.4; }
          40% { transform: scale(1); opacity: 1; }
        }
      `}</style>
    </div>
  );
}
