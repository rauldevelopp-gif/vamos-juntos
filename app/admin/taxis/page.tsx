'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { 
    ArrowLeft, Plus, User, Briefcase, X, Star, 
    Music, Wind, Dog, Cigarette, GlassWater, Wifi, Smartphone, Loader2 
} from 'lucide-react';
import { getTaxis } from './actions';

interface Driver {
    id: number;
    name: string;
    phone: string;
    license: string;
    expiration: string | null;
    rating: number;
    photo: string | null;
}

interface Taxi {
    id: number;
    plate: string;
    brand: string;
    model: string;
    year: number;
    color: string;
    type: string;
    passengers: number;
    luggage: number;
    amenities: string[];
    status: string;
    driver: Driver;
}

export default function TaxisPage() {
    const [fleet, setFleet] = useState<Taxi[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedTaxi, setSelectedTaxi] = useState<Taxi | null>(null);

    useEffect(() => {
        const fetchFleet = async () => {
            const result = await getTaxis();
            if (result.success && result.data) {
                // @ts-expect-error - Result data is compatible with Taxi[]
                setFleet(result.data);
            }
            setLoading(false);
        };
        fetchFleet();
    }, []);

    const getAmenityIcon = (amenity: string) => {
        const icons: Record<string, React.ElementType> = {
            'Música': Music, 'A/C': Wind, 'Mascotas': Dog, 'Fumar': Cigarette, 
            'Bar': GlassWater, 'Bebidas': GlassWater, 'WiFi': Wifi, 'Equipaje Extra': Briefcase
        };
        const Icon = icons[amenity] || Smartphone;
        return <Icon size={16} />;
    };

    const closeModal = () => setSelectedTaxi(null);

    return (
        <div style={{ padding: '1rem', maxWidth: '1200px', margin: '0 auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2.5rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <Link href="/admin" className="btn-glass-nav" style={{ width: '40px', height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '12px', textDecoration: 'none', padding: 0 }}>
                        <ArrowLeft size={20} strokeWidth={2} />
                    </Link>
                    <div>
                        <h1 style={{ fontSize: '1.8rem', fontWeight: 800, margin: 0 }} className="text-gradient">
                            Gestión de Flota (VIP)
                        </h1>
                        <p style={{ color: 'var(--text-muted)', margin: '0.5rem 0 0 0' }}>
                            Control de vehículos, servicios y perfiles de choferes.
                        </p>
                    </div>
                </div>
                
                <button className="btn-premium" style={{ padding: '0.8rem 1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <Plus size={18} strokeWidth={2.5} />
                    <span className="btn-text-mobile-hide">Nuevo Vehículo</span>
                </button>
            </div>

            {/* Desktop View */}
            <div className="desktop-only" style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid var(--border-glass)', borderRadius: '24px', overflow: 'hidden', minHeight: '300px' }}>
                {loading ? (
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '6rem', color: 'var(--text-muted)' }}>
                        <Loader2 className="animate-spin" size={32} style={{ marginBottom: '1rem', color: 'var(--primary)' }} />
                        <p>Sincronizando flota...</p>
                    </div>
                ) : (
                    <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                        <thead>
                            <tr style={{ background: 'rgba(255,255,255,0.03)', borderBottom: '1px solid var(--border-glass)' }}>
                                <th style={{ padding: '1.2rem', color: 'var(--text-muted)', fontWeight: 600, fontSize: '0.9rem' }}>Vehículo / Placa</th>
                                <th style={{ padding: '1.2rem', color: 'var(--text-muted)', fontWeight: 600, fontSize: '0.9rem' }}>Chofer</th>
                                <th style={{ padding: '1.2rem', color: 'var(--text-muted)', fontWeight: 600, fontSize: '0.9rem' }}>Amenidades</th>
                                <th style={{ padding: '1.2rem', color: 'var(--text-muted)', fontWeight: 600, fontSize: '0.9rem' }}>Estado</th>
                                <th style={{ padding: '1.2rem', color: 'var(--text-muted)', fontWeight: 600, fontSize: '0.9rem' }}>Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {fleet.map((taxi) => (
                                <tr key={taxi.id} className="hover-row" style={{ borderBottom: '1px solid var(--border-glass)', transition: 'var(--transition-smooth)' }}>
                                    <td style={{ padding: '1.5rem 1.2rem' }}>
                                        <div style={{ fontWeight: 700, color: 'var(--text-main)', fontSize: '1.1rem' }}>{taxi.plate}</div>
                                        <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
                                            {taxi.brand} {taxi.model} ({taxi.year})
                                        </div>
                                    </td>
                                    <td style={{ padding: '1.5rem 1.2rem' }}>
                                        {taxi.driver ? (
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                                <div style={{ width: '42px', height: '42px', borderRadius: '50%', overflow: 'hidden', border: '2px solid var(--border-glass)', position: 'relative' }}>
                                                    <Image 
                                                        src={taxi.driver.photo || 'https://ui-avatars.com/api/?name=' + encodeURIComponent(taxi.driver.name)} 
                                                        alt={taxi.driver.name} 
                                                        fill
                                                        style={{ objectFit: 'cover' }}
                                                        unoptimized 
                                                    />
                                                </div>
                                                <div>
                                                    <div style={{ fontWeight: 600, fontSize: '0.95rem' }}>{taxi.driver.name}</div>
                                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.8rem', color: '#f59e0b' }}>
                                                        <Star size={12} fill="#f59e0b" strokeWidth={0} /> {taxi.driver.rating.toFixed(1)}
                                                    </div>
                                                </div>
                                            </div>
                                        ) : 'Sin asignar'}
                                    </td>
                                    <td style={{ padding: '1.5rem 1.2rem' }}>
                                        <div style={{ display: 'flex', gap: '0.6rem', flexWrap: 'wrap' }}>
                                            {taxi.amenities.map(amenity => (
                                                <div key={amenity} style={{ color: 'var(--text-muted)' }} title={amenity}>{getAmenityIcon(amenity)}</div>
                                            ))}
                                        </div>
                                    </td>
                                    <td style={{ padding: '1.5rem 1.2rem' }}>
                                        <span style={{ 
                                            padding: '0.4rem 0.8rem', borderRadius: '10px', fontSize: '0.8rem', fontWeight: 600,
                                            background: taxi.status === 'Disponible' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(59, 130, 246, 0.1)',
                                            color: taxi.status === 'Disponible' ? '#10b981' : '#3b82f6'
                                        }}>
                                            {taxi.status}
                                        </span>
                                    </td>
                                    <td style={{ padding: '1.5rem 1.2rem' }}>
                                        <button onClick={() => setSelectedTaxi(taxi)} className="btn-glass-nav" style={{ padding: '0.6rem 1rem', borderRadius: '12px' }}>
                                            Detalles
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>

            {/* Mobile View */}
            <div className="mobile-only">
                {loading ? (
                    <div style={{ textAlign: 'center', padding: '4rem' }}>
                        <Loader2 className="animate-spin" size={32} style={{ margin: '0 auto 1rem', color: 'var(--primary)' }} />
                        <p style={{ color: 'var(--text-muted)' }}>Sincronizando flota...</p>
                    </div>
                ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem', padding: '0.5rem 0' }}>
                        {fleet.map((taxi) => (
                            <div key={taxi.id} className="taxi-card-mobile">
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.2rem' }}>
                                    <div>
                                        <div style={{ fontWeight: 800, fontSize: '1.3rem', color: 'var(--text-main)', marginBottom: '0.2rem' }}>{taxi.plate}</div>
                                        <div style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>{taxi.brand} {taxi.model} ({taxi.year})</div>
                                    </div>
                                    <span style={{ 
                                        padding: '0.4rem 0.8rem', borderRadius: '10px', fontSize: '0.75rem', fontWeight: 700,
                                        background: taxi.status === 'Disponible' ? 'rgba(16, 185, 129, 0.1)' : '#3b82f61a',
                                        color: taxi.status === 'Disponible' ? '#10b981' : '#3b82f6'
                                    }}>
                                        {taxi.status}
                                    </span>
                                </div>

                                <div style={{ background: 'rgba(255,255,255,0.03)', borderRadius: '20px', padding: '1.2rem', marginBottom: '1.2rem', border: '1px solid var(--border-glass)' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
                                        <div style={{ width: '50px', height: '50px', borderRadius: '50%', overflow: 'hidden', border: '2px solid var(--primary)', position: 'relative' }}>
                                            <Image 
                                                src={taxi.driver.photo || ''} 
                                                alt={taxi.driver.name} 
                                                fill
                                                style={{ objectFit: 'cover' }}
                                                unoptimized 
                                            />
                                        </div>
                                        <div>
                                            <div style={{ fontWeight: 700, fontSize: '1rem' }}>{taxi.driver.name}</div>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.85rem', color: '#f59e0b' }}>
                                                <Star size={14} fill="#f59e0b" strokeWidth={0} /> {taxi.driver.rating}
                                            </div>
                                        </div>
                                    </div>
                                    
                                    <div style={{ display: 'flex', gap: '0.8rem', flexWrap: 'wrap', borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '1rem' }}>
                                        {taxi.amenities.map(amenity => (
                                            <div key={amenity} style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', background: 'rgba(255,255,255,0.05)', padding: '0.4rem 0.8rem', borderRadius: '10px', fontSize: '0.75rem' }}>
                                                {getAmenityIcon(amenity)} {amenity}
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <button onClick={() => setSelectedTaxi(taxi)} className="btn-premium" style={{ width: '100%', padding: '0.9rem', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.6rem' }}>
                                    <User size={18} /> Ver Perfil de Chofer
                                </button>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {selectedTaxi && (
                <div className="modal-overlay" onClick={closeModal}>
                    <div className="modal-content glass-panel" onClick={e => e.stopPropagation()} style={{ maxWidth: '450px' }}>
                        <div style={{ position: 'relative', height: '120px', background: 'linear-gradient(135deg, var(--primary), var(--secondary))', borderTopLeftRadius: '25px', borderTopRightRadius: '25px' }}>
                            <button onClick={closeModal} style={{ position: 'absolute', top: '15px', right: '15px', background: 'rgba(0,0,0,0.2)', border: 'none', color: 'white', borderRadius: '50%', width: '32px', height: '32px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <X size={18} strokeWidth={2} />
                            </button>
                        </div>
                        
                        <div style={{ textAlign: 'center', marginTop: '-60px', padding: '0 2rem 2rem 2rem', position: 'relative', zIndex: 10 }}>
                            <div style={{ 
                                width: '120px', height: '120px', borderRadius: '50%', border: '4px solid #05070a', 
                                overflow: 'hidden', margin: '0 auto', boxShadow: '0 10px 25px rgba(0,0,0,0.6)', position: 'relative', background: '#111'
                            }}>
                                <Image 
                                    src={selectedTaxi.driver.photo || ''} 
                                    alt={selectedTaxi.driver.name} 
                                    fill
                                    style={{ objectFit: 'cover' }}
                                    unoptimized 
                                />
                            </div>
                            
                            <h2 style={{ fontSize: '1.5rem', margin: '1rem 0 0.25rem 0' }}>{selectedTaxi.driver.name}</h2>
                             <div style={{ display: 'flex', justifyContent: 'center', gap: '2px', marginBottom: '1.5rem' }}>
                                {Array(5).fill(0).map((_, i) => (
                                    <Star key={i} size={14} fill={i < Math.floor(selectedTaxi.driver.rating) ? '#f59e0b' : 'none'} color={i < Math.floor(selectedTaxi.driver.rating) ? '#f59e0b' : 'var(--text-muted)'} strokeWidth={2} />
                                ))}
                                <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginLeft: '5px' }}>({selectedTaxi.driver.rating})</span>
                            </div>

                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', textAlign: 'left', background: 'rgba(255,255,255,0.03)', padding: '1.5rem', borderRadius: '15px', border: '1px solid var(--border-glass)' }}>
                                <div>
                                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>ID Chofer</div>
                                    <div style={{ fontWeight: 600 }}>#{selectedTaxi.driver.id}</div>
                                </div>
                                <div>
                                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Licencia</div>
                                    <div style={{ fontWeight: 600 }}>{selectedTaxi.driver.license}</div>
                                </div>
                                <div>
                                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Teléfono</div>
                                    <div style={{ fontWeight: 600 }}>{selectedTaxi.driver.phone}</div>
                                </div>
                                <div>
                                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Expira</div>
                                    <div style={{ fontWeight: 600, color: '#f43f5e' }}>{selectedTaxi.driver.expiration}</div>
                                </div>
                            </div>
                            
                            <button className="btn-premium" style={{ width: '100%', marginTop: '2rem' }} onClick={closeModal}>Cerrar Ficha</button>
                        </div>
                    </div>
                </div>
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
                .taxi-card-mobile {
                    padding: 1.5rem;
                    border-radius: 24px;
                    border: 1px solid rgba(255, 255, 255, 0.3) !important;
                    background: rgba(255, 255, 255, 0.08) !important;
                    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);
                }
                .modal-overlay {
                    position: fixed; top: 0; left: 0; right: 0; bottom: 0;
                    background: rgba(0, 0, 0, 0.85); backdrop-filter: blur(12px);
                    display: flex; align-items: center; justify-content: center;
                    z-index: 1000; animation: fadeIn 0.3s ease;
                }
                .modal-content {
                    width: 90%; max-width: 800px; border-radius: 25px; padding: 0;
                    animation: slideUp 0.4s cubic-bezier(0.4, 0, 0.2, 1);
                }
                @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
                @keyframes slideUp { from { transform: translateY(30px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
            `}</style>
        </div>
    );
}
