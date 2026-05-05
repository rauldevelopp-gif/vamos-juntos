'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowLeft, Plus, Anchor, Users, X, Star, MapPin, Loader2, Phone } from 'lucide-react';
import { getYachts } from './actions';

interface Crew {
    id: number;
    name: string;
    role: string;
    experience: string;
    photo?: string;
    phone?: string;
}

interface Yacht {
    id: number;
    name: string;
    brand: string;
    model: string;
    year: number;
    length: string;
    capacity: number;
    price_day: number;
    status: string;
    location: string;
    coordinates: string;
    crew: Crew[];
}

export default function YachtsPage() {
    const [yachts, setYachts] = useState<Yacht[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedYacht, setSelectedYacht] = useState<Yacht | null>(null);
    const [mapYacht, setMapYacht] = useState<Yacht | null>(null);

    useEffect(() => {
        const fetchYachts = async () => {
            console.log("YachtsPage: Calling getYachts...");
            const result = await getYachts();
            console.log("YachtsPage: Result received:", result);
            if (result.success && result.data) {
                // @ts-ignore
                setYachts(result.data);
            } else if (!result.success) {
                console.error("YachtsPage Error:", result.error, result.details);
                alert("Error de base de datos: " + result.error + "\n\nPor favor, asegúrate de haber ejecutado 'npx prisma generate' si cambiaste el esquema.");
            }
            setLoading(false);
        };
        fetchYachts();
    }, []);

    const closeModal = () => setSelectedYacht(null);
    const closeMap = () => setMapYacht(null);

    return (
        <div style={{ padding: '1rem', maxWidth: '1200px', margin: '0 auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2.5rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <Link href="/admin" className="btn-glass-nav" style={{ width: '40px', height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '12px', textDecoration: 'none', padding: 0 }}>
                        <ArrowLeft size={20} strokeWidth={2} />
                    </Link>
                    <div>
                        <h1 style={{ fontSize: '1.8rem', fontWeight: 800, margin: 0 }} className="text-gradient">
                            Flota de Yates (Elite)
                        </h1>
                        <p style={{ color: 'var(--text-muted)', margin: '0.5rem 0 0 0' }}>
                            Gestión de embarcaciones de lujo y tripulaciones.
                        </p>
                    </div>
                </div>
                
                <button className="btn-premium" style={{ padding: '0.8rem 1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <Plus size={18} strokeWidth={2.5} />
                    <span className="btn-text-mobile-hide">Registrar Yate</span>
                </button>
            </div>

            {/* Desktop View */}
            <div className="desktop-only" style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid var(--border-glass)', borderRadius: '24px', overflow: 'hidden', minHeight: '300px' }}>
                {loading ? (
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '6rem', color: 'var(--text-muted)' }}>
                        <Loader2 className="animate-spin" size={32} style={{ marginBottom: '1rem', color: 'var(--primary)' }} />
                        <p>Sincronizando flota elite...</p>
                    </div>
                ) : (
                    <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                        <thead>
                            <tr style={{ background: 'rgba(255,255,255,0.03)', borderBottom: '1px solid var(--border-glass)' }}>
                                <th style={{ padding: '1.2rem', color: 'var(--text-muted)', fontWeight: 600, fontSize: '0.9rem' }}>Embarcación / Eslora</th>
                                <th style={{ padding: '1.2rem', color: 'var(--text-muted)', fontWeight: 600, fontSize: '0.9rem' }}>Ubicación</th>
                                <th style={{ padding: '1.2rem', color: 'var(--text-muted)', fontWeight: 600, fontSize: '0.9rem' }}>Capacidad</th>
                                <th style={{ padding: '1.2rem', color: 'var(--text-muted)', fontWeight: 600, fontSize: '0.9rem' }}>Tarifa Diaria</th>
                                <th style={{ padding: '1.2rem', color: 'var(--text-muted)', fontWeight: 600, fontSize: '0.9rem' }}>Estado</th>
                                <th style={{ padding: '1.2rem', color: 'var(--text-muted)', fontWeight: 600, fontSize: '0.9rem' }}>Tripulación</th>
                            </tr>
                        </thead>
                        <tbody>
                            {yachts.map((yacht) => (
                                <tr key={yacht.id} className="hover-row" style={{ borderBottom: '1px solid var(--border-glass)', transition: 'var(--transition-smooth)' }}>
                                    <td style={{ padding: '1.2rem' }}>
                                        <div style={{ fontWeight: 700, color: 'var(--text-main)', fontSize: '1.05rem' }}>{yacht.name}</div>
                                        <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                                            {yacht.brand} {yacht.model} - <span style={{ color: 'var(--primary)', fontWeight: 600 }}>{yacht.length}</span>
                                        </div>
                                    </td>
                                    <td style={{ padding: '1.2rem' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                                            <div style={{ color: 'var(--text-main)', fontSize: '0.9rem' }}>{yacht.location}</div>
                                            <button onClick={() => setMapYacht(yacht)} className="btn-glass-nav" style={{ padding: '0.3rem', borderRadius: '8px' }}>
                                                <MapPin size={14} color="var(--primary)" />
                                            </button>
                                        </div>
                                    </td>
                                    <td style={{ padding: '1.2rem' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontWeight: 500 }}>
                                            <Users size={16} color="var(--text-muted)" /> {yacht.capacity} pax
                                        </div>
                                    </td>
                                    <td style={{ padding: '1.2rem' }}>
                                        <div style={{ fontWeight: 800, color: '#10b981' }}>${yacht.price_day.toLocaleString()} USD</div>
                                    </td>
                                    <td style={{ padding: '1.2rem' }}>
                                        <span style={{ 
                                            padding: '0.4rem 0.8rem', borderRadius: '10px', fontSize: '0.8rem', fontWeight: 700,
                                            background: yacht.status === 'Disponible' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(59, 130, 246, 0.1)',
                                            color: yacht.status === 'Disponible' ? '#10b981' : '#3b82f6'
                                        }}>
                                            {yacht.status}
                                        </span>
                                    </td>
                                    <td style={{ padding: '1.2rem' }}>
                                        <button onClick={() => setSelectedYacht(yacht)} className="btn-glass-nav" style={{ padding: '0.5rem 1rem', borderRadius: '12px', fontSize: '0.85rem' }}>
                                            Staff ({yacht.crew.length})
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
                        <p style={{ color: 'var(--text-muted)' }}>Zarpando...</p>
                    </div>
                ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem', padding: '0.5rem 0' }}>
                        {yachts.map((yacht) => (
                            <div key={yacht.id} className="yacht-card-mobile">
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.2rem' }}>
                                    <div>
                                        <div style={{ fontWeight: 800, fontSize: '1.3rem', color: 'var(--text-main)', marginBottom: '0.2rem' }}>{yacht.name}</div>
                                        <div style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>{yacht.brand} {yacht.model} ({yacht.length})</div>
                                    </div>
                                    <span style={{ 
                                        padding: '0.4rem 0.8rem', borderRadius: '10px', fontSize: '0.75rem', fontWeight: 700,
                                        background: yacht.status === 'Disponible' ? 'rgba(16, 185, 129, 0.1)' : '#3b82f61a',
                                        color: yacht.status === 'Disponible' ? '#10b981' : '#3b82f6'
                                    }}>
                                        {yacht.status}
                                    </span>
                                </div>

                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                                    <MapPin size={16} color="var(--primary)" />
                                    <span>{yacht.location}</span>
                                    <button onClick={() => setMapYacht(yacht)} style={{ background: 'none', border: 'none', color: 'var(--primary)', fontSize: '0.8rem', fontWeight: 600, marginLeft: 'auto' }}>
                                        Ver Mapa
                                    </button>
                                </div>

                                <div style={{ background: 'rgba(255,255,255,0.03)', borderRadius: '20px', padding: '1.2rem', marginBottom: '1.2rem', border: '1px solid var(--border-glass)', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                                    <div>
                                        <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Capacidad</div>
                                        <div style={{ fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                                            <Users size={14} /> {yacht.capacity} PAX
                                        </div>
                                    </div>
                                    <div>
                                        <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Tarifa Día</div>
                                        <div style={{ fontWeight: 800, color: '#10b981' }}>${yacht.price_day.toLocaleString()}</div>
                                    </div>
                                </div>

                                <button onClick={() => setSelectedYacht(yacht)} className="btn-premium" style={{ width: '100%', padding: '0.9rem', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.6rem' }}>
                                    <Anchor size={18} /> Gestionar Tripulación ({yacht.crew.length})
                                </button>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Crew Modal */}
            {selectedYacht && (
                <div className="modal-overlay" onClick={closeModal}>
                    <div className="modal-content glass-panel" onClick={e => e.stopPropagation()} style={{ maxWidth: '550px' }}>
                        <div style={{ padding: '1.5rem', borderBottom: '1px solid var(--border-glass)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <div>
                                <h2 style={{ fontSize: '1.25rem', margin: 0 }}>🚢 Tripulación: {selectedYacht.name}</h2>
                                <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', margin: '0.2rem 0 0 0' }}>Personal a bordo calificado</p>
                            </div>
                            <button onClick={closeModal} style={{ background: 'none', border: 'none', color: 'white', cursor: 'pointer' }}>
                                <X size={24} />
                            </button>
                        </div>
                        
                        <div style={{ padding: '1.5rem' }}>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                {selectedYacht.crew.map((member) => (
                                    <div key={member.id} style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '1rem', background: 'rgba(255,255,255,0.03)', borderRadius: '15px', border: '1px solid var(--border-glass)' }}>
                                        <div style={{ width: '60px', height: '60px', borderRadius: '14px', overflow: 'hidden', border: '2px solid var(--border-glass)', flexShrink: 0 }}>
                                            {member.photo ? (
                                                <img src={member.photo} alt={member.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                            ) : (
                                                <div style={{ width: '100%', height: '100%', background: 'var(--bg-card)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                                    <Users size={24} color="var(--text-muted)" />
                                                </div>
                                            )}
                                        </div>
                                        <div style={{ flex: 1 }}>
                                            <div style={{ fontWeight: 700, fontSize: '1.1rem' }}>{member.name}</div>
                                            <div style={{ fontSize: '0.85rem', color: 'var(--primary)', fontWeight: 600, marginBottom: '0.3rem' }}>{member.role}</div>
                                            {member.phone && (
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                                                    <Phone size={14} /> {member.phone}
                                                </div>
                                            )}
                                        </div>
                                        <div style={{ textAlign: 'right', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Exp: <span style={{ color: 'white', fontWeight: 600 }}>{member.experience}</span></div>
                                            {member.phone && (
                                                <a href={`tel:${member.phone}`} style={{ 
                                                    padding: '0.4rem', borderRadius: '10px', background: 'rgba(16, 185, 129, 0.1)', color: '#10b981',
                                                    display: 'flex', alignItems: 'center', justifyContent: 'center', textDecoration: 'none'
                                                }}>
                                                    <Phone size={16} />
                                                </a>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                            
                            <button className="btn-premium" style={{ width: '100%', marginTop: '2rem' }} onClick={closeModal}>Cerrar Lista</button>
                        </div>
                    </div>
                </div>
            )}

            {/* Map Modal */}
            {mapYacht && (
                <div className="modal-overlay" onClick={closeMap}>
                    <div className="modal-content glass-panel" onClick={e => e.stopPropagation()} style={{ maxWidth: '600px' }}>
                        <div style={{ padding: '1.5rem', borderBottom: '1px solid var(--border-glass)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <div>
                                <h2 style={{ fontSize: '1.25rem', margin: 0 }}>📍 Ubicación: {mapYacht.name}</h2>
                                <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', margin: '0.2rem 0 0 0' }}>{mapYacht.location}</p>
                            </div>
                            <button onClick={closeMap} style={{ background: 'none', border: 'none', color: 'white', cursor: 'pointer' }}>
                                <X size={24} />
                            </button>
                        </div>
                        <div style={{ padding: '1rem' }}>
                            <div style={{ width: '100%', height: '400px', borderRadius: '15px', overflow: 'hidden', background: '#05070a' }}>
                                <iframe
                                    width="100%"
                                    height="100%"
                                    style={{ border: 0 }}
                                    loading="lazy"
                                    allowFullScreen
                                    src={`https://maps.google.com/maps?q=${mapYacht.coordinates}&t=k&z=16&ie=UTF8&iwloc=&output=embed`}
                                ></iframe>
                                <div style={{ position: 'absolute', bottom: '2rem', left: '2rem', right: '2rem', background: 'rgba(0,0,0,0.8)', padding: '1rem', borderRadius: '10px', border: '1px solid var(--border-glass)', fontSize: '0.85rem', color: 'white', textAlign: 'center' }}>
                                    Visualización satelital de la Marina en {mapYacht.location}
                                </div>
                            </div>
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
                .yacht-card-mobile {
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
