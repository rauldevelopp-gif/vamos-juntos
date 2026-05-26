'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowLeft, MapPin, Star, CheckCircle2, Clock, Phone, Mail, Loader2, BedDouble, User } from 'lucide-react';
import { getHotelById } from '../actions';
import { HotelBookingWizard } from '../components/HotelBookingWizard';

export default function HotelDetailPage({ params }: { params: { id: string } }) {
    const [hotel, setHotel] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [selectedRoom, setSelectedRoom] = useState<any>(null);

    useEffect(() => {
        const fetchHotel = async () => {
            const res = await getHotelById(parseInt(params.id));
            if (res.success) setHotel(res.data);
            setLoading(false);
        };
        fetchHotel();
    }, [params.id]);

    if (loading) {
        return <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#050505' }}>
            <Loader2 className="animate-spin" size={40} color="#8b5cf6" />
        </div>;
    }

    if (!hotel) {
        return <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#050505', color: 'white', flexDirection: 'column', gap: '1rem' }}>
            <h2>Hotel no encontrado</h2>
            <Link href="/hotels" className="btn-premium">Volver al catálogo</Link>
        </div>;
    }

    const mainImage = hotel.gallery?.length > 0 ? hotel.gallery[0] : 'https://images.unsplash.com/photo-1542314831-c6a4d1409e1c?q=80&w=2070&auto=format&fit=crop';

    return (
        <div style={{ background: '#050505', minHeight: '100vh', color: 'white', paddingBottom: '5rem' }}>
            {/* HERO */}
            <div style={{ position: 'relative', height: '60vh', width: '100%' }}>
                <Image src={mainImage} alt={hotel.name} fill style={{ objectFit: 'cover' }} unoptimized />
                <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, #050505 0%, rgba(5,5,5,0.4) 50%, rgba(0,0,0,0.6) 100%)' }} />
                
                <div style={{ position: 'absolute', top: '2rem', left: '2rem', zIndex: 10 }}>
                    <Link href="/hotels" className="btn-glass-nav" style={{ width: '40px', height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '50%', background: 'rgba(0,0,0,0.5)', color: 'white', textDecoration: 'none' }}>
                        <ArrowLeft size={20} />
                    </Link>
                </div>

                <div style={{ position: 'absolute', bottom: '0', left: '0', width: '100%', padding: '3rem 2rem' }}>
                    <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
                        <div style={{ display: 'flex', gap: '2px', marginBottom: '0.5rem' }}>
                            {Array(hotel.stars).fill(0).map((_, i) => <Star key={i} size={16} fill="#f59e0b" color="#f59e0b" />)}
                        </div>
                        <h1 style={{ fontSize: '3.5rem', fontWeight: 900, margin: '0 0 0.5rem 0', textShadow: '0 4px 20px rgba(0,0,0,0.8)' }}>{hotel.name}</h1>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '1.1rem', color: 'rgba(255,255,255,0.8)', textShadow: '0 2px 10px rgba(0,0,0,0.8)' }}>
                            <MapPin size={18} /> {hotel.address || hotel.location}, {hotel.city}, {hotel.state}
                        </div>
                    </div>
                </div>
            </div>

            <div style={{ maxWidth: '1200px', margin: '3rem auto 0', padding: '0 2rem', display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '3rem' }}>
                {/* LEFT COL: Info */}
                <div>
                    <section style={{ marginBottom: '3rem' }}>
                        <h2 style={{ fontSize: '1.8rem', fontWeight: 800, marginBottom: '1.5rem' }}>Sobre el Hotel</h2>
                        <p style={{ fontSize: '1.1rem', lineHeight: '1.8', color: 'rgba(255,255,255,0.7)' }}>
                            {hotel.description || 'Disfruta de una estancia de lujo con todas las comodidades que mereces.'}
                        </p>
                    </section>

                    <section style={{ marginBottom: '3rem', background: 'rgba(255,255,255,0.02)', padding: '2rem', borderRadius: '24px', border: '1px solid rgba(255,255,255,0.05)' }}>
                        <h3 style={{ fontSize: '1.4rem', fontWeight: 800, marginBottom: '1.5rem' }}>Información Útil</h3>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem' }}>
                            <div style={{ display: 'flex', gap: '1rem' }}>
                                <Clock color="#8b5cf6" />
                                <div>
                                    <div style={{ fontWeight: 700 }}>Horarios</div>
                                    <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.9rem', marginTop: '0.2rem' }}>
                                        Check-in: {hotel.checkInTime}<br/>
                                        Check-out: {hotel.checkOutTime}
                                    </div>
                                </div>
                            </div>
                            <div style={{ display: 'flex', gap: '1rem' }}>
                                <Phone color="#8b5cf6" />
                                <div>
                                    <div style={{ fontWeight: 700 }}>Contacto</div>
                                    <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.9rem', marginTop: '0.2rem' }}>
                                        {hotel.phone || 'No disponible'}<br/>
                                        {hotel.email || 'No disponible'}
                                    </div>
                                </div>
                            </div>
                            {hotel.user && (
                                <div style={{ display: 'flex', gap: '1rem' }}>
                                    <User color="#8b5cf6" />
                                    <div>
                                        <div style={{ fontWeight: 700 }}>Operador</div>
                                        <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.9rem', marginTop: '0.2rem' }}>
                                            {hotel.user.name}<br/>
                                            {hotel.user.email}
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                        {hotel.policies && (
                            <div style={{ marginTop: '1.5rem', paddingTop: '1.5rem', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
                                <div style={{ fontWeight: 700, marginBottom: '0.5rem' }}>Políticas</div>
                                <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.9rem', whiteSpace: 'pre-line' }}>{hotel.policies}</div>
                            </div>
                        )}
                    </section>

                    <section>
                        <h2 style={{ fontSize: '1.8rem', fontWeight: 800, marginBottom: '1.5rem' }}>Habitaciones Disponibles</h2>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            {hotel.rooms?.length > 0 ? hotel.rooms.map((room: any) => (
                                <div key={room.id} style={{ display: 'flex', background: 'rgba(255,255,255,0.03)', borderRadius: '20px', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.05)', transition: 'all 0.3s' }}>
                                    <div style={{ width: '200px', background: 'rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
                                        {room.gallery && room.gallery.length > 0 ? (
                                            <Image src={room.gallery[0]} alt={room.type} fill style={{ objectFit: 'cover' }} unoptimized />
                                        ) : (
                                            <BedDouble size={40} opacity={0.3} />
                                        )}
                                    </div>
                                    <div style={{ padding: '1.5rem', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                                        <h3 style={{ fontSize: '1.3rem', fontWeight: 800, margin: '0 0 0.5rem 0' }}>{room.type}</h3>
                                        <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.9rem', marginBottom: '1rem' }}>
                                            Capacidad máxima: {room.maxCapacity} huéspedes
                                        </div>
                                        <div style={{ color: '#10b981', fontSize: '0.85rem', display: 'flex', gap: '0.3rem', alignItems: 'center' }}>
                                            <CheckCircle2 size={14} /> Cancelación Gratuita
                                        </div>
                                    </div>
                                    <div style={{ padding: '1.5rem', background: 'rgba(0,0,0,0.2)', display: 'flex', flexDirection: 'column', alignItems: 'flex-end', justifyContent: 'center', minWidth: '200px', borderLeft: '1px solid rgba(255,255,255,0.05)' }}>
                                        <div style={{ fontSize: '1.8rem', fontWeight: 900, color: 'white' }}>${room.basePrice.toLocaleString()}</div>
                                        <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.8rem', marginBottom: '1rem' }}>por noche</div>
                                        <button onClick={() => setSelectedRoom(room)} className="btn-premium" style={{ padding: '0.8rem 1.5rem', width: '100%', borderRadius: '12px' }}>
                                            Seleccionar
                                        </button>
                                    </div>
                                </div>
                            )) : (
                                <div style={{ padding: '3rem', textAlign: 'center', background: 'rgba(255,255,255,0.02)', borderRadius: '20px', color: 'rgba(255,255,255,0.5)' }}>
                                    No hay habitaciones disponibles por el momento.
                                </div>
                            )}
                        </div>
                    </section>
                </div>

                {/* RIGHT COL: Sticky Booking Component */}
                <div style={{ position: 'relative' }}>
                    <div style={{ position: 'sticky', top: '2rem' }}>
                        {selectedRoom ? (
                            <HotelBookingWizard hotel={hotel} room={selectedRoom} onCancel={() => setSelectedRoom(null)} />
                        ) : (
                            <div className="glass-panel" style={{ padding: '2rem', borderRadius: '24px', textAlign: 'center', border: '1px solid rgba(255,255,255,0.05)' }}>
                                <BedDouble size={48} opacity={0.2} style={{ margin: '0 auto 1rem' }} />
                                <h3 style={{ fontSize: '1.2rem', marginBottom: '0.5rem' }}>Tu Estancia</h3>
                                <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.9rem' }}>Selecciona una habitación de la lista para verificar fechas y disponibilidad.</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
            
            <style jsx>{`
                @media (max-width: 900px) {
                    .container { grid-template-columns: 1fr !important; }
                }
            `}</style>
        </div>
    );
}
