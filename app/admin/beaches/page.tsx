'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Plus, MapPin, X, Waves } from 'lucide-react';

interface Beach {
    id: number;
    name: string;
    type: string;
    city: string;
    state: string;
    status: string;
    coordinates: string;
    popularity: string;
}

const TOP_BEACHES: Beach[] = [
    { id: 1, name: 'Playa Norte', type: 'Pública / Club', city: 'Isla Mujeres', state: 'Quintana Roo', status: 'Abierta', popularity: 'Alta', coordinates: '21.2581,-86.7511' },
    { id: 2, name: 'Playa Balandra', type: 'Reserva Natural', city: 'La Paz', state: 'Baja California Sur', status: 'Acceso Restringido', popularity: 'Alta', coordinates: '24.3211,-110.3211' },
    { id: 3, name: 'Playa del Amor', type: 'Pública (Acceso por mar)', city: 'Cabo San Lucas', state: 'BCS', status: 'Abierta', popularity: 'Muy Alta', coordinates: '22.8741,-109.9041' },
    { id: 4, name: 'Playa Akumal', type: 'Santuario de Tortugas', city: 'Akumal', state: 'Quintana Roo', status: 'Abierta', popularity: 'Alta', coordinates: '20.4041,-87.3141' },
    { id: 5, name: 'Playa Delfines', type: 'Pública (Mirador)', city: 'Cancún', state: 'Quintana Roo', status: 'Abierta', popularity: 'Muy Alta', coordinates: '21.0541,-86.7841' },
    { id: 6, name: 'Playa Maroma', type: 'Club de Playa Privado', city: 'Riviera Maya', state: 'Quintana Roo', status: 'Abierta', popularity: 'Media-Alta', coordinates: '20.7341,-86.9641' },
    { id: 7, name: 'Playa Carrizalillo', type: 'Pública (Bahía)', city: 'Puerto Escondido', state: 'Oaxaca', status: 'Abierta', popularity: 'Media', coordinates: '15.8641,-97.0741' },
    { id: 8, name: 'Playa Sayulita', type: 'Surf / Pública', city: 'Sayulita', state: 'Nayarit', status: 'Abierta', popularity: 'Alta', coordinates: '20.8641,-105.4441' },
    { id: 10, name: 'Playa Paraíso', type: 'Pública (Ruinas)', city: 'Tulum', state: 'Quintana Roo', status: 'Abierta', popularity: 'Muy Alta', coordinates: '20.2141,-87.4341' },
];

export default function BeachesPage() {
    const [selectedBeach, setSelectedBeach] = useState<Beach | null>(null);

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
                            Gestión de Playas
                        </h1>
                        <p style={{ color: 'var(--text-muted)', margin: '0.5rem 0 0 0' }}>
                            Catálogo de destinos costeros y puntos de interés marino.
                        </p>
                    </div>
                </div>
                
                <button className="btn-premium" style={{ padding: '0.8rem 1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <Plus size={18} strokeWidth={2.5} />
                    <span className="btn-text-mobile-hide">Registrar Playa</span>
                </button>
            </div>

            <div className="glass-panel" style={{ overflow: 'hidden', borderRadius: '20px' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                    <thead>
                        <tr style={{ background: 'rgba(255,255,255,0.03)', borderBottom: '1px solid var(--border-glass)' }}>
                            <th style={{ padding: '1.2rem', color: 'var(--text-muted)', fontWeight: 600, fontSize: '0.9rem' }}>Nombre / Tipo</th>
                            <th style={{ padding: '1.2rem', color: 'var(--text-muted)', fontWeight: 600, fontSize: '0.9rem' }}>Ubicación</th>
                            <th style={{ padding: '1.2rem', color: 'var(--text-muted)', fontWeight: 600, fontSize: '0.9rem' }}>Popularidad</th>
                            <th style={{ padding: '1.2rem', color: 'var(--text-muted)', fontWeight: 600, fontSize: '0.9rem' }}>Estado</th>
                            <th style={{ padding: '1.2rem', color: 'var(--text-muted)', fontWeight: 600, fontSize: '0.9rem' }}>Ver Mapa</th>
                        </tr>
                    </thead>
                    <tbody>
                        {TOP_BEACHES.map((beach) => (
                            <tr key={beach.id} style={{ borderBottom: '1px solid var(--border-glass)', transition: 'var(--transition-smooth)' }} className="hover-row">
                                <td style={{ padding: '1.2rem' }}>
                                    <div style={{ fontWeight: 600, color: 'var(--text-main)' }}>{beach.name}</div>
                                    <div style={{ fontSize: '0.8rem', color: 'var(--primary)', fontWeight: 500 }}>{beach.type}</div>
                                </td>
                                <td style={{ padding: '1.2rem' }}>
                                    <div style={{ fontSize: '0.95rem', fontWeight: 500 }}>{beach.city}</div>
                                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{beach.state}</div>
                                </td>
                                <td style={{ padding: '1.2rem' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                        <div style={{ width: '60px', height: '6px', background: 'rgba(255,255,255,0.1)', borderRadius: '10px', overflow: 'hidden' }}>
                                            <div style={{ 
                                                width: beach.popularity === 'Muy Alta' ? '100%' : beach.popularity === 'Alta' ? '80%' : '50%', 
                                                height: '100%', 
                                                background: 'linear-gradient(90deg, var(--secondary), var(--primary))' 
                                            }} />
                                        </div>
                                        <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{beach.popularity}</span>
                                    </div>
                                </td>
                                <td style={{ padding: '1.2rem' }}>
                                    <span style={{ 
                                        padding: '0.3rem 0.8rem', 
                                        borderRadius: 'var(--radius-full)', 
                                        fontSize: '0.8rem', 
                                        background: beach.status === 'Abierta' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(244, 63, 94, 0.1)',
                                        color: beach.status === 'Abierta' ? '#10b981' : '#f43f5e',
                                        border: `1px solid ${beach.status === 'Abierta' ? 'rgba(16, 185, 129, 0.2)' : 'rgba(244, 63, 94, 0.2)'}`
                                    }}>
                                        {beach.status}
                                    </span>
                                </td>
                                <td style={{ padding: '1.2rem' }}>
                                    <button 
                                        onClick={() => setSelectedBeach(beach)}
                                        className="btn-glass-nav" 
                                        style={{ padding: '0.5rem', borderRadius: '10px', width: '36px', height: '36px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                                        title="Ver Ubicación Satelital"
                                    >
                                        <MapPin size={16} strokeWidth={2} />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Map Modal */}
            {selectedBeach && (
                <div className="modal-overlay" onClick={closeModal}>
                    <div className="modal-content glass-panel" onClick={e => e.stopPropagation()}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', padding: '1rem' }}>
                            <div>
                                <h2 style={{ fontSize: '1.2rem', margin: 0 }}>🌊 Vista Satelital: {selectedBeach.name}</h2>
                                <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', margin: '0.2rem 0 0 0' }}>{selectedBeach.city}, {selectedBeach.state} - {selectedBeach.type}</p>
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
                                src={`https://maps.google.com/maps?q=${selectedBeach.coordinates}&t=k&z=16&ie=UTF8&iwloc=&output=embed`}
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
                .hover-row:hover {
                    background: rgba(255, 255, 255, 0.02);
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
                    max-width: 850px;
                    border-radius: 25px;
                    padding: 0;
                    animation: slideUp 0.4s cubic-bezier(0.4, 0, 0.2, 1);
                }
                @keyframes fadeIn {
                    from { opacity: 0; }
                    to { opacity: 1; }
                }
                @keyframes slideUp {
                    from { transform: translateY(50px); opacity: 0; }
                    to { transform: translateY(0); opacity: 1; }
                }
            `}</style>
        </div>
    );
}
