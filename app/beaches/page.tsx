'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import EntityGrid from '@/components/EntityGrid';
import { getPublicBeaches } from '@/app/admin/beaches/actions';

export default function BeachesPage() {
    const [beaches, setBeaches] = useState<any[]>([]);

    useEffect(() => {
        const fetchBeaches = async () => {
            const res = await getPublicBeaches();
            if (res.success && res.data) {
                setBeaches(res.data);
            }
        };
        fetchBeaches();
    }, []);

    return (
        <main>
            {/* Hero Section */}
            <section className="hero-banner" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '50vh', position: 'relative' }}>
                <Image 
                    src="https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=2070&auto=format&fit=crop" 
                    alt="Playas paradisiacas" 
                    fill 
                    style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', zIndex: 0 }} 
                    unoptimized
                    priority
                />
                <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, rgba(0,0,0,0.5), rgba(0,0,0,0.85))', zIndex: 1 }} />
                
                <div className="container" style={{ position: 'relative', zIndex: 2, textAlign: 'center', padding: '0 2rem' }}>
                    <h1 className="heading-1 float-animation" style={{ fontSize: '3.5rem', marginBottom: '1rem', textShadow: '0 10px 30px rgba(0,0,0,0.5)' }}>
                        Paraísos <span className="text-gradient">Costeros</span>
                    </h1>
                    <p style={{ fontSize: '1.25rem', color: 'rgba(255,255,255,0.9)', maxWidth: '800px', margin: '0 auto', textShadow: '0 4px 10px rgba(0,0,0,0.5)' }}>
                        Descubre las playas más impresionantes, donde el sol brilla eternamente y las olas cuentan historias de arena dorada.
                    </p>
                </div>
            </section>

            {/* Beaches Grid */}
            <div style={{ padding: '2rem 0 5rem 0', background: 'var(--background)' }}>
                <EntityGrid 
                    title={<>Explora tu <span className="text-gradient">Destino</span></>} 
                    subtitle="Desde bahías escondidas hasta playas vibrantes y exclusivas." 
                    items={beaches} 
                />
            </div>
        </main>
    );
}
