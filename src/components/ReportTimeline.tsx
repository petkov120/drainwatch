import type { TimelineEvent } from '../data/mock'

const eventIcons: Record<TimelineEvent['type'], string> = {
  reported: '📋',
  confirmed: '✓',
  gov_response: '🏛',
  in_progress: '🔧',
  resolved: '✅',
  photo_added: '📷',
}

export function ReportTimeline({ events }: { events: TimelineEvent[] }) {
  return (
    <ol className="relative space-y-0" aria-label="Report timeline">
      {events.map((event, i) => (
        <li key={event.id} className="flex gap-3 pb-5 last:pb-0 relative">
          {i < events.length - 1 && (
            <span
              className="absolute left-[15px] top-8 bottom-0 w-px bg-[var(--color-fw-divider)]"
              aria-hidden
            />
          )}
          <span
            className="w-8 h-8 rounded-full bg-[var(--color-fw-surface-secondary)] border border-[var(--color-fw-divider)] flex items-center justify-center text-sm shrink-0 z-10"
            aria-hidden
          >
            {eventIcons[event.type]}
          </span>
          <div className="pt-1 min-w-0">
            <p className="text-[14px] font-semibold text-[var(--color-fw-text)]">
              {event.title}
            </p>
            {event.description && (
              <p className="text-[13px] text-[var(--color-fw-text-secondary)] mt-0.5">
                {event.description}
              </p>
            )}
            <p className="text-[12px] text-[var(--color-fw-text-tertiary)] mt-1">
              {event.timestamp}
              {event.actor && ` · ${event.actor}`}
            </p>
          </div>
        </li>
      ))}
    </ol>
  )
}
