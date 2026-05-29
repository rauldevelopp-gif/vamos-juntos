'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Info, ChevronLeft, ChevronRight } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

interface EntityCardProps {
    title: string;
    subtitle?: string;
    priceLabel?: string;
    gallery?: string[];
    badge?: string;
    accentColor?: string;
    onClick?: () => void;
}

export default function EntityCard({ title, subtitle, priceLabel, gallery, badge, accentColor, onClick }: EntityCardProps) {
    const { language } = useLanguage();
    const isEn = language === 'en';
    const activeColor = accentColor || 'var(--primary)';
    const images = gallery && gallery.length > 0 ? gallery : ['https://images.unsplash.com/photo-1544551763-46a013bb70d5?q=80&w=600&auto=format&fit=crop'];
    const [currentIndex, setCurrentIndex] = useState(0);

    const nextImage = (e: React.MouseEvent) => {
        e.stopPropagation();
        setCurrentIndex((prev) => (prev + 1) % images.length);
    };

    const prevImage = (e: React.MouseEvent) => {
        e.stopPropagation();
        setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
    };

    return (
        <div 
            className="glass-card" 
            onClick={onClick}
            style={{ 
                scrollSnapAlign: 'start', 
                flex: '0 0 auto', 
                width: '100%',
                maxWidth: '380px',
                overflow: 'hidden', 
                cursor: 'pointer',
                display: 'flex',
                flexDirection: 'column',
                position: 'relative'
            }}
        >
            {/* Image Section */}
            <div style={{ position: 'relative', height: '220px', width: '100%', background: 'rgba(255,255,255,0.05)' }}>
                <Image 
                    src={images[currentIndex]} 
                    alt={title} 
                    fill 
                    style={{ objectFit: 'cover' }} 
                    unoptimized 
                />
                {/* Badge */}
                {badge && (
                    <div style={{ 
                        position: 'absolute', 
                        top: '1rem', right: '1rem', 
                        background: activeColor, 
                        color: 'white', 
                        padding: '0.25rem 0.75rem', 
                        fontWeight: 700, 
                        fontSize: '0.8rem',
                        borderRadius: 'var(--radius-full)',
                        textTransform: 'uppercase',
                        zIndex: 10
                    }}>
                        {badge}
                    </div>
                )}

                {/* Arrows */}
                {images.length > 1 && (
                    <>
                        <button onClick={prevImage} className="gallery-arrow left">
                            <ChevronLeft size={20} />
                        </button>
                        <button onClick={nextImage} className="gallery-arrow right">
                            <ChevronRight size={20} />
                        </button>
                    </>
                )}

                {/* Bottom Gradient for Price and Dots */}
                <div style={{ 
                    position: 'absolute', 
                    bottom: 0, left: 0, right: 0, 
                    height: '80px',
                    background: 'linear-gradient(to top, rgba(0,0,0,0.85), transparent)',
                    display: 'flex',
                    alignItems: 'flex-end',
                    justifyContent: 'space-between',
                    padding: '1rem 1.2rem',
                    zIndex: 5
                }}>
                    {/* Dots */}
                    <div style={{ display: 'flex', gap: '6px', marginBottom: '4px' }}>
                        {images.length > 1 && images.map((_, idx) => (
                            <div 
                                key={idx} 
                                style={{ 
                                    width: '8px', height: '8px', borderRadius: '50%', 
                                    background: idx === currentIndex ? 'white' : 'rgba(255,255,255,0.4)',
                                    transition: 'background 0.3s'
                                }} 
                            />
                        ))}
                    </div>

                    {/* Price */}
                    {priceLabel && (
                        <div style={{ color: 'white', fontWeight: 800, fontSize: '1.05rem', textShadow: '0 2px 4px rgba(0,0,0,0.5)' }}>
                            {priceLabel}
                        </div>
                    )}
                </div>
            </div>

            {/* Content Section */}
            <div style={{ padding: '1.5rem', flex: 1, display: 'flex', flexDirection: 'column' }}>
                <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', color: 'var(--text-main)' }}>
                    {title}
                </h3>
                {subtitle && (
                    <p style={{ margin: 0, color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '1.5rem', height: '2.8rem', overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>
                        {subtitle}
                    </p>
                )}
                <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 'auto' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: activeColor, fontWeight: 600, fontSize: '0.9rem' }}>
                        <span>{isEn ? 'View details' : 'Ver detalles'}</span>
                        <ChevronRight size={16} />
                    </div>
                </div>
            </div>

            <style jsx>{`
                .glass-card:hover .gallery-arrow {
                    position: absolute;
                    top: 50%;
                    transform: translateY(-50%);
                    background: rgba(255,255,255,0.2);
                    backdrop-filter: blur(4px);
                    color: white;
                    border: 1px solid rgba(255,255,255,0.3);
                    width: 36px;
                    height: 36px;
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    cursor: pointer;
                    opacity: 0;
                    transition: opacity 0.3s, background 0.3s;
                    z-index: 10;
                }
                .glass-card:hover .gallery-arrow {
                    opacity: 1;
                }
                .gallery-arrow:hover {
                    background: rgba(255,255,255,0.4);
                }
                .gallery-arrow.left {
                    left: 0.5rem;
                }
                .gallery-arrow.right {
                    right: 0.5rem;
                }
            `}</style>
        </div>
    );
}
