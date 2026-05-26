'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Info, Star, ChevronLeft, ChevronRight, X, MapPin, Clock, Phone, Mail, BedDouble, Users, CheckCircle2, Wifi, Waves, Dumbbell, UtensilsCrossed } from 'lucide-react';

export const WhatsAppIcon = ({ size = 20 }: { size?: number }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
    </svg>
);

// Amenity icon map
const amenityIcons: Record<string, any> = {
    'WiFi': Wifi,
    'Alberca': Waves,
    'Gimnasio': Dumbbell,
    'Restaurante': UtensilsCrossed,
};

function HotelDetailModal({ hotel, onClose }: { hotel: any; onClose: () => void }) {
    const [roomImageIndexes, setRoomImageIndexes] = useState<Record<number, number>>({});

    const getRoomImageIndex = (roomId: number) => roomImageIndexes[roomId] || 0;
    const setRoomImageIndex = (roomId: number, idx: number) => {
        setRoomImageIndexes(prev => ({ ...prev, [roomId]: idx }));
    };

    const mainImage = hotel.gallery?.length > 0
        ? hotel.gallery[0]
        : 'https://images.unsplash.com/photo-1542314831-c6a4d1409e1c?q=80&w=2070&auto=format&fit=crop';

    return (
        <div
            onClick={onClose}
            style={{
                position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(8px)',
                zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem'
            }}
        >
            <div
                onClick={e => e.stopPropagation()}
                style={{
                    background: '#0f0f0f', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '28px',
                    width: '100%', maxWidth: '820px', maxHeight: '90vh', overflowY: 'auto',
                    display: 'flex', flexDirection: 'column', position: 'relative'
                }}
            >
                {/* Hero image */}
                <div style={{ position: 'relative', height: '260px', flexShrink: 0, borderRadius: '28px 28px 0 0', overflow: 'hidden' }}>
                    <Image src={mainImage} alt={hotel.name} fill style={{ objectFit: 'cover' }} unoptimized />
                    <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, #0f0f0f 0%, transparent 50%)' }} />

                    {/* Close button */}
                    <button
                        onClick={onClose}
                        style={{
                            position: 'absolute', top: '1rem', right: '1rem',
                            background: 'rgba(0,0,0,0.6)', border: '1px solid rgba(255,255,255,0.2)',
                            borderRadius: '50%', width: '36px', height: '36px',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            color: 'white', cursor: 'pointer', zIndex: 10
                        }}
                    >
                        <X size={18} />
                    </button>

                    {/* Stars & category badge */}
                    <div style={{ position: 'absolute', top: '1rem', left: '1rem', display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                        <span style={{ background: '#8b5cf6', padding: '0.25rem 0.75rem', borderRadius: '20px', fontSize: '0.75rem', fontWeight: 700, color: 'white' }}>
                            {hotel.category}
                        </span>
                    </div>

                    {/* Name overlay */}
                    <div style={{ position: 'absolute', bottom: '1.5rem', left: '1.5rem', right: '4rem' }}>
                        <div style={{ display: 'flex', gap: '2px', marginBottom: '0.4rem' }}>
                            {Array(hotel.stars || 5).fill(0).map((_: any, i: number) => (
                                <Star key={i} size={14} fill="#f59e0b" color="#f59e0b" strokeWidth={0} />
                            ))}
                        </div>
                        <h2 style={{ fontSize: '1.8rem', fontWeight: 900, margin: 0, textShadow: '0 2px 10px rgba(0,0,0,0.8)' }}>
                            {hotel.name}
                        </h2>
                    </div>
                </div>

                {/* Body */}
                <div style={{ padding: '1.5rem' }}>
                    {/* Info row */}
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1.2rem', marginBottom: '1.5rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'rgba(255,255,255,0.6)', fontSize: '0.9rem' }}>
                            <MapPin size={15} color="#8b5cf6" /> {hotel.address || hotel.location}, {hotel.city}
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'rgba(255,255,255,0.6)', fontSize: '0.9rem' }}>
                            <Clock size={15} color="#8b5cf6" /> Check-in {hotel.checkInTime} · Check-out {hotel.checkOutTime}
                        </div>
                        {hotel.phone && (
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'rgba(255,255,255,0.6)', fontSize: '0.9rem' }}>
                                <Phone size={15} color="#8b5cf6" /> {hotel.phone}
                            </div>
                        )}
                        {hotel.email && (
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'rgba(255,255,255,0.6)', fontSize: '0.9rem' }}>
                                <Mail size={15} color="#8b5cf6" /> {hotel.email}
                            </div>
                        )}
                    </div>

                    {/* Description */}
                    {hotel.description && (
                        <p style={{ color: 'rgba(255,255,255,0.7)', lineHeight: '1.7', fontSize: '0.95rem', marginBottom: '1.5rem' }}>
                            {hotel.description}
                        </p>
                    )}

                    {/* Amenities */}
                    {hotel.amenities?.length > 0 && (
                        <div style={{ marginBottom: '1.5rem' }}>
                            <h3 style={{ fontSize: '0.75rem', fontWeight: 800, color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '0.8rem' }}>
                                Amenidades
                            </h3>
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                                {hotel.amenities.map((a: string, i: number) => {
                                    const Icon = amenityIcons[a] || CheckCircle2;
                                    return (
                                        <span key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', background: 'rgba(139,92,246,0.1)', border: '1px solid rgba(139,92,246,0.25)', padding: '0.3rem 0.8rem', borderRadius: '20px', fontSize: '0.82rem', color: '#c4b5fd' }}>
                                            <Icon size={13} /> {a}
                                        </span>
                                    );
                                })}
                            </div>
                        </div>
                    )}

                    {/* Rooms */}
                    {hotel.rooms?.length > 0 && (
                        <div style={{ marginBottom: '1.5rem' }}>
                            <h3 style={{ fontSize: '0.75rem', fontWeight: 800, color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '1rem' }}>
                                Tipos de Habitación
                            </h3>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
                                {hotel.rooms.map((room: any) => {
                                    const roomImages = room.gallery?.length > 0 ? room.gallery : null;
                                    const imgIdx = getRoomImageIndex(room.id);
                                    return (
                                        <div key={room.id} style={{ display: 'flex', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '16px', overflow: 'hidden' }}>
                                            {/* Room image */}
                                            <div style={{ width: '140px', flexShrink: 0, position: 'relative', background: 'rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                                {roomImages ? (
                                                    <>
                                                        <Image src={roomImages[imgIdx]} alt={room.type} fill style={{ objectFit: 'cover' }} unoptimized />
                                                        {roomImages.length > 1 && (
                                                            <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 4px', zIndex: 2 }}>
                                                                <button onClick={() => setRoomImageIndex(room.id, (imgIdx - 1 + roomImages.length) % roomImages.length)}
                                                                    style={{ background: 'rgba(0,0,0,0.5)', border: 'none', borderRadius: '50%', width: '24px', height: '24px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', cursor: 'pointer' }}>
                                                                    <ChevronLeft size={14} />
                                                                </button>
                                                                <button onClick={() => setRoomImageIndex(room.id, (imgIdx + 1) % roomImages.length)}
                                                                    style={{ background: 'rgba(0,0,0,0.5)', border: 'none', borderRadius: '50%', width: '24px', height: '24px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', cursor: 'pointer' }}>
                                                                    <ChevronRight size={14} />
                                                                </button>
                                                            </div>
                                                        )}
                                                    </>
                                                ) : (
                                                    <BedDouble size={32} opacity={0.2} />
                                                )}
                                            </div>

                                            {/* Room info */}
                                            <div style={{ padding: '1rem', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: '0.4rem' }}>
                                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                                    <h4 style={{ margin: 0, fontSize: '1rem', fontWeight: 800 }}>{room.type}</h4>
                                                    <div style={{ textAlign: 'right' }}>
                                                        <div style={{ fontSize: '1.2rem', fontWeight: 900, color: 'white' }}>${room.basePrice.toLocaleString()}</div>
                                                        <div style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.4)' }}>por noche</div>
                                                    </div>
                                                </div>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'rgba(255,255,255,0.5)', fontSize: '0.82rem' }}>
                                                    <Users size={13} /> Hasta {room.maxCapacity} huéspedes
                                                </div>
                                                {room.amenities?.length > 0 && (
                                                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.3rem', marginTop: '0.2rem' }}>
                                                        {room.amenities.slice(0, 4).map((a: string, i: number) => (
                                                            <span key={i} style={{ fontSize: '0.72rem', color: 'rgba(255,255,255,0.5)', background: 'rgba(255,255,255,0.05)', padding: '0.15rem 0.5rem', borderRadius: '10px' }}>
                                                                {a}
                                                            </span>
                                                        ))}
                                                    </div>
                                                )}
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', color: '#10b981', fontSize: '0.78rem', marginTop: '0.2rem' }}>
                                                    <CheckCircle2 size={12} /> Cancelación Gratuita
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    )}

                    {/* CTA */}
                    <Link
                        href={`/hotels/${hotel.id}`}
                        style={{
                            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.6rem',
                            padding: '1rem', background: 'linear-gradient(135deg, #8b5cf6, #7c3aed)',
                            color: 'white', borderRadius: '14px', fontWeight: 800, fontSize: '1rem',
                            textDecoration: 'none', boxShadow: '0 8px 20px rgba(139,92,246,0.35)'
                        }}
                    >
                        <BedDouble size={18} /> Ver Habitaciones y Reservar
                    </Link>
                </div>
            </div>
        </div>
    );
}

export default function HotelCard({ hotel }: { hotel: any }) {
    const startingPrice = hotel.rooms?.length > 0
        ? Math.min(...hotel.rooms.map((r: any) => r.basePrice))
        : null;
    const images = hotel.gallery && hotel.gallery.length > 0 ? hotel.gallery : ['https://images.unsplash.com/photo-1582719508461-905c673771fd?q=80&w=2070&auto=format&fit=crop'];
    const [currentIndex, setCurrentIndex] = useState(0);
    const [showModal, setShowModal] = useState(false);

    const nextImage = (e: React.MouseEvent) => {
        e.preventDefault(); e.stopPropagation();
        setCurrentIndex((prev) => (prev + 1) % images.length);
    };

    const prevImage = (e: React.MouseEvent) => {
        e.preventDefault(); e.stopPropagation();
        setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
    };

    return (
        <>
            {showModal && <HotelDetailModal hotel={hotel} onClose={() => setShowModal(false)} />}

            <div className="glass-card hotel-card-hover" style={{ overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
                <div style={{ height: '220px', background: 'rgba(255,255,255,0.05)', position: 'relative' }}>
                    <Image src={images[currentIndex]} alt={hotel.name} fill style={{ objectFit: 'cover' }} unoptimized />
                    <div style={{ position: 'absolute', top: '1rem', right: '1rem', background: '#8b5cf6', padding: '0.25rem 0.75rem', borderRadius: 'var(--radius-full)', fontSize: '0.8rem', fontWeight: 700, color: 'white', zIndex: 10 }}>
                        {hotel.category}
                    </div>

                    {images.length > 1 && (
                        <>
                            <button onClick={prevImage} className="gallery-arrow left"><ChevronLeft size={20} /></button>
                            <button onClick={nextImage} className="gallery-arrow right"><ChevronRight size={20} /></button>
                        </>
                    )}

                    <div style={{ position: 'absolute', bottom: '10px', left: 0, right: 0, display: 'flex', justifyContent: 'center', gap: '6px', zIndex: 10 }}>
                        {images.length > 1 && images.map((_: any, idx: number) => (
                            <div key={idx} style={{ width: '6px', height: '6px', borderRadius: '50%', background: idx === currentIndex ? 'white' : 'rgba(255,255,255,0.4)', transition: 'background 0.3s' }} />
                        ))}
                    </div>
                </div>

                <div style={{ padding: '1.5rem', flex: 1, display: 'flex', flexDirection: 'column' }}>
                    <h3 style={{ fontSize: '1.25rem', marginBottom: '0.2rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{hotel.name}</h3>
                    <div style={{ display: 'flex', gap: '2px', marginBottom: '0.5rem' }}>
                        {Array(hotel.stars || 5).fill(0).map((_, i) => (
                            <Star key={i} size={14} fill="#f59e0b" color="#f59e0b" strokeWidth={0} />
                        ))}
                    </div>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '1.5rem', height: '3rem', overflow: 'hidden' }}>
                        {hotel.description || 'Una experiencia única en ' + hotel.city}
                    </p>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 'auto' }}>
                        <span style={{ fontSize: '1.5rem', fontWeight: 800 }}>
                            {startingPrice ? `$${startingPrice.toLocaleString()}` : '-'} <small style={{ fontSize: '0.7rem', opacity: 0.5 }}>/noche</small>
                        </span>
                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                            {/* Info → ahora abre modal */}
                            <button
                                onClick={() => setShowModal(true)}
                                className="btn-secondary"
                                style={{ padding: '0.6rem', borderRadius: '12px', background: 'rgba(255,255,255,0.05)', color: 'white', border: '1px solid rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
                                title="Detalles del Hotel"
                            >
                                <Info size={16} />
                            </button>
                            <a
                                href={`https://wa.me/${hotel.phone?.replace(/\D/g, '') || '529981234567'}?text=${encodeURIComponent(`Hola, necesito más información sobre el hotel: ${hotel.name}.\nPuedes verlo aquí: ${typeof window !== 'undefined' ? window.location.origin : ''}/hotels/${hotel.id}`)}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                style={{ padding: '0.6rem', borderRadius: '12px', background: '#25d366', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'transform 0.2s', border: 'none' }}
                                title="Contactar por WhatsApp"
                            >
                                <WhatsAppIcon size={16} />
                            </a>
                            <Link
                                href={`/hotels/${hotel.id}`}
                                className="btn-premium"
                                style={{ padding: '0.6rem 1.2rem', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.4rem', flex: 1, justifyContent: 'center', textDecoration: 'none' }}
                            >
                                Reservar
                            </Link>
                        </div>
                    </div>
                </div>

                <style jsx>{`
                    .hotel-card-hover:hover .gallery-arrow { opacity: 1; }
                    .gallery-arrow {
                        position: absolute; top: 50%; transform: translateY(-50%);
                        background: rgba(255,255,255,0.2); backdrop-filter: blur(4px);
                        color: white; border: 1px solid rgba(255,255,255,0.3);
                        width: 36px; height: 36px; border-radius: 50%;
                        display: flex; align-items: center; justify-content: center;
                        cursor: pointer; opacity: 0; transition: opacity 0.3s, background 0.3s; z-index: 10;
                    }
                    .gallery-arrow:hover { background: rgba(255,255,255,0.4); }
                    .gallery-arrow.left { left: 0.5rem; }
                    .gallery-arrow.right { right: 0.5rem; }
                `}</style>
            </div>
        </>
    );
}
