'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import EntityGrid from '@/components/EntityGrid';
import { getPublicYachts } from '@/app/admin/yachts/actions';
import { useLanguage } from '@/context/LanguageContext';

export default function YachtsPage() {
    const { language } = useLanguage();
    const isEn = language === 'en';
    const [yachts, setYachts] = useState<any[]>([]);

    useEffect(() => {
        const fetchYachts = async () => {
            const res = await getPublicYachts();
            if (res.success && res.data) {
                setYachts(res.data);
            }
        };
        fetchYachts();
    }, []);

    return (
        <main>
            {/* Hero Section */}
            <section className="hero-banner" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '50vh', position: 'relative' }}>
                <Image 
                    src="/uploads/emerald_wave.png" 
                    alt={isEn ? "Yachts at the beach" : "Yates en la playa"} 
                    fill 
                    style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', zIndex: 0 }} 
                    unoptimized
                    priority
                />
                <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, rgba(0,0,0,0.5), rgba(0,0,0,0.85))', zIndex: 1 }} />
                
                <div className="container" style={{ position: 'relative', zIndex: 2, textAlign: 'center', padding: '0 2rem' }}>
                    <h1 className="heading-1 float-animation" style={{ fontSize: '3.5rem', marginBottom: '1rem', textShadow: '0 10px 30px rgba(0,0,0,0.5)' }}>
                        {isEn ? "Premium " : "Colección de "}<span className="text-gradient">{isEn ? "Yacht Collection" : "Yates Premium"}</span>
                    </h1>
                    <p style={{ fontSize: '1.25rem', color: 'rgba(255,255,255,0.9)', maxWidth: '800px', margin: '0 auto', textShadow: '0 4px 10px rgba(0,0,0,0.5)' }}>
                        {isEn 
                            ? "Discover the freedom of sailing in crystal-clear waters with our exclusive fleet. Luxury, comfort, and the most impeccable service on every wave."
                            : "Descubre la libertad de navegar en aguas cristalinas con nuestra exclusiva flota. Lujo, confort y el servicio más impecable en cada ola."
                        }
                    </p>
                </div>
            </section>

            {/* Yachts Grid */}
            <div style={{ padding: '2rem 0 5rem 0', background: 'var(--background)' }}>
                <EntityGrid 
                    title={isEn ? <>Select Your <span className="text-gradient">Vessel</span></> : <>Selecciona tu <span className="text-gradient">Embarcación</span></>} 
                    subtitle={isEn 
                        ? "We have the perfect yacht for every type of adventure, whether it is an intimate gathering or a grand celebration."
                        : "Tenemos el yate perfecto para cada tipo de aventura, ya sea una reunión íntima o una gran celebración."
                    } 
                    items={yachts} 
                />
            </div>
        </main>
    );
}
