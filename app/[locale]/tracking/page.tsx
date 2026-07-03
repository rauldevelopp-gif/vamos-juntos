'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
    ArrowLeft, 
    Loader2, 
    Eye, 
    X, 
    Plane, 
    Hotel, 
    Utensils, 
    Palmtree, 
    Camera, 
    Anchor, 
    Info,
    CheckCircle2,
    Clock,
    AlertCircle,
    Bell
} from 'lucide-react';
import { getPackagesByClientId } from '../admin/package/actions';
import { useLanguage } from '../../../context/LanguageContext';
import { useCurrency } from '../../../context/CurrencyContext';
import Image from 'next/image';
import { getTranslatedValue } from '../../../lib/i18n-utils';

interface PackageItem {
    id: string;
    itemId: number;
    type: string;
    name: string;
    price: number;
    order: number;
}

interface Package {
    id: number;
    name: string;
    description?: string;
    status: string;
    price: number;
    sales: number;
    date: string;
    image: string | null;
    items?: PackageItem[] | string;
    driverId?: number;
    total?: number;
    driver?: {
        id: number;
        name: string;
        photo: string | null;
        taxis?: { model: string }[];
    };
    createdAt: Date;
}

const TypeIcon = ({ type, size = 18 }: { type: string; size?: number }) => {
    switch (type) {
        case 'aeropuerto': return <Plane size={size} />;
        case 'hotel': return <Hotel size={size} />;
        case 'restaurante': return <Utensils size={size} />;
        case 'playa': return <Palmtree size={size} />;
        case 'atraccion': return <Camera size={size} />;
        case 'yate': return <Anchor size={size} />;
        default: return <Info size={size} />;
    }
};

const StatusBadge = ({ status }: { status: string }) => {
    const { t, language } = useLanguage();
    const isEn = language === 'en';
    const isConfirmed = status === 'Confirmado';
    const isPending = status === 'Pendiente';
    
    return (
        <span style={{ 
            padding: '0.4rem 0.8rem', 
            borderRadius: '10px', 
            fontSize: '0.75rem', 
            fontWeight: 700,
            display: 'flex',
            alignItems: 'center',
            gap: '0.4rem',
            background: isConfirmed ? 'rgba(16, 185, 129, 0.15)' : (isPending ? 'rgba(245, 158, 11, 0.15)' : 'rgba(255, 255, 255, 0.05)'),
            color: isConfirmed ? '#10b981' : (isPending ? '#f59e0b' : 'var(--text-muted)'),
            border: `1px solid ${isConfirmed ? 'rgba(16, 185, 129, 0.2)' : (isPending ? 'rgba(245, 158, 11, 0.2)' : 'rgba(255, 255, 255, 0.1)')}`
        }}>
            {isConfirmed ? <CheckCircle2 size={14} /> : (isPending ? <Clock size={14} /> : <AlertCircle size={14} />)}
            {isConfirmed ? (isEn ? "Confirmed" : "Confirmado") : (isPending ? (isEn ? "Pending" : "Pendiente") : status)}
        </span>
    );
};

const PreviewFlyerModal = ({ pkg, onClose }: { pkg: Package, onClose: () => void }) => {
    const { t, language } = useLanguage();
    const { formatPrice } = useCurrency();
    const isEn = language === 'en';

    const displayPkg = {
        ...pkg,
        name: getTranslatedValue(pkg.name, language),
        description: getTranslatedValue(pkg.description, language),
        total: pkg.price || pkg.total || 0,
        items: Array.isArray(pkg.items) ? pkg.items : (typeof pkg.items === 'string' ? JSON.parse(pkg.items) : [])
    };

    return (
        <div className="modal-overlay" onClick={onClose} style={{ zIndex: 2000 }}>
            <div className="flyer-container" onClick={e => e.stopPropagation()}>
                <button className="flyer-close" onClick={onClose}><X size={24} /></button>
                
                <div className="flyer-hero" style={{ height: 'auto', padding: '3rem 2rem 1.5rem' }}>
                    <div className="hero-overlay" style={{ position: 'relative', background: 'transparent', padding: 0 }}>
                        <div className="flyer-badge">{t('custom_package_flyer') || (isEn ? "YOUR CUSTOM PACKAGE" : "TU PAQUETE PERSONALIZADO")}</div>
                        <h1 className="flyer-title">{displayPkg.name || '---'}</h1>
                        <div className="flyer-meta">
                            <span>{t('brand_name') || "VAMOS JUNTOS"} • {t('client_request_flyer') || (isEn ? "CLIENT REQUEST" : "SOLICITUD DE CLIENTE")}</span>
                        </div>
                    </div>
                </div>

                <div className="flyer-body">
                    <div className="flyer-status-section" style={{ marginBottom: '1.5rem' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <div style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-muted)' }}>{t('current_status') || "Status:"}</div>
                            <StatusBadge status={displayPkg.status} />
                        </div>
                    </div>

                    <div className="flyer-description">
                        <p>{displayPkg.description || '...'}</p>
                    </div>

                    <div className="flyer-itinerary">
                        <h3>{t('itinerary_flyer') || (isEn ? "YOUR ITINERARY" : "TU ITINERARIO")}</h3>
                        <div className="flyer-items">
                            {displayPkg.items.length === 0 ? (
                                <p className="empty-msg">...</p>
                            ) : (
                                displayPkg.items.map((item: PackageItem, idx: number) => (
                                    <div key={item.id || idx} className="flyer-item-row">
                                        <div className="item-number">{(idx + 1).toString().padStart(2, '0')}</div>
                                        <div className="item-icon-wrap"><TypeIcon type={item.type} size={16} /></div>
                                        <div className="item-info">
                                            <div className="item-name">{getTranslatedValue(item.name, language)}</div>
                                            <div className="item-type">{getTranslatedValue(item.type, language)}</div>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>

                    {displayPkg.driver && (
                        <div className="flyer-driver-section">
                            <div className="driver-label">{t('driver_confirmed_flyer') || (isEn ? "CONFIRMED DRIVER" : "CHOFER CONFIRMADO")}</div>
                            <div className="driver-flyer-card">
                                <Image 
                                    src={displayPkg.driver.photo || 'https://i.pravatar.cc/150?u=' + displayPkg.driver.id} 
                                    alt="Driver" 
                                    width={40}
                                    height={40}
                                    unoptimized
                                    style={{ borderRadius: '50%', border: '2px solid #8b5cf6' }}
                                />
                                <div className="driver-flyer-info">
                                    <div className="driver-flyer-name">{displayPkg.driver.name}</div>
                                    <div className="driver-flyer-role">
                                        Driver VIP • <span style={{ color: 'white' }}>{displayPkg.driver.taxis?.[0]?.model || (isEn ? 'Assigned Cab' : 'Taxi Asignado')}</span>
                                    </div>
                                    <div style={{ fontSize: '0.65rem', color: '#10b981', fontWeight: 700, marginTop: '0.2rem' }}>
                                        {t('request_approved_flyer') || (isEn ? "✓ Request Approved" : "✓ Solicitud Aprobada")}
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    <div className="flyer-footer">
                        <div className="price-box">
                            <span className="label">{t('estimated_price') || (isEn ? "ESTIMATED PRICE" : "PRECIO ESTIMADO")}</span>
                            <span className="value">{formatPrice(displayPkg.total)}</span>
                        </div>
                        <div className="contact-info">
                            <p>{t('brand_footer_note') || "Vamos Juntos Luxury"}</p>
                            <div className="brand-logo">VAMOS JUNTOS</div>
                        </div>
                    </div>
                </div>
            </div>
            
            <style jsx>{`
                .modal-overlay {
                    position: fixed;
                    inset: 0;
                    background: rgba(0,0,0,0.85);
                    backdrop-filter: blur(15px);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    padding: 2rem;
                }
                .flyer-container {
                    width: 100%;
                    max-width: 450px;
                    background: #0a0a0a;
                    border-radius: 30px;
                    overflow: hidden;
                    position: relative;
                    box-shadow: 0 30px 60px rgba(0,0,0,0.8);
                    border: 1px solid rgba(255,255,255,0.1);
                    animation: flyer-up 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
                }
                @keyframes flyer-up {
                    from { transform: translateY(50px) scale(0.9); opacity: 0; }
                    to { transform: translateY(0) scale(1); opacity: 1; }
                }
                .flyer-close {
                    position: absolute;
                    top: 1.5rem;
                    right: 1.5rem;
                    z-index: 10;
                    background: rgba(0,0,0,0.5);
                    backdrop-filter: blur(10px);
                    border: 1px solid rgba(255,255,255,0.2);
                    color: white;
                    width: 40px;
                    height: 40px;
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    cursor: pointer;
                    transition: all 0.2s;
                }
                .flyer-close:hover {
                    background: white;
                    color: black;
                }
                .flyer-hero {
                    position: relative;
                    overflow: hidden;
                }
                .flyer-badge {
                    font-size: 0.65rem;
                    font-weight: 900;
                    background: #8b5cf6;
                    color: white;
                    padding: 0.3rem 0.8rem;
                    border-radius: 5px;
                    width: fit-content;
                    margin-bottom: 0.75rem;
                    letter-spacing: 0.1em;
                }
                .flyer-title { font-size: 2rem; font-weight: 800; margin: 0; line-height: 1.1; color: white; text-shadow: 0 2px 10px rgba(0,0,0,0.5); }
                .flyer-meta { font-size: 0.7rem; color: rgba(255,255,255,0.5); margin-top: 0.5rem; font-weight: 700; letter-spacing: 0.1em; }
                
                .flyer-body { padding: 2rem; }
                .flyer-description { font-size: 0.9rem; color: rgba(255,255,255,0.6); line-height: 1.6; margin-bottom: 2rem; }
                
                .flyer-itinerary h3 { font-size: 0.8rem; font-weight: 900; color: #8b5cf6; letter-spacing: 0.2em; margin-bottom: 1.5rem; }
                .flyer-items { display: flex; flex-direction: column; gap: 1rem; margin-bottom: 2.5rem; }
                .flyer-item-row { display: flex; align-items: center; gap: 1rem; }
                .item-number { font-size: 0.7rem; font-weight: 900; color: rgba(255,255,255,0.2); }
                .item-icon-wrap { color: #8b5cf6; }
                .item-info { display: flex; flex-direction: column; }
                .item-name { font-size: 0.95rem; font-weight: 700; color: white; }
                .item-type { font-size: 0.65rem; text-transform: uppercase; color: rgba(255,255,255,0.3); font-weight: 700; }
                
                .flyer-footer {
                    border-top: 1px solid rgba(255,255,255,0.05);
                    padding-top: 2rem;
                    display: flex;
                    justify-content: space-between;
                    align-items: flex-end;
                }
                .price-box { display: flex; flex-direction: column; }
                .price-box .label { font-size: 0.7rem; font-weight: 800; color: rgba(255,255,255,0.3); }
                .price-box .value { font-size: 1.8rem; font-weight: 900; color: white; }
                .price-box .value <small> { font-size: 0.8rem; opacity: 0.5; }
                
                .contact-info { text-align: right; }
                .contact-info p { font-size: 0.75rem; color: rgba(255,255,255,0.5); margin: 0 0 0.5rem 0; font-weight: 600; }
                .brand-logo { font-size: 1.2rem; font-weight: 900; background: linear-gradient(to right, #8b5cf6, #d946ef); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
                
                .flyer-driver-section { margin-bottom: 2.5rem; background: rgba(255,255,255,0.03); padding: 1.25rem; border-radius: 1.25rem; border: 1px solid rgba(255,255,255,0.05); }
                .driver-label { font-size: 0.65rem; font-weight: 900; color: rgba(255,255,255,0.3); letter-spacing: 0.15em; margin-bottom: 1rem; }
                .driver-flyer-card { display: flex; align-items: center; gap: 1rem; }
                .driver-flyer-card img { width: 45px; height: 45px; border-radius: 50%; border: 2px solid #8b5cf6; }
                .driver-flyer-name { font-size: 1rem; font-weight: 700; color: white; }
                .driver-flyer-role { font-size: 0.75rem; color: #8b5cf6; font-weight: 600; }
            `}</style>
        </div>
    );
};

export default function TrackingPage() {
    const { t, language } = useLanguage();
    const { formatPrice } = useCurrency();
    const isEn = language === 'en';

    const [email, setEmail] = useState('');
    const [locatorCode, setLocatorCode] = useState('');
    const [viewMode, setViewMode] = useState<'checking_auth' | 'guest_form' | 'guest_result' | 'dashboard'>('checking_auth');
    
    const [loadingGuest, setLoadingGuest] = useState(false);
    const [guestError, setGuestError] = useState('');
    
    // Reservations state
    const [userReservations, setUserReservations] = useState<{ packages: any[], hotels: any[] }>({ packages: [], hotels: [] });
    const [customPackages, setCustomPackages] = useState<Package[]>([]);
    
    // Modal preview states
    const [previewItem, setPreviewItem] = useState<{ type: 'package' | 'hotel', data: any } | null>(null);
    const [previewPkg, setPreviewPkg] = useState<Package | null>(null);

    useEffect(() => {
        const checkUserSession = async () => {
            try {
                const res = await fetch('/api/auth/me');
                const data = await res.json();
                
                if (data.success && data.user) {
                    const r = await fetch('/api/user/reservations');
                    const resData = await r.json();
                    if (resData.success && resData.data) {
                        setUserReservations(resData.data);
                    }
                    
                    const clientPackages = await getPackagesByClientId(data.user.id.toString());
                    if (clientPackages.success && clientPackages.data) {
                        setCustomPackages(clientPackages.data as Package[]);
                    }
                    setViewMode('dashboard');
                } else {
                    const fallbackClientId = localStorage.getItem('vamosJuntos_clientId');
                    if (fallbackClientId) {
                        const clientPackages = await getPackagesByClientId(fallbackClientId);
                        if (clientPackages.success && clientPackages.data) {
                            setCustomPackages(clientPackages.data as Package[]);
                        }
                    }
                    setViewMode('guest_form');
                }
            } catch (error) {
                console.error("Auth check failed:", error);
                setViewMode('guest_form');
            }
        };
        checkUserSession();
    }, []);

    const handleGuestTrack = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoadingGuest(true);
        setGuestError('');
        setPreviewItem(null);

        try {
            const r = await fetch(`/api/user/reservations/track?email=${encodeURIComponent(email)}&locatorCode=${encodeURIComponent(locatorCode)}`);
            const data = await r.json();
            
            if (data.success && data.data) {
                setPreviewItem(data.data);
                setViewMode('guest_result');
            } else {
                setGuestError(data.error || (isEn ? "No active reservation matches this locator and email." : "No se encontró ninguna reserva activa con este localizador y correo."));
            }
        } catch (error) {
            setGuestError(isEn ? "Connection failure. Please retry." : "Error de conexión. Inténtalo de nuevo.");
        }
        setLoadingGuest(false);
    };

    return (
        <div style={{ padding: '1rem', maxWidth: '1000px', margin: '0 auto' }}>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2.5rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <Link href="/" className="btn-glass-nav" style={{ width: '40px', height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '12px', textDecoration: 'none', padding: 0 }}>
                        <ArrowLeft size={20} strokeWidth={2} />
                    </Link>
                    <div>
                        <h1 style={{ fontSize: '1.8rem', fontWeight: 800, margin: 0 }} className="text-gradient">
                            {viewMode === 'dashboard' ? (isEn ? 'My Reservations Panel' : 'Mi Panel de Reservas') : (viewMode === 'guest_result' ? (isEn ? 'Booking Details' : 'Detalle de Reserva') : (isEn ? 'Booking Tracking' : 'Seguimiento de Reservas'))}
                        </h1>
                        <p style={{ color: 'var(--text-muted)', margin: '0.5rem 0 0 0' }}>
                            {viewMode === 'dashboard' ? (isEn ? 'History of your purchases and custom quotes.' : 'Historial de tus compras y cotizaciones a la medida.') : (viewMode === 'guest_result' ? (isEn ? 'Check the status and information of your reservation.' : 'Consulta la información y estatus de tu reserva.') : (isEn ? 'Check the status of your purchases or custom packages.' : 'Consulta el estado de tus compras o paquetes personalizados.'))}
                        </p>
                    </div>
                </div>
            </div>

            <div className="glass-panel" style={{ padding: '2rem', borderRadius: '25px', minHeight: '400px' }}>
                {viewMode === 'checking_auth' && (
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '6rem', color: 'var(--text-muted)' }}>
                        <Loader2 className="animate-spin" size={32} style={{ marginBottom: '1rem', color: 'var(--primary)' }} />
                        <p>{isEn ? "Loading panel..." : "Cargando panel..."}</p>
                    </div>
                )}

                {viewMode === 'guest_form' && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '3rem' }}>
                        <div style={{ maxWidth: '400px', margin: '0 auto' }}>
                            <h3 style={{ textAlign: 'center', marginBottom: '1.5rem', fontSize: '1.4rem' }}>{isEn ? "Find your Reservation" : "Consulta tu Reserva"}</h3>
                            <form onSubmit={handleGuestTrack} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                <div>
                                    <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: 'rgba(255,255,255,0.6)', marginBottom: '0.4rem' }}>{isEn ? "Email Address" : "Correo Electrónico"}</label>
                                    <input 
                                        type="email" 
                                        value={email} 
                                        onChange={e => setEmail(e.target.value)} 
                                        required
                                        style={{ width: '100%', padding: '1rem', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', color: 'white' }}
                                    />
                                </div>
                                <div>
                                    <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: 'rgba(255,255,255,0.6)', marginBottom: '0.4rem' }}>{isEn ? "Locator Code (e.g., VJ-XXXXXX)" : "Localizador (Ej. VJ-XXXXXX)"}</label>
                                    <input 
                                        type="text" 
                                        value={locatorCode} 
                                        onChange={e => setLocatorCode(e.target.value.toUpperCase())} 
                                        required
                                        style={{ width: '100%', padding: '1rem', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', color: 'white' }}
                                    />
                                </div>
                                {guestError && <div style={{ color: '#ef4444', fontSize: '0.85rem', textAlign: 'center' }}>{guestError}</div>}
                                <button 
                                    type="submit" 
                                    disabled={loadingGuest || !email || !locatorCode}
                                    className="btn-premium"
                                    style={{ padding: '1rem', borderRadius: '12px', marginTop: '1rem' }}
                                >
                                    {loadingGuest ? <Loader2 className="animate-spin" /> : (isEn ? "Find Reservation" : "Buscar Reserva")}
                                </button>
                            </form>
                        </div>

                        {customPackages.length > 0 && (
                            <div>
                                <h3 style={{ fontSize: '1.2rem', marginBottom: '1.5rem', borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '2rem' }}>{isEn ? "Your Custom Packages" : "Tus Paquetes Personalizados"}</h3>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                    {customPackages.map((pkg) => (
                                        <div key={pkg.id} className="tracking-card" onClick={() => setPreviewPkg(pkg)} style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', padding: '1.25rem', background: 'rgba(255,255,255,0.02)', border: '1px solid var(--border-glass)', borderRadius: '1.25rem', cursor: 'pointer', transition: 'all 0.3s' }}>
                                            <div style={{ flex: 1 }}>
                                                <div style={{ fontSize: '1.1rem', fontWeight: 800 }}>{getTranslatedValue(pkg.name, language)}</div>
                                                <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>{t('created_at')} {new Date(pkg.createdAt).toLocaleDateString()}</div>
                                            </div>
                                            <div style={{ textAlign: 'right' }}>
                                                <StatusBadge status={pkg.status} />
                                                <div style={{ fontWeight: 800, color: 'var(--primary)', marginTop: '0.5rem' }}>{formatPrice(pkg.price)}</div>
                                            </div>
                                            <div style={{ color: 'var(--text-muted)' }}><Eye size={20} /></div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                )}

                {viewMode === 'guest_result' && previewItem && (
                    <div>
                        <button onClick={() => setViewMode('guest_form')} style={{ background: 'none', border: 'none', color: '#8b5cf6', cursor: 'pointer', marginBottom: '1rem', fontWeight: 800 }}>
                            {isEn ? "← New Search" : "← Nueva Búsqueda"}
                        </button>
                        <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid var(--border-glass)', borderRadius: '20px', padding: '2rem' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '2rem' }}>
                                <div>
                                    <h2 style={{ margin: '0 0 0.5rem 0', fontSize: '1.8rem' }}>
                                        {previewItem.type === 'package' ? getTranslatedValue(previewItem.data.package.name, language) : getTranslatedValue(previewItem.data.hotel.name, language)}
                                    </h2>
                                    <div style={{ color: 'var(--text-muted)' }}>{isEn ? "Locator Code: " : "Localizador: "}<strong style={{ color: 'white' }}>{previewItem.data.locatorCode}</strong></div>
                                </div>
                                <StatusBadge status={previewItem.data.status} />
                            </div>
                            
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '2rem' }}>
                                <div>
                                    <span style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', fontWeight: 800 }}>{isEn ? "Date" : "Fecha"}</span>
                                    <div style={{ fontSize: '1.1rem', fontWeight: 600 }}>{previewItem.type === 'package' ? previewItem.data.date : previewItem.data.checkInDate}</div>
                                </div>
                                <div>
                                    <span style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', fontWeight: 800 }}>Total</span>
                                    <div style={{ fontSize: '1.1rem', fontWeight: 600, color: '#10b981' }}>{formatPrice(previewItem.data.totalPrice)}</div>
                                </div>
                            </div>
                            <button className="btn-premium" style={{ width: '100%', padding: '1rem', borderRadius: '12px' }}>
                                {isEn ? "Download PDF Voucher" : "Descargar Comprobante PDF"}
                            </button>
                        </div>
                    </div>
                )}

                {viewMode === 'dashboard' && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                        {/* HERO: Próximo Viaje / Next Trip */}
                        {(() => {
                            const allTrips = [
                                ...userReservations.packages.map(p => ({ ...p, type: 'package', title: p.package.name, dt: new Date(p.date) })),
                                ...userReservations.hotels.map(h => ({ ...h, type: 'hotel', title: h.hotel.name, dt: new Date(h.checkInDate) }))
                            ].filter(t => t.dt.getTime() > new Date().getTime() - 86400000).sort((a, b) => a.dt.getTime() - b.dt.getTime());
                            
                            const nextTrip = allTrips[0];
                            
                            if (nextTrip) {
                                const daysLeft = Math.max(0, Math.ceil((nextTrip.dt.getTime() - new Date().getTime()) / (1000 * 3600 * 24)));
                                return (
                                    <div className="next-trip-hero" style={{ background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.15), rgba(217, 70, 239, 0.05))', border: '1px solid rgba(139, 92, 246, 0.3)', borderRadius: '25px', padding: '2.5rem', display: 'flex', flexWrap: 'wrap', gap: '2rem', alignItems: 'center' }}>
                                        <div style={{ flex: '1 1 300px' }}>
                                            <div style={{ fontSize: '0.8rem', fontWeight: 900, letterSpacing: '0.15em', color: 'var(--primary)', marginBottom: '0.5rem', textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                                <Plane size={16} /> {isEn ? "Your Next Adventure" : "Tu Próxima Aventura"}
                                            </div>
                                            <h2 style={{ fontSize: '2.2rem', margin: '0 0 1.5rem 0', textShadow: '0 2px 10px rgba(0,0,0,0.5)' }}>{getTranslatedValue(nextTrip.title, language)}</h2>
                                            <div style={{ display: 'flex', gap: '2rem', alignItems: 'center', marginBottom: '1.5rem' }}>
                                                <div>
                                                    <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700, marginBottom: '0.3rem' }}>{isEn ? "Countdown" : "Cuenta Regresiva"}</div>
                                                    <div style={{ fontSize: '1.8rem', fontWeight: 800, color: 'white' }}>{daysLeft} <span style={{ fontSize: '1rem', fontWeight: 500 }}>{isEn ? "Days" : "Días"}</span></div>
                                                </div>
                                                <div style={{ width: '1px', height: '50px', background: 'rgba(255,255,255,0.1)' }}></div>
                                                <div>
                                                    <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700, marginBottom: '0.3rem' }}>{isEn ? "Weather Forecast" : "Clima Esperado"}</div>
                                                    <div style={{ fontSize: '1.4rem', fontWeight: 700, color: '#38bdf8', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                                        ☀️ 28°C
                                                    </div>
                                                </div>
                                            </div>
                                            <StatusBadge status={nextTrip.status} />
                                        </div>
                                        <div style={{ background: 'white', padding: '1rem', borderRadius: '20px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.8rem', boxShadow: '0 20px 40px rgba(0,0,0,0.3)' }}>
                                            <img src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${nextTrip.locatorCode}`} alt="QR Code" style={{ width: '130px', height: '130px' }} />
                                            <span style={{ color: 'black', fontSize: '0.75rem', fontWeight: 900, letterSpacing: '0.15em' }}>{nextTrip.locatorCode}</span>
                                        </div>
                                    </div>
                                );
                            }
                            return null;
                        })()}

                        {userReservations.packages.length === 0 && userReservations.hotels.length === 0 && customPackages.length === 0 ? (
                            <div style={{ textAlign: 'center', padding: '4rem' }}>
                                <div style={{ background: 'rgba(255,255,255,0.03)', width: '80px', height: '80px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem' }}>
                                    <Clock size={32} color="var(--text-muted)" />
                                </div>
                                <h3>{isEn ? "No active reservations" : "No tienes reservas activas"}</h3>
                                <p style={{ color: 'var(--text-muted)' }}>{isEn ? "Explore our luxury packages and hotels." : "Explora nuestros paquetes y hoteles."}</p>
                                <Link href="/" className="btn-premium" style={{ display: 'inline-block', marginTop: '1rem', textDecoration: 'none' }}>{isEn ? "View Catalog" : "Ver Catálogo"}</Link>
                            </div>
                        ) : (
                            <div>
                                <h3 style={{ fontSize: '1.3rem', marginBottom: '1.5rem', color: 'rgba(255,255,255,0.9)' }}>{isEn ? "All your reservations" : "Todas tus reservas"}</h3>
                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem' }}>
                                    {userReservations.packages.map(pkg => (
                                        <div key={pkg.id} className="tracking-card" onClick={() => setPreviewItem({ type: 'package', data: pkg })} style={{ display: 'flex', flexDirection: 'column', padding: '1.5rem', background: 'rgba(255,255,255,0.02)', border: '1px solid var(--border-glass)', borderRadius: '1.25rem', cursor: 'pointer', position: 'relative', overflow: 'hidden' }}>
                                            <div style={{ position: 'absolute', top: 0, right: 0, width: '150px', height: '150px', background: 'radial-gradient(circle, rgba(139, 92, 246, 0.1) 0%, transparent 70%)', transform: 'translate(30%, -30%)' }}></div>
                                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem', position: 'relative' }}>
                                                <div style={{ background: 'rgba(139, 92, 246, 0.1)', padding: '0.8rem', borderRadius: '12px' }}><Palmtree color="#8b5cf6" size={24} /></div>
                                                <StatusBadge status={pkg.status} />
                                            </div>
                                            <div style={{ fontSize: '1.15rem', fontWeight: 800, marginBottom: '0.4rem', lineHeight: 1.3 }}>{getTranslatedValue(pkg.package.name, language)}</div>
                                            <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}><Clock size={14}/> {pkg.date}</div>
                                            <div style={{ marginTop: 'auto', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '1.2rem' }}>
                                                <div>
                                                    <div style={{ fontSize: '0.65rem', textTransform: 'uppercase', color: 'rgba(255,255,255,0.3)', fontWeight: 800, marginBottom: '0.2rem' }}>{isEn ? "LOCATOR" : "LOCALIZADOR"}</div>
                                                    <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 700, letterSpacing: '0.05em' }}>{pkg.locatorCode}</div>
                                                </div>
                                                <div style={{ fontWeight: 900, fontSize: '1.2rem', color: 'var(--primary)' }}>{formatPrice(pkg.totalPrice)}</div>
                                            </div>
                                        </div>
                                    ))}
                                    {userReservations.hotels.map(hot => (
                                        <div key={hot.id} className="tracking-card" onClick={() => setPreviewItem({ type: 'hotel', data: hot })} style={{ display: 'flex', flexDirection: 'column', padding: '1.5rem', background: 'rgba(255,255,255,0.02)', border: '1px solid var(--border-glass)', borderRadius: '1.25rem', cursor: 'pointer', position: 'relative', overflow: 'hidden' }}>
                                            <div style={{ position: 'absolute', top: 0, right: 0, width: '150px', height: '150px', background: 'radial-gradient(circle, rgba(16, 185, 129, 0.1) 0%, transparent 70%)', transform: 'translate(30%, -30%)' }}></div>
                                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem', position: 'relative' }}>
                                                <div style={{ background: 'rgba(16, 185, 129, 0.1)', padding: '0.8rem', borderRadius: '12px' }}><Hotel color="#10b981" size={24} /></div>
                                                <StatusBadge status={hot.status} />
                                            </div>
                                            <div style={{ fontSize: '1.15rem', fontWeight: 800, marginBottom: '0.4rem', lineHeight: 1.3 }}>{getTranslatedValue(hot.hotel.name, language)}</div>
                                            <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}><Clock size={14}/> {hot.checkInDate} a {hot.checkOutDate}</div>
                                            <div style={{ marginTop: 'auto', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '1.2rem' }}>
                                                <div>
                                                    <div style={{ fontSize: '0.65rem', textTransform: 'uppercase', color: 'rgba(255,255,255,0.3)', fontWeight: 800, marginBottom: '0.2rem' }}>{isEn ? "LOCATOR" : "LOCALIZADOR"}</div>
                                                    <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 700, letterSpacing: '0.05em' }}>{hot.locatorCode}</div>
                                                </div>
                                                <div style={{ fontWeight: 900, fontSize: '1.2rem', color: '#10b981' }}>{formatPrice(hot.totalPrice)}</div>
                                            </div>
                                        </div>
                                    ))}
                                    {customPackages.map((pkg) => (
                                        <div key={`custom-${pkg.id}`} className="tracking-card" onClick={() => setPreviewPkg(pkg)} style={{ display: 'flex', flexDirection: 'column', padding: '1.5rem', background: 'rgba(255,255,255,0.02)', border: '1px solid var(--border-glass)', borderRadius: '1.25rem', cursor: 'pointer', position: 'relative', overflow: 'hidden' }}>
                                            <div style={{ position: 'absolute', top: 0, right: 0, width: '150px', height: '150px', background: 'radial-gradient(circle, rgba(245, 158, 11, 0.1) 0%, transparent 70%)', transform: 'translate(30%, -30%)' }}></div>
                                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem', position: 'relative' }}>
                                                <div style={{ background: 'rgba(245, 158, 11, 0.1)', padding: '0.8rem', borderRadius: '12px' }}><Info color="#f59e0b" size={24} /></div>
                                                <StatusBadge status={pkg.status} />
                                            </div>
                                            <div style={{ fontSize: '1.15rem', fontWeight: 800, marginBottom: '0.4rem', lineHeight: 1.3 }}>{getTranslatedValue(pkg.name, language)}</div>
                                            <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}><Clock size={14}/> {isEn ? "Custom Itinerary" : "Itinerario a medida"}</div>
                                            <div style={{ marginTop: 'auto', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '1.2rem' }}>
                                                <div>
                                                    <div style={{ fontSize: '0.65rem', textTransform: 'uppercase', color: 'rgba(255,255,255,0.3)', fontWeight: 800, marginBottom: '0.2rem' }}>{t('created_at')}</div>
                                                    <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 700, letterSpacing: '0.05em' }}>{new Date(pkg.createdAt).toLocaleDateString()}</div>
                                                </div>
                                                <div style={{ fontWeight: 900, fontSize: '1.2rem', color: 'var(--primary)' }}>{formatPrice(pkg.price)}</div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </div>

            <style jsx>{`
                .tracking-card:hover {
                    background: rgba(255,255,255,0.05) !important;
                    border-color: var(--primary) !important;
                    transform: translateX(5px);
                }
            `}</style>

            {/* If they click a row in dashboard, we show preview modal */}
            {previewItem && viewMode === 'dashboard' && (
                <div className="modal-overlay" onClick={() => setPreviewItem(null)} style={{ zIndex: 2000, position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(10px)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <div style={{ background: '#111', padding: '3rem', borderRadius: '24px', width: '100%', maxWidth: '500px', border: '1px solid rgba(255,255,255,0.1)' }} onClick={e => e.stopPropagation()}>
                        <h2 style={{ marginBottom: '0.5rem' }}>{previewItem.type === 'package' ? getTranslatedValue(previewItem.data.package.name, language) : getTranslatedValue(previewItem.data.hotel.name, language)}</h2>
                        <div style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>{isEn ? "Locator Code: " : "Localizador: "} {previewItem.data.locatorCode}</div>
                        <StatusBadge status={previewItem.data.status} />
                        <div style={{ marginTop: '2rem' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '1rem' }}>
                                <span>{previewItem.type === 'package' ? (isEn ? "Passengers" : "Pasajeros") : (isEn ? "Guests" : "Huéspedes")}</span>
                                <strong>{previewItem.type === 'package' ? previewItem.data.passengers : previewItem.data.guests}</strong>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '1rem' }}>
                                <span>Total</span>
                                <strong style={{ color: '#10b981' }}>{formatPrice(previewItem.data.totalPrice)}</strong>
                            </div>
                        </div>
                        <button onClick={() => setPreviewItem(null)} className="btn-secondary" style={{ width: '100%', marginTop: '1rem', padding: '1rem', borderRadius: '12px' }}>{isEn ? "Close" : "Cerrar"}</button>
                    </div>
                </div>
            )}

            {/* Custom Package Flyer Modal */}
            {previewPkg && (
                <PreviewFlyerModal 
                    pkg={previewPkg} 
                    onClose={() => setPreviewPkg(null)} 
                />
            )}
        </div>
    );
}
