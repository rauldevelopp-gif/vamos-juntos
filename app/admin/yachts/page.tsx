'use client';

import { useState } from 'react';
import Link from 'next/link';

interface CrewMember {
    name: string;
    role: string;
    phone: string;
    rating: number;
    photo: string;
}

interface Yacht {
    id: number;
    name: string;
    brand: string;
    model: string;
    year: number;
    length: string; // Eslora
    type: 'Motor' | 'Catamarán' | 'Vela' | 'Mega Yate';
    passengers: number;
    cabins: number;
    amenities: string[];
    status: 'Disponible' | 'En Altamar' | 'Reservado' | 'Mantenimiento';
    coordinates: string;
    crew: CrewMember[];
}

const YACHT_DATA: Yacht[] = [
    { 
        id: 1, name: 'Obsidian Wings', brand: 'Sunseeker', model: 'Predator 74', year: 2023, length: '74ft', type: 'Motor', passengers: 12, cabins: 4, 
        amenities: ['Chef', 'Bar', 'Jet Ski', 'WiFi', 'Snorkel'], status: 'Disponible', coordinates: '21.1441,-86.7841',
        crew: [
            { name: 'Capt. Carlos Mendoza', role: 'Capitán', phone: '+52 998-111-2222', rating: 5.0, photo: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=200&auto=format&fit=crop' },
            { name: 'Elena Solis', role: 'Chef Ejecutivo', phone: '+52 998-333-4444', rating: 4.9, photo: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=200&auto=format&fit=crop' }
        ]
    },
    { 
        id: 2, name: 'Azure Dream', brand: 'Lagoon', model: '50', year: 2022, length: '50ft', type: 'Catamarán', passengers: 16, cabins: 6, 
        amenities: ['Bar', 'Snorkel', 'Música', 'WiFi'], status: 'En Altamar', coordinates: '20.2141,-87.4291',
        crew: [
            { name: 'Capt. Ricardo Luna', role: 'Capitán', phone: '+52 984-555-6666', rating: 4.8, photo: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=200&auto=format&fit=crop' },
            { name: 'Sofía Marín', role: 'Hostess', phone: '+52 984-777-8888', rating: 4.9, photo: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=200&auto=format&fit=crop' }
        ]
    },
    { 
        id: 3, name: 'Titan Majesty', brand: 'Azimut', model: 'Grande 35M', year: 2024, length: '115ft', type: 'Mega Yate', passengers: 20, cabins: 8, 
        amenities: ['Jacuzzi', 'Chef', 'Bar', 'Cine', 'WiFi', 'Jet Ski'], status: 'Disponible', coordinates: '21.0367,-86.8771',
        crew: [
            { name: 'Capt. James Morgan', role: 'Capitán', phone: '+52 998-000-1111', rating: 5.0, photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200&auto=format&fit=crop' },
            { name: 'Marco Polo', role: 'Chef / Mixólogo', phone: '+52 998-222-3333', rating: 5.0, photo: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=200&auto=format&fit=crop' },
            { name: 'Isabella V.', role: 'Jefa de Cabina', phone: '+52 998-444-5555', rating: 4.9, photo: 'https://images.unsplash.com/photo-1554151228-14d9def656e4?q=80&w=200&auto=format&fit=crop' }
        ]
    }
];

export default function YachtsPage() {
    const [selectedCrew, setSelectedCrew] = useState<CrewMember[] | null>(null);
    const [selectedLoc, setSelectedLoc] = useState<string | null>(null);

    const closeModals = () => {
        setSelectedCrew(null);
        setSelectedLoc(null);
    };

    return (
        <div style={{ padding: '1rem', maxWidth: '1200px', margin: '0 auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2.5rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <Link href="/admin" className="btn-glass-nav" style={{ width: '40px', height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '12px', fontSize: '1.2rem', textDecoration: 'none' }}>
                        ←
                    </Link>
                    <div>
                        <h1 style={{ fontSize: '1.8rem', fontWeight: 800, margin: 0 }} className="text-gradient">
                            Gestión de Yates
                        </h1>
                        <p style={{ color: 'var(--text-muted)', margin: '0.5rem 0 0 0' }}>
                            Catálogo de embarcaciones de lujo y gestión de tripulación.
                        </p>
                    </div>
                </div>
                
                <button className="btn-premium" style={{ padding: '0.8rem 1.8rem' }}>
                    <span className="btn-text-mobile-hide">Registrar Yate</span>
                    <span style={{ fontSize: '1.2rem' }}>🚤</span>
                </button>
            </div>

            <div className="glass-panel" style={{ overflow: 'hidden', borderRadius: '20px' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                    <thead>
                        <tr style={{ background: 'rgba(255,255,255,0.03)', borderBottom: '1px solid var(--border-glass)' }}>
                            <th style={{ padding: '1.2rem', color: 'var(--text-muted)', fontWeight: 600, fontSize: '0.9rem' }}>Yate / Eslora</th>
                            <th style={{ padding: '1.2rem', color: 'var(--text-muted)', fontWeight: 600, fontSize: '0.9rem' }}>Tipo / Capacidad</th>
                            <th style={{ padding: '1.2rem', color: 'var(--text-muted)', fontWeight: 600, fontSize: '0.9rem' }}>Amenidades</th>
                            <th style={{ padding: '1.2rem', color: 'var(--text-muted)', fontWeight: 600, fontSize: '0.9rem' }}>Estado</th>
                            <th style={{ padding: '1.2rem', color: 'var(--text-muted)', fontWeight: 600, fontSize: '0.9rem', textAlign: 'center' }}>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {YACHT_DATA.map((yacht) => (
                            <tr key={yacht.id} style={{ borderBottom: '1px solid var(--border-glass)', transition: 'var(--transition-smooth)' }} className="hover-row">
                                <td style={{ padding: '1.2rem' }}>
                                    <div style={{ fontWeight: 700, color: 'var(--text-main)', fontSize: '1.05rem' }}>{yacht.name}</div>
                                    <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>{yacht.brand} {yacht.model} ({yacht.year}) - <span style={{ color: 'var(--primary)', fontWeight: 600 }}>{yacht.length}</span></div>
                                </td>
                                <td style={{ padding: '1.2rem' }}>
                                    <div style={{ marginBottom: '0.4rem' }}>
                                        <span style={{ 
                                            padding: '0.2rem 0.6rem', borderRadius: '8px', fontSize: '0.75rem', fontWeight: 600,
                                            background: yacht.type === 'Mega Yate' ? 'rgba(139, 92, 246, 0.1)' : 'rgba(255,255,255,0.05)',
                                            color: yacht.type === 'Mega Yate' ? 'var(--primary)' : 'var(--text-main)',
                                            border: `1px solid ${yacht.type === 'Mega Yate' ? 'rgba(139, 92, 246, 0.2)' : 'rgba(255,255,255,0.1)'}`
                                        }}>
                                            {yacht.type}
                                        </span>
                                    </div>
                                    <div style={{ display: 'flex', gap: '0.75rem', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                                        <span title="Pasajeros">👥 {yacht.passengers}</span>
                                        <span title="Camarotes">🛏️ {yacht.cabins}</span>
                                    </div>
                                </td>
                                <td style={{ padding: '1.2rem' }}>
                                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.6rem' }}>
                                        {yacht.amenities.map((amenity, idx) => {
                                            const icons: { [key: string]: string } = {
                                                'Chef': '👨‍🍳', 'Bar': '🥂', 'Jet Ski': '🌊', 'WiFi': '📶', 'Snorkel': '🤿', 'Música': '🎵', 'Jacuzzi': '🛁', 'Cine': '🎬'
                                            };
                                            return (
                                                <span key={idx} style={{ fontSize: '1.1rem', cursor: 'help' }} title={amenity}>
                                                    {icons[amenity] || '✨'}
                                                </span>
                                            );
                                        })}
                                    </div>
                                </td>
                                <td style={{ padding: '1.2rem' }}>
                                    <span style={{ 
                                        padding: '0.3rem 0.8rem', borderRadius: 'var(--radius-full)', fontSize: '0.8rem', 
                                        background: yacht.status === 'Disponible' ? 'rgba(16, 185, 129, 0.1)' : 
                                                    yacht.status === 'En Altamar' ? 'rgba(59, 130, 246, 0.1)' : 'rgba(244, 63, 94, 0.1)',
                                        color: yacht.status === 'Disponible' ? '#10b981' : 
                                               yacht.status === 'En Altamar' ? '#3b82f6' : '#f43f5e',
                                        border: `1px solid ${yacht.status === 'Disponible' ? 'rgba(16, 185, 129, 0.2)' : 
                                                           yacht.status === 'En Altamar' ? 'rgba(59, 130, 246, 0.2)' : 'rgba(244, 63, 94, 0.2)'}`
                                    }}>
                                        {yacht.status}
                                    </span>
                                </td>
                                <td style={{ padding: '1.2rem', textAlign: 'center' }}>
                                    <div style={{ display: 'flex', justifyContent: 'center', gap: '0.5rem' }}>
                                        <button 
                                            onClick={() => setSelectedCrew(yacht.crew)}
                                            className="btn-glass-nav" 
                                            style={{ padding: '0.5rem', borderRadius: '50%', width: '40px', height: '40px', fontSize: '1.2rem' }}
                                            title="Ver Tripulación"
                                        >
                                            ⚓
                                        </button>
                                        <button 
                                            onClick={() => setSelectedLoc(yacht.coordinates)}
                                            className="btn-glass-nav" 
                                            style={{ padding: '0.5rem', borderRadius: '50%', width: '40px', height: '40px', fontSize: '1.1rem' }}
                                            title="Ver Marina / Puerto"
                                        >
                                            📍
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Crew Modal */}
            {selectedCrew && (
                <div className="modal-overlay" onClick={closeModals}>
                    <div className="modal-content glass-panel" onClick={e => e.stopPropagation()} style={{ maxWidth: '600px', padding: '2rem' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                            <h2 style={{ fontSize: '1.5rem', margin: 0 }}>🚢 Tripulación a Bordo</h2>
                            <button onClick={closeModals} style={{ background: 'none', border: 'none', color: 'white', fontSize: '1.5rem', cursor: 'pointer' }}>×</button>
                        </div>
                        
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                            {selectedCrew.map((member, i) => (
                                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', background: 'rgba(255,255,255,0.03)', padding: '1rem', borderRadius: '15px', border: '1px solid var(--border-glass)' }}>
                                    <img src={member.photo} alt={member.name} style={{ width: '64px', height: '64px', borderRadius: '50%', objectFit: 'cover', border: '2px solid var(--primary)' }} />
                                    <div style={{ flex: 1 }}>
                                        <div style={{ fontWeight: 700, fontSize: '1.1rem' }}>{member.name}</div>
                                        <div style={{ color: 'var(--primary)', fontSize: '0.85rem', fontWeight: 600 }}>{member.role}</div>
                                        <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>📞 {member.phone}</div>
                                    </div>
                                    <div style={{ textAlign: 'right' }}>
                                        <div style={{ color: '#f59e0b' }}>{'★'.repeat(Math.floor(member.rating))}</div>
                                        <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{member.rating} Rating</div>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <button className="btn-premium" style={{ width: '100%', marginTop: '2rem' }} onClick={closeModals}>Cerrar Tripulación</button>
                    </div>
                </div>
            )}

            {/* Location Modal */}
            {selectedLoc && (
                <div className="modal-overlay" onClick={closeModals}>
                    <div className="modal-content glass-panel" onClick={e => e.stopPropagation()} style={{ maxWidth: '850px' }}>
                        <div style={{ padding: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <h2 style={{ fontSize: '1.2rem', margin: 0 }}>📍 Punto de Atraque / Marina</h2>
                            <button onClick={closeModals} style={{ background: 'none', border: 'none', color: 'white', fontSize: '1.5rem', cursor: 'pointer' }}>×</button>
                        </div>
                        <div style={{ width: '100%', height: '450px', background: '#05070a' }}>
                            <iframe
                                width="100%"
                                height="100%"
                                frameBorder="0"
                                style={{ border: 0 }}
                                src={`https://maps.google.com/maps?q=${selectedLoc}&t=k&z=17&ie=UTF8&iwloc=&output=embed`}
                                allowFullScreen
                            ></iframe>
                        </div>
                        <div style={{ padding: '1.5rem', textAlign: 'right' }}>
                            <button className="btn-premium" onClick={closeModals}>Cerrar Mapa</button>
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
