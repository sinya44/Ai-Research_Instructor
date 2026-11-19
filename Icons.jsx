const S = { fill: 'none', stroke: 'currentColor', strokeWidth: 2, strokeLinecap: 'round', strokeLinejoin: 'round', 'aria-hidden': true }

export const EyeIcon = ({ slash }) => (
  <svg viewBox="0 0 24 24" width="20" height="20" {...S}>
    <path d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7S1 12 1 12z" />
    <circle cx="12" cy="12" r="3" />
    {slash && <line x1="3" y1="3" x2="21" y2="21" />}
  </svg>
)

export const ArrowLeft = () => (
  <svg viewBox="0 0 24 24" width="20" height="20" {...S} strokeWidth="2.2">
    <line x1="19" y1="12" x2="5" y2="12" />
    <polyline points="12 19 5 12 12 5" />
  </svg>
)

const Tile = ({ children }) => (
  <div className="ico q">
    <svg viewBox="0 0 24 24" width="28" height="28" {...S}>{children}</svg>
  </div>
)

export const ClockTile = () => (
  <Tile>
    <circle cx="12" cy="12" r="10" />
    <polyline points="12 6 12 12 16 14" />
  </Tile>
)
export const ShieldTile = () => (
  <Tile>
    <path d="M12 2l8 3v6c0 5-3.5 9.5-8 11-4.5-1.5-8-6-8-11V5l8-3z" />
    <polyline points="8.5 12 11 14.5 15.5 9.5" />
  </Tile>
)
export const PointerTile = () => (
  <Tile>
    <path d="M3 3l7.07 16.97 2.51-7.39 7.39-2.51L3 3z" />
    <line x1="13" y1="13" x2="19" y2="19" />
  </Tile>
)
