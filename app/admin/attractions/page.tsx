'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Plus, MapPin, X, Camera, Clock } from 'lucide-react';

interface Attraction {
    id: number;
    name: string;
    category: string;
    city: string;
    state: string;
    status: string;
    coordinates: string;
    recommendedTime: string;
}

const TOP_ATTRACTIONS: Attraction[] = [
    { id: 1, name: 'Chichén Itzá', category: 'Zona Arqueológica', city: 'Tinum', state: 'Yucatán', status: 'Abierto', recommendedTime: '3-4 Horas', coordinates: '20.6841,-88.5671' },
    { id: 2, name: 'Pirámides de Teotihuacán', category: 'Zona Arqueológica', city: 'Teotihuacán', state: 'Edo. de México', status: 'Abierto', recommendedTime: '4-5 Horas', coordinates: '19.6921,-98.8431' },
    { id: 3, name: 'Castillo de Chapultepec', category: 'Museo / Histórico', city: 'Ciudad de México', state: 'CDMX', status: 'Abierto', recommendedTime: '2-3 Horas', coordinates: '19.4201,-99.1811' },
    { id: 4, name: 'Parque Xcaret', category: 'Eco-Parque Temático', city: 'Playa del Carmen', state: 'Quintana Roo', status: 'Abierto', recommendedTime: 'Todo el día', coordinates: '20.5801,-87.1191' },
    { id: 5, name: 'Zona Arqueológica de Tulum', category: 'Zona Arqueológica', city: 'Tulum', state: 'Quintana Roo', status: 'Abierto', recommendedTime: '2 Horas', coordinates: '20.2141,-87.4291' },
    { id: 6, name: 'Cañón del Sumidero', category: 'Parque Nacional', city: 'Chiapa de Corzo', state: 'Chiapas', status: 'Abierto', recommendedTime: '3 Horas', coordinates: '16.8331,-93.0831' },
    { id: 7, name: 'Museo Frida Kahlo (Casa Azul)', category: 'Museo de Arte', city: 'Coyoacán', state: 'CDMX', status: 'Abierto', recommendedTime: '1.5 Horas', coordinates: '19.3551,-99.1621' },
    { id: 8, name: 'Palenque', category: 'Zona Arqueológica', city: 'Palenque', state: 'Chiapas', status: 'Restauración', recommendedTime: '4 Horas', coordinates: '17.4841,-92.0461' },
    { id: 9, name: 'Barrancas del Cobre', category: 'Parque Nacional', city: 'Creel', state: 'Chihuahua', status: 'Abierto', recommendedTime: '1-2 Días', coordinates: '27.5041,-107.7541' },
    { id: 10, name: 'Monte Albán', category: 'Zona Arqueológica', city: 'Oaxaca de Juárez', state: 'Oaxaca', status: 'Abierto', recommendedTime: '3 Horas', coordinates: '17.0441,-96.7641' },
];

export default function AttractionsPage() {
    const [selectedAttraction, setSelectedAttraction] = useState<Attraction | null>(null);

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
                            Atracciones Turísticas
                        </h1>
                        <p style={{ color: 'var(--text-muted)', margin: '0.5rem 0 0 0' }}>
                            Puntos de interés, monumentos y experiencias locales.
                        </p>
                    </div>
                </div>
                
                <button className="btn-premium" style={{ padding: '0.8rem 1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <Plus size={18} strokeWidth={2.5} />
                    <span className="btn-text-mobile-hide">Registrar Atracción</span>
                </button>
            </div>

            <div className="glass-panel" style={{ overflow: 'hidden', borderRadius: '20px' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                    <thead>
                        <tr style={{ background: 'rgba(255,255,255,0.03)', borderBottom: '1px solid var(--border-glass)' }}>
                            <th style={{ padding: '1.2rem', color: 'var(--text-muted)', fontWeight: 600, fontSize: '0.9rem' }}>Nombre / Categoría</th>
                            <th style={{ padding: '1.2rem', color: 'var(--text-muted)', fontWeight: 600, fontSize: '0.9rem' }}>Ubicación</th>
                            <th style={{ padding: '1.2rem', color: 'var(--text-muted)', fontWeight: 600, fontSize: '0.9rem' }}>Estadía Sugerida</th>
                            <th style={{ padding: '1.2rem', color: 'var(--text-muted)', fontWeight: 600, fontSize: '0.9rem' }}>Estado</th>
                            <th style={{ padding: '1.2rem', color: 'var(--text-muted)', fontWeight: 600, fontSize: '0.9rem' }}>Mapa</th>
                        </tr>
                    </thead>
                    <tbody>
                        {TOP_ATTRACTIONS.map((attraction) => (
                            <tr key={attraction.id} style={{ borderBottom: '1px solid var(--border-glass)', transition: 'var(--transition-smooth)' }} className="hover-row">
                                <td style={{ padding: '1.2rem' }}>
                                    <div style={{ fontWeight: 600, color: 'var(--text-main)' }}>{attraction.name}</div>
                                    <div style={{ fontSize: '0.8rem', color: 'var(--primary)', fontWeight: 500 }}>{attraction.category}</div>
                                </td>
                                <td style={{ padding: '1.2rem' }}>
                                    <div style={{ fontSize: '0.95rem', fontWeight: 500 }}>{attraction.city}</div>
                                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{attraction.state}</div>
                                </td>
                                <td style={{ padding: '1.2rem' }}>
                                    <div style={{ fontSize: '0.9rem', color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                                        <Clock size={14} strokeWidth={2} color="var(--text-muted)" />
                                        {attraction.recommendedTime}
                                    </div>
                                </td>
                                <td style={{ padding: '1.2rem' }}>
                                    <span style={{ 
                                        padding: '0.3rem 0.8rem', 
                                        borderRadius: 'var(--radius-full)', 
                                        fontSize: '0.8rem', 
                                        background: attraction.status === 'Abierto' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(244, 63, 94, 0.1)',
                                        color: attraction.status === 'Abierto' ? '#10b981' : '#f43f5e',
                                        border: `1px solid ${attraction.status === 'Abierto' ? 'rgba(16, 185, 129, 0.2)' : 'rgba(244, 63, 94, 0.2)'}`
                                    }}>
                                        {attraction.status}
                                    </span>
                                </td>
                                <td style={{ padding: '1.2rem' }}>
                                    <button 
                                        onClick={() => setSelectedAttraction(attraction)}
                                        className="btn-glass-nav" 
                                        style={{ padding: '0.5rem', borderRadius: '10px', width: '36px', height: '36px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                                        title="Explorar Ubicación"
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
            {selectedAttraction && (
                <div className="modal-overlay" onClick={closeModal}>
                    <div className="modal-content glass-panel" onClick={e => e.stopPropagation()}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', padding: '1rem' }}>
                            <div>
                                <h2 style={{ fontSize: '1.2rem', margin: 0 }}>📷 Exploración: {selectedAttraction.name}</h2>
                                <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', margin: '0.2rem 0 0 0' }}>{selectedAttraction.city}, {selectedAttraction.state} - {selectedAttraction.category}</p>
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
                                src={`https://maps.google.com/maps?q=${selectedAttraction.coordinates}&t=k&z=17&ie=UTF8&iwloc=&output=embed`}
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
                    from { transform: translateY(40px); opacity: 0; }
                    to { transform: translateY(0); opacity: 1; }
                }
            `}</style>
        </div>
    );
}
