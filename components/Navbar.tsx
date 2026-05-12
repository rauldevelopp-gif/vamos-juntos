'use client';

import React from 'react';
import Link from 'next/link';
import { Home, Package, LogOut, User, Search, Globe } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export const Navbar = ({ session }: { session: unknown }) => {
  const { t, language, setLanguage } = useLanguage();
  
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
          <h1 style={{ fontSize: '1.6rem', fontWeight: 800, margin: 0 }} className="text-gradient">VamosJuntos</h1>
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
          <div style={{ position: 'relative', display: 'flex', alignItems: 'center', gap: '0.5rem', marginLeft: '0.5rem' }}>
            <Globe size={18} className="text-muted" style={{ opacity: 0.6 }} />
            <select 
              value={language} 
              onChange={(e) => setLanguage(e.target.value as 'es' | 'en')}
              style={{
                background: 'transparent',
                color: 'white',
                border: 'none',
                fontSize: '0.85rem',
                fontWeight: 600,
                cursor: 'pointer',
                outline: 'none'
              }}
            >
              <option value="es" style={{ background: '#05070a' }}>Español</option>
              <option value="en" style={{ background: '#05070a' }}>English</option>
            </select>
          </div>
          
          {session ? (
            <form action="/api/auth/logout" method="POST" style={{ margin: 0 }}>
              <button type="submit" className="nav-auth-btn" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <LogOut size={18} strokeWidth={2} />
                <span className="btn-text-mobile-hide">{t('nav_logout')}</span>
              </button>
            </form>
          ) : (
            <Link href="/login" className="nav-link" style={{ color: 'var(--primary)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <User size={18} strokeWidth={2} />
              <span className="btn-text-mobile-hide">{t('nav_login')}</span>
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
};
