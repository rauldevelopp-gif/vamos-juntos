"use client";

import { useState, useEffect } from "react";
import { 
    Car, 
    Anchor, 
    Utensils, 
    MapPin, 
    Trash2, 
    Receipt, 
    ShoppingBag, 
    Plus,
    CheckCircle2
} from "lucide-react";

interface Taxi {
    id: number;
    type: string;
    capacity: number;
    basePrice: number;
}

interface Yacht {
    id: number;
    name: string;
    capacity: number;
    hourlyPrice: number;
}

interface Place {
    id: number;
    name: string;
    category: string;
}

interface Restaurant {
    id: number;
    name: string;
    type: string;
}

interface SelectedService {
    id: string;
    serviceType: string;
    itemId: number;
    name: string;
    price: number;
}

export default function PackageBuilder() {
    const [taxis, setTaxis] = useState<Taxi[]>([]);
    const [yachts, setYachts] = useState<Yacht[]>([]);
    const [places, setPlaces] = useState<Place[]>([]);
    const [restaurants, setRestaurants] = useState<Restaurant[]>([]);

    const [selectedServices, setSelectedServices] = useState<SelectedService[]>([]);

    useEffect(() => {
        Promise.all([
            fetch('/api/taxis').then(res => res.json()),
            fetch('/api/yachts').then(res => res.json()),
            fetch('/api/places').then(res => res.json()),
            fetch('/api/restaurants').then(res => res.json())
        ]).then(([tData, yData, pData, rData]) => {
            setTaxis(Array.isArray(tData) ? tData : []);
            setYachts(Array.isArray(yData) ? yData : []);
            setPlaces(Array.isArray(pData) ? pData : []);
            setRestaurants(Array.isArray(rData) ? rData : []);
        });
    }, []);

    const addService = (type: string, item: Taxi | Yacht | Place | Restaurant, price: number) => {
        const name = 'name' in item ? item.name : (item as Taxi).type;
        setSelectedServices(prev => [...prev, {
            id: Math.random().toString(36).substring(2, 9),
            serviceType: type,
            itemId: item.id,
            name: name,
            price: price
        }]);
    };

    const removeService = (id: string) => {
        setSelectedServices(prev => prev.filter(s => s.id !== id));
    };

    const total = selectedServices.reduce((sum, s) => sum + s.price, 0);

    return (
        <div style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto' }}>
            <div style={{ marginBottom: '3rem' }}>
                <h1 style={{ fontSize: '2.5rem', fontWeight: 800, marginBottom: '0.5rem' }} className="text-gradient">Diseña tu Experiencia</h1>
                <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem' }}>
                    Selecciona los servicios exclusivos para crear un paquete a tu medida.
                </p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 380px', gap: '3rem', alignItems: 'start' }} className="mobile-stack">
                <div style={{ display: 'flex', flexDirection: 'column', gap: '3rem' }}>
                    {/* Taxis */}
                    <section>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', marginBottom: '1.5rem' }}>
                            <Car className="text-gradient" size={24} />
                            <h2 style={{ fontSize: '1.5rem', margin: 0 }}>Transporte VIP</h2>
                        </div>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '1.2rem' }}>
                            {taxis.map(taxi => (
                                <div key={taxi.id} className="glass-panel hover-card" 
                                    style={{ padding: '1.5rem', cursor: 'pointer', position: 'relative', overflow: 'hidden' }}
                                    onClick={() => addService('TAXI', taxi, taxi.basePrice)}>
                                    <div style={{ fontWeight: 700, fontSize: '1.1rem', marginBottom: '0.5rem' }}>{taxi.type}</div>
                                    <div style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '1rem' }}>Capacidad: {taxi.capacity} px</div>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <span style={{ fontWeight: 700, color: 'var(--primary)', fontSize: '1.2rem' }}>${taxi.basePrice}</span>
                                        <Plus size={18} color="var(--primary)" />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>

                    {/* Yachts */}
                    <section>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', marginBottom: '1.5rem' }}>
                            <Anchor className="text-gradient" size={24} />
                            <h2 style={{ fontSize: '1.5rem', margin: 0 }}>Yates de Lujo</h2>
                        </div>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '1.2rem' }}>
                            {yachts.map(yacht => (
                                <div key={yacht.id} className="glass-panel hover-card" 
                                    style={{ padding: '1.5rem', cursor: 'pointer' }}
                                    onClick={() => addService('YACHT', yacht, yacht.hourlyPrice)}>
                                    <div style={{ fontWeight: 700, fontSize: '1.1rem', marginBottom: '0.5rem' }}>{yacht.name}</div>
                                    <div style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '1rem' }}>Capacidad: {yacht.capacity} px</div>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <span style={{ fontWeight: 700, color: 'var(--primary)', fontSize: '1.2rem' }}>${yacht.hourlyPrice}<small>/hr</small></span>
                                        <Plus size={18} color="var(--primary)" />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>

                    {/* Restaurants */}
                    <section>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', marginBottom: '1.5rem' }}>
                            <Utensils className="text-gradient" size={24} />
                            <h2 style={{ fontSize: '1.5rem', margin: 0 }}>Gastronomía</h2>
                        </div>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '1.2rem' }}>
                            {restaurants.map(rest => (
                                <div key={rest.id} className="glass-panel hover-card" 
                                    style={{ padding: '1.5rem', cursor: 'pointer' }}
                                    onClick={() => addService('RESTAURANT', rest, 50)}>
                                    <div style={{ fontWeight: 700, fontSize: '1.1rem', marginBottom: '0.5rem' }}>{rest.name}</div>
                                    <div style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '1rem' }}>{rest.type}</div>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <span style={{ fontWeight: 700, color: 'var(--primary)', fontSize: '1.2rem' }}>$50<small> fee</small></span>
                                        <Plus size={18} color="var(--primary)" />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>

                    {/* Places */}
                    <section>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', marginBottom: '1.5rem' }}>
                            <MapPin className="text-gradient" size={24} />
                            <h2 style={{ fontSize: '1.5rem', margin: 0 }}>Destinos</h2>
                        </div>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '1.2rem' }}>
                            {places.map(place => (
                                <div key={place.id} className="glass-panel hover-card" 
                                    style={{ padding: '1.5rem', cursor: 'pointer' }}
                                    onClick={() => addService('PLACE', place, 20)}>
                                    <div style={{ fontWeight: 700, fontSize: '1.1rem', marginBottom: '0.5rem' }}>{place.name}</div>
                                    <div style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '1rem' }}>{place.category}</div>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <span style={{ fontWeight: 700, color: 'var(--primary)', fontSize: '1.2rem' }}>$20<small> ticket</small></span>
                                        <Plus size={18} color="var(--primary)" />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>
                </div>

                {/* Summary Sidebar */}
                <div style={{ position: 'sticky', top: '100px' }}>
                    <div className="glass-panel" style={{ padding: '2rem', border: '1px solid var(--primary)' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', marginBottom: '2rem' }}>
                            <Receipt size={22} className="text-gradient" />
                            <h2 style={{ fontSize: '1.5rem', margin: 0 }}>Tu Itinerario</h2>
                        </div>
                        
                        <div style={{ minHeight: '150px', marginBottom: '2rem' }}>
                            {selectedServices.length === 0 ? (
                                <div style={{ textAlign: 'center', padding: '2rem 0', color: 'var(--text-muted)' }}>
                                    <p>No has seleccionado servicios aún.</p>
                                </div>
                            ) : (
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                    {selectedServices.map(s => (
                                        <div key={s.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(255,255,255,0.03)', padding: '0.8rem', borderRadius: '12px' }}>
                                            <div style={{ flex: 1 }}>
                                                <div style={{ fontSize: '0.95rem', fontWeight: 600 }}>{s.name}</div>
                                                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{s.serviceType}</div>
                                            </div>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
                                                <span style={{ fontWeight: 700 }}>${s.price}</span>
                                                <button 
                                                    onClick={() => removeService(s.id)} 
                                                    style={{ background: 'rgba(244, 63, 94, 0.1)', color: '#f43f5e', border: 'none', borderRadius: '8px', width: '28px', height: '28px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
                                                >
                                                    <Trash2 size={14} />
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        <div style={{ borderTop: '1px solid var(--border-glass)', paddingTop: '1.5rem', marginBottom: '2rem' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <span style={{ color: 'var(--text-muted)', fontWeight: 500 }}>Inversión Total</span>
                                <span style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--primary)' }}>${total.toFixed(2)}</span>
                            </div>
                        </div>

                        <button
                            className="btn-premium"
                            style={{ width: '100%', padding: '1rem', fontSize: '1.1rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.8rem', opacity: total === 0 ? 0.5 : 1 }}
                            disabled={total === 0}
                        >
                            <ShoppingBag size={20} />
                            Reservar Ahora
                        </button>
                        
                        {total > 0 && (
                            <div style={{ marginTop: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#10b981', fontSize: '0.8rem', justifyContent: 'center' }}>
                                <CheckCircle2 size={14} />
                                Pago Seguro & Confirmación Instantánea
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <style jsx>{`
                .hover-card {
                    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                }
                .hover-card:hover {
                    transform: translateY(-5px);
                    border-color: var(--primary);
                    background: rgba(255, 255, 255, 0.05);
                }
                @media (max-width: 992px) {
                    .mobile-stack {
                        grid-template-columns: 1fr !important;
                    }
                    div[style*="position: sticky"] {
                        position: static !important;
                        margin-top: 2rem;
                    }
                }
            `}</style>
        </div>
    );
}
