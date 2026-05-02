"use client";
import { useState, useEffect } from "react";

export default function PackageBuilder() {
    const [taxis, setTaxis] = useState<any[]>([]);
    const [yachts, setYachts] = useState<any[]>([]);
    const [places, setPlaces] = useState<any[]>([]);
    const [restaurants, setRestaurants] = useState<any[]>([]);

    const [selectedServices, setSelectedServices] = useState<any[]>([]);

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

    const addService = (type: string, item: any, price: number) => {
        setSelectedServices(prev => [...prev, {
            id: Math.random().toString(36).substr(2, 9),
            serviceType: type,
            itemId: item.id,
            name: item.name || item.type,
            price: price
        }]);
    };

    const removeService = (id: string) => {
        setSelectedServices(prev => prev.filter(s => s.id !== id));
    };

    const total = selectedServices.reduce((sum, s) => sum + s.price, 0);

    return (
        <div className="container" style={{ display: 'grid', gridTemplateColumns: '1fr 350px', gap: '3rem', alignItems: 'start' }}>
            <div>
                <h1 className="heading-1">Build Your Dynamic Package</h1>
                <p style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>
                    Select the services to include in your personalized trip. Click to add.
                </p>

                <section style={{ marginBottom: '3rem' }}>
                    <h2 className="heading-2">Transportation (Taxis)</h2>
                    <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                        {taxis.map(taxi => (
                            <div key={taxi.id} style={{ padding: '1rem', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)', cursor: 'pointer' }}
                                onClick={() => addService('TAXI', taxi, taxi.basePrice)}>
                                <strong>{taxi.type}</strong>
                                <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Capacity: {taxi.capacity}</p>
                                <p style={{ color: 'var(--primary-color)', fontWeight: 600 }}>${taxi.basePrice}</p>
                            </div>
                        ))}
                    </div>
                </section>

                <section style={{ marginBottom: '3rem' }}>
                    <h2 className="heading-2">Yachts</h2>
                    <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                        {yachts.map(yacht => (
                            <div key={yacht.id} style={{ padding: '1rem', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)', cursor: 'pointer' }}
                                onClick={() => addService('YACHT', yacht, yacht.hourlyPrice)}>
                                <strong>{yacht.name}</strong>
                                <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Capacity: {yacht.capacity}</p>
                                <p style={{ color: 'var(--primary-color)', fontWeight: 600 }}>${yacht.hourlyPrice} / hr</p>
                            </div>
                        ))}
                    </div>
                </section>

                <section style={{ marginBottom: '3rem' }}>
                    <h2 className="heading-2">Restaurants</h2>
                    <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                        {restaurants.map(rest => (
                            <div key={rest.id} style={{ padding: '1rem', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)', cursor: 'pointer' }}
                                onClick={() => addService('RESTAURANT', rest, 50)}> {/* assumed static reservation fee */}
                                <strong>{rest.name}</strong>
                                <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>{rest.type}</p>
                                <p style={{ color: 'var(--primary-color)', fontWeight: 600 }}>+ $50 Fee</p>
                            </div>
                        ))}
                    </div>
                </section>

                <section style={{ marginBottom: '3rem' }}>
                    <h2 className="heading-2">Tourist Places</h2>
                    <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                        {places.map(place => (
                            <div key={place.id} style={{ padding: '1rem', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)', cursor: 'pointer' }}
                                onClick={() => addService('PLACE', place, 20)}> {/* assumed static entrance fee */}
                                <strong>{place.name}</strong>
                                <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>{place.category}</p>
                                <p style={{ color: 'var(--primary-color)', fontWeight: 600 }}>+ $20 Ticket</p>
                            </div>
                        ))}
                    </div>
                </section>
            </div>

            <div style={{ position: 'sticky', top: '100px', background: 'var(--bg-card)', padding: '2rem', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-color)', boxShadow: 'var(--shadow-md)' }}>
                <h2 className="heading-2" style={{ fontSize: '1.5rem', marginBottom: '1.5rem' }}>Your Summary</h2>
                <div style={{ color: 'var(--text-muted)', marginBottom: '2rem', minHeight: '150px' }}>
                    {selectedServices.length === 0 && <p>No services selected yet.</p>}
                    {selectedServices.map(s => (
                        <div key={s.id} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', alignItems: 'center' }}>
                            <div>
                                <strong style={{ fontSize: '0.9rem', color: 'var(--text-main)', display: 'block' }}>{s.name}</strong>
                                <span style={{ fontSize: '0.8rem' }}>{s.serviceType}</span>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                <span style={{ fontWeight: 500 }}>${s.price}</span>
                                <button onClick={() => removeService(s.id)} style={{ background: 'red', color: 'white', border: 'none', borderRadius: '50%', width: '20px', height: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>&times;</button>
                            </div>
                        </div>
                    ))}
                </div>
                <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                    <span style={{ fontWeight: 600 }}>Total</span>
                    <span style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--primary-color)' }}>${total.toFixed(2)}</span>
                </div>
                <button
                    className="btn-primary"
                    style={{ width: '100%', padding: '1rem', fontSize: '1.1rem', opacity: total === 0 ? 0.5 : 1 }}
                    disabled={total === 0}
                >
                    Proceed to Checkout
                </button>
            </div>
        </div>
    );
}
