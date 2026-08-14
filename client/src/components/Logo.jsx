/* ============================================================
   Blnq — signature logo
   A sleek signal-bolt icon with the Blnq wordmark
   Props:
     size : 'sm' | 'md' | 'lg' | 'xl'
     tone : 'light' (dark text) | 'dark' (white text)
     showName : boolean
     animate  : boolean (idle motion)
     tagline  : optional string under the wordmark
   ============================================================ */

const SIZES = {
  sm: { mark: 28, icon: 16, font: '1.2rem',  radius: 8,  gap: 9,  dot: 4 },
  md: { mark: 46, icon: 26, font: '1.85rem', radius: 14, gap: 13, dot: 7 },
  lg: { mark: 60, icon: 34, font: '2.5rem',  radius: 18, gap: 16, dot: 9 },
  xl: { mark: 84, icon: 48, font: '3.5rem',  radius: 24, gap: 20, dot: 12 },
}

export default function Logo({ size = 'md', tone = 'dark', showName = true, animate = false, tagline }) {
  const s = SIZES[size] || SIZES.md
  const textColor = tone === 'light' ? '#15141c' : '#f4f3ff'
  const subColor  = tone === 'light' ? '#56545f' : 'rgba(244,243,255,0.5)'

  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: s.gap }}>


      {/* ── Wordmark ── */}
      {showName && (
        <span style={{ display: 'inline-flex', flexDirection: 'column', alignItems: 'center', gap: tagline ? 4 : 0 }}>
          <span style={{
            fontFamily: "'Space Grotesk', sans-serif",
            fontSize: s.font, fontWeight: 900,
            letterSpacing: '-0.035em', color: textColor,
            lineHeight: 0.95, display: 'inline-flex', alignItems: 'baseline',
            position: 'relative',
          }}>
            Blnq
          </span>
          {tagline && (
            <span style={{
              fontFamily: "'Space Grotesk', sans-serif",
              fontSize: size === 'xl' ? '0.75rem' : size === 'sm' ? '0.55rem' : '0.625rem',
              fontWeight: 600, letterSpacing: '0.18em',
              textTransform: 'uppercase', color: subColor,
              display: 'flex', alignItems: 'center', gap: 4,
            }}>
              <span style={{ 
                display: 'inline-block', 
                width: size === 'sm' ? 8 : size === 'xl' ? 16 : 12, 
                height: 1, 
                background: 'currentColor',
                opacity: 0.3 
              }} />
              {tagline}
              <span style={{ 
                display: 'inline-block', 
                width: size === 'sm' ? 8 : size === 'xl' ? 16 : 12, 
                height: 1, 
                background: 'currentColor',
                opacity: 0.3 
              }} />
            </span>
          )}
        </span>
      )}
    </span>
  )
}
