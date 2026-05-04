'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const MENU_ITEMS = [
    { name: 'Dashboard', href: '/admin', icon: '📊' },
    { name: 'Paquetes', href: '/admin/package', icon: '📦' },
    { name: 'Aeropuerto', href: '/admin/airports', icon: '✈️' },
    { name: 'Hoteles', href: '/admin/hotels', icon: '🏨' },
    { name: 'Playas', href: '/admin/beaches', icon: '🏖️' },
    { name: 'Atracciones', href: '/admin/attractions', icon: '📷' },
    { name: 'Restaurantes', href: '/admin/restaurants', icon: '🍴' },
    { name: 'Flota Taxis', href: '/admin/taxis', icon: '🚕' },
    { name: 'Yates', href: '/admin/yachts', icon: '🚤' },
];

export default function Sidebar() {
    const pathname = usePathname();
    const [isOpen, setIsOpen] = useState(false);

    const toggleSidebar = () => setIsOpen(!isOpen);

    return (
        <>
            {/* Mobile Toggle Button */}
            <button 
                onClick={toggleSidebar}
                className="mobile-toggle-btn glass-panel"
                style={{ 
                    position: 'fixed', 
                    top: '1rem', 
                    right: '1rem', 
                    zIndex: 2000, 
                    display: 'none', // Shown via CSS in globals.css
                    padding: '0.5rem',
                    borderRadius: '10px',
                    fontSize: '1.5rem',
                    border: '1px solid var(--border-glass)'
                }}
            >
                {isOpen ? '✕' : '☰'}
            </button>

            {/* Sidebar Overlay (Mobile) */}
            {isOpen && (
                <div 
                    onClick={toggleSidebar}
                    className="sidebar-overlay"
                    style={{
                        position: 'fixed',
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: '100%',
                        background: 'rgba(0,0,0,0.6)',
                        backdropFilter: 'blur(4px)',
                        zIndex: 1400
                    }}
                />
            )}

            <aside 
                className={`glass-panel admin-sidebar ${isOpen ? 'open' : ''}`}
                style={{ 
                    width: '280px', 
                    margin: '1rem', 
                    padding: '1.5rem', 
                    display: 'flex', 
                    flexDirection: 'column', 
                    gap: '1rem', 
                    height: 'calc(100vh - 2rem)', 
                    position: 'sticky', 
                    top: '1rem', 
                    overflow: 'hidden',
                    zIndex: 1500,
                    transition: 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
                }}
            >
                {/* Fixed Header */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', paddingBottom: '1rem', borderBottom: '1px solid var(--border-glass)', flexShrink: 0 }}>
                    <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, color: 'white' }}>V</div>
                    <h2 className="text-gradient" style={{ fontSize: '1.4rem', fontWeight: 800, margin: 0 }}>Admin Hub</h2>
                </div>

                {/* Scrollable Navigation Area */}
                <nav style={{ 
                    display: 'flex', 
                    flexDirection: 'column', 
                    gap: '0.4rem', 
                    flex: 1, 
                    overflowY: 'auto', 
                    paddingRight: '0.5rem',
                    marginRight: '-0.5rem'
                }}>
                    {MENU_ITEMS.map((item) => {
                        const isActive = pathname === item.href;
                        return (
                            <Link 
                                key={item.href} 
                                href={item.href} 
                                className={`sidebar-link ${isActive ? 'active' : ''}`}
                                style={{ borderRadius: '12px' }}
                                onClick={() => setIsOpen(false)} // Close on click for mobile
                            >
                                <span style={{ fontSize: '1.2rem' }}>{item.icon}</span>
                                <span>{item.name}</span>
                            </Link>
                        );
                    })}
                </nav>

                {/* Return Home Link */}
                <div style={{ borderTop: '1px solid var(--border-glass)', paddingTop: '1rem', marginTop: 'auto' }}>
                    <Link href="/" className="sidebar-link" style={{ color: 'var(--accent)' }}>
                        <span>🏠</span>
                        <span>Volver al Inicio</span>
                    </Link>
                </div>
            </aside>

            <style jsx>{`
                @media (max-width: 768px) {
                    .mobile-toggle-btn {
                        display: block !important;
                    }
                    .admin-sidebar {
                        position: fixed !important;
                        top: 0 !important;
                        left: 0 !important;
                        height: 100vh !important;
                        margin: 0 !important;
                        border-radius: 0 !important;
                        transform: translateX(-100%);
                    }
                    .admin-sidebar.open {
                        transform: translateX(0);
                    }
                }
            `}</style>
        </>
    );
}
