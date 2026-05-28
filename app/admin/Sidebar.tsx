'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
    LayoutDashboard, 
    Package, 
    Clock,
    Plane, 
    Hotel, 
    Palmtree, 
    Camera, 
    Utensils, 
    Car, 
    Ship, 
    Home,
    Menu,
    X,
    Calendar,
    Percent,
    CreditCard,
    BedDouble,
    ShieldAlert,
    Users,
    Settings,
    ChevronDown,
    ChevronRight
} from 'lucide-react';
import { getCurrentUserAction } from '@/app/admin/users/actions';

const MENU_ITEMS = [
    { name: 'Dashboard', href: '/admin', icon: LayoutDashboard },
    { name: 'Reportes', href: '/admin/reports', icon: LayoutDashboard },
    { name: 'Cupones', href: '/admin/discounts', icon: Percent },
    { name: 'Solicitudes', href: '/admin/requests', icon: Clock },
    { name: 'Paquetes', href: '/admin/package', icon: Package },
    { name: 'Reservas', href: '/admin/reservations', icon: Calendar },
    { name: 'Reservas Hotel', href: '/admin/hotel-reservations', icon: BedDouble },
    { name: 'Aeropuerto', href: '/admin/airports', icon: Plane },
    { name: 'Hoteles', href: '/admin/hotels', icon: Hotel },
    { name: 'Playas', href: '/admin/beaches', icon: Palmtree },
    { name: 'Atracciones', href: '/admin/attractions', icon: Camera },
    { name: 'Restaurantes', href: '/admin/restaurants', icon: Utensils },
    { name: 'Flota Taxis', href: '/admin/taxis', icon: Car },
    { name: 'Yates', href: '/admin/yachts', icon: Ship },
];

export default function Sidebar() {
    const pathname = usePathname();
    const [isOpen, setIsOpen] = useState(false);
    const [user, setUser] = useState<any>(null);
    const [userLoading, setUserLoading] = useState(true);
    const [configExpanded, setConfigExpanded] = useState(false);

    useEffect(() => {
        getCurrentUserAction()
            .then(res => {
                if (res.success && res.user) {
                    setUser(res.user);
                }
                setUserLoading(false);
            })
            .catch(err => {
                console.error("Error loading user in Sidebar:", err);
                setUserLoading(false);
            });
    }, []);

    // Auto-expand Configuration if active path is inside it
    useEffect(() => {
        if (pathname === '/admin/billing' || pathname === '/admin/about-admin' || pathname === '/admin/about-operator') {
            setConfigExpanded(true);
        }
    }, [pathname]);

    const toggleSidebar = () => setIsOpen(!isOpen);

    const isSuperAdmin = user?.role === 'SUPER_ADMIN' || user?.username?.toLowerCase() === 'admin' || user?.role === 'ADMIN';
    const isOperator = user?.role === 'OPERATOR';
    const hasControlOperativo = isSuperAdmin || isOperator;

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
                    padding: '0.6rem',
                    borderRadius: '12px',
                    border: '1px solid var(--border-glass)',
                    background: 'rgba(255,255,255,0.05)',
                    color: 'white',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                }}
            >
                {isOpen ? <X size={24} strokeWidth={2} /> : <Menu size={24} strokeWidth={2} />}
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
                {/* Return Home Link (Replaces Header) */}
                <div style={{ paddingBottom: '1rem', borderBottom: '1px solid var(--border-glass)', flexShrink: 0 }}>
                    <Link href="/" className="sidebar-link" style={{ color: 'var(--accent)', gap: '0.75rem', borderRadius: '12px', padding: '0.5rem' }}>
                        <Home size={22} strokeWidth={2} />
                        <span style={{ fontSize: '1.1rem', fontWeight: 700 }}>Volver al Inicio</span>
                    </Link>
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
                        const Icon = item.icon;
                        return (
                            <Link 
                                key={item.href} 
                                href={item.href} 
                                className={`sidebar-link ${isActive ? 'active' : ''}`}
                                style={{ borderRadius: '12px', gap: '0.75rem' }}
                                onClick={() => setIsOpen(false)} // Close on click for mobile
                            >
                                <Icon size={20} strokeWidth={isActive ? 2.5 : 1.5} color={isActive ? 'var(--primary)' : 'currentColor'} />
                                <span>{item.name}</span>
                            </Link>
                        );
                    })}

                    {!userLoading && hasControlOperativo && (
                        <>
                            <div style={{ 
                                height: '1px', 
                                background: 'linear-gradient(90deg, transparent, var(--border-glass), transparent)', 
                                margin: '0.75rem 0',
                                flexShrink: 0 
                            }} />
                            
                            <div style={{ 
                                padding: '0 0.5rem 0.25rem 0.5rem', 
                                fontSize: '0.65rem', 
                                fontWeight: 800, 
                                color: 'var(--text-muted)', 
                                textTransform: 'uppercase', 
                                letterSpacing: '1px',
                                flexShrink: 0
                            }}>
                                Control Operativo
                            </div>

                            {isSuperAdmin && (
                                <>
                                    <Link 
                                        href="/admin/super-reports" 
                                        className={`sidebar-link ${pathname === '/admin/super-reports' ? 'active' : ''}`}
                                        style={{ 
                                            borderRadius: '12px', 
                                            gap: '0.75rem',
                                            border: pathname === '/admin/super-reports' ? '1px solid rgba(139,92,246,0.3)' : '1px solid transparent',
                                            background: pathname === '/admin/super-reports' ? 'rgba(139, 92, 246, 0.08)' : 'transparent',
                                            boxShadow: pathname === '/admin/super-reports' ? '0 0 15px rgba(139,92,246,0.1)' : 'none'
                                        }}
                                        onClick={() => setIsOpen(false)}
                                    >
                                        <ShieldAlert size={20} strokeWidth={pathname === '/admin/super-reports' ? 2.5 : 1.5} color={pathname === '/admin/super-reports' ? 'var(--primary)' : 'var(--text-muted)'} />
                                        <span style={{ fontWeight: pathname === '/admin/super-reports' ? 700 : 500 }}>Admin Reportes</span>
                                    </Link>

                                    <Link 
                                        href="/admin/users" 
                                        className={`sidebar-link ${pathname === '/admin/users' ? 'active' : ''}`}
                                        style={{ 
                                            borderRadius: '12px', 
                                            gap: '0.75rem',
                                            border: pathname === '/admin/users' ? '1px solid rgba(139,92,246,0.3)' : '1px solid transparent',
                                            background: pathname === '/admin/users' ? 'rgba(139, 92, 246, 0.08)' : 'transparent',
                                            boxShadow: pathname === '/admin/users' ? '0 0 15px rgba(139,92,246,0.1)' : 'none'
                                        }}
                                        onClick={() => setIsOpen(false)}
                                    >
                                        <Users size={20} strokeWidth={pathname === '/admin/users' ? 2.5 : 1.5} color={pathname === '/admin/users' ? 'var(--primary)' : 'var(--text-muted)'} />
                                        <span style={{ fontWeight: pathname === '/admin/users' ? 700 : 500 }}>Usuarios</span>
                                    </Link>
                                </>
                            )}

                            <div 
                                onClick={() => setConfigExpanded(!configExpanded)}
                                className={`sidebar-link ${configExpanded ? 'active' : ''}`}
                                style={{ 
                                    borderRadius: '12px', 
                                    gap: '0.75rem',
                                    cursor: 'pointer',
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'center'
                                }}
                            >
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                    <Settings size={20} strokeWidth={configExpanded ? 2.5 : 1.5} color={configExpanded ? 'var(--primary)' : 'var(--text-muted)'} />
                                    <span>Configuración</span>
                                </div>
                                {configExpanded ? <ChevronDown size={14} color="var(--text-muted)" /> : <ChevronRight size={14} color="var(--text-muted)" />}
                            </div>

                            {configExpanded && (
                                <div style={{ 
                                    display: 'flex', 
                                    flexDirection: 'column', 
                                    gap: '0.25rem', 
                                    paddingLeft: '1.25rem',
                                    borderLeft: '1px solid var(--border-glass)',
                                    marginLeft: '0.9rem',
                                    marginTop: '0.2rem',
                                    marginBottom: '0.4rem',
                                    transition: 'all 0.2s'
                                }}>
                                    {isSuperAdmin && (
                                        <>
                                            <Link 
                                                href="/admin/billing" 
                                                className={`sidebar-link ${pathname === '/admin/billing' ? 'active' : ''}`}
                                                style={{ 
                                                    borderRadius: '10px', 
                                                    gap: '0.6rem',
                                                    padding: '0.4rem 0.75rem',
                                                    fontSize: '0.8rem',
                                                    background: pathname === '/admin/billing' ? 'rgba(139, 92, 246, 0.05)' : 'transparent',
                                                }}
                                                onClick={() => setIsOpen(false)}
                                            >
                                                <CreditCard size={15} />
                                                <span>Facturación / Pasarelas</span>
                                            </Link>

                                            <Link 
                                                href="/admin/about-admin" 
                                                className={`sidebar-link ${pathname === '/admin/about-admin' ? 'active' : ''}`}
                                                style={{ 
                                                    borderRadius: '10px', 
                                                    gap: '0.6rem',
                                                    padding: '0.4rem 0.75rem',
                                                    fontSize: '0.8rem',
                                                    background: pathname === '/admin/about-admin' ? 'rgba(139, 92, 246, 0.05)' : 'transparent',
                                                }}
                                                onClick={() => setIsOpen(false)}
                                            >
                                                <ShieldAlert size={15} color="var(--accent)" />
                                                <span>Quiénes Somos (Admin)</span>
                                            </Link>
                                        </>
                                    )}

                                    {hasControlOperativo && (
                                        <Link 
                                            href="/admin/about-operator" 
                                            className={`sidebar-link ${pathname === '/admin/about-operator' ? 'active' : ''}`}
                                            style={{ 
                                                borderRadius: '10px', 
                                                gap: '0.6rem',
                                                padding: '0.4rem 0.75rem',
                                                fontSize: '0.8rem',
                                                background: pathname === '/admin/about-operator' ? 'rgba(139, 92, 246, 0.05)' : 'transparent',
                                            }}
                                            onClick={() => setIsOpen(false)}
                                        >
                                            <Users size={15} color="#06b6d4" />
                                            <span>Quiénes Somos (Operadores)</span>
                                        </Link>
                                    )}
                                </div>
                            )}
                        </>
                    )}
                </nav>

                <div style={{ marginTop: 'auto' }}></div>
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
