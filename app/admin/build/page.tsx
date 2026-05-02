'use client';

import { useState, Suspense } from 'react';

const SERVICES = [
    { id: 'taxi', name: 'Taxi', icon: '🚕', color: '#f59e0b', bg: 'rgba(251,191,36,0.15)', price: 28 },
    { id: 'hotel', name: 'Hotel', icon: '🏨', color: '#6366f1', bg: 'rgba(99,102,241,0.15)', price: 540 },
    { id: 'beach', name: 'Playa', icon: '🏖️', color: '#10b981', bg: 'rgba(16,185,129,0.15)', price: 0 },
    { id: 'yacht', name: 'Yate', icon: '🚤', color: '#0ea5e9', bg: 'rgba(14,165,233,0.15)', price: 320 },
    { id: 'bar', name: 'Bar', icon: '🍸', color: '#f43f5e', bg: 'rgba(244,63,94,0.15)', price: 60 },
    { id: 'restaurant', name: 'Restaurante', icon: '🍴', color: '#f97316', bg: 'rgba(249,115,22,0.15)', price: 45 },
    { id: 'excursion', name: 'Excursión', icon: '📷', color: '#8b5cf6', bg: 'rgba(139,92,246,0.15)', price: 80 },
    { id: 'spa', name: 'Spa', icon: '🌸', color: '#ec4899', bg: 'rgba(236,72,153,0.15)', price: 120 },
    { id: 'flight', name: 'Vuelo', icon: '✈️', color: '#3b82f6', bg: 'rgba(59,130,246,0.15)', price: 450 },
];

interface ServiceItem {
    id: string;
    name: string;
    icon: string;
    color: string;
    bg: string;
    price: number;
    instanceId: number;
    detail: string;
    date: string;
}

function BuilderContent() {
    const [selected, setSelected] = useState<ServiceItem[]>([]);
    const [activeId, setActiveId] = useState<string>('taxi');

    const addService = (service: typeof SERVICES[0]) => {
        setActiveId(service.id);
        const now = new Date();
        const dateStr = `${now.getDate()} Jun 2025, ${now.getHours()}:${String(now.getMinutes()).padStart(2, '0')}`;
        setSelected(prev => [...prev, {
            ...service,
            instanceId: Date.now(),
            detail: service.name + ' Premium',
            date: dateStr,
        }]);
    };

    const removeService = (instanceId: number) => {
        setSelected(prev => prev.filter(s => s.instanceId !== instanceId));
    };

    const total = selected.reduce((acc, s) => acc + s.price, 0);

    return (
        <div style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto' }}>
            <h1 style={{ fontSize: '1.75rem', fontWeight: 700, marginBottom: '2rem' }} className="text-gradient">
                Construir Paquete
            </h1>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 380px', gap: '1.5rem', alignItems: 'start' }}>

                {/* LEFT: service list */}
                <div className="glass-panel" style={{ padding: '2rem', borderRadius: '20px' }}>
                    <h2 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '1.5rem', color: '#fff' }}>
                        Servicios de la reserva
                    </h2>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem', minHeight: '360px' }}>
                        {selected.length === 0 ? (
                            <div style={{
                                flex: 1, border: '2px dashed rgba(255,255,255,0.15)', borderRadius: '16px',
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                color: 'rgba(255,255,255,0.35)', fontSize: '0.95rem', padding: '3rem'
                            }}>
                                Selecciona servicios del panel derecho para comenzar
                            </div>
                        ) : selected.map(s => (
                            <div key={s.instanceId} style={{
                                display: 'flex', alignItems: 'center', gap: '1rem',
                                background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)',
                                borderRadius: '14px', padding: '0.9rem 1.1rem'
                            }}>
                                {/* drag handle */}
                                <span style={{ color: 'rgba(255,255,255,0.25)', fontSize: '1rem', cursor: 'grab', letterSpacing: '-2px' }}>⠿</span>

                                {/* icon */}
                                <div style={{
                                    width: '54px', height: '54px', borderRadius: '12px', flexShrink: 0,
                                    background: s.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.6rem'
                                }}>
                                    {s.icon}
                                </div>

                                {/* info */}
                                <div style={{ flex: 1, minWidth: 0 }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', marginBottom: '0.2rem' }}>
                                        <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: s.color, flexShrink: 0 }} />
                                        <span style={{ fontWeight: 600, fontSize: '0.95rem' }}>{s.name}</span>
                                    </div>
                                    <div style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.45)' }}>{s.detail}</div>
                                    <div style={{ fontSize: '0.78rem', color: 'rgba(255,255,255,0.3)' }}>{s.date}</div>
                                </div>

                                {/* price */}
                                <div style={{ fontWeight: 700, fontSize: '1rem', whiteSpace: 'nowrap' }}>
                                    ${s.price.toFixed(2)}
                                </div>

                                {/* remove */}
                                <button
                                    onClick={() => removeService(s.instanceId)}
                                    style={{
                                        background: 'none', border: 'none', cursor: 'pointer',
                                        color: 'rgba(255,255,255,0.3)', fontSize: '1.1rem', padding: '0.2rem 0.4rem',
                                        borderRadius: '6px', lineHeight: 1
                                    }}
                                    title="Eliminar"
                                >⋮</button>
                            </div>
                        ))}
                    </div>

                    {/* total */}
                    <div style={{
                        marginTop: '1.5rem', paddingTop: '1.25rem', borderTop: '1px solid rgba(255,255,255,0.1)',
                        display: 'flex', justifyContent: 'space-between', alignItems: 'center'
                    }}>
                        <span style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.95rem' }}>Total estimado</span>
                        <span style={{ fontSize: '1.6rem', fontWeight: 800 }}>
                            ${total.toFixed(2)} <span style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.4)', fontWeight: 400 }}>USD</span>
                        </span>
                    </div>
                </div>

                {/* RIGHT: picker */}
                <div className="glass-panel" style={{ padding: '1.75rem', borderRadius: '20px' }}>
                    <h2 style={{ fontSize: '1.05rem', fontWeight: 700, marginBottom: '0.3rem', color: '#fff' }}>
                        Agregar servicio
                    </h2>
                    <p style={{ fontSize: '0.82rem', color: 'rgba(255,255,255,0.4)', marginBottom: '1.25rem' }}>
                        Selecciona un servicio para agregar a tu reserva
                    </p>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.75rem' }}>
                        {SERVICES.map(s => (
                            <button
                                key={s.id}
                                onClick={() => addService(s)}
                                style={{
                                    background: activeId === s.id ? s.bg : 'rgba(255,255,255,0.04)',
                                    border: `1.5px solid ${activeId === s.id ? s.color : 'rgba(255,255,255,0.08)'}`,
                                    borderRadius: '14px', padding: '1.1rem 0.5rem', cursor: 'pointer',
                                    display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.55rem',
                                    transition: 'all 0.2s ease'
                                }}
                            >
                                <span style={{ fontSize: '1.8rem' }}>{s.icon}</span>
                                <span style={{ fontSize: '0.78rem', fontWeight: 600, color: '#fff' }}>{s.name}</span>
                            </button>
                        ))}
                    </div>

                    {/* hint */}
                    <div style={{
                        marginTop: '1.25rem', background: 'rgba(59,130,246,0.08)', border: '1px solid rgba(59,130,246,0.2)',
                        borderRadius: '12px', padding: '0.85rem 1rem', display: 'flex', gap: '0.6rem', alignItems: 'flex-start'
                    }}>
                        <span style={{ color: '#3b82f6', fontSize: '1rem', flexShrink: 0 }}>ⓘ</span>
                        <p style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.45)', lineHeight: 1.5 }}>
                            Puedes agregar múltiples servicios y organizarlos como desees.
                        </p>
                    </div>

                    {/* confirm */}
                    <button
                        className="btn-premium"
                        style={{ width: '100%', marginTop: '1.25rem', padding: '0.85rem' }}
                    >
                        Confirmar Reserva
                    </button>
                </div>
            </div>
        </div>
    );
}

export default function BuildPackagePage() {
    return (
        <Suspense fallback={<div style={{ padding: '4rem', textAlign: 'center', color: 'rgba(255,255,255,0.5)' }}>Cargando...</div>}>
            <BuilderContent />
        </Suspense>
    );
}
