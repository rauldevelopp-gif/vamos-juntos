'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowLeft, Plus, MapPin, X, Loader2, Camera } from 'lucide-react';
import { getAttractions } from './actions';

interface Attraction {
    id: number;
    name: string;
    location: string;
    city: string;
    state: string;
    status: string;
    coordinates: string;
    type: string;
    price: number;
}

export default function AttractionsPage() {
    const [attractions, setAttractions] = useState<Attraction[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedAttraction, setSelectedAttraction] = useState<Attraction | null>(null);

    useEffect(() => {
        const fetchAttractions = async () => {
            const result = await getAttractions();
            if (result.success && result.data) {
                setAttractions(result.data);
            }
            setLoading(false);
        };
        fetchAttractions();
    }, []);

    const closeModal = () => setSelectedAttraction(null);

    return (
        <div style={{ padding: '1rem', maxWidth: '1200px', margin: '0 auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2.5rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <Link href="/admin" className="btn-glass-nav" style={{ width: '40px', height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '12px', textDecoration: 'none', padding: 0 }}>
                        <ArrowLeft size={20} strokeWidth={2} />
                    </Link>
                    <div>
                        <h1 style={{ fontSize: '1.8rem', fontWeight: 800, margin: 0 }} className="text-gradient">
                            Experiencias & Tours
                        </h1>
                        <p style={{ color: 'var(--text-muted)', margin: '0.5rem 0 0 0' }}>
                            Gestión de atracciones turísticas y actividades VIP.
                        </p>
                    </div>
                </div>
                
                <button className="btn-premium" style={{ padding: '0.8rem 1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <Plus size={18} strokeWidth={2.5} />
                    <span className="btn-text-mobile-hide">Nueva Actividad</span>
                </button>
            </div>

            {/* Desktop View */}
            <div className="desktop-only" style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid var(--border-glass)', borderRadius: '24px', overflow: 'hidden', minHeight: '200px' }}>
                {loading ? (
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '4rem', color: 'var(--text-muted)' }}>
                        <Loader2 className="animate-spin" size={32} style={{ marginBottom: '1rem', color: 'var(--primary)' }} />
                        <p>Sincronizando aventuras...</p>
                    </div>
                ) : attractions.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '6rem' }}>
                        <div style={{ width: '80px', height: '80px', borderRadius: '50%', background: 'rgba(255,255,255,0.02)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem' }}>
                            <Camera size={32} color="var(--text-muted)" />
                        </div>
                        <h3>No hay atracciones registradas</h3>
                        <p style={{ color: 'var(--text-muted)' }}>Las nuevas atracciones aparecerán aquí.</p>
                    </div>
                ) : (
                    <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                        <thead>
                            <tr style={{ background: 'rgba(255,255,255,0.03)', borderBottom: '1px solid var(--border-glass)' }}>
                                <th style={{ padding: '1.2rem', color: 'var(--text-muted)', fontWeight: 600, fontSize: '0.9rem' }}>Actividad / Tipo</th>
                                <th style={{ padding: '1.2rem', color: 'var(--text-muted)', fontWeight: 600, fontSize: '0.9rem' }}>Ubicación</th>
                                <th style={{ padding: '1.2rem', color: 'var(--text-muted)', fontWeight: 600, fontSize: '0.9rem' }}>Precio Base</th>
                                <th style={{ padding: '1.2rem', color: 'var(--text-muted)', fontWeight: 600, fontSize: '0.9rem' }}>Estado</th>
                                <th style={{ padding: '1.2rem', color: 'var(--text-muted)', fontWeight: 600, fontSize: '0.9rem' }}>Mapa</th>
                            </tr>
                        </thead>
                        <tbody>
                            {attractions.map((attraction) => (
                                <tr key={attraction.id} className="hover-row" style={{ borderBottom: '1px solid var(--border-glass)', transition: 'var(--transition-smooth)' }}>
                                    <td style={{ padding: '1.2rem' }}>
                                        <div style={{ fontWeight: 600, color: 'var(--text-main)' }}>{attraction.name}</div>
                                        <div style={{ fontSize: '0.8rem', color: 'var(--primary)', fontWeight: 600 }}>{attraction.type}</div>
                                    </td>
                                    <td style={{ padding: '1.2rem' }}>
                                        <div style={{ fontSize: '0.9rem' }}>{attraction.city}</div>
                                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{attraction.state}</div>
                                    </td>
                                    <td style={{ padding: '1.2rem' }}>
                                        <div style={{ fontWeight: 700, color: '#10b981' }}>${attraction.price} USD</div>
                                    </td>
                                    <td style={{ padding: '1.2rem' }}>
                                        <span style={{ 
                                            padding: '0.3rem 0.8rem', borderRadius: 'var(--radius-full)', fontSize: '0.8rem', 
                                            background: attraction.status === 'Activo' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(244, 63, 94, 0.1)',
                                            color: attraction.status === 'Activo' ? '#10b981' : '#f43f5e', border: '1px solid rgba(16, 185, 129, 0.2)'
                                        }}>
                                            {attraction.status}
                                        </span>
                                    </td>
                                    <td style={{ padding: '1.2rem' }}>
                                        <button onClick={() => setSelectedAttraction(attraction)} className="btn-glass-nav" style={{ padding: '0.5rem', borderRadius: '10px', width: '36px', height: '36px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                            <MapPin size={16} strokeWidth={2} />
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
                        <p style={{ color: 'var(--text-muted)' }}>Cargando aventuras...</p>
                    </div>
                ) : attractions.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '6rem' }}>
                        <div style={{ width: '80px', height: '80px', borderRadius: '50%', background: 'rgba(255,255,255,0.02)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem' }}>
                            <Camera size={32} color="var(--text-muted)" />
                        </div>
                        <h3>No hay atracciones registradas</h3>
                        <p style={{ color: 'var(--text-muted)' }}>Las nuevas atracciones aparecerán aquí.</p>
                    </div>
                ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem', padding: '0.5rem 0' }}>
                        {attractions.map((attraction) => (
                            <div key={attraction.id} className="attraction-card-mobile">
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.2rem' }}>
                                    <div>
                                        <div style={{ fontWeight: 800, fontSize: '1.2rem', color: 'var(--text-main)', marginBottom: '0.2rem' }}>{attraction.name}</div>
                                        <div style={{ fontSize: '0.9rem', color: 'var(--primary)', fontWeight: 600 }}>{attraction.type}</div>
                                    </div>
                                    <div style={{ textAlign: 'right' }}>
                                        <div style={{ fontWeight: 700, color: '#10b981', fontSize: '1rem' }}>${attraction.price}</div>
                                        <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>USD</div>
                                    </div>
                                </div>

                                <div style={{ background: 'rgba(255,255,255,0.03)', borderRadius: '16px', padding: '1rem', marginBottom: '1.2rem', border: '1px solid var(--border-glass)' }}>
                                    <div style={{ fontSize: '0.9rem', color: 'var(--text-main)', fontWeight: 500 }}>{attraction.city}, {attraction.state}</div>
                                    <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>{attraction.location}</div>
                                </div>

                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <span style={{ 
                                        padding: '0.4rem 0.8rem', borderRadius: '10px', fontSize: '0.75rem', fontWeight: 700,
                                        background: attraction.status === 'Activo' ? 'rgba(16, 185, 129, 0.1)' : '#f43f5e1a',
                                        color: attraction.status === 'Activo' ? '#10b981' : '#f43f5e'
                                    }}>
                                        {attraction.status}
                                    </span>
                                    <button onClick={() => setSelectedAttraction(attraction)} className="btn-premium" style={{ padding: '0.8rem 1.2rem', borderRadius: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.6rem' }}>
                                        <MapPin size={18} /> Ver Mapa
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Map Modal */}
            {selectedAttraction && (
                <div className="modal-overlay" onClick={closeModal}>
                    <div className="modal-content glass-panel" onClick={e => e.stopPropagation()}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', padding: '1rem' }}>
                            <div>
                                <h2 style={{ fontSize: '1.2rem', margin: 0 }}>🌟 Actividad: {selectedAttraction.name}</h2>
                                <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', margin: '0.2rem 0 0 0' }}>{selectedAttraction.city} - {selectedAttraction.type}</p>
                            </div>
                            <button onClick={closeModal} style={{ background: 'none', border: 'none', color: 'white', cursor: 'pointer', padding: '5px' }}>
                                <X size={24} strokeWidth={1.5} />
                            </button>
                        </div>
                        <div style={{ width: '100%', height: '450px', borderRadius: '15px', overflow: 'hidden', background: '#05070a' }}>
                            <iframe width="100%" height="100%" frameBorder="0" style={{ border: 0 }} src={`https://maps.google.com/maps?q=${selectedAttraction.coordinates}&t=k&z=17&ie=UTF8&iwloc=&output=embed`} allowFullScreen></iframe>
                        </div>
                        <div style={{ padding: '1.5rem', textAlign: 'right' }}>
                            <button className="btn-premium" onClick={closeModal}>Cerrar Mapa</button>
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
                .attraction-card-mobile {
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
