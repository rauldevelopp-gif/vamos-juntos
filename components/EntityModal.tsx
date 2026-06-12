'use client';

import { useState } from 'react';
import Image from 'next/image';
import { X, ChevronLeft, ChevronRight, Info, Users, Tag, DollarSign, Activity } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { getTranslatedValue } from '../lib/i18n-utils';

interface EntityModalProps {
    item: any;
    onClose: () => void;
    accentColor?: string;
}

export default function EntityModal({ item, onClose, accentColor = 'var(--primary)' }: EntityModalProps) {
    const { language, t } = useLanguage();
    const isEn = language === 'en';
    const images = item.gallery && item.gallery.length > 0 ? item.gallery : (item.image ? [item.image] : ['https://images.unsplash.com/photo-1544551763-46a013bb70d5?q=80&w=1200&auto=format&fit=crop']);
    const [currentImage, setCurrentImage] = useState(0);

    const nextImage = () => setCurrentImage((prev) => (prev + 1) % images.length);
    const prevImage = () => setCurrentImage((prev) => (prev - 1 + images.length) % images.length);

    const price = item.price_day || item.price;
    const title = item.brand ? `${item.brand} ${getTranslatedValue(item.name, language)}` : getTranslatedValue(item.name, language);
    const description = getTranslatedValue(item.description_long || item.description, language);
    const localizedType = getTranslatedValue(item.type, language);

    return (
        <div style={{ position: 'fixed', inset: 0, zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem', background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(5px)' }}>
            <div className="glass-panel" style={{ width: '100%', maxWidth: '900px', maxHeight: '90vh', overflow: 'auto', background: 'rgba(15,23,42,0.95)', position: 'relative', padding: 0 }}>
                
                {/* Close Button */}
                <button 
                    onClick={onClose}
                    style={{ position: 'absolute', top: '1rem', right: '1rem', zIndex: 50, background: 'rgba(0,0,0,0.5)', border: '1px solid rgba(255,255,255,0.2)', color: 'white', borderRadius: '50%', width: '40px', height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', transition: 'all 0.2s' }}
                >
                    <X size={20} />
                </button>

                {/* Gallery */}
                <div style={{ position: 'relative', height: '400px', width: '100%', background: 'black' }}>
                    <Image 
                        src={images[currentImage]} 
                        alt={title || 'Image'} 
                        fill 
                        style={{ objectFit: 'cover' }} 
                        unoptimized 
                    />
                    
                    {images.length > 1 && (
                        <>
                            <button onClick={prevImage} className="gallery-nav left">
                                <ChevronLeft size={24} />
                            </button>
                            <button onClick={nextImage} className="gallery-nav right">
                                <ChevronRight size={24} />
                            </button>
                            <div style={{ position: 'absolute', bottom: '1rem', left: 0, right: 0, display: 'flex', justifyContent: 'center', gap: '8px' }}>
                                {images.map((_: any, idx: number) => (
                                    <button 
                                        key={idx}
                                        onClick={() => setCurrentImage(idx)}
                                        style={{ width: '10px', height: '10px', borderRadius: '50%', background: idx === currentImage ? 'white' : 'rgba(255,255,255,0.4)', border: 'none', cursor: 'pointer', padding: 0 }}
                                    />
                                ))}
                            </div>
                        </>
                    )}
                </div>

                {/* Content */}
                <div style={{ padding: '2.5rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.5rem' }}>
                        <div>
                            <h2 style={{ fontSize: '2rem', fontWeight: 800, margin: '0 0 0.5rem 0' }}>{title}</h2>
                            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', color: 'rgba(255,255,255,0.7)' }}>
                                {localizedType && (
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                                        <Tag size={16} color={accentColor} />
                                        <span>{localizedType}</span>
                                    </div>
                                )}
                                {item.capacity && (
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                                        <Users size={16} color={accentColor} />
                                        <span>{isEn ? `Capacity: ${item.capacity}` : `Capacidad: ${item.capacity}`}</span>
                                    </div>
                                )}
                                {item.status && (
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                                        <Activity size={16} color={accentColor} />
                                        <span>{getTranslatedValue(item.status, language)}</span>
                                    </div>
                                )}
                            </div>
                        </div>
                        {price && (
                            <div style={{ background: 'rgba(255,255,255,0.05)', border: `1px solid ${accentColor}`, padding: '1rem', borderRadius: '1rem', textAlign: 'center', minWidth: '150px' }}>
                                <div style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.6)', textTransform: 'uppercase', marginBottom: '0.2rem' }}>
                                    {isEn ? 'Price from' : 'Precio desde'}
                                </div>
                                <div style={{ fontSize: '1.8rem', fontWeight: 800, color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    <DollarSign size={24} color={accentColor} />
                                    {price.toLocaleString()} <span style={{ fontSize: '1rem', opacity: 0.6, marginLeft: '4px' }}>USD</span>
                                </div>
                            </div>
                        )}
                    </div>

                    <div style={{ background: 'rgba(255,255,255,0.02)', padding: '1.5rem', borderRadius: '1rem', border: '1px solid rgba(255,255,255,0.05)', marginBottom: '2rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem', color: accentColor, fontWeight: 700 }}>
                            <Info size={18} />
                            {isEn ? 'Information' : 'Información'}
                        </div>
                        <p style={{ lineHeight: '1.8', color: 'rgba(255,255,255,0.85)', fontSize: '1.05rem', margin: 0 }}>
                            {description || (isEn ? 'No description available.' : 'Sin descripción disponible.')}
                        </p>
                    </div>

                    <div style={{ textAlign: 'center' }}>
                        <a 
                            href={`https://wa.me/529981234567?text=${encodeURIComponent(`Hola, me interesa obtener más información sobre: ${title}`)}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="btn-premium" 
                            style={{ display: 'inline-flex', padding: '1rem 3rem', background: accentColor, fontSize: '1.1rem' }}
                        >
                            {isEn ? 'Contact for Booking' : 'Contactar para Reservar'}
                        </a>
                    </div>
                </div>
            </div>

            <style jsx>{`
                .gallery-nav {
                    position: absolute;
                    top: 50%;
                    transform: translateY(-50%);
                    background: rgba(0,0,0,0.4);
                    color: white;
                    border: 1px solid rgba(255,255,255,0.2);
                    border-radius: 50%;
                    width: 48px;
                    height: 48px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    cursor: pointer;
                    transition: all 0.2s;
                    backdrop-filter: blur(4px);
                }
                .gallery-nav:hover {
                    background: rgba(255,255,255,0.2);
                    transform: translateY(-50%) scale(1.1);
                }
                .gallery-nav.left { left: 1rem; }
                .gallery-nav.right { right: 1rem; }
            `}</style>
        </div>
    );
}
