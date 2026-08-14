import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useState, useEffect, useRef } from 'react'
import Logo from './Logo'

export default function Navbar() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const menuRef  = useRef(null)
  const [menuOpen, setMenuOpen] = useState(false)
  const [drawerOpen, setDrawerOpen] = useState(false)

  // close dropdown on outside click
  useEffect(() => {
    const handler = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) setMenuOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  // close drawer on route change
  useEffect(() => {
    setDrawerOpen(false)
  }, [location.pathname])

  // lock body scroll when drawer is open
  useEffect(() => {
    if (drawerOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => { document.body.style.overflow = '' }
  }, [drawerOpen])

  const isAuthPage = ['/login', '/signup'].includes(location.pathname)
  if (isAuthPage) return null

  const handleLogout = () => { logout(); navigate('/'); setMenuOpen(false); setDrawerOpen(false) }
  const isActive = (p) => location.pathname === p

  const scrollTo = (e, href) => {
    if (!href.startsWith('/#')) return
    e.preventDefault()
    const id = href.slice(2)
    if (location.pathname !== '/') {
      navigate('/')
      setTimeout(() => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' }), 120)
    } else {
      document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
    }
  }

  const authLinks = [
    { href: '/shorten',   label: 'Shorten',   icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M10 13a5 5 0 007.54.54l3-3a5 5 0 00-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 00-7.54-.54l-3 3a5 5 0 007.07 7.07l1.71-1.71"/></svg> },
    { href: '/bulk',      label: 'Bulk',      icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 7V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v2"/></svg> },
    { href: '/dashboard', label: 'Dashboard', icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg> },
    { href: '/analytics', label: 'Analytics', icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg> },
  ]

  const guestLinks = [
    { href: '/features',           label: 'Features',  icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg> },
    { href: '/analytics-showcase', label: 'Analytics', icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg> },
    { href: '/pricing',            label: 'Pricing',   icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6"/></svg> },
    { href: '/about',              label: 'About',     icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg> },
    { href: '/contact',            label: 'Contact',   icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/></svg> },
  ]

  const isLanding = location.pathname === '/'

  return (
    <>
      <nav style={{
        position: 'fixed', top: 0, left: 0, right: 0,
        zIndex: 200, height: 64,
        background: 'rgba(245,243,239,0.97)',
        backdropFilter: 'blur(18px)', WebkitBackdropFilter: 'blur(18px)',
        borderBottom: '1px solid rgba(20,20,28,0.09)',
        boxShadow: '0 1px 12px rgba(20,20,28,0.06)',
        display: 'flex', alignItems: 'center',
        animation: 'fadeDown .5s cubic-bezier(0.16,1,0.3,1) both',
      }}>
        <div style={{
          width: '100%', maxWidth: 1300, margin: '0 auto',
          padding: '0 32px',
          display: 'flex', alignItems: 'center',
          justifyContent: 'space-between', gap: 32,
          position: 'relative',
        }}>

          {/* ── Logo ── */}
          <Link to={user ? "/shorten" : "/"} style={{ textDecoration: 'none', flexShrink: 0, display: 'flex', alignItems: 'center' }}>
            <Logo size="sm" tone="light" animate tagline="URL Shortener" />
          </Link>

          {/* ── Centre nav links — centered in the bar ── */}
          {!isLanding && user && (
            <ul className="nav-center-links" style={{
              listStyle: 'none', display: 'flex', alignItems: 'center', gap: 2,
              margin: 0, padding: 0,
              position: 'absolute', left: '50%', transform: 'translateX(-50%)',
            }}>
              {authLinks.map(link => (
                <li key={link.href}>
                  <Link to={link.href} style={{
                    fontFamily: "'Space Grotesk', sans-serif",
                    fontSize: '0.875rem', fontWeight: 500,
                    color: isActive(link.href) ? '#7c3aed' : '#8d8b94',
                    padding: '7px 16px', borderRadius: 99,
                    display: 'block', textDecoration: 'none',
                    letterSpacing: '0.01em',
                    background: isActive(link.href) ? 'rgba(124,58,237,0.08)' : 'transparent',
                    transition: 'color .15s, background .15s',
                  }}
                    onMouseEnter={e => { if (!isActive(link.href)) { e.currentTarget.style.background = 'rgba(20,20,28,0.05)'; e.currentTarget.style.color = '#15141c' } }}
                    onMouseLeave={e => { if (!isActive(link.href)) { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#8d8b94' } }}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          )}

          {/* ── Actions ── */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexShrink: 0, marginLeft: 'auto' }}>
            {user ? (
              <>
                {/* New link pill */}
                <Link to="/shorten" id="nav-new-link-btn" style={{
                  display: 'inline-flex', alignItems: 'center', gap: 6,
                  padding: '7px 16px', background: '#7c3aed', color: '#fff',
                  borderRadius: 99, fontFamily: "'Space Grotesk', sans-serif",
                  fontSize: '0.8125rem', fontWeight: 600, letterSpacing: '0.01em',
                  textDecoration: 'none', boxShadow: '0 4px 14px rgba(124,58,237,0.3)',
                  transition: 'all .2s ease',
                }}
                  onMouseEnter={e => { e.currentTarget.style.background = '#6d28d9'; e.currentTarget.style.transform = 'translateY(-1px)'; e.currentTarget.style.boxShadow = '0 6px 20px rgba(124,58,237,0.45)' }}
                  onMouseLeave={e => { e.currentTarget.style.background = '#7c3aed'; e.currentTarget.style.transform = ''; e.currentTarget.style.boxShadow = '0 4px 14px rgba(124,58,237,0.3)' }}
                >
                  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M12 5v14M5 12h14"/></svg>
                  New link
                </Link>

                {/* Avatar + dropdown (desktop) */}
                <div className="hide-mobile" style={{ position: 'relative' }} ref={menuRef}>
                  <button onClick={() => setMenuOpen(!menuOpen)} id="user-menu-btn" title={user.name || user.email} style={{
                    width: 34, height: 34, borderRadius: '50%',
                    background: 'linear-gradient(135deg,#a78bfa,#7c3aed)',
                    border: '2px solid transparent', display: 'flex',
                    alignItems: 'center', justifyContent: 'center',
                    fontFamily: "'Playfair Display', serif",
                    fontSize: '0.9375rem', fontWeight: 700, color: '#fff',
                    cursor: 'pointer', transition: 'all .2s',
                    boxShadow: '0 2px 8px rgba(124,58,237,0.25)',
                  }}
                    onMouseEnter={e => { e.currentTarget.style.borderColor = '#a78bfa'; e.currentTarget.style.transform = 'scale(1.07)' }}
                    onMouseLeave={e => { e.currentTarget.style.borderColor = 'transparent'; e.currentTarget.style.transform = '' }}
                  >
                    {(user.name?.[0] || user.email?.[0])?.toUpperCase()}
                  </button>

                  {menuOpen && (
                    <div style={{
                      position: 'absolute', right: 0, top: 'calc(100% + 8px)',
                      background: '#fff', border: '1px solid rgba(20,20,28,0.12)',
                      borderRadius: 14, boxShadow: '0 16px 48px rgba(20,20,28,0.14)',
                      minWidth: 210, overflow: 'hidden', zIndex: 300,
                      animation: 'scaleIn .2s cubic-bezier(0.34,1.56,0.64,1) both',
                      transformOrigin: 'top right',
                    }}>
                      <div style={{ padding: '13px 16px 10px', borderBottom: '1px solid rgba(20,20,28,0.07)' }}>
                        {user.name && (
                          <div style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: '0.9375rem', fontWeight: 700, color: '#15141c', marginBottom: 3 }}>
                            {user.name}
                          </div>
                        )}
                        <div style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: '0.8125rem', fontWeight: user.name ? 400 : 600, color: user.name ? '#8d8b94' : '#15141c', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                          {user.email}
                        </div>
                        <div style={{ marginTop: 5 }}>
                          <span style={{ display: 'inline-block', padding: '2px 9px', background: 'rgba(124,58,237,0.1)', border: '1px solid rgba(124,58,237,0.22)', borderRadius: 99, fontFamily: "'Space Grotesk',sans-serif", fontSize: '0.6rem', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#7c3aed' }}>
                            Free Plan
                          </span>
                        </div>
                      </div>

                      <button 
                        onClick={() => { setMenuOpen(false); navigate('/profile') }} 
                        id="edit-profile-btn"
                        style={{
                          display: 'flex', alignItems: 'center', gap: 10,
                          padding: '9px 16px', fontFamily: "'Space Grotesk',sans-serif",
                          fontSize: '0.875rem', fontWeight: 500, color: '#15141c', 
                          background: 'none', border: 'none', cursor: 'pointer', 
                          width: '100%', textAlign: 'left', transition: 'background .12s',
                        }}
                        onMouseEnter={e => e.currentTarget.style.background = 'rgba(124,58,237,0.06)'}
                        onMouseLeave={e => e.currentTarget.style.background = ''}
                      >
                        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/>
                          <circle cx="12" cy="7" r="4"/>
                        </svg>
                        Edit Profile
                      </button>
                      <div style={{ height: 1, background: 'rgba(20,20,28,0.07)', margin: '4px 0' }} />
                      <button onClick={handleLogout} id="logout-btn" style={{
                        display: 'flex', alignItems: 'center', gap: 10,
                        padding: '9px 16px', fontFamily: "'Space Grotesk',sans-serif",
                        fontSize: '0.875rem', color: '#ef4444', background: 'none',
                        border: 'none', cursor: 'pointer', width: '100%', textAlign: 'left',
                        transition: 'background .12s',
                      }}
                        onMouseEnter={e => e.currentTarget.style.background = 'rgba(239,68,68,0.06)'}
                        onMouseLeave={e => e.currentTarget.style.background = ''}
                      >
                        Sign out
                      </button>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <>
                {/* Sign in */}
                <Link to="/login" id="nav-login-btn" className="nav-signin-link hide-mobile" style={{
                  fontFamily: "'Space Grotesk', sans-serif",
                  fontSize: '0.875rem', fontWeight: 500,
                  color: '#8d8b94', textDecoration: 'none',
                  padding: '7px 12px', position: 'relative',
                  letterSpacing: '0.01em',
                }}>
                  Sign in
                </Link>

                {/* Get started — split pill, always light variant */}
                <Link to="/signup" id="nav-signup-btn" className="nav-cta-pill nav-cta-light hide-mobile">
                  <span className="nav-cta-text">Get started</span>
                  <span className="nav-cta-icon">
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <path d="M7 17L17 7M17 7H8M17 7v9"/>
                    </svg>
                  </span>
                </Link>
              </>
            )}

            {/* ── Hamburger button (mobile only) ── */}
            <button
              className="nav-hamburger"
              onClick={() => setDrawerOpen(true)}
              aria-label="Open menu"
            >
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <line x1="3" y1="6" x2="21" y2="6"/>
                <line x1="3" y1="12" x2="21" y2="12"/>
                <line x1="3" y1="18" x2="21" y2="18"/>
              </svg>
            </button>
          </div>

        </div>
      </nav>

      {/* ── Mobile Drawer ── */}
      {drawerOpen && (
        <>
          <div className="nav-mobile-overlay" onClick={() => setDrawerOpen(false)} />
          <div className="nav-mobile-drawer">
            {/* Drawer header */}
            <div className="nav-drawer-head">
              <Logo size="sm" tone="light" />
              <button className="nav-drawer-close" onClick={() => setDrawerOpen(false)} aria-label="Close menu">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
                </svg>
              </button>
            </div>

            {/* User info (if logged in) */}
            {user && (
              <div className="nav-drawer-user">
                <div className="nav-drawer-avatar">
                  {(user.name?.[0] || user.email?.[0])?.toUpperCase()}
                </div>
                <div className="nav-drawer-user-info">
                  {user.name && <div className="nav-drawer-user-name">{user.name}</div>}
                  <div className="nav-drawer-user-email">{user.email}</div>
                </div>
              </div>
            )}

            {/* Links */}
            <div className="nav-drawer-links">
              {user ? (
                <>
                  <div className="nav-drawer-section-label">Navigation</div>
                  {authLinks.map(link => (
                    <Link
                      key={link.href}
                      to={link.href}
                      className={`nav-drawer-link${isActive(link.href) ? ' active' : ''}`}
                      onClick={() => setDrawerOpen(false)}
                    >
                      {link.icon}
                      {link.label}
                    </Link>
                  ))}
                  <div className="nav-drawer-section-label">Account</div>
                  <Link
                    to="/profile"
                    className={`nav-drawer-link${isActive('/profile') ? ' active' : ''}`}
                    onClick={() => setDrawerOpen(false)}
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                    Profile
                  </Link>
                </>
              ) : (
                <>
                  <div className="nav-drawer-section-label">Explore</div>
                  {guestLinks.map(link => (
                    <Link
                      key={link.href}
                      to={link.href}
                      className={`nav-drawer-link${isActive(link.href) ? ' active' : ''}`}
                      onClick={() => setDrawerOpen(false)}
                    >
                      {link.icon}
                      {link.label}
                    </Link>
                  ))}
                </>
              )}
            </div>

            {/* Actions */}
            <div className="nav-drawer-actions">
              {user ? (
                <>
                  <Link to="/shorten" className="nav-drawer-btn nav-drawer-btn-primary" onClick={() => setDrawerOpen(false)}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M12 5v14M5 12h14"/></svg>
                    New Link
                  </Link>
                  <button className="nav-drawer-btn nav-drawer-btn-danger" onClick={handleLogout}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
                    Sign out
                  </button>
                </>
              ) : (
                <>
                  <Link to="/signup" className="nav-drawer-btn nav-drawer-btn-primary" onClick={() => setDrawerOpen(false)}>
                    Get started free
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M7 17L17 7M17 7H8M17 7v9"/></svg>
                  </Link>
                  <Link to="/login" className="nav-drawer-btn nav-drawer-btn-outline" onClick={() => setDrawerOpen(false)}>
                    Sign in
                  </Link>
                </>
              )}
            </div>
          </div>
        </>
      )}
    </>
  )
}
