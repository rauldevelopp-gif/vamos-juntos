'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowLeft, Plus, MapPin, X, Star, Loader2 } from 'lucide-react';
import { getHotels } from './actions';

interface Hotel {
    id: number;
    name: string;
    location: string;
    stars: number;
    city: string;
    state: string;
    status: string;
    coordinates: string;
}

export default function HotelsPage() {
    const [hotels, setHotels] = useState<Hotel[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedHotel, setSelectedHotel] = useState<Hotel | null>(null);

    useEffect(() => {
        const fetchHotels = async () => {
            const result = await getHotels();
            if (result.success && result.data) {
                setHotels(result.data);
            }
            setLoading(false);
        };
        fetchHotels();
    }, []);

    const closeModal = () => setSelectedHotel(null);

    const renderStars = (count: number) => {
        return Array(count).fill(0).map((_, i) => (
            <Star key={i} size={12} fill="#f59e0b" color="#f59e0b" strokeWidth={0} />
        ));
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
                            Gestión de Hoteles
                        </h1>
                        <p style={{ color: 'var(--text-muted)', margin: '0.5rem 0 0 0' }}>
                            Directorio de alojamiento de lujo y estancias VIP.
                        </p>
                    </div>
                </div>
                
                <button className="btn-premium" style={{ padding: '0.8rem 1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <Plus size={18} strokeWidth={2.5} />
                    <span className="btn-text-mobile-hide">Registrar Hotel</span>
                </button>
            </div>

            {/* Desktop View: Table */}
            <div className="desktop-only" style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid var(--border-glass)', borderRadius: '24px', overflow: 'hidden', minHeight: '200px' }}>
                {loading ? (
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '4rem', color: 'var(--text-muted)' }}>
                        <Loader2 className="animate-spin" size={32} style={{ marginBottom: '1rem', color: 'var(--primary)' }} />
                        <p>Sincronizando hoteles...</p>
                    </div>
                ) : (
                    <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                        <thead>
                            <tr style={{ background: 'rgba(255,255,255,0.03)', borderBottom: '1px solid var(--border-glass)' }}>
                                <th style={{ padding: '1.2rem', color: 'var(--text-muted)', fontWeight: 600, fontSize: '0.9rem' }}>Hotel / Categoría</th>
                                <th style={{ padding: '1.2rem', color: 'var(--text-muted)', fontWeight: 600, fontSize: '0.9rem' }}>Ubicación</th>
                                <th style={{ padding: '1.2rem', color: 'var(--text-muted)', fontWeight: 600, fontSize: '0.9rem' }}>Estado</th>
                                <th style={{ padding: '1.2rem', color: 'var(--text-muted)', fontWeight: 600, fontSize: '0.9rem' }}>Localización</th>
                            </tr>
                        </thead>
                        <tbody>
                            {hotels.map((hotel) => (
                                <tr key={hotel.id} style={{ borderBottom: '1px solid var(--border-glass)', transition: 'var(--transition-smooth)' }} className="hover-row">
                                    <td style={{ padding: '1.2rem' }}>
                                        <div style={{ fontWeight: 600, color: 'var(--text-main)' }}>{hotel.name}</div>
                                        <div style={{ display: 'flex', gap: '2px', marginTop: '0.25rem' }}>
                                            {renderStars(hotel.stars)}
                                        </div>
                                    </td>
                                    <td style={{ padding: '1.2rem' }}>
                                        <div style={{ fontSize: '0.95rem', fontWeight: 500 }}>{hotel.city}, {hotel.state}</div>
                                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{hotel.location}</div>
                                    </td>
                                    <td style={{ padding: '1.2rem' }}>
                                        <span style={{ 
                                            padding: '0.3rem 0.8rem', 
                                            borderRadius: 'var(--radius-full)', 
                                            fontSize: '0.8rem', 
                                            background: hotel.status === 'Disponible' ? 'rgba(16, 185, 129, 0.1)' : 
                                                        hotel.status === 'Lleno' ? 'rgba(244, 63, 94, 0.1)' : 'rgba(245, 158, 11, 0.1)',
                                            color: hotel.status === 'Disponible' ? '#10b981' : 
                                                hotel.status === 'Lleno' ? '#f43f5e' : '#f59e0b',
                                            border: `1px solid ${hotel.status === 'Disponible' ? 'rgba(16, 185, 129, 0.2)' : 
                                                            hotel.status === 'Lleno' ? 'rgba(244, 63, 94, 0.2)' : 'rgba(245, 158, 11, 0.2)'}`
                                        }}>
                                            {hotel.status}
                                        </span>
                                    </td>
                                    <td style={{ padding: '1.2rem' }}>
                                        <button 
                                            onClick={() => setSelectedHotel(hotel)}
                                            className="btn-glass-nav" 
                                            style={{ padding: '0.5rem', borderRadius: '10px', width: '36px', height: '36px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                                            title="Ver en Mapa"
                                        >
                                            <MapPin size={16} strokeWidth={2} />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>

            {/* Mobile View: Cards */}
            <div className="mobile-only">
                {loading ? (
                    <div style={{ textAlign: 'center', padding: '4rem' }}>
                        <Loader2 className="animate-spin" size={32} style={{ margin: '0 auto 1rem', color: 'var(--primary)' }} />
                        <p style={{ color: 'var(--text-muted)' }}>Cargando hoteles...</p>
                    </div>
                ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem', padding: '0.5rem 0' }}>
                        {hotels.map((hotel) => (
                            <div key={hotel.id} className="hotel-card-mobile">
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.2rem' }}>
                                    <div>
                                        <div style={{ fontWeight: 800, fontSize: '1.2rem', color: 'var(--text-main)', marginBottom: '0.2rem' }}>{hotel.name}</div>
                                        <div style={{ display: 'flex', gap: '2px' }}>{renderStars(hotel.stars)}</div>
                                    </div>
                                    <span style={{ 
                                        padding: '0.4rem 0.8rem', borderRadius: '10px', fontSize: '0.75rem', fontWeight: 700,
                                        background: hotel.status === 'Disponible' ? 'rgba(16, 185, 129, 0.1)' : '#f43f5e1a',
                                        color: hotel.status === 'Disponible' ? '#10b981' : '#f43f5e'
                                    }}>
                                        {hotel.status}
                                    </span>
                                </div>

                                <div style={{ background: 'rgba(255,255,255,0.03)', borderRadius: '16px', padding: '1rem', marginBottom: '1.2rem', border: '1px solid var(--border-glass)' }}>
                                    <div style={{ fontSize: '0.9rem', color: 'var(--text-main)', fontWeight: 500 }}>{hotel.city}, {hotel.state}</div>
                                    <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>{hotel.location}</div>
                                </div>

                                <button 
                                    onClick={() => setSelectedHotel(hotel)}
                                    className="btn-premium" 
                                    style={{ width: '100%', padding: '0.8rem', borderRadius: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.6rem' }}
                                >
                                    <MapPin size={18} /> Ver Ubicación VIP
                                </button>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Map Modal */}
            {selectedHotel && (
                <div className="modal-overlay" onClick={closeModal}>
                    <div className="modal-content glass-panel" onClick={e => e.stopPropagation()}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', padding: '1rem' }}>
                            <div>
                                <h2 style={{ fontSize: '1.2rem', margin: 0 }}>📍 Ubicación: {selectedHotel.name}</h2>
                                <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', margin: '0.2rem 0 0 0' }}>{selectedHotel.city}, {selectedHotel.state}</p>
                            </div>
                            <button onClick={closeModal} style={{ background: 'none', border: 'none', color: 'white', cursor: 'pointer', padding: '5px' }}>
                                <X size={24} strokeWidth={1.5} />
                            </button>
                        </div>
                        <div style={{ width: '100%', height: '450px', borderRadius: '15px', overflow: 'hidden', background: '#05070a' }}>
                            <iframe
                                width="100%"
                                height="100%"
                                frameBorder="0"
                                style={{ border: 0 }}
                                src={`https://maps.google.com/maps?q=${selectedHotel.coordinates}&t=k&z=17&ie=UTF8&iwloc=&output=embed`}
                                allowFullScreen
                            ></iframe>
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
                .hover-row:hover {
                    background: rgba(255, 255, 255, 0.02);
                }
                .hotel-card-mobile {
                    padding: 1.5rem;
                    border-radius: 24px;
                    border: 1px solid rgba(255, 255, 255, 0.3) !important;
                    background: rgba(255, 255, 255, 0.08) !important;
                    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);
                }
                .modal-overlay {
                    position: fixed;
                    top: 0;
                    left: 0;
                    right: 0;
                    bottom: 0;
                    background: rgba(0, 0, 0, 0.85);
                    backdrop-filter: blur(12px);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    z-index: 1000;
                    animation: fadeIn 0.3s ease;
                }
                .modal-content {
                    width: 90%;
                    max-width: 800px;
                    border-radius: 25px;
                    padding: 0;
                    animation: slideUp 0.4s cubic-bezier(0.4, 0, 0.2, 1);
                }
                @keyframes fadeIn {
                    from { opacity: 0; }
                    to { opacity: 1; }
                }
                @keyframes slideUp {
                    from { transform: translateY(30px); opacity: 0; }
                    to { transform: translateY(0); opacity: 1; }
                }
            `}</style>
        </div>
    );
}
