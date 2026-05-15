'use client';

import React from 'react';
import Link from 'next/link';
import { Home, Package, LogOut, User, Search, Globe, ChevronDown, Key, LayoutDashboard } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useState, useRef, useEffect } from 'react';

export const Navbar = ({ session, username }: { session: unknown, username: string | null }) => {
  const { t, language, setLanguage } = useLanguage();
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsUserMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);
  
  return (
    <header style={{
      borderBottom: '1px solid var(--border-glass)',
      background: 'rgba(5, 7, 10, 0.8)',
      backdropFilter: 'blur(20px)',
      WebkitBackdropFilter: 'blur(20px)',
      position: 'sticky',
      top: 0,
      zIndex: 100,
      transition: 'var(--transition-smooth)'
    }}>
      <div className="container header-container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem 2rem' }}>
        <Link href="/" style={{ textDecoration: 'none' }}>
          <h1 style={{ fontSize: '1.6rem', fontWeight: 800, margin: 0, display: 'flex', alignItems: 'center' }} className="text-gradient">
            <span className="brand-text-desktop">VamosJuntos</span>
            <span className="brand-text-mobile" style={{ display: 'none' }}>
              <img src="/icons/icon-192x192.png" alt="VamosJuntos Logo" width="36" height="36" style={{ borderRadius: '8px' }} />
            </span>
          </h1>
        </Link>
        <nav className="nav-menu" style={{ display: 'flex', gap: '2rem', alignItems: 'center' }}>
          <Link href="/" className="nav-link" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Home size={18} strokeWidth={2} className="mobile-only-icon-lucide" />
            <span className="btn-text-mobile-hide">{t('nav_home')}</span>
          </Link>
          <Link href="/packages" className="nav-link" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Package size={18} strokeWidth={2} className="mobile-only-icon-lucide" />
            <span className="btn-text-mobile-hide">{t('nav_packages')}</span>
          </Link>
          <Link href="/tracking" className="nav-link" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Search size={18} strokeWidth={2} className="mobile-only-icon-lucide" />
            <span className="btn-text-mobile-hide">{t('nav_tracking')}</span>
          </Link>
          <div style={{ display: 'flex', alignItems: 'center', marginLeft: '0.5rem' }}>
            <button
              onClick={() => setLanguage(language === 'es' ? 'en' : 'es')}
              style={{
                background: 'rgba(255,255,255,0.05)',
                border: '1px solid var(--border-glass)',
                borderRadius: '8px',
                display: 'flex',
                alignItems: 'center',
                gap: '0.4rem',
                padding: '0.4rem 0.6rem',
                cursor: 'pointer',
                color: 'white',
                fontWeight: 600,
                fontSize: '0.8rem',
                transition: 'all 0.2s'
              }}
              title={language === 'es' ? 'Switch to English' : 'Cambiar a Español'}
            >
              <img 
                src={language === 'es' ? 'https://flagcdn.com/w20/es.png' : 'https://flagcdn.com/w20/us.png'} 
                width="18" 
                alt={language === 'es' ? 'ES' : 'EN'} 
                style={{ borderRadius: '2px', objectFit: 'cover' }}
              />
              <span>{language === 'es' ? 'ES' : 'EN'}</span>
            </button>
          </div>
          
          {session ? (
            <div style={{ position: 'relative' }} ref={menuRef}>
              <button 
                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                className="nav-auth-btn" 
                style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '0.5rem',
                  padding: '0.5rem 1rem',
                  borderRadius: 'var(--radius-md)',
                  background: isUserMenuOpen ? 'rgba(255,255,255,0.05)' : 'transparent'
                }}
              >
                <div style={{ 
                  width: '32px', 
                  height: '32px', 
                  borderRadius: '50%', 
                  background: 'linear-gradient(135deg, var(--primary), var(--secondary))',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '0.8rem',
                  fontWeight: 800,
                  color: 'white'
                }}>
                  {username ? username.charAt(0).toUpperCase() : 'A'}
                </div>
                <span className="btn-text-mobile-hide" style={{ fontWeight: 600, color: 'var(--text-main)' }}>
                  {username || 'Admin'}
                </span>
                <ChevronDown size={14} style={{ transform: isUserMenuOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.3s' }} />
              </button>

              {isUserMenuOpen && (
                <div className="user-dropdown-menu" style={{
                  position: 'absolute',
                  top: '120%',
                  right: '-10px',
                  width: '240px',
                  padding: '0.5rem',
                  zIndex: 1000,
                  boxShadow: '0 20px 40px rgba(0,0,0,0.8)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: '16px',
                  animation: 'fadeIn 0.2s ease',
                  background: 'rgba(5, 7, 10, 0.98)',
                  backdropFilter: 'blur(24px)',
                  WebkitBackdropFilter: 'blur(24px)'
                }}>
                  <div style={{ padding: '1rem', borderBottom: '1px solid rgba(255,255,255,0.05)', marginBottom: '0.5rem', background: 'rgba(255,255,255,0.02)', borderRadius: '10px' }}>
                    <p style={{ margin: 0, fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 700 }}>Conectado como</p>
                    <p style={{ margin: '0.2rem 0 0 0', fontSize: '1rem', fontWeight: 800, color: 'white', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {username || 'Administrador'}
                    </p>
                  </div>
                  
                  <Link href="/admin" className="dropdown-item" style={{ 
                    display: 'flex', alignItems: 'center', gap: '0.75rem', width: '100%', padding: '0.8rem 1rem', color: 'white', textDecoration: 'none', borderRadius: '10px', transition: 'all 0.2s'
                  }}>
                    <LayoutDashboard size={18} color="var(--primary)" />
                    <span style={{ fontWeight: 600 }}>Panel de Control</span>
                  </Link>

                  <Link href="/settings" className="dropdown-item" style={{ 
                    display: 'flex', alignItems: 'center', gap: '0.75rem', width: '100%', padding: '0.8rem 1rem', color: 'var(--text-main)', textDecoration: 'none', borderRadius: '10px', transition: 'all 0.2s'
                  }}>
                    <Key size={18} color="var(--text-muted)" />
                    <span style={{ fontWeight: 500 }}>Cambiar Contraseña</span>
                  </Link>
                  
                  <div style={{ height: '1px', background: 'rgba(255,255,255,0.05)', margin: '0.5rem 0' }}></div>

                  <form action="/api/auth/logout" method="POST" style={{ margin: 0 }}>
                    <button type="submit" className="dropdown-item" style={{ 
                      display: 'flex', alignItems: 'center', gap: '0.75rem', width: '100%', padding: '0.8rem 1rem', color: '#f43f5e', background: 'transparent', border: 'none', textAlign: 'left', cursor: 'pointer', borderRadius: '10px', transition: 'all 0.2s'
                    }}>
                      <LogOut size={18} />
                      <span style={{ fontWeight: 600 }}>Cerrar Sesión</span>
                    </button>
                  </form>
                </div>
              )}
            </div>
          ) : (
            <Link href="/login" className="nav-link" style={{ color: 'var(--primary)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <User size={18} strokeWidth={2} />
              <span className="btn-text-mobile-hide">{t('nav_login')}</span>
            </Link>
          )}
        </nav>
      </div>
      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .dropdown-item:hover {
          background: rgba(255,255,255,0.05) !important;
          transform: translateX(4px);
        }
        @media (max-width: 768px) {
          .user-dropdown-menu {
            right: -20px !important;
            width: 260px !important;
          }
          .brand-text-desktop { display: none !important; }
          .brand-text-mobile { display: inline !important; }
        }
      `}</style>
    </header>
  );
};
