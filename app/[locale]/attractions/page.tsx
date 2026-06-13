'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import EntityGrid from '@/components/EntityGrid';
import { getPublicAttractions } from '@/app/admin/attractions/actions';
import { useLanguage } from '@/context/LanguageContext';

export default function AttractionsPage() {
    const { language } = useLanguage();
    const isEn = language === 'en';
    const [attractions, setAttractions] = useState<any[]>([]);

    useEffect(() => {
        const fetchAttractions = async () => {
            const res = await getPublicAttractions();
            if (res.success && res.data) {
                setAttractions(res.data);
            }
        };
        fetchAttractions();
    }, []);

    return (
        <main>
            {/* Hero Section */}
            <section className="hero-banner" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '50vh', position: 'relative' }}>
                <Image 
                    src="https://images.unsplash.com/photo-1518182170546-07661607baaf?q=80&w=2070&auto=format&fit=crop" 
                    alt={isEn ? "Tourist attractions" : "Atracciones turísticas"} 
                    fill 
                    style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', zIndex: 0 }} 
                    unoptimized
                    priority
                />
                <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, rgba(0,0,0,0.5), rgba(0,0,0,0.85))', zIndex: 1 }} />
                
                <div className="container" style={{ position: 'relative', zIndex: 2, textAlign: 'center', padding: '0 2rem' }}>
                    <h1 className="heading-1 float-animation" style={{ fontSize: '3.5rem', marginBottom: '1rem', textShadow: '0 10px 30px rgba(0,0,0,0.5)' }}>
                        {isEn ? "Unique " : "Experiencias "}<span className="text-gradient">{isEn ? "Experiences" : "Únicas"}</span>
                    </h1>
                    <p style={{ fontSize: '1.25rem', color: 'rgba(255,255,255,0.9)', maxWidth: '800px', margin: '0 auto', textShadow: '0 4px 10px rgba(0,0,0,0.5)' }}>
                        {isEn 
                            ? "Immerse yourself in the culture, history, and natural wonders that will leave you with memories for a lifetime."
                            : "Sumérgete en la cultura, historia y maravillas naturales que te dejarán recuerdos para toda la vida."
                        }
                    </p>
                </div>
            </section>

            {/* Attractions Grid */}
            <div style={{ padding: '2rem 0 5rem 0', background: 'var(--background)' }}>
                <EntityGrid 
                    title={isEn ? <>Discover the <span className="text-gradient">Magic</span></> : <>Descubre la <span className="text-gradient">Magia</span></>} 
                    subtitle={isEn 
                        ? "Parks, archaeological zones, and natural wonders await you."
                        : "Parques, zonas arqueológicas y maravillas naturales te esperan."
                    } 
                    items={attractions} 
                />
            </div>
        </main>
    );
}
