'use client';

import { useState } from 'react';
import Link from 'next/link';
import { 
    ArrowLeft, 
    Plus, 
    User, 
    Users, 
    Briefcase, 
    X, 
    Star, 
    Music, 
    Wind, 
    Dog, 
    Cigarette, 
    GlassWater, 
    Wifi, 
    Smartphone 
} from 'lucide-react';

interface Driver {
    id: number;
    name: string;
    phone: string;
    license: string;
    expiration: string;
    rating: number;
    photo: string;
}

interface Taxi {
    id: number;
    plate: string;
    brand: string;
    model: string;
    year: number;
    color: string;
    type: 'Sedán' | 'SUV' | 'Van' | 'Premium';
    passengers: number;
    luggage: number;
    amenities: string[];
    status: 'Disponible' | 'En Viaje' | 'Mantenimiento';
    driver: Driver;
}

const FLEET_DATA: Taxi[] = [
    { 
        id: 1, plate: 'VJP-1234', brand: 'Toyota', model: 'Camry', year: 2023, color: 'Blanco', type: 'Sedán', passengers: 4, luggage: 3, 
        amenities: ['Música', 'A/C', 'Mascotas'], status: 'Disponible',
        driver: { id: 101, name: 'Juan Carlos Pérez', phone: '+52 555-123-4567', license: 'MX-998877', expiration: '2026-12-15', rating: 4.8, photo: 'https://images.unsplash.com/photo-1633332755192-727a05c4013d?q=80&w=200&auto=format&fit=crop' }
    },
    { 
        id: 2, plate: 'VJP-5678', brand: 'Chevrolet', model: 'Suburban', year: 2022, color: 'Negro', type: 'SUV', passengers: 7, luggage: 6, 
        amenities: ['Música', 'A/C', 'Fumar', 'Bar'], status: 'En Viaje',
        driver: { id: 102, name: 'Roberto Gómez', phone: '+52 555-987-6543', license: 'MX-445566', expiration: '2025-08-20', rating: 4.9, photo: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=200&auto=format&fit=crop' }
    },
    { 
        id: 3, plate: 'VJP-9012', brand: 'Mercedes-Benz', model: 'V-Class', year: 2024, color: 'Gris Plata', type: 'Premium', passengers: 6, luggage: 5, 
        amenities: ['Música', 'A/C', 'WiFi', 'Bebidas'], status: 'Disponible',
        driver: { id: 103, name: 'Alejandro Ruiz', phone: '+52 555-777-8888', license: 'MX-112233', expiration: '2027-01-10', rating: 5.0, photo: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?q=80&w=200&auto=format&fit=crop' }
    },
    { 
        id: 4, plate: 'VJP-3456', brand: 'Volkswagen', model: 'Transporter', year: 2021, color: 'Azul', type: 'Van', passengers: 12, luggage: 10, 
        amenities: ['A/C', 'Equipaje Extra'], status: 'Mantenimiento',
        driver: { id: 104, name: 'Sonia Méndez', phone: '+52 555-333-4444', license: 'MX-889900', expiration: '2025-11-30', rating: 4.7, photo: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=200&auto=format&fit=crop' }
    },
];

export default function TaxisPage() {
    const [selectedDriver, setSelectedDriver] = useState<Driver | null>(null);

    const closeModal = () => setSelectedDriver(null);

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

            <div className="glass-panel" style={{ overflow: 'hidden', borderRadius: '20px' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                    <thead>
                        <tr style={{ background: 'rgba(255,255,255,0.03)', borderBottom: '1px solid var(--border-glass)' }}>
                            <th style={{ padding: '1.2rem', color: 'var(--text-muted)', fontWeight: 600, fontSize: '0.9rem' }}>Vehículo / Placa</th>
                            <th style={{ padding: '1.2rem', color: 'var(--text-muted)', fontWeight: 600, fontSize: '0.9rem' }}>Tipo / Capacidad</th>
                            <th style={{ padding: '1.2rem', color: 'var(--text-muted)', fontWeight: 600, fontSize: '0.9rem' }}>Amenidades</th>
                            <th style={{ padding: '1.2rem', color: 'var(--text-muted)', fontWeight: 600, fontSize: '0.9rem' }}>Estado</th>
                            <th style={{ padding: '1.2rem', color: 'var(--text-muted)', fontWeight: 600, fontSize: '0.9rem', textAlign: 'center' }}>Chofer</th>
                        </tr>
                    </thead>
                    <tbody>
                        {FLEET_DATA.map((taxi) => (
                            <tr key={taxi.id} style={{ borderBottom: '1px solid var(--border-glass)', transition: 'var(--transition-smooth)' }} className="hover-row">
                                <td style={{ padding: '1.2rem' }}>
                                    <div style={{ fontWeight: 700, color: 'var(--text-main)', fontSize: '1.05rem' }}>{taxi.plate}</div>
                                    <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>{taxi.brand} {taxi.model} ({taxi.year})</div>
                                </td>
                                <td style={{ padding: '1.2rem' }}>
                                    <div style={{ marginBottom: '0.4rem' }}>
                                        <span style={{ 
                                            padding: '0.2rem 0.6rem', borderRadius: '8px', fontSize: '0.75rem', fontWeight: 600,
                                            background: taxi.type === 'Premium' ? 'rgba(139, 92, 246, 0.1)' : 'rgba(255,255,255,0.05)',
                                            color: taxi.type === 'Premium' ? 'var(--primary)' : 'var(--text-main)',
                                            border: `1px solid ${taxi.type === 'Premium' ? 'rgba(139, 92, 246, 0.2)' : 'rgba(255,255,255,0.1)'}`
                                        }}>
                                            {taxi.type}
                                        </span>
                                    </div>
                                    <div style={{ display: 'flex', gap: '0.75rem', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                                        <span title="Capacidad de Pasajeros" style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}><Users size={14} /> {taxi.passengers}</span>
                                        <span title="Capacidad de Equipaje" style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}><Briefcase size={14} /> {taxi.luggage}</span>
                                    </div>
                                </td>
                                <td style={{ padding: '1.2rem' }}>
                                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.6rem' }}>
                                        {taxi.amenities.map((amenity, idx) => {
                                            const IconsMap: { [key: string]: any } = {
                                                'Música': Music, 'A/C': Wind, 'Mascotas': Dog, 'Fumar': Cigarette, 'Bar': GlassWater, 'Bebidas': GlassWater, 'WiFi': Wifi, 'Equipaje Extra': Briefcase
                                            };
                                            const Icon = IconsMap[amenity] || Smartphone;
                                            return (
                                                <span key={idx} style={{ color: 'var(--text-muted)' }} title={amenity}>
                                                    <Icon size={16} strokeWidth={2} />
                                                </span>
                                            );
                                        })}
                                    </div>
                                </td>
                                <td style={{ padding: '1.2rem' }}>
                                    <span style={{ 
                                        padding: '0.3rem 0.8rem', borderRadius: 'var(--radius-full)', fontSize: '0.8rem', 
                                        background: taxi.status === 'Disponible' ? 'rgba(16, 185, 129, 0.1)' : 
                                                    taxi.status === 'En Viaje' ? 'rgba(59, 130, 246, 0.1)' : 'rgba(244, 63, 94, 0.1)',
                                        color: taxi.status === 'Disponible' ? '#10b981' : 
                                               taxi.status === 'En Viaje' ? '#3b82f6' : '#f43f5e',
                                        border: `1px solid ${taxi.status === 'Disponible' ? 'rgba(16, 185, 129, 0.2)' : 
                                                           taxi.status === 'En Viaje' ? 'rgba(59, 130, 246, 0.2)' : 'rgba(244, 63, 94, 0.2)'}`
                                    }}>
                                        {taxi.status}
                                    </span>
                                </td>
                                <td style={{ padding: '1.2rem', textAlign: 'center' }}>
                                    <button 
                                        onClick={() => setSelectedDriver(taxi.driver)}
                                        className="btn-glass-nav" 
                                        style={{ padding: '0.5rem', borderRadius: '10px', width: '40px', height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                                        title="Ver Ficha del Chofer"
                                    >
                                        <User size={20} strokeWidth={2} />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Driver Profile Modal */}
            {selectedDriver && (
                <div className="modal-overlay" onClick={closeModal}>
                    <div className="modal-content glass-panel" onClick={e => e.stopPropagation()} style={{ maxWidth: '450px' }}>
                        <div style={{ position: 'relative', height: '120px', background: 'linear-gradient(135deg, var(--primary), var(--secondary))', borderTopLeftRadius: '25px', borderTopRightRadius: '25px' }}>
                            <button onClick={closeModal} style={{ position: 'absolute', top: '15px', right: '15px', background: 'rgba(0,0,0,0.2)', border: 'none', color: 'white', borderRadius: '50%', width: '32px', height: '32px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <X size={18} strokeWidth={2} />
                            </button>
                        </div>
                        
                        <div style={{ textAlign: 'center', marginTop: '-60px', padding: '0 2rem 2rem 2rem', position: 'relative', zIndex: 10 }}>
                            <div style={{ 
                                width: '120px', 
                                height: '120px', 
                                borderRadius: '50%', 
                                border: '4px solid #05070a', 
                                overflow: 'hidden', 
                                margin: '0 auto', 
                                boxShadow: '0 10px 25px rgba(0,0,0,0.6)',
                                position: 'relative',
                                background: '#111'
                            }}>
                                <img src={selectedDriver.photo} alt={selectedDriver.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                            </div>
                            
                            <h2 style={{ fontSize: '1.5rem', margin: '1rem 0 0.25rem 0' }}>{selectedDriver.name}</h2>
                             <div style={{ display: 'flex', justifyContent: 'center', gap: '2px', marginBottom: '1.5rem' }}>
                                {Array(5).fill(0).map((_, i) => (
                                    <Star key={i} size={14} fill={i < Math.floor(selectedDriver.rating) ? '#f59e0b' : 'none'} color={i < Math.floor(selectedDriver.rating) ? '#f59e0b' : 'var(--text-muted)'} strokeWidth={2} />
                                ))}
                                <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginLeft: '5px' }}>({selectedDriver.rating})</span>
                            </div>

                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', textAlign: 'left', background: 'rgba(255,255,255,0.03)', padding: '1.5rem', borderRadius: '15px', border: '1px solid var(--border-glass)' }}>
                                <div>
                                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>ID Chofer</div>
                                    <div style={{ fontWeight: 600 }}>#{selectedDriver.id}</div>
                                </div>
                                <div>
                                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Licencia</div>
                                    <div style={{ fontWeight: 600 }}>{selectedDriver.license}</div>
                                </div>
                                <div>
                                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Teléfono</div>
                                    <div style={{ fontWeight: 600 }}>{selectedDriver.phone}</div>
                                </div>
                                <div>
                                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Expira</div>
                                    <div style={{ fontWeight: 600, color: '#f43f5e' }}>{selectedDriver.expiration}</div>
                                </div>
                            </div>
                            
                            <button className="btn-premium" style={{ width: '100%', marginTop: '2rem' }} onClick={closeModal}>Cerrar Ficha</button>
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
                    border-radius: 25px;
                    padding: 0;
                    animation: slideUp 0.4s cubic-bezier(0.4, 0, 0.2, 1);
                    overflow: hidden;
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
