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
import { useLanguage } from '../../context/LanguageContext';
import Image from 'next/image';

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
    const { t } = useLanguage();
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
            {isConfirmed ? t('status_confirmed') : (isPending ? t('status_pending') : status)}
        </span>
    );
};

const PreviewFlyerModal = ({ pkg, onClose }: { pkg: Package, onClose: () => void }) => {
    const { t } = useLanguage();
    const displayPkg = {
        ...pkg,
        total: pkg.price || pkg.total || 0,
        items: Array.isArray(pkg.items) ? pkg.items : (typeof pkg.items === 'string' ? JSON.parse(pkg.items) : [])
    };

    return (
        <div className="modal-overlay" onClick={onClose} style={{ zIndex: 2000 }}>
            <div className="flyer-container" onClick={e => e.stopPropagation()}>
                <button className="flyer-close" onClick={onClose}><X size={24} /></button>
                
                <div className="flyer-hero" style={{ height: 'auto', padding: '3rem 2rem 1.5rem' }}>
                    <div className="hero-overlay" style={{ position: 'relative', background: 'transparent', padding: 0 }}>
                        <div className="flyer-badge">{t('custom_package_flyer')}</div>
                        <h1 className="flyer-title">{displayPkg.name || '---'}</h1>
                        <div className="flyer-meta">
                            <span>{t('brand_name')} • {t('client_request_flyer')}</span>
                        </div>
                    </div>
                </div>

                <div className="flyer-body">
                    <div className="flyer-status-section" style={{ marginBottom: '1.5rem' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <div style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-muted)' }}>{t('current_status')}</div>
                            <StatusBadge status={displayPkg.status} />
                        </div>
                    </div>

                    <div className="flyer-description">
                        <p>{displayPkg.description || '...'}</p>
                    </div>

                    <div className="flyer-itinerary">
                        <h3>{t('itinerary_flyer')}</h3>
                        <div className="flyer-items">
                            {displayPkg.items.length === 0 ? (
                                <p className="empty-msg">...</p>
                            ) : (
                                displayPkg.items.map((item: PackageItem, idx: number) => (
                                    <div key={item.id || idx} className="flyer-item-row">
                                        <div className="item-number">{(idx + 1).toString().padStart(2, '0')}</div>
                                        <div className="item-icon-wrap"><TypeIcon type={item.type} size={16} /></div>
                                        <div className="item-info">
                                            <div className="item-name">{item.name}</div>
                                            <div className="item-type">{item.type}</div>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>

                    {displayPkg.driver && (
                        <div className="flyer-driver-section">
                            <div className="driver-label">{t('driver_confirmed_flyer')}</div>
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
                                        Driver VIP • <span style={{ color: 'white' }}>{displayPkg.driver.taxis?.[0]?.model || 'Taxi Asignado'}</span>
                                    </div>
                                    <div style={{ fontSize: '0.65rem', color: '#10b981', fontWeight: 700, marginTop: '0.2rem' }}>
                                        {t('request_approved_flyer')}
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    <div className="flyer-footer">
                        <div className="price-box">
                            <span className="label">{t('estimated_price')}</span>
                            <span className="value">${displayPkg.total.toLocaleString()} <small>USD</small></span>
                        </div>
                        <div className="contact-info">
                            <p>{t('brand_footer_note')}</p>
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
                    overflow-y: auto;
                    max-height: 90vh;
                    position: relative;
                    box-shadow: 0 30px 60px rgba(0,0,0,0.8);
                    border: 1px solid rgba(255,255,255,0.1);
                    animation: flyer-up 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
                }
                .flyer-container::-webkit-scrollbar { width: 4px; }
                .flyer-container::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 10px; }
                
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
                    transition: all 0.3s;
                }
                
                .flyer-hero { height: 260px; position: relative; overflow: hidden; }
                .hero-img { width: 100%; height: 100%; object-fit: cover; }
                .hero-placeholder { width: 100%; height: 100%; background: linear-gradient(45deg, #1a1a1a, #2a2a2a); display: flex; align-items: center; justify-content: center; }
                .hero-overlay { position: absolute; inset: 0; background: linear-gradient(to top, #0a0a0a, transparent); display: flex; flex-direction: column; justify-content: flex-end; padding: 2rem; }
                
                .flyer-badge { font-size: 0.6rem; font-weight: 900; background: #8b5cf6; color: white; padding: 0.3rem 0.8rem; border-radius: 5px; width: fit-content; margin-bottom: 0.75rem; letter-spacing: 0.15em; }
                .flyer-title { font-size: 1.8rem; font-weight: 800; margin: 0; line-height: 1.1; color: white; }
                .flyer-meta { font-size: 0.65rem; color: rgba(255,255,255,0.4); margin-top: 0.5rem; font-weight: 700; letter-spacing: 0.1em; }
                
                .flyer-body { padding: 2rem; }
                .flyer-description { font-size: 0.85rem; color: rgba(255,255,255,0.5); line-height: 1.6; margin-bottom: 2rem; }
                
                .flyer-itinerary h3 { font-size: 0.75rem; font-weight: 900; color: #8b5cf6; letter-spacing: 0.2em; margin-bottom: 1.25rem; }
                .flyer-items { display: flex; flex-direction: column; gap: 0.8rem; margin-bottom: 2rem; }
                .flyer-item-row { display: flex; align-items: center; gap: 1rem; }
                .item-number { font-size: 0.65rem; font-weight: 900; color: rgba(255,255,255,0.15); }
                .item-icon-wrap { color: #8b5cf6; }
                .item-info { display: flex; flex-direction: column; }
                .item-name { font-size: 0.9rem; font-weight: 700; color: white; }
                .item-type { font-size: 0.6rem; text-transform: uppercase; color: rgba(255,255,255,0.3); font-weight: 700; }
                
                .flyer-driver-section { margin-bottom: 2rem; background: rgba(255,255,255,0.03); padding: 1.25rem; border-radius: 1.25rem; border: 1px solid rgba(255,255,255,0.05); }
                .driver-label { font-size: 0.6rem; font-weight: 900; color: rgba(255,255,255,0.2); letter-spacing: 0.15em; margin-bottom: 0.75rem; }
                .driver-flyer-card { display: flex; align-items: center; gap: 1rem; }
                .driver-flyer-card img { width: 40px; height: 40px; border-radius: 50%; border: 2px solid #8b5cf6; }
                .driver-flyer-name { font-size: 0.9rem; font-weight: 700; color: white; }
                .driver-flyer-role { font-size: 0.7rem; color: #8b5cf6; font-weight: 600; }
                
                .flyer-footer { border-top: 1px solid rgba(255,255,255,0.05); padding-top: 1.5rem; display: flex; justify-content: space-between; align-items: flex-end; }
                .price-box .label { font-size: 0.6rem; font-weight: 800; color: rgba(255,255,255,0.2); }
                .price-box .value { font-size: 1.6rem; font-weight: 900; color: white; }
                .price-box .value small { font-size: 0.7rem; opacity: 0.4; }
                .contact-info p { font-size: 0.7rem; color: rgba(255,255,255,0.4); margin: 0 0 0.3rem 0; }
                .brand-logo { font-size: 1.1rem; font-weight: 900; background: linear-gradient(to right, #8b5cf6, #d946ef); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
            `}</style>
        </div>
    );
};

export default function TrackingPage() {
    const { t } = useLanguage();
    const [packages, setPackages] = useState<Package[]>([]);
    const [loading, setLoading] = useState(true);
    const [previewPkg, setPreviewPkg] = useState<Package | null>(null);
    const [hasNewConfirmed, setHasNewConfirmed] = useState(false);

    useEffect(() => {
        const fetchPackages = async () => {
            const clientId = localStorage.getItem('vamosJuntos_clientId');
            if (!clientId) {
                setLoading(false);
                return;
            }

            const result = await getPackagesByClientId(clientId);
            if (result.success && result.data) {
                setPackages(result.data as unknown as Package[]);
                
                // Check if any package is confirmed
                const confirmed = (result.data as Package[]).some((p) => p.status === 'Confirmado');
                if (confirmed) {
                    setHasNewConfirmed(true);
                }
            }
            setLoading(false);
        };
        fetchPackages();
    }, []);

    return (
        <div style={{ padding: '1rem', maxWidth: '1000px', margin: '0 auto' }}>
            {hasNewConfirmed && (
                <div style={{ 
                    background: 'rgba(16, 185, 129, 0.1)', 
                    border: '1px solid rgba(16, 185, 129, 0.2)', 
                    padding: '1.25rem', 
                    borderRadius: '1.25rem', 
                    marginBottom: '2rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '1rem',
                    animation: 'slideDown 0.5s ease-out'
                }}>
                    <div style={{ background: '#10b981', color: 'white', padding: '0.6rem', borderRadius: '50%', display: 'flex' }}>
                        <Bell size={20} />
                    </div>
                    <div>
                        <div style={{ fontWeight: 800, color: '#10b981', fontSize: '1.1rem' }}>{t('request_confirmed_title')}</div>
                        <div style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>{t('request_confirmed_desc')}</div>
                    </div>
                </div>
            )}

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2.5rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <Link href="/" className="btn-glass-nav" style={{ width: '40px', height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '12px', textDecoration: 'none', padding: 0 }}>
                        <ArrowLeft size={20} strokeWidth={2} />
                    </Link>
                    <div>
                        <h1 style={{ fontSize: '1.8rem', fontWeight: 800, margin: 0 }} className="text-gradient">
                            {t('my_requests')}
                        </h1>
                        <p style={{ color: 'var(--text-muted)', margin: '0.5rem 0 0 0' }}>
                            {t('tracking_subtitle')}
                        </p>
                    </div>
                </div>
            </div>

            <div className="glass-panel" style={{ padding: '1rem', borderRadius: '25px', minHeight: '400px' }}>
                {loading ? (
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '6rem', color: 'var(--text-muted)' }}>
                        <Loader2 className="animate-spin" size={32} style={{ marginBottom: '1rem', color: 'var(--primary)' }} />
                        <p>{t('syncing_status')}</p>
                    </div>
                ) : packages.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '6rem' }}>
                        <div style={{ background: 'rgba(255,255,255,0.03)', width: '80px', height: '80px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem' }}>
                            <Clock size={32} color="var(--text-muted)" />
                        </div>
                        <h3>{t('no_active_requests')}</h3>
                        <p style={{ color: 'var(--text-muted)', maxWidth: '300px', margin: '0 auto 2rem' }}>{t('no_requests_desc')}</p>
                        <Link href="/build" className="btn-premium" style={{ display: 'inline-block' }}>
                            {t('btn_build')}
                        </Link>
                    </div>
                ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        {packages.map((pkg) => (
                            <div key={pkg.id} className="tracking-card" onClick={() => setPreviewPkg(pkg)} style={{ 
                                display: 'flex', 
                                alignItems: 'center', 
                                gap: '1.25rem', 
                                padding: '1.25rem', 
                                background: 'rgba(255,255,255,0.02)', 
                                border: '1px solid var(--border-glass)', 
                                borderRadius: '1.25rem',
                                cursor: 'pointer',
                                transition: 'all 0.3s'
                            }}>

                                
                                <div style={{ flex: 1 }}>
                                    <div style={{ fontSize: '1.1rem', fontWeight: 800 }}>{pkg.name}</div>
                                    <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
                                        {t('created_at')} {new Date(pkg.createdAt).toLocaleDateString()}
                                    </div>
                                </div>

                                <div style={{ textAlign: 'right' }}>
                                    <StatusBadge status={pkg.status} />
                                    <div style={{ fontWeight: 800, color: 'var(--primary)', marginTop: '0.5rem' }}>
                                        ${pkg.price.toLocaleString()} USD
                                    </div>
                                </div>
                                
                                <div style={{ color: 'var(--text-muted)' }}>
                                    <Eye size={20} />
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            <style jsx>{`
                .tracking-card:hover {
                    background: rgba(255,255,255,0.05) !important;
                    border-color: var(--primary) !important;
                    transform: translateX(5px);
                }
                @keyframes slideDown {
                    from { transform: translateY(-20px); opacity: 0; }
                    to { transform: translateY(0); opacity: 1; }
                }
            `}</style>

            {/* Preview Flyer Modal */}
            {previewPkg && (
                <PreviewFlyerModal 
                    pkg={previewPkg} 
                    onClose={() => setPreviewPkg(null)} 
                />
            )}
        </div>
    );
}
