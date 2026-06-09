export default function SectionCard({ title, icon: Icon, items, renderItem, emptyMessage = 'No data available' }) {
  return (
    <div className="p-5 rounded-xl bg-[var(--color-surface)] border border-[var(--color-border)] card-hover">
      <div className="flex items-center gap-2 mb-4">
        <div className="w-8 h-8 rounded-lg bg-[var(--color-primary)]/10 flex items-center justify-center">
          <Icon className="w-4 h-4 text-[var(--color-primary)]" />
        </div>
        <h3 className="font-semibold text-sm text-[var(--color-text)]">{title}</h3>
        {items?.length > 0 && (
          <span className="ml-auto text-xs text-[var(--color-text-tertiary)]">{items.length} items</span>
        )}
      </div>
      {(!items || items.length === 0) ? (
        <p className="text-sm text-[var(--color-text-tertiary)] text-center py-4">{emptyMessage}</p>
      ) : (
        <ul className="space-y-1.5">
          {items.map((item, i) => (
            <li key={i} className="flex items-start gap-2.5 p-2 rounded-lg hover:bg-[var(--color-surface-hover)] transition-colors">
              <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-[var(--color-primary)]/60 shrink-0" />
              {renderItem ? renderItem(item) : (
                <span className="text-sm text-[var(--color-text-secondary)]">
                  {typeof item === 'string' ? item : item.text || item.keyword || item.name || JSON.stringify(item)}
                </span>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
