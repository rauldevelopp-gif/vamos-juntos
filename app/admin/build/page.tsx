'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';

const SERVICES = [
    { id: 'taxi', name: 'Taxi', icon: '🚕', color: '#fbbf24', price: 28 },
    { id: 'hotel', name: 'Hotel', icon: '🏨', color: '#6366f1', price: 540 },
    { id: 'beach', name: 'Playa', icon: '🏖️', color: '#10b981', price: 0 },
    { id: 'yacht', name: 'Yate', icon: '🚤', color: '#0ea5e9', price: 320 },
    { id: 'bar', name: 'Bar', icon: '🍸', color: '#f43f5e', price: 60 },
    { id: 'restaurant', name: 'Restaurante', icon: '🍴', color: '#f97316', price: 45 },
    { id: 'excursion', name: 'Excursión', icon: '🧗', color: '#8b5cf6', price: 80 },
    { id: 'spa', name: 'Spa', icon: '🧘', color: '#ec4899', price: 120 },
    { id: 'flight', name: 'Vuelo', icon: '✈️', color: '#3b82f6', price: 450 },
];

function BuilderContent() {
    const [selectedServices, setSelectedServices] = useState<any[]>([]);
    const searchParams = useSearchParams();
    const packageId = searchParams.get('packageId');

    useEffect(() => {
        if (packageId === 'luxury-starter') {
            const initial = [
                SERVICES.find(s => s.id === 'yacht'),
                SERVICES.find(s => s.id === 'hotel'),
                SERVICES.find(s => s.id === 'taxi'),
            ].filter(Boolean).map(s => ({ ...s, instanceId: Math.random() }));
            setSelectedServices(initial);
        }
    }, [packageId]);

    const addService = (service: any) => {
        setSelectedServices([...selectedServices, { ...service, instanceId: Date.now() }]);
    };

    const removeService = (instanceId: number) => {
        setSelectedServices(selectedServices.filter(s => s.instanceId !== instanceId));
    };

    const total = selectedServices.reduce((acc, curr) => acc + curr.price, 0);

    return (
        <div className="container" style={{ padding: '4rem 2rem' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: '2rem' }}>

                {/* Left Side: Selected Services */}
                <div className="glass-panel" style={{ padding: '2rem' }}>
                    <h2 className="heading-2" style={{ marginBottom: '2rem' }}>Servicios de la reserva</h2>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', minHeight: '400px' }}>
                        {selectedServices.length === 0 ? (
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flex: 1, border: '2px dashed var(--border-glass)', borderRadius: 'var(--radius-lg)', color: 'var(--text-muted)' }}>
                                Arrastra o selecciona servicios para comenzar
                            </div>
                        ) : (
                            selectedServices.map((service) => (
                                <div key={service.instanceId} className="glass-card" style={{ display: 'flex', alignItems: 'center', padding: '1rem', gap: '1.5rem' }}>
                                    <div style={{ width: '60px', height: '60px', background: 'rgba(255,255,255,0.05)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2rem' }}>
                                        {service.icon}
                                    </div>
                                    <div style={{ flex: 1 }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                            <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: service.color }}></span>
                                            <span style={{ fontWeight: 600 }}>{service.name}</span>
                                        </div>
                                        <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Servicio Premium</p>
                                    </div>
                                    <div style={{ fontWeight: 700, fontSize: '1.1rem' }}>
                                        ${service.price.toFixed(2)}
                                    </div>
                                    <button onClick={() => removeService(service.instanceId)} style={{ background: 'none', color: 'var(--accent)', fontSize: '1.2rem' }}>×</button>
                                </div>
                            ))
                        )}
                    </div>

                    <div style={{ marginTop: '2rem', paddingTop: '2rem', borderTop: '1px solid var(--border-glass)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ color: 'var(--text-muted)' }}>Total estimado</span>
                        <span style={{ fontSize: '2rem', fontWeight: 700 }}>${total.toFixed(2)} <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>USD</span></span>
                    </div>
                </div>

                {/* Right Side: Add Services */}
                <div className="glass-panel" style={{ padding: '2rem', alignSelf: 'start' }}>
                    <h2 style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>Agregar servicio</h2>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '2rem' }}>Selecciona un servicio para agregar a tu reserva</p>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem' }}>
                        {SERVICES.map((service) => (
                            <button
                                key={service.id}
                                onClick={() => addService(service)}
                                className="glass-card"
                                style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '1.5rem 1rem', gap: '0.75rem', background: 'rgba(255,255,255,0.02)' }}
                            >
                                <div style={{ fontSize: '2rem' }}>{service.icon}</div>
                                <span style={{ fontSize: '0.9rem', fontWeight: 500 }}>{service.name}</span>
                            </button>
                        ))}
                    </div>

                    <div className="glass-card" style={{ marginTop: '2rem', padding: '1rem', display: 'flex', gap: '0.75rem', alignItems: 'flex-start', background: 'rgba(59, 130, 246, 0.05)', borderColor: 'rgba(59, 130, 246, 0.2)' }}>
                        <span style={{ color: '#3b82f6' }}>ⓘ</span>
                        <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Puedes agregar múltiples servicios y organizarlos como desees.</p>
                    </div>

                    <button className="btn-premium" style={{ width: '100%', marginTop: '2rem' }}>
                        Confirmar Reserva
                    </button>
                </div>

            </div>
        </div>
    );
}

export default function BuildPackagePage() {
    return (
        <Suspense fallback={<div>Cargando...</div>}>
            <BuilderContent />
        </Suspense>
    );
}
