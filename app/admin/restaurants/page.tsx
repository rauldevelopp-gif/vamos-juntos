'use client';

import { useState } from 'react';
import Link from 'next/link';

interface Restaurant {
    id: number;
    name: string;
    cuisine: string;
    city: string;
    state: string;
    status: string;
    coordinates: string;
    priceRange: string;
}

const TOP_RESTAURANTS: Restaurant[] = [
    { id: 1, name: 'Pujol', cuisine: 'Alta Cocina Mexicana', city: 'Polanco, CDMX', state: 'CDMX', status: 'Abierto', priceRange: '$$$$', coordinates: '19.4281,-99.2011' },
    { id: 2, name: 'Quintonil', cuisine: 'Contemporánea Mexicana', city: 'Polanco, CDMX', state: 'CDMX', status: 'Abierto', priceRange: '$$$$', coordinates: '19.4291,-99.1981' },
    { id: 3, name: 'Rosetta', cuisine: 'Italiana-Mexicana Fusion', city: 'Roma Norte, CDMX', state: 'CDMX', status: 'Abierto', priceRange: '$$$', coordinates: '19.4191,-99.1601' },
    { id: 4, name: 'Fauna', cuisine: 'Cocina de Autor / Baja', city: 'Valle de Guadalupe', state: 'Baja California', status: 'Abierto', priceRange: '$$$$', coordinates: '32.0641,-116.6541' },
    { id: 5, name: 'Pangea', cuisine: 'Contemporánea', city: 'San Pedro Garza García', state: 'Nuevo León', status: 'Abierto', priceRange: '$$$$', coordinates: '25.6441,-100.3541' },
    { id: 6, name: 'Alcalde', cuisine: 'Cocina de Tierra', city: 'Guadalajara', state: 'Jalisco', status: 'Abierto', priceRange: '$$$', coordinates: '20.6741,-103.3641' },
    { id: 7, name: 'Porfirio\'s', cuisine: 'Mexicana Contemporánea', city: 'Zona Hotelera', state: 'Cancún', status: 'Abierto', priceRange: '$$$', coordinates: '21.0941,-86.7641' },
    { id: 8, name: 'Rosa Negra', cuisine: 'Iberoamericana Fusion', city: 'Zona Hotelera', state: 'Tulum', status: 'Abierto', priceRange: '$$$$', coordinates: '20.1441,-87.4741' },
    { id: 9, name: 'Contramar', cuisine: 'Mariscos / Mexicana', city: 'Roma Norte, CDMX', state: 'CDMX', status: 'Abierto', priceRange: '$$$', coordinates: '19.4191,-99.1671' },
    { id: 10, name: 'Criollo', cuisine: 'Cocina Oaxaqueña', city: 'Oaxaca de Juárez', state: 'Oaxaca', status: 'Abierto', priceRange: '$$$', coordinates: '17.0641,-96.7241' },
];

export default function RestaurantsPage() {
    const [selectedRestaurant, setSelectedRestaurant] = useState<Restaurant | null>(null);

    const closeModal = () => setSelectedRestaurant(null);

    return (
        <div style={{ padding: '1rem', maxWidth: '1200px', margin: '0 auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2.5rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <Link href="/admin" className="btn-glass-nav" style={{ width: '40px', height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '12px', fontSize: '1.2rem', textDecoration: 'none' }}>
                        ←
                    </Link>
                    <div>
                        <h1 style={{ fontSize: '1.8rem', fontWeight: 800, margin: 0 }} className="text-gradient">
                            Directorio Gastronómico
                        </h1>
                        <p style={{ color: 'var(--text-muted)', margin: '0.5rem 0 0 0' }}>
                            Gestión de restaurantes, bares y experiencias culinarias.
                        </p>
                    </div>
                </div>
                
                <button className="btn-premium" style={{ padding: '0.8rem 1.8rem' }}>
                    <span className="btn-text-mobile-hide">Nuevo Restaurante</span>
                    <span style={{ fontSize: '1.2rem' }}>🍴</span>
                </button>
            </div>

            <div className="glass-panel" style={{ overflow: 'hidden', borderRadius: '20px' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                    <thead>
                        <tr style={{ background: 'rgba(255,255,255,0.03)', borderBottom: '1px solid var(--border-glass)' }}>
                            <th style={{ padding: '1.2rem', color: 'var(--text-muted)', fontWeight: 600, fontSize: '0.9rem' }}>Restaurante / Cocina</th>
                            <th style={{ padding: '1.2rem', color: 'var(--text-muted)', fontWeight: 600, fontSize: '0.9rem' }}>Ubicación</th>
                            <th style={{ padding: '1.2rem', color: 'var(--text-muted)', fontWeight: 600, fontSize: '0.9rem' }}>Rango Precio</th>
                            <th style={{ padding: '1.2rem', color: 'var(--text-muted)', fontWeight: 600, fontSize: '0.9rem' }}>Estado</th>
                            <th style={{ padding: '1.2rem', color: 'var(--text-muted)', fontWeight: 600, fontSize: '0.9rem' }}>Mapa</th>
                        </tr>
                    </thead>
                    <tbody>
                        {TOP_RESTAURANTS.map((restaurant) => (
                            <tr key={restaurant.id} style={{ borderBottom: '1px solid var(--border-glass)', transition: 'var(--transition-smooth)' }} className="hover-row">
                                <td style={{ padding: '1.2rem' }}>
                                    <div style={{ fontWeight: 600, color: 'var(--text-main)' }}>{restaurant.name}</div>
                                    <div style={{ fontSize: '0.8rem', color: 'var(--primary)', fontWeight: 500 }}>{restaurant.cuisine}</div>
                                </td>
                                <td style={{ padding: '1.2rem' }}>
                                    <div style={{ fontSize: '0.95rem', fontWeight: 500 }}>{restaurant.city}</div>
                                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{restaurant.state}</div>
                                </td>
                                <td style={{ padding: '1.2rem' }}>
                                    <span style={{ color: '#10b981', fontWeight: 600, letterSpacing: '1px' }}>
                                        {restaurant.priceRange}
                                    </span>
                                </td>
                                <td style={{ padding: '1.2rem' }}>
                                    <span style={{ 
                                        padding: '0.3rem 0.8rem', 
                                        borderRadius: 'var(--radius-full)', 
                                        fontSize: '0.8rem', 
                                        background: restaurant.status === 'Abierto' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(244, 63, 94, 0.1)',
                                        color: restaurant.status === 'Abierto' ? '#10b981' : '#f43f5e',
                                        border: `1px solid ${restaurant.status === 'Abierto' ? 'rgba(16, 185, 129, 0.2)' : 'rgba(244, 63, 94, 0.2)'}`
                                    }}>
                                        {restaurant.status}
                                    </span>
                                </td>
                                <td style={{ padding: '1.2rem' }}>
                                    <button 
                                        onClick={() => setSelectedRestaurant(restaurant)}
                                        className="btn-glass-nav" 
                                        style={{ padding: '0.5rem', borderRadius: '50%', width: '36px', height: '36px' }}
                                        title="Ver Ubicación Gourmet"
                                    >
                                        🍴
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Map Modal */}
            {selectedRestaurant && (
                <div className="modal-overlay" onClick={closeModal}>
                    <div className="modal-content glass-panel" onClick={e => e.stopPropagation()}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', padding: '1rem' }}>
                            <div>
                                <h2 style={{ fontSize: '1.2rem', margin: 0 }}>🍴 Ubicación: {selectedRestaurant.name}</h2>
                                <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', margin: '0.2rem 0 0 0' }}>{selectedRestaurant.city} - {selectedRestaurant.cuisine}</p>
                            </div>
                            <button onClick={closeModal} style={{ background: 'none', border: 'none', color: 'white', fontSize: '1.5rem', cursor: 'pointer' }}>×</button>
                        </div>
                        <div style={{ width: '100%', height: '450px', borderRadius: '15px', overflow: 'hidden', background: '#05070a' }}>
                            <iframe
                                width="100%"
                                height="100%"
                                frameBorder="0"
                                style={{ border: 0 }}
                                src={`https://maps.google.com/maps?q=${selectedRestaurant.coordinates}&t=k&z=18&ie=UTF8&iwloc=&output=embed`}
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
