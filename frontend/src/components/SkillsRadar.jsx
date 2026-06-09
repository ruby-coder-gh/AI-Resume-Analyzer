export default function SkillsRadar({ data }) {
  if (!data?.categories?.length) return null;

  const categories = data.categories;
  const size = 280;
  const center = size / 2;
  const radius = size * 0.38;
  const levels = 4;
  const angleStep = (2 * Math.PI) / categories.length;

  const getPoint = (index, value) => {
    const angle = angleStep * index - Math.PI / 2;
    const r = (value / 100) * radius;
    return {
      x: center + r * Math.cos(angle),
      y: center + r * Math.sin(angle),
    };
  };

  const polygonPoints = categories.map((cat, i) => {
    const p = getPoint(i, cat.score);
    return `${p.x},${p.y}`;
  }).join(' ');

  return (
    <div className="p-5 rounded-xl bg-[var(--color-surface)] border border-[var(--color-border)] card-hover">
      <div className="flex items-center gap-2 mb-4">
        <div className="w-8 h-8 rounded-lg bg-[var(--color-primary)]/10 flex items-center justify-center">
          <svg className="w-4 h-4 text-[var(--color-primary)]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2z" />
          </svg>
        </div>
        <h3 className="font-semibold text-sm text-[var(--color-text)]">Skills Radar</h3>
      </div>

      <div className="flex justify-center">
        <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
          {/* Background grid */}
          {[1, 2, 3, 4].map((level) => (
            <polygon
              key={level}
              points={categories.map((_, i) => {
                const angle = angleStep * i - Math.PI / 2;
                const r = (level / levels) * radius;
                return `${center + r * Math.cos(angle)},${center + r * Math.sin(angle)}`;
              }).join(' ')}
              fill="none"
              stroke="var(--color-border)"
              strokeWidth={1}
              opacity={0.5}
            />
          ))}

          {/* Axes */}
          {categories.map((_, i) => {
            const p = getPoint(i, 100);
            return (
              <line
                key={i}
                x1={center} y1={center}
                x2={p.x} y2={p.y}
                stroke="var(--color-border)"
                strokeWidth={1}
                opacity={0.3}
              />
            );
          })}

          {/* Data area */}
          <polygon
            points={polygonPoints}
            fill="var(--color-primary-glow)"
            stroke="var(--color-primary)"
            strokeWidth={2}
            className="transition-all duration-1000"
          />

          {/* Data points */}
          {categories.map((cat, i) => {
            const p = getPoint(i, cat.score);
            return (
              <circle
                key={i}
                cx={p.x} cy={p.y} r={4}
                fill="var(--color-primary)"
                stroke="var(--color-surface)"
                strokeWidth={2}
              />
            );
          })}

          {/* Labels */}
          {categories.map((cat, i) => {
            const p = getPoint(i, 120);
            return (
              <text
                key={i}
                x={p.x} y={p.y}
                textAnchor="middle"
                dominantBaseline="middle"
                fill="var(--color-text-secondary)"
                fontSize={11}
                fontFamily="Inter, sans-serif"
              >
                {cat.label}
              </text>
            );
          })}

          {/* Center score */}
          <text
            x={center} y={center}
            textAnchor="middle"
            dominantBaseline="middle"
            fill="var(--color-text)"
            fontSize={16}
            fontWeight="bold"
            fontFamily="Inter, sans-serif"
          >
            {Math.round(categories.reduce((sum, c) => sum + c.score, 0) / categories.length)}
          </text>
        </svg>
      </div>
    </div>
  );
}
