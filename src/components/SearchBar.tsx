interface SearchBarProps {
  placeholder?: string
  className?: string
}

function SearchIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
      <circle cx="11" cy="11" r="8" />
      <path d="m21 21-4.35-4.35" />
    </svg>
  )
}

export function SearchBar({
  placeholder = 'Search Lagos…',
  className = '',
}: SearchBarProps) {
  return (
    <div className={`fw-search-bar ${className}`}>
      <span className="text-[var(--color-fw-text-tertiary)]">
        <SearchIcon />
      </span>
      <input
        type="search"
        placeholder={placeholder}
        className="flex-1 bg-transparent outline-none text-sm text-[var(--color-fw-text)] placeholder:text-[var(--color-fw-text-tertiary)]"
        aria-label="Search"
      />
    </div>
  )
}
