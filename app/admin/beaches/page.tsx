'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowLeft, Plus, MapPin, X, Loader2, Palmtree } from 'lucide-react';
import { getBeaches } from './actions';

interface Beach {
    id: number;
    name: string;
    location: string;
    city: string;
    state: string;
    status: string;
    coordinates: string;
    type: string;
}

export default function BeachesPage() {
    const [beaches, setBeaches] = useState<Beach[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedBeach, setSelectedBeach] = useState<Beach | null>(null);

    useEffect(() => {
        const fetchBeaches = async () => {
            const result = await getBeaches();
            if (result.success && result.data) {
                setBeaches(result.data);
            }
            setLoading(false);
        };
        fetchBeaches();
    }, []);

    const closeModal = () => setSelectedBeach(null);

    return (
        <div style={{ padding: '1rem', maxWidth: '1200px', margin: '0 auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2.5rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <Link href="/admin" className="btn-glass-nav" style={{ width: '40px', height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '12px', textDecoration: 'none', padding: 0 }}>
                        <ArrowLeft size={20} strokeWidth={2} />
                    </Link>
                    <div>
                        <h1 style={{ fontSize: '1.8rem', fontWeight: 800, margin: 0 }} className="text-gradient">
                            Catálogo de Playas
                        </h1>
                        <p style={{ color: 'var(--text-muted)', margin: '0.5rem 0 0 0' }}>
                            Gestión de destinos costeros y zonas de embarque.
                        </p>
                    </div>
                </div>
                
                <button className="btn-premium" style={{ padding: '0.8rem 1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <Plus size={18} strokeWidth={2.5} />
                    <span className="btn-text-mobile-hide">Añadir Playa</span>
                </button>
            </div>

            {/* Desktop View */}
            <div className="desktop-only" style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid var(--border-glass)', borderRadius: '24px', overflow: 'hidden', minHeight: '200px' }}>
                {loading ? (
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '4rem', color: 'var(--text-muted)' }}>
                        <Loader2 className="animate-spin" size={32} style={{ marginBottom: '1rem', color: 'var(--primary)' }} />
                        <p>Sincronizando destinos...</p>
                    </div>
                ) : beaches.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '6rem' }}>
                        <div style={{ width: '80px', height: '80px', borderRadius: '50%', background: 'rgba(255,255,255,0.02)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem' }}>
                            <Palmtree size={32} color="var(--text-muted)" />
                        </div>
                        <h3>No hay playas registradas</h3>
                        <p style={{ color: 'var(--text-muted)' }}>Las nuevas playas aparecerán aquí.</p>
                    </div>
                ) : (
                    <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                        <thead>
                            <tr style={{ background: 'rgba(255,255,255,0.03)', borderBottom: '1px solid var(--border-glass)' }}>
                                <th style={{ padding: '1.2rem', color: 'var(--text-muted)', fontWeight: 600, fontSize: '0.9rem' }}>Nombre / Tipo</th>
                                <th style={{ padding: '1.2rem', color: 'var(--text-muted)', fontWeight: 600, fontSize: '0.9rem' }}>Ubicación</th>
                                <th style={{ padding: '1.2rem', color: 'var(--text-muted)', fontWeight: 600, fontSize: '0.9rem' }}>Estado</th>
                                <th style={{ padding: '1.2rem', color: 'var(--text-muted)', fontWeight: 600, fontSize: '0.9rem' }}>Mapa</th>
                            </tr>
                        </thead>
                        <tbody>
                            {beaches.map((beach) => (
                                <tr key={beach.id} className="hover-row" style={{ borderBottom: '1px solid var(--border-glass)', transition: 'var(--transition-smooth)' }}>
                                    <td style={{ padding: '1.2rem' }}>
                                        <div style={{ fontWeight: 600, color: 'var(--text-main)' }}>{beach.name}</div>
                                        <div style={{ fontSize: '0.8rem', color: 'var(--secondary)', fontWeight: 500 }}>{beach.type}</div>
                                    </td>
                                    <td style={{ padding: '1.2rem' }}>
                                        <div style={{ fontSize: '0.95rem' }}>{beach.city}</div>
                                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{beach.state}</div>
                                    </td>
                                    <td style={{ padding: '1.2rem' }}>
                                        <span style={{ 
                                            padding: '0.3rem 0.8rem', borderRadius: 'var(--radius-full)', fontSize: '0.8rem', 
                                            background: beach.status === 'Abierta' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(244, 63, 94, 0.1)',
                                            color: beach.status === 'Abierta' ? '#10b981' : '#f43f5e', border: '1px solid rgba(16, 185, 129, 0.2)'
                                        }}>
                                            {beach.status}
                                        </span>
                                    </td>
                                    <td style={{ padding: '1.2rem' }}>
                                        <button onClick={() => setSelectedBeach(beach)} className="btn-glass-nav" style={{ padding: '0.5rem', borderRadius: '10px', width: '36px', height: '36px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
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
                        <p style={{ color: 'var(--text-muted)' }}>Cargando playas...</p>
                    </div>
                ) : beaches.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '6rem' }}>
                        <div style={{ width: '80px', height: '80px', borderRadius: '50%', background: 'rgba(255,255,255,0.02)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem' }}>
                            <Palmtree size={32} color="var(--text-muted)" />
                        </div>
                        <h3>No hay playas registradas</h3>
                        <p style={{ color: 'var(--text-muted)' }}>Las nuevas playas aparecerán aquí.</p>
                    </div>
                ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem', padding: '0.5rem 0' }}>
                        {beaches.map((beach) => (
                            <div key={beach.id} className="beach-card-mobile">
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.2rem' }}>
                                    <div>
                                        <div style={{ fontWeight: 800, fontSize: '1.2rem', color: 'var(--text-main)', marginBottom: '0.2rem' }}>{beach.name}</div>
                                        <div style={{ fontSize: '0.9rem', color: 'var(--secondary)', fontWeight: 600 }}>{beach.type}</div>
                                    </div>
                                    <span style={{ 
                                        padding: '0.4rem 0.8rem', borderRadius: '10px', fontSize: '0.75rem', fontWeight: 700,
                                        background: beach.status === 'Abierta' ? 'rgba(16, 185, 129, 0.1)' : '#f43f5e1a',
                                        color: beach.status === 'Abierta' ? '#10b981' : '#f43f5e'
                                    }}>
                                        {beach.status}
                                    </span>
                                </div>

                                <div style={{ background: 'rgba(255,255,255,0.03)', borderRadius: '16px', padding: '1rem', marginBottom: '1.2rem', border: '1px solid var(--border-glass)' }}>
                                    <div style={{ fontSize: '0.9rem', color: 'var(--text-main)', fontWeight: 500 }}>{beach.city}, {beach.state}</div>
                                    <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>{beach.location}</div>
                                </div>

                                <button onClick={() => setSelectedBeach(beach)} className="btn-premium" style={{ width: '100%', padding: '0.8rem', borderRadius: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.6rem' }}>
                                    <MapPin size={18} /> Ver Costa
                                </button>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Map Modal */}
            {selectedBeach && (
                <div className="modal-overlay" onClick={closeModal}>
                    <div className="modal-content glass-panel" onClick={e => e.stopPropagation()}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', padding: '1rem' }}>
                            <div>
                                <h2 style={{ fontSize: '1.2rem', margin: 0 }}>🏖️ Costa: {selectedBeach.name}</h2>
                                <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', margin: '0.2rem 0 0 0' }}>{selectedBeach.city} - {selectedBeach.type}</p>
                            </div>
                            <button onClick={closeModal} style={{ background: 'none', border: 'none', color: 'white', cursor: 'pointer', padding: '5px' }}>
                                <X size={24} strokeWidth={1.5} />
                            </button>
                        </div>
                        <div style={{ width: '100%', height: '450px', borderRadius: '15px', overflow: 'hidden', background: '#05070a' }}>
                            <iframe width="100%" height="100%" frameBorder="0" style={{ border: 0 }} src={`https://maps.google.com/maps?q=${selectedBeach.coordinates}&t=k&z=17&ie=UTF8&iwloc=&output=embed`} allowFullScreen></iframe>
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
                .beach-card-mobile {
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
