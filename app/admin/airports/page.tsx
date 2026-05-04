'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Plus, MapPin, X } from 'lucide-react';

interface Airport {
    id: number;
    name: string;
    location: string;
    iata: string;
    city: string;
    state: string;
    status: string;
    coordinates: string; // Used for Google Maps iframe
}

const MEXICAN_AIRPORTS: Airport[] = [
    { id: 1, name: 'Aeropuerto Internacional de la Ciudad de México', location: 'Venustiano Carranza, CDMX', iata: 'MEX', city: 'Ciudad de México', state: 'CDMX', status: 'Operativo', coordinates: '19.4361,-99.0719' },
    { id: 2, name: 'Aeropuerto Internacional de Cancún', location: 'Cancún, Quintana Roo', iata: 'CUN', city: 'Cancún', state: 'Quintana Roo', status: 'Operativo', coordinates: '21.0367,-86.8771' },
    { id: 3, name: 'Aeropuerto Internacional de Guadalajara', location: 'Tlajomulco de Zúñiga, Jalisco', iata: 'GDL', city: 'Guadalajara', state: 'Jalisco', status: 'Operativo', coordinates: '20.5218,-103.3112' },
    { id: 4, name: 'Aeropuerto Internacional de Monterrey', location: 'Apodaca, Nuevo León', iata: 'MTY', city: 'Monterrey', state: 'Nuevo León', status: 'Operativo', coordinates: '25.7785,-100.1069' },
    { id: 5, name: 'Aeropuerto Internacional de Tijuana', location: 'Tijuana, Baja California', iata: 'TIJ', city: 'Tijuana', state: 'Baja California', status: 'Operativo', coordinates: '32.5411,-116.9702' },
    { id: 6, name: 'Aeropuerto Internacional de Puerto Vallarta', location: 'Puerto Vallarta, Jalisco', iata: 'PVR', city: 'Puerto Vallarta', state: 'Jalisco', status: 'Operativo', coordinates: '20.6801,-105.2541' },
    { id: 7, name: 'Aeropuerto Internacional de Los Cabos', location: 'San José del Cabo, BCS', iata: 'SJD', city: 'San José del Cabo', state: 'Baja California Sur', status: 'Operativo', coordinates: '23.1518,-109.7210' },
    { id: 8, name: 'Aeropuerto Internacional de Mérida', location: 'Mérida, Yucatán', iata: 'MID', city: 'Mérida', state: 'Yucatán', status: 'Operativo', coordinates: '20.9370,-89.6577' },
    { id: 9, name: 'Aeropuerto Internacional del Bajío', location: 'Silao, Guanajuato', iata: 'BJX', city: 'León', state: 'Guanajuato', status: 'Operativo', coordinates: '20.9935,-101.4808' },
    { id: 10, name: 'Aeropuerto Internacional de Veracruz', location: 'Veracruz, Veracruz', iata: 'VER', city: 'Veracruz', state: 'Veracruz', status: 'Operativo', coordinates: '19.1459,-96.1873' },
];

export default function AirportsPage() {
    const [selectedAirport, setSelectedAirport] = useState<Airport | null>(null);

    const closeModal = () => setSelectedAirport(null);

    return (
        <div style={{ padding: '1rem', maxWidth: '1200px', margin: '0 auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2.5rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <Link href="/admin" className="btn-glass-nav" style={{ width: '40px', height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '12px', textDecoration: 'none', padding: 0 }}>
                        <ArrowLeft size={20} strokeWidth={2} />
                    </Link>
                    <div>
                        <h1 style={{ fontSize: '1.8rem', fontWeight: 800, margin: 0 }} className="text-gradient">
                            Gestión de Aeropuertos
                        </h1>
                        <p style={{ color: 'var(--text-muted)', margin: '0.5rem 0 0 0' }}>
                            Listado oficial de terminales aéreas en México.
                        </p>
                    </div>
                </div>
                
                <button className="btn-premium" style={{ padding: '0.8rem 1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <Plus size={18} strokeWidth={2.5} />
                    <span className="btn-text-mobile-hide">Agregar Terminal</span>
                </button>
            </div>

            <div className="glass-panel" style={{ overflow: 'hidden', borderRadius: '20px' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                    <thead>
                        <tr style={{ background: 'rgba(255,255,255,0.03)', borderBottom: '1px solid var(--border-glass)' }}>
                            <th style={{ padding: '1.2rem', color: 'var(--text-muted)', fontWeight: 600, fontSize: '0.9rem' }}>Aeropuerto</th>
                            <th style={{ padding: '1.2rem', color: 'var(--text-muted)', fontWeight: 600, fontSize: '0.9rem' }}>IATA</th>
                            <th style={{ padding: '1.2rem', color: 'var(--text-muted)', fontWeight: 600, fontSize: '0.9rem' }}>Ubicación</th>
                            <th style={{ padding: '1.2rem', color: 'var(--text-muted)', fontWeight: 600, fontSize: '0.9rem' }}>Estado</th>
                            <th style={{ padding: '1.2rem', color: 'var(--text-muted)', fontWeight: 600, fontSize: '0.9rem' }}>Mapa</th>
                        </tr>
                    </thead>
                    <tbody>
                        {MEXICAN_AIRPORTS.map((airport) => (
                            <tr key={airport.id} style={{ borderBottom: '1px solid var(--border-glass)', transition: 'var(--transition-smooth)' }} className="hover-row">
                                <td style={{ padding: '1.2rem' }}>
                                    <div style={{ fontWeight: 600, color: 'var(--text-main)' }}>{airport.name}</div>
                                    <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{airport.city}</div>
                                </td>
                                <td style={{ padding: '1.2rem' }}>
                                    <span style={{ fontWeight: 700, color: 'var(--primary)', background: 'rgba(139, 92, 246, 0.1)', padding: '0.2rem 0.5rem', borderRadius: '6px' }}>
                                        {airport.iata}
                                    </span>
                                </td>
                                <td style={{ padding: '1.2rem' }}>
                                    <div style={{ fontSize: '0.9rem' }}>{airport.state}</div>
                                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{airport.location}</div>
                                </td>
                                <td style={{ padding: '1.2rem' }}>
                                    <span style={{ 
                                        padding: '0.3rem 0.8rem', 
                                        borderRadius: 'var(--radius-full)', 
                                        fontSize: '0.8rem', 
                                        background: 'rgba(16, 185, 129, 0.1)',
                                        color: '#10b981',
                                        border: '1px solid rgba(16, 185, 129, 0.2)'
                                    }}>
                                        {airport.status}
                                    </span>
                                </td>
                                <td style={{ padding: '1.2rem' }}>
                                    <button 
                                        onClick={() => setSelectedAirport(airport)}
                                        className="btn-glass-nav" 
                                        style={{ padding: '0.5rem', borderRadius: '10px', width: '36px', height: '36px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                                        title="Ver Ubicación"
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
            {selectedAirport && (
                <div className="modal-overlay" onClick={closeModal}>
                    <div className="modal-content glass-panel" onClick={e => e.stopPropagation()}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', padding: '1rem' }}>
                            <div>
                                <h2 style={{ fontSize: '1.2rem', margin: 0 }}>Ubicación: {selectedAirport.iata}</h2>
                                <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', margin: '0.2rem 0 0 0' }}>{selectedAirport.name}</p>
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
                                src={`https://maps.google.com/maps?q=${selectedAirport.coordinates}&t=k&z=15&ie=UTF8&iwloc=&output=embed`}
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
                    background: rgba(0, 0, 0, 0.8);
                    backdrop-filter: blur(8px);
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
