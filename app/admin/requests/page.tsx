'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
    ArrowLeft, 
    Calendar, 
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
    Check,
    Clock
} from 'lucide-react';
import { getClientRequests, confirmPackage } from '../package/actions';
import { getTaxis } from '../taxis/actions';

interface Package {
    id: number;
    name: string;
    description?: string;
    status: string;
    price: number;
    sales: number;
    date: string;
    image: string | null;
    items?: unknown;
    driverId?: number;
    total?: number;
    driver?: {
        id: number;
        name: string;
        photo: string | null;
        taxis?: Array<{ model: string; plate: string }>;
    };
    createdAt: string;
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

const PreviewFlyerModal = ({ pkg, onClose }: { pkg: Package, onClose: () => void }) => {
    const displayPkg = {
        ...pkg,
        total: pkg.price || pkg.total || 0,
        items: Array.isArray(pkg.items) ? pkg.items : (typeof pkg.items === 'string' ? JSON.parse(pkg.items) : [])
    };

    return (
        <div className="modal-overlay" onClick={onClose} style={{ zIndex: 2000 }}>
            <div className="flyer-container" onClick={e => e.stopPropagation()}>
                <button className="flyer-close" onClick={onClose}><X size={24} /></button>
                
                <div className="flyer-hero" style={{ height: 'auto', padding: '3rem 2rem 1.5rem', background: 'linear-gradient(45deg, #1a1a1a, #0a0a0a)' }}>
                    <div className="hero-overlay" style={{ position: 'relative', background: 'transparent', padding: 0 }}>
                        <div className="flyer-badge" style={{ background: '#f59e0b' }}>SOLICITUD DE CLIENTE</div>
                        <h1 className="flyer-title">{displayPkg.name || 'Sin nombre'}</h1>
                        <div className="flyer-meta">
                            <span>VAMOS JUNTOS • CUSTOM REQUEST</span>
                        </div>
                    </div>
                </div>

                <div className="flyer-body">
                    <div className="flyer-description">
                        <p>{displayPkg.description || 'Sin descripción.'}</p>
                        <div style={{ marginTop: '1rem', padding: '0.75rem', background: 'rgba(245, 158, 11, 0.1)', border: '1px solid rgba(245, 158, 11, 0.2)', borderRadius: '10px', fontSize: '0.8rem', color: '#f59e0b' }}>
                            <Calendar size={14} style={{ marginRight: '0.5rem', verticalAlign: 'middle' }} />
                            Inicio: <strong>{displayPkg.date}</strong>
                        </div>
                    </div>

                    <div className="flyer-itinerary">
                        <h3>ITINERARIO SOLICITADO</h3>
                        <div className="flyer-items">
                            {displayPkg.items.length === 0 ? (
                                <p className="empty-msg">No hay servicios en el itinerario.</p>
                            ) : (
                                displayPkg.items.map((item: { id?: string; name: string; type: string }, idx: number) => (
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

                    <div className="flyer-footer">
                        <div className="price-box">
                            <span className="label">PRESUPUESTO</span>
                            <span className="value">${displayPkg.total.toLocaleString()} <small>USD</small></span>
                        </div>
                        <div className="contact-info">
                            <p>Vamos Juntos Luxury</p>
                            <div className="brand-logo">SOLICITUD</div>
                        </div>
                    </div>
                </div>
            </div>
            
            <style jsx>{`
                .modal-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.85); backdrop-filter: blur(15px); display: flex; align-items: center; justify-content: center; padding: 2rem; }
                .flyer-container { width: 100%; max-width: 450px; background: #0a0a0a; border-radius: 30px; overflow-y: auto; max-height: 90vh; position: relative; box-shadow: 0 30px 60px rgba(0,0,0,0.8); border: 1px solid rgba(255,255,255,0.1); }
                .flyer-close { position: absolute; top: 1.5rem; right: 1.5rem; z-index: 10; background: rgba(0,0,0,0.5); border: 1px solid rgba(255,255,255,0.2); color: white; width: 40px; height: 40px; border-radius: 50%; display: flex; align-items: center; justify-content: center; cursor: pointer; }
                .flyer-badge { font-size: 0.6rem; font-weight: 900; color: white; padding: 0.3rem 0.8rem; border-radius: 5px; width: fit-content; margin-bottom: 0.75rem; letter-spacing: 0.15em; }
                .flyer-title { font-size: 1.8rem; font-weight: 800; margin: 0; line-height: 1.1; color: white; }
                .flyer-meta { font-size: 0.65rem; color: rgba(255,255,255,0.4); margin-top: 0.5rem; font-weight: 700; letter-spacing: 0.1em; }
                .flyer-body { padding: 2rem; }
                .flyer-description { font-size: 0.85rem; color: rgba(255,255,255,0.5); line-height: 1.6; margin-bottom: 2rem; }
                .flyer-itinerary h3 { font-size: 0.75rem; font-weight: 900; color: #f59e0b; letter-spacing: 0.2em; margin-bottom: 1.25rem; }
                .flyer-items { display: flex; flex-direction: column; gap: 0.8rem; margin-bottom: 2rem; }
                .flyer-item-row { display: flex; align-items: center; gap: 1rem; }
                .item-number { font-size: 0.65rem; font-weight: 900; color: rgba(255,255,255,0.15); }
                .item-icon-wrap { color: #f59e0b; }
                .item-info { display: flex; flex-direction: column; }
                .item-name { font-size: 0.9rem; font-weight: 700; color: white; }
                .item-type { font-size: 0.6rem; text-transform: uppercase; color: rgba(255,255,255,0.3); font-weight: 700; }
                .flyer-footer { border-top: 1px solid rgba(255,255,255,0.05); padding-top: 1.5rem; display: flex; justify-content: space-between; align-items: flex-end; }
                .price-box .label { font-size: 0.6rem; font-weight: 800; color: rgba(255,255,255,0.2); }
                .price-box .value { font-size: 1.6rem; font-weight: 900; color: white; }
                .brand-logo { font-size: 1.1rem; font-weight: 900; color: #f59e0b; }
            `}</style>
        </div>
    );
};

export default function RequestsPage() {
    const [requests, setRequests] = useState<Package[]>([]);
    const [loading, setLoading] = useState(true);
    const [previewPkg, setPreviewPkg] = useState<Package | null>(null);
    const [isConfirming, setIsConfirming] = useState<number | null>(null);
    const [taxis, setTaxis] = useState<Array<{ driver: { id: number; name: string } }>>([]);

    useEffect(() => {
        const fetchData = async () => {
            const [reqRes, taxiRes] = await Promise.all([
                getClientRequests(),
                getTaxis()
            ]);
            if (reqRes.success && reqRes.data) setRequests(reqRes.data as Package[]);
            if (taxiRes.success && taxiRes.data) setTaxis(taxiRes.data);
            setLoading(false);
        };
        fetchData();
    }, []);

    const handleConfirm = async (pkgId: number, driverId: number) => {
        setIsConfirming(pkgId);
        const res = await confirmPackage(pkgId, driverId);
        if (res.success) {
            setRequests(prev => prev.map(p => p.id === pkgId ? { ...p, status: 'Confirmado', driverId } : p));
        } else {
            alert(res.error);
        }
        setIsConfirming(null);
    };

    return (
        <div style={{ padding: '1rem' }}>
            <header style={{ marginBottom: '3rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '0.5rem' }}>
                        <Link href="/admin" className="btn-glass-nav" style={{ padding: '0.5rem', borderRadius: '10px' }}><ArrowLeft size={20} /></Link>
                        <h1 className="heading-1" style={{ margin: 0 }}>Solicitudes de Clientes</h1>
                    </div>
                    <p style={{ color: 'var(--text-muted)' }}>Gestiona y confirma los paquetes personalizados creados por los clientes.</p>
                </div>
            </header>

            <div className="glass-panel" style={{ padding: '1rem', borderRadius: '25px', minHeight: '400px' }}>
                {loading ? (
                    <div style={{ textAlign: 'center', padding: '6rem' }}>
                        <Loader2 className="animate-spin" size={40} color="var(--primary)" style={{ margin: '0 auto 1rem' }} />
                        <p>Cargando solicitudes...</p>
                    </div>
                ) : requests.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '6rem' }}>
                        <div style={{ width: '80px', height: '80px', borderRadius: '50%', background: 'rgba(255,255,255,0.02)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem' }}>
                            <Clock size={32} color="var(--text-muted)" />
                        </div>
                        <h3>No hay solicitudes pendientes</h3>
                        <p style={{ color: 'var(--text-muted)' }}>Las nuevas solicitudes aparecerán aquí automáticamente.</p>
                    </div>
                ) : (
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '1.5rem' }}>
                        {requests.map((pkg) => (
                            <div key={pkg.id} className="request-card glass-panel" style={{ padding: '1.5rem', position: 'relative' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem' }}>
                                    <div>
                                        <div style={{ fontSize: '0.65rem', fontWeight: 900, color: '#f59e0b', letterSpacing: '0.1em', marginBottom: '0.5rem' }}>
                                            ID: #{pkg.id} • {new Date(pkg.createdAt).toLocaleDateString()}
                                        </div>
                                        <h3 style={{ margin: 0, fontSize: '1.2rem' }}>{pkg.name}</h3>
                                    </div>
                                    <span style={{ 
                                        padding: '0.3rem 0.75rem', 
                                        borderRadius: '8px', 
                                        fontSize: '0.7rem', 
                                        fontWeight: 800,
                                        background: pkg.status === 'Confirmado' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(245, 158, 11, 0.1)',
                                        color: pkg.status === 'Confirmado' ? '#10b981' : '#f59e0b'
                                    }}>
                                        {pkg.status}
                                    </span>
                                </div>

                                <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '1.5rem', overflowX: 'auto', paddingBottom: '0.5rem' }} className="custom-scrollbar">
                                    {(Array.isArray(pkg.items) ? pkg.items : []).map((item: { name: string; type: string }, idx: number) => (
                                        <div key={idx} style={{ padding: '0.5rem', background: 'rgba(255,255,255,0.03)', borderRadius: '10px', display: 'flex', alignItems: 'center', gap: '0.5rem', flexShrink: 0 }}>
                                            <TypeIcon type={item.type} size={14} />
                                            <span style={{ fontSize: '0.7rem', fontWeight: 600 }}>{item.name}</span>
                                        </div>
                                    ))}
                                </div>

                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 'auto' }}>
                                    <div>
                                        <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Presupuesto</div>
                                        <div style={{ fontSize: '1.2rem', fontWeight: 800, color: 'white' }}>${pkg.price.toLocaleString()} <small style={{ fontSize: '0.7rem', opacity: 0.5 }}>USD</small></div>
                                    </div>
                                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                                        <button onClick={() => setPreviewPkg(pkg)} className="btn-glass-nav" style={{ width: '40px', height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '10px' }}>
                                            <Eye size={18} />
                                        </button>
                                        
                                        {pkg.status === 'Pendiente' && (
                                            <div className="confirm-group" style={{ position: 'relative' }}>
                                                <select 
                                                    onChange={(e) => handleConfirm(pkg.id, Number(e.target.value))}
                                                    disabled={isConfirming === pkg.id}
                                                    style={{
                                                        padding: '0.6rem 2.5rem 0.6rem 1rem',
                                                        borderRadius: '10px',
                                                        background: 'var(--primary)',
                                                        color: 'white',
                                                        border: 'none',
                                                        fontSize: '0.8rem',
                                                        fontWeight: 700,
                                                        appearance: 'none',
                                                        cursor: 'pointer'
                                                    }}
                                                >
                                                    <option value="">Confirmar con...</option>
                                                    {taxis.map(t => (
                                                        <option key={t.driver.id} value={t.driver.id}>{t.driver.name}</option>
                                                    ))}
                                                </select>
                                                <Check size={16} style={{ position: 'absolute', right: '1rem', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} />
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {previewPkg && <PreviewFlyerModal pkg={previewPkg} onClose={() => setPreviewPkg(null)} />}

            <style jsx>{`
                .request-card { transition: all 0.3s; border: 1px solid var(--border-glass); }
                .request-card:hover { transform: translateY(-5px); border-color: var(--primary); background: rgba(255,255,255,0.04); }
                .custom-scrollbar::-webkit-scrollbar { height: 4px; }
                .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 10px; }
            `}</style>
        </div>
    );
}
