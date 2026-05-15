'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
    ArrowLeft, 
    Calendar, 
    Loader2, 
    X, 
    Plane,
    Hotel,
    Utensils,
    Palmtree,
    Camera,
    Anchor, 
    Info, 
    Clock,
    Search,
    UserPlus,
    Music,
    Wind,
    Dog,
    Cigarette,
    GlassWater,
    Wifi,
    Smartphone,
    Briefcase
} from 'lucide-react';
import { getClientRequests, confirmPackage } from '../package/actions';
import { getTaxis } from '../taxis/actions';
import Image from 'next/image';

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

interface Taxi {
    id: number;
    plate: string;
    model: string;
    passengers: number;
    amenities: string[];
    driver: {
        id: number;
        name: string;
        photo: string | null;
        license: string;
        expiration: string;
    };
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

const AssignDriverModal = ({ pkg, taxis, onClose, onAssign, isAssigning }: { 
    pkg: Package, 
    taxis: Taxi[], 
    onClose: () => void, 
    onAssign: (pkgId: number, driverId: number) => void,
    isAssigning: number | null 
}) => {
    const [search, setSearch] = useState('');
    
    const getAmenityIcon = (amenity: string) => {
        const icons: Record<string, React.ElementType> = {
            'Música': Music, 'A/C': Wind, 'Mascotas': Dog, 'Fumar': Cigarette, 
            'Bar': GlassWater, 'Bebidas': GlassWater, 'WiFi': Wifi, 'Equipaje Extra': Briefcase
        };
        const Icon = icons[amenity] || Smartphone;
        return <Icon size={12} />;
    };

    const filteredTaxis = taxis.filter(t => 
        t.driver.name.toLowerCase().includes(search.toLowerCase()) ||
        t.model.toLowerCase().includes(search.toLowerCase()) ||
        t.plate.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div 
            className="modal-overlay-assignment" 
            onClick={onClose}
            style={{
                position: 'fixed',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                width: '100vw',
                height: '100vh',
                background: 'rgba(0,0,0,0.85)',
                backdropFilter: 'blur(15px)',
                WebkitBackdropFilter: 'blur(15px)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '2rem',
                zIndex: 10000
            }}
        >
            <div className="modal-content glass-panel" onClick={e => e.stopPropagation()} style={{ maxWidth: '600px', width: '90%', padding: '2rem', maxHeight: '85vh', display: 'flex', flexDirection: 'column', position: 'relative', zIndex: 10001 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                    <div>
                        <h2 style={{ margin: 0, fontSize: '1.5rem' }} className="text-gradient">Asignar Chófer</h2>
                        <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', margin: '0.3rem 0 0 0' }}>Selecciona un profesional para la solicitud #{pkg.id}</p>
                    </div>
                    <button onClick={onClose} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}><X size={24} /></button>
                </div>

                <div style={{ position: 'relative', marginBottom: '1.5rem' }}>
                    <Search size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                    <input 
                        type="text" 
                        placeholder="Buscar por nombre, modelo o placa..." 
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        style={{
                            width: '100%',
                            padding: '0.8rem 1rem 0.8rem 3rem',
                            background: 'rgba(255,255,255,0.03)',
                            border: '1px solid var(--border-glass)',
                            borderRadius: '12px',
                            color: 'white',
                            fontSize: '0.95rem',
                            outline: 'none'
                        }}
                    />
                </div>

                <div style={{ overflowY: 'auto', flex: 1, paddingRight: '0.5rem' }} className="custom-scrollbar">
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
                        {filteredTaxis.length === 0 ? (
                            <p style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '2rem' }}>No se encontraron chóferes.</p>
                        ) : (
                            filteredTaxis.map((taxi) => (
                                <div 
                                    key={taxi.id} 
                                    className="driver-selection-card"
                                    onClick={() => !isAssigning && onAssign(pkg.id, taxi.driver.id)}
                                    style={{
                                        padding: '1.2rem',
                                        background: 'rgba(255,255,255,0.02)',
                                        border: '1px solid var(--border-glass)',
                                        borderRadius: '20px',
                                        cursor: isAssigning ? 'not-allowed' : 'pointer',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '1.2rem',
                                        transition: 'all 0.3s ease'
                                    }}
                                >
                                    <div style={{ 
                                        width: '60px', 
                                        height: '60px', 
                                        borderRadius: '15px', 
                                        background: 'linear-gradient(45deg, var(--primary), var(--secondary))',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        flexShrink: 0,
                                        overflow: 'hidden',
                                        boxShadow: '0 5px 15px rgba(0,0,0,0.3)'
                                    }}>
                                        {taxi.driver.photo ? (
                                            <div style={{ position: 'relative', width: '100%', height: '100%' }}>
                                                <Image 
                                                    src={taxi.driver.photo} 
                                                    alt={taxi.driver.name} 
                                                    fill 
                                                    style={{ objectFit: 'cover' }}
                                                    unoptimized 
                                                />
                                            </div>
                                        ) : (
                                            <span style={{ fontWeight: 800, color: 'white', fontSize: '1.2rem' }}>{taxi.driver.name.charAt(0)}</span>
                                        )}
                                    </div>
                                    <div style={{ flex: 1 }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                            <div>
                                                <div style={{ fontWeight: 800, color: 'white', fontSize: '1.1rem' }}>{taxi.driver.name}</div>
                                                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>
                                                    Licencia: <span style={{ color: 'white', fontWeight: 600 }}>{taxi.driver.license}</span> • 
                                                    Vence: <span style={{ color: taxi.driver.expiration?.includes('2024') ? '#f43f5e' : 'white', fontWeight: 600 }}>{taxi.driver.expiration || 'N/A'}</span>
                                                </div>
                                            </div>
                                            <div style={{ textAlign: 'right' }}>
                                                <div style={{ fontSize: '0.9rem', fontWeight: 800, color: 'var(--primary)' }}>{taxi.plate}</div>
                                                <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>{taxi.model}</div>
                                            </div>
                                        </div>

                                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginTop: '0.5rem' }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', padding: '0.3rem 0.6rem', background: 'rgba(255,255,255,0.05)', borderRadius: '8px', fontSize: '0.7rem', border: '1px solid rgba(255,255,255,0.1)' }}>
                                                <UserPlus size={12} color="var(--primary)" />
                                                <span style={{ fontWeight: 700 }}>{taxi.passengers} Pasajeros</span>
                                            </div>
                                            {(taxi.amenities || []).map((amenity: string, idx: number) => (
                                                <div key={idx} title={amenity} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '28px', height: '28px', background: 'rgba(14, 165, 233, 0.1)', border: '1px solid rgba(14, 165, 233, 0.2)', borderRadius: '50%', color: 'var(--secondary)' }}>
                                                    {getAmenityIcon(amenity)}
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                    {isAssigning === pkg.id ? (
                                        <Loader2 className="animate-spin" size={24} color="var(--primary)" />
                                    ) : (
                                        <div className="assign-badge-modern">Asignar</div>
                                    )}
                                </div>
                            ))
                        )}
                    </div>
                </div>

                <style jsx>{`
                    .modal-overlay-assignment { 
                        position: fixed !important; 
                        top: 0 !important;
                        left: 0 !important;
                        right: 0 !important;
                        bottom: 0 !important;
                        width: 100vw !important;
                        height: 100vh !important;
                        background: rgba(0,0,0,0.85) !important; 
                        backdrop-filter: blur(15px) !important; 
                        -webkit-backdrop-filter: blur(15px) !important;
                        display: flex !important; 
                        align-items: center !important; 
                        justify-content: center !important; 
                        padding: 2rem !important; 
                        z-index: 10000 !important;
                    }
                    .driver-selection-card:hover {
                        background: rgba(139, 92, 246, 0.05) !important;
                        border-color: var(--primary) !important;
                        transform: scale(1.01);
                    }
                    .assign-badge-modern {
                        padding: 0.6rem 1rem;
                        background: rgba(255, 255, 255, 0.05);
                        border-radius: 12px;
                        font-size: 0.8rem;
                        font-weight: 800;
                        color: var(--text-muted);
                        transition: all 0.3s;
                        text-transform: uppercase;
                        letter-spacing: 0.5px;
                    }
                    .driver-selection-card:hover .assign-badge-modern {
                        background: var(--primary);
                        color: white;
                        box-shadow: 0 4px 15px rgba(139, 92, 246, 0.4);
                    }
                `}</style>
            </div>
        </div>
    );
};

export default function RequestsPage() {
    const [requests, setRequests] = useState<Package[]>([]);
    const [loading, setLoading] = useState(true);
    const [previewPkg, setPreviewPkg] = useState<Package | null>(null);
    const [assigningPkg, setAssigningPkg] = useState<Package | null>(null);
    const [isConfirming, setIsConfirming] = useState<number | null>(null);
    const [taxis, setTaxis] = useState<Taxi[]>([]);

    useEffect(() => {
        const fetchData = async () => {
            const [reqRes, taxiRes] = await Promise.all([
                getClientRequests(),
                getTaxis()
            ]);
            if (reqRes.success && reqRes.data) setRequests(reqRes.data as Package[]);
            if (taxiRes.success && taxiRes.data) setTaxis(taxiRes.data as unknown as Taxi[]);
            setLoading(false);
        };
        fetchData();
    }, []);

    const handleConfirm = async (pkgId: number, driverId: number) => {
        setIsConfirming(pkgId);
        const res = await confirmPackage(pkgId, driverId);
        if (res.success) {
            setRequests(prev => prev.map(p => p.id === pkgId ? { ...p, status: 'Confirmado', driverId } : p));
            setAssigningPkg(null);
        } else {
            alert(res.error);
        }
        setIsConfirming(null);
    };

    return (
        <div style={{ padding: '1rem', maxWidth: '1200px', margin: '0 auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2.5rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <Link href="/admin" className="btn-glass-nav" style={{ width: '40px', height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '12px', textDecoration: 'none', padding: 0 }}>
                        <ArrowLeft size={20} strokeWidth={2} />
                    </Link>
                    <div>
                        <h1 style={{ fontSize: '1.8rem', fontWeight: 800, margin: 0 }} className="text-gradient">
                            Solicitudes de Clientes
                        </h1>
                        <p style={{ color: 'var(--text-muted)', margin: '0.5rem 0 0 0' }}>
                            Gestión y confirmación de paquetes personalizados creados por los clientes.
                        </p>
                    </div>
                </div>
                
                <div className="glass-panel" style={{ padding: '0.6rem 1.2rem', borderRadius: '14px', display: 'flex', alignItems: 'center', gap: '0.8rem', border: '1px solid rgba(245, 158, 11, 0.2)' }}>
                    <Clock size={18} color="#f59e0b" />
                    <span style={{ fontSize: '0.9rem', fontWeight: 700 }}>{requests.length} Pendientes</span>
                </div>
            </div>

            <div className="glass-panel" style={{ padding: '2rem', borderRadius: '24px', minHeight: '400px', background: 'rgba(255,255,255,0.02)', border: '1px solid var(--border-glass)' }}>
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
                    <>
                        {/* Desktop View */}
                        <div className="desktop-only">
                            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                                <thead>
                                    <tr style={{ background: 'rgba(255,255,255,0.03)', borderBottom: '1px solid var(--border-glass)' }}>
                                        <th style={{ padding: '1.2rem', color: 'var(--text-muted)', fontWeight: 600, fontSize: '0.9rem' }}>Solicitud / Fecha</th>
                                        <th style={{ padding: '1.2rem', color: 'var(--text-muted)', fontWeight: 600, fontSize: '0.9rem' }}>Itinerario (Preview)</th>
                                        <th style={{ padding: '1.2rem', color: 'var(--text-muted)', fontWeight: 600, fontSize: '0.9rem' }}>Presupuesto</th>
                                        <th style={{ padding: '1.2rem', color: 'var(--text-muted)', fontWeight: 600, fontSize: '0.9rem' }}>Estado</th>
                                        <th style={{ padding: '1.2rem', color: 'var(--text-muted)', fontWeight: 600, fontSize: '0.9rem' }}>Acciones</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {requests.map((pkg) => (
                                        <tr key={pkg.id} className="hover-row" style={{ borderBottom: '1px solid var(--border-glass)', transition: 'var(--transition-smooth)' }}>
                                            <td style={{ padding: '1.2rem' }}>
                                                <div style={{ fontWeight: 800, color: 'white', fontSize: '1.1rem' }}>{pkg.name}</div>
                                                <div style={{ fontSize: '0.7rem', color: '#f59e0b', fontWeight: 700, textTransform: 'uppercase', marginTop: '0.2rem' }}>
                                                    ID: #{pkg.id} • {new Date(pkg.createdAt).toLocaleDateString()}
                                                </div>
                                            </td>
                                            <td style={{ padding: '1.2rem' }}>
                                            <button 
                                                onClick={() => setPreviewPkg(pkg)}
                                                className="btn-glass-nav"
                                                style={{ 
                                                    padding: '0.5rem 1rem', 
                                                    borderRadius: '10px', 
                                                    fontSize: '0.75rem',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    gap: '0.5rem',
                                                    border: '1px solid rgba(255,255,255,0.1)'
                                                }}
                                            >
                                                <Palmtree size={16} color="#f59e0b" />
                                                <span style={{ fontWeight: 700 }}>Ver Itinerario</span>
                                                <span style={{ 
                                                    background: 'rgba(245, 158, 11, 0.2)', 
                                                    color: '#f59e0b', 
                                                    padding: '0.1rem 0.4rem', 
                                                    borderRadius: '5px',
                                                    fontSize: '0.65rem'
                                                }}>
                                                    {(Array.isArray(pkg.items) ? pkg.items : []).length}
                                                </span>
                                            </button>
                                        </td>
                                            <td style={{ padding: '1.2rem' }}>
                                                <div style={{ fontWeight: 900, fontSize: '1.2rem', color: 'white' }}>${pkg.price.toLocaleString()}</div>
                                                <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Presupuesto Estimado</div>
                                            </td>
                                            <td style={{ padding: '1.2rem' }}>
                                                <span style={{ 
                                                    padding: '0.4rem 0.8rem', 
                                                    borderRadius: '10px', 
                                                    fontSize: '0.7rem', 
                                                    fontWeight: 800,
                                                    background: pkg.status === 'Confirmado' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(245, 158, 11, 0.1)',
                                                    color: pkg.status === 'Confirmado' ? '#10b981' : '#f59e0b',
                                                    textTransform: 'uppercase'
                                                }}>
                                                    {pkg.status}
                                                </span>
                                            </td>
                                            <td style={{ padding: '1.2rem' }}>
                                                {pkg.status === 'Pendiente' && (
                                                    <button 
                                                        onClick={() => setAssigningPkg(pkg)}
                                                        className="btn-premium"
                                                        style={{ 
                                                            padding: '0.6rem 1.2rem', 
                                                            borderRadius: '12px', 
                                                            fontSize: '0.8rem',
                                                            display: 'flex',
                                                            alignItems: 'center',
                                                            gap: '0.5rem'
                                                        }}
                                                    >
                                                        <UserPlus size={16} />
                                                        Asignar Chófer
                                                    </button>
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {/* Mobile View */}
                        <div className="mobile-only">
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                {requests.map((pkg) => (
                                    <div key={pkg.id} className="request-card-mobile" style={{ padding: '1.5rem', borderRadius: '24px', border: '1px solid var(--border-glass)', background: 'rgba(255,255,255,0.05)' }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.2rem' }}>
                                            <div>
                                                <div style={{ fontWeight: 800, fontSize: '1.2rem', color: 'white' }}>{pkg.name}</div>
                                                <div style={{ fontSize: '0.7rem', color: '#f59e0b', fontWeight: 700, textTransform: 'uppercase' }}>ID: #{pkg.id} • {new Date(pkg.createdAt).toLocaleDateString()}</div>
                                            </div>
                                            <div style={{ textAlign: 'right' }}>
                                                <div style={{ fontWeight: 900, color: 'white', fontSize: '1.3rem' }}>${pkg.price.toLocaleString()}</div>
                                                <span style={{ 
                                                    padding: '0.3rem 0.6rem', borderRadius: '8px', fontSize: '0.65rem', fontWeight: 800,
                                                    background: pkg.status === 'Confirmado' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(245, 158, 11, 0.1)',
                                                    color: pkg.status === 'Confirmado' ? '#10b981' : '#f59e0b', textTransform: 'uppercase'
                                                }}>
                                                    {pkg.status}
                                                </span>
                                            </div>
                                        </div>

                                        <div style={{ background: 'rgba(255,255,255,0.03)', borderRadius: '16px', padding: '1rem', marginBottom: '1.2rem' }}>
                                            <button 
                                                onClick={() => setPreviewPkg(pkg)}
                                                className="btn-glass-nav"
                                                style={{ 
                                                    width: '100%',
                                                    padding: '0.8rem 1rem', 
                                                    borderRadius: '10px', 
                                                    fontSize: '0.85rem',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    gap: '0.5rem',
                                                    border: '1px solid rgba(255,255,255,0.1)'
                                                }}
                                            >
                                                <Palmtree size={18} color="#f59e0b" />
                                                <span style={{ fontWeight: 700 }}>Ver Itinerario</span>
                                                <span style={{ 
                                                    background: 'rgba(245, 158, 11, 0.2)', 
                                                    color: '#f59e0b', 
                                                    padding: '0.1rem 0.5rem', 
                                                    borderRadius: '5px',
                                                    fontSize: '0.7rem'
                                                }}>
                                                    {(Array.isArray(pkg.items) ? pkg.items : []).length}
                                                </span>
                                            </button>
                                        </div>

                                        <div style={{ display: 'flex', gap: '0.8rem' }}>
                                            {pkg.status === 'Pendiente' && (
                                                <button 
                                                    onClick={() => setAssigningPkg(pkg)}
                                                    className="btn-premium"
                                                    style={{ width: '100%', padding: '0.8rem', borderRadius: '14px', fontSize: '0.85rem' }}
                                                >
                                                    <UserPlus size={18} style={{ marginRight: '0.5rem' }} /> Asignar Chófer
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </>
                )}
            </div>

            {previewPkg && <PreviewFlyerModal pkg={previewPkg} onClose={() => setPreviewPkg(null)} />}
            
            {assigningPkg && (
                <AssignDriverModal 
                    pkg={assigningPkg} 
                    taxis={taxis} 
                    onClose={() => setAssigningPkg(null)} 
                    onAssign={handleConfirm}
                    isAssigning={isConfirming}
                />
            )}

            <style jsx>{`
                @media (max-width: 768px) {
                    .desktop-only { display: none !important; }
                    .mobile-only { display: block !important; }
                }
                @media (min-width: 769px) {
                    .desktop-only { display: block !important; }
                    .mobile-only { display: none !important; }
                }
                .hover-row:hover { background: rgba(255, 255, 255, 0.02); }
                .custom-scrollbar::-webkit-scrollbar { height: 4px; }
                .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(255, 255, 255, 0.1); border-radius: 10px; }
                
                .select-premium {
                    padding: 0.7rem 2.8rem 0.7rem 1.2rem;
                    border-radius: 12px;
                    background: var(--primary);
                    color: white;
                    border: none;
                    font-size: 0.85rem;
                    font-weight: 700;
                    appearance: none;
                    cursor: pointer;
                    transition: var(--transition-smooth);
                    box-shadow: 0 4px 15px rgba(139, 92, 246, 0.2);
                }
                .select-premium:hover:not(:disabled) {
                    background: var(--primary-hover);
                    transform: translateY(-1px);
                    box-shadow: 0 6px 20px rgba(139, 92, 246, 0.3);
                }
                .select-premium:disabled {
                    opacity: 0.5;
                    cursor: not-allowed;
                }
            `}</style>
        </div>
    );
}
