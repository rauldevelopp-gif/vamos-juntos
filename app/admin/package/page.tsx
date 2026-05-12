'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowLeft, Plus, Edit2, Trash2, Calendar, Loader2, Eye, X, Image as ImageIcon, Plane, Hotel, Utensils, Palmtree, Camera, Anchor, Info, Check } from 'lucide-react';
import { getPackages, confirmPackage } from './actions';

interface Package {
    id: number;
    name: string;
    description?: string;
    status: string;
    price: number;
    sales: number;
    date: string;
    image: string | null;
    items?: any;
    driverId?: number;
    total?: number;
    driver?: any;
}

const TypeIcon = ({ type, size = 18 }: { type: any; size?: number }) => {
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

const PreviewFlyerModal = ({ pkg, onClose }: { pkg: any, onClose: () => void }) => {
    // Standardize total for flyer
    const displayPkg = {
        ...pkg,
        total: pkg.price || pkg.total || 0,
        items: Array.isArray(pkg.items) ? pkg.items : (typeof pkg.items === 'string' ? JSON.parse(pkg.items) : [])
    };

    return (
        <div className="modal-overlay" onClick={onClose} style={{ zIndex: 2000 }}>
            <div className="flyer-container" onClick={e => e.stopPropagation()}>
                <button className="flyer-close" onClick={onClose}><X size={24} /></button>
                
                <div className="flyer-hero">
                    {displayPkg.image ? (
                        <img src={displayPkg.image} alt={displayPkg.name} className="hero-img" />
                    ) : (
                        <div className="hero-placeholder">
                            <ImageIcon size={64} opacity={0.2} />
                        </div>
                    )}
                    <div className="hero-overlay">
                        <div className="flyer-badge">PAQUETE EXCLUSIVO</div>
                        <h1 className="flyer-title">{displayPkg.name || 'Sin nombre'}</h1>
                        <div className="flyer-meta">
                            <span>VAMOS JUNTOS • LUXURY TRAVEL</span>
                        </div>
                    </div>
                </div>

                <div className="flyer-body">
                    <div className="flyer-description">
                        <p>{displayPkg.description || 'Este paquete ha sido diseñado meticulosamente para ofrecer una experiencia inolvidable en el Caribe Mexicano.'}</p>
                    </div>

                    <div className="flyer-itinerary">
                        <h3>ITINERARIO SELECTO</h3>
                        <div className="flyer-items">
                            {displayPkg.items.length === 0 ? (
                                <p className="empty-msg">Este paquete es promocional directo.</p>
                            ) : (
                                displayPkg.items.map((item: any, idx: number) => (
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
                            <div className="driver-label">CHOFER ASIGNADO</div>
                            <div className="driver-flyer-card">
                                <img src={displayPkg.driver.photo || 'https://i.pravatar.cc/150?u=' + displayPkg.driver.id} alt="Driver" />
                                <div className="driver-flyer-info">
                                    <div className="driver-flyer-name">{displayPkg.driver.name}</div>
                                    <div className="driver-flyer-role">
                                        Driver VIP • <span style={{ color: 'white' }}>{displayPkg.driver.taxis?.[0]?.model || 'Taxi Asignado'}</span>
                                    </div>
                                    <div style={{ fontSize: '0.65rem', color: 'rgba(255,255,255,0.3)', marginTop: '0.2rem' }}>
                                        Placas: {displayPkg.driver.taxis?.[0]?.plate || '---'}
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    <div className="flyer-footer">
                        <div className="price-box">
                            <span className="label">PRECIO TOTAL</span>
                            <span className="value">${displayPkg.total.toLocaleString()} <small>USD</small></span>
                        </div>
                        <div className="contact-info">
                            <p>Reserva con tu Concierge VIP</p>
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
                .flyer-close:hover { background: #ef4444; border-color: #ef4444; transform: rotate(90deg); }
                
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

export default function PackagesPage() {
    const [packages, setPackages] = useState<Package[]>([]);
    const [loading, setLoading] = useState(true);
    const [previewPkg, setPreviewPkg] = useState<Package | null>(null);

    useEffect(() => {
        const fetchPackages = async () => {
            const result = await getPackages();
            if (result.success && result.data) {
                // @ts-ignore
                setPackages(result.data);
            }
            setLoading(false);
        };
        fetchPackages();
    }, []);

    return (
        <div style={{ padding: '1rem', maxWidth: '1200px', margin: '0 auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2.5rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <Link href="/admin" className="btn-glass-nav" style={{ width: '40px', height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '12px', textDecoration: 'none', padding: 0 }}>
                        <ArrowLeft size={20} strokeWidth={2} />
                    </Link>
                    <div>
                        <h1 style={{ fontSize: '1.8rem', fontWeight: 800, margin: 0 }} className="text-gradient">
                            Paquetes Premium
                        </h1>
                        <p style={{ color: 'var(--text-muted)', margin: '0.5rem 0 0 0' }}>
                            Gestiona el catálogo de experiencias exclusivas disponibles para todos los clientes.
                        </p>
                    </div>
                </div>
                
                <Link href="/admin/build" className="btn-premium" style={{ padding: '0.8rem 1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <Plus size={18} strokeWidth={2.5} />
                    <span className="btn-text-mobile-hide">Nuevo Paquete</span>
                </Link>
            </div>

            <div className="glass-panel" style={{ overflow: 'hidden', borderRadius: '20px' }}>
                {loading ? (
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '6rem', color: 'var(--text-muted)' }}>
                        <Loader2 className="animate-spin" size={32} style={{ marginBottom: '1rem', color: 'var(--primary)' }} />
                        <p>Cargando paquetes...</p>
                    </div>
                ) : (
                    <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                        <thead>
                            <tr style={{ background: 'rgba(255,255,255,0.03)', borderBottom: '1px solid var(--border-glass)' }}>
                                <th style={{ padding: '1.2rem', color: 'var(--text-muted)', fontWeight: 600, fontSize: '0.9rem' }}>Nombre del Paquete</th>
                                <th style={{ padding: '1.2rem', color: 'var(--text-muted)', fontWeight: 600, fontSize: '0.9rem' }}>Estado</th>
                                <th style={{ padding: '1.2rem', color: 'var(--text-muted)', fontWeight: 600, fontSize: '0.9rem' }}>Precio Base</th>
                                <th style={{ padding: '1.2rem', color: 'var(--text-muted)', fontWeight: 600, fontSize: '0.9rem' }}>Ventas</th>
                                <th style={{ padding: '1.2rem', color: 'var(--text-muted)', fontWeight: 600, fontSize: '0.9rem' }}>Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {packages.map((pkg) => (
                                <tr key={pkg.id} style={{ borderBottom: '1px solid var(--border-glass)', transition: 'var(--transition-smooth)' }} className="hover-row">
                                    <td style={{ padding: '1.2rem' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                            <div style={{ width: '45px', height: '45px', borderRadius: '12px', background: 'rgba(255,255,255,0.05)', overflow: 'hidden', flexShrink: 0 }}>
                                                {pkg.image ? (
                                                    <img src={pkg.image} alt={pkg.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                                ) : (
                                                    <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                                        <Calendar size={20} color="var(--text-muted)" />
                                                    </div>
                                                )}
                                            </div>
                                            <div>
                                                <div style={{ fontWeight: 700, color: 'var(--text-main)' }}>{pkg.name}</div>
                                                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                                                    <Calendar size={12} /> Próximo: {pkg.date}
                                                </div>
                                            </div>
                                        </div>
                                    </td>
                                    <td style={{ padding: '1.2rem' }}>
                                        <span style={{ 
                                            padding: '0.4rem 0.8rem', borderRadius: '10px', fontSize: '0.75rem', fontWeight: 700,
                                            background: pkg.status === 'Activo' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(255, 255, 255, 0.05)',
                                            color: pkg.status === 'Activo' ? '#10b981' : 'var(--text-muted)'
                                        }}>
                                            {pkg.status}
                                        </span>
                                    </td>
                                    <td style={{ padding: '1.2rem' }}>
                                        <div style={{ fontWeight: 800, color: 'var(--primary)', fontSize: '1.1rem' }}>
                                            ${pkg.price.toLocaleString()}
                                        </div>
                                    </td>
                                    <td style={{ padding: '1.2rem' }}>
                                        <div style={{ fontWeight: 600 }}>{pkg.sales} unid.</div>
                                    </td>
                                    <td style={{ padding: '1.2rem' }}>
                                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                                            {pkg.status === 'Pendiente' && (
                                                <button 
                                                    onClick={async () => {
                                                        if (confirm('¿Confirmar esta solicitud de cliente?')) {
                                                            const res = await confirmPackage(pkg.id, 1); // Asignando driver ID 1 por defecto
                                                            if (res.success) {
                                                                location.reload();
                                                            }
                                                        }
                                                    }} 
                                                    className="btn-premium" 
                                                    style={{ padding: '0.5rem', borderRadius: '10px', background: '#10b981', borderColor: '#10b981' }} 
                                                    title="Confirmar Solicitud"
                                                >
                                                    <Check size={16} />
                                                </button>
                                            )}
                                            <button onClick={() => setPreviewPkg(pkg)} className="btn-glass-nav" style={{ padding: '0.5rem', borderRadius: '10px' }} title="Ver Detalles">
                                                <Eye size={16} />
                                            </button>
                                            <button className="btn-glass-nav" style={{ padding: '0.5rem', borderRadius: '10px' }}>
                                                <Edit2 size={16} />
                                            </button>
                                            <button className="btn-glass-nav" style={{ padding: '0.5rem', borderRadius: '10px', color: '#ef4444' }}>
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>

            <style jsx>{`
                .hover-row:hover { background: rgba(255, 255, 255, 0.02); }
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
