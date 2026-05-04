'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Plus, MapPin, X, Star } from 'lucide-react';

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

const LUXURY_HOTELS: Hotel[] = [
    { id: 1, name: 'Four Seasons Hotel Mexico City', location: 'Paseo de la Reforma, CDMX', stars: 5, city: 'Ciudad de México', state: 'CDMX', status: 'Disponible', coordinates: '19.4244,-99.1741' },
    { id: 2, name: 'Rosewood San Miguel de Allende', location: 'Nemesio Diez 11, Centro', stars: 5, city: 'San Miguel de Allende', state: 'Guanajuato', status: 'Disponible', coordinates: '20.9103,-100.7437' },
    { id: 3, name: 'Nizuc Resort & Spa', location: 'Blvd. Kukulcán, Zona Hotelera', stars: 5, city: 'Cancún', state: 'Quintana Roo', status: 'Lleno', coordinates: '21.0211,-86.7811' },
    { id: 4, name: 'The St. Regis Punta Mita Resort', location: 'Lote H-4, Carr. Federal 200', stars: 5, city: 'Punta Mita', state: 'Nayarit', status: 'Disponible', coordinates: '20.7725,-105.5184' },
    { id: 5, name: 'Hotel Xcaret México', location: 'Carretera Chetumal-Puerto Juárez', stars: 5, city: 'Playa del Carmen', state: 'Quintana Roo', status: 'Disponible', coordinates: '20.5841,-87.1141' },
    { id: 6, name: 'Viceroy Los Cabos', location: 'Paseo Malecon San Jose Lote 8', stars: 5, city: 'San José del Cabo', state: 'BCS', status: 'Mantenimiento', coordinates: '23.0541,-109.6841' },
    { id: 7, name: 'Banyan Tree Cabo Marqués', location: 'Blvd. Cabo Marqués, Lote 1', stars: 5, city: 'Acapulco', state: 'Guerrero', status: 'Disponible', coordinates: '16.8041,-99.8241' },
    { id: 8, name: 'Hacienda de San Antonio', location: 'Domicilio Conocido, Comala', stars: 5, city: 'Comala', state: 'Colima', status: 'Disponible', coordinates: '19.4541,-103.7141' },
    { id: 9, name: 'Belmond Maroma Resort & Spa', location: 'Carretera Cancún-Tulum', stars: 5, city: 'Riviera Maya', state: 'Quintana Roo', status: 'Disponible', coordinates: '20.7385,-86.9669' },
    { id: 10, name: 'One&Only Palmilla', location: 'Carr. Transpeninsular Km 7.5', stars: 5, city: 'Los Cabos', state: 'BCS', status: 'Disponible', coordinates: '23.0125,-109.7118' },
];

export default function HotelsPage() {
    const [selectedHotel, setSelectedHotel] = useState<Hotel | null>(null);

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

            <div className="glass-panel" style={{ overflow: 'hidden', borderRadius: '20px' }}>
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
                        {LUXURY_HOTELS.map((hotel) => (
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
                    backdrop-filter: blur(10px);
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
                    from { transform: translateY(40px); opacity: 0; }
                    to { transform: translateY(0); opacity: 1; }
                }
            `}</style>
        </div>
    );
}
