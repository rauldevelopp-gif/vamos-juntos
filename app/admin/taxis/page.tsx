"use client";
import { useState, useEffect } from "react";
import Link from "next/link";

export default function AdminTaxis() {
    const [taxis, setTaxis] = useState<any[]>([]);
    const [formData, setFormData] = useState({ type: '', capacity: 4, basePrice: 50, driverId: 1 });

    useEffect(() => {
        fetch('/api/taxis').then(res => res.json()).then(data => {
            setTaxis(Array.isArray(data) ? data : []);
        });
    }, []);

    const handleSubmit = async (e: any) => {
        e.preventDefault();
        const res = await fetch('/api/taxis', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(formData)
        });
        if (res.ok) {
            const newTaxi = await res.json();
            setTaxis(prev => [...prev, newTaxi]);
            setFormData({ type: '', capacity: 4, basePrice: 50, driverId: 1 });
        }
    };

    return (
        <div className="container">
            <Link href="/admin" style={{ color: 'var(--primary-color)', marginBottom: '2rem', display: 'inline-block' }}>&larr; Back to Dashboard</Link>
            <h1 className="heading-1">Manage Taxis</h1>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4rem', marginTop: '2rem' }}>
                <div>
                    <h2 className="heading-2">Current Taxis</h2>
                    {taxis.length === 0 && <p style={{ color: 'var(--text-muted)' }}>No taxis found.</p>}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        {taxis.map(taxi => (
                            <div key={taxi.id} style={{ background: 'var(--bg-card)', padding: '1.5rem', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-color)' }}>
                                <h3>{taxi.type}</h3>
                                <p>Capacity: {taxi.capacity} | Price: ${taxi.basePrice}</p>
                                {taxi.driver && <p style={{ color: 'var(--text-muted)' }}>Driver: {taxi.driver.name}</p>}
                            </div>
                        ))}
                    </div>
                </div>

                <div>
                    <h2 className="heading-2">Add New Taxi</h2>
                    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', background: 'var(--bg-card)', padding: '2rem', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-color)' }}>
                        <div>
                            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>Taxi Type</label>
                            <input type="text" value={formData.type} onChange={e => setFormData({ ...formData, type: e.target.value })} style={{ width: '100%', padding: '0.8rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }} required />
                        </div>
                        <div style={{ display: 'flex', gap: '1rem' }}>
                            <div style={{ flex: 1 }}>
                                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>Capacity</label>
                                <input type="number" min="1" value={formData.capacity} onChange={e => setFormData({ ...formData, capacity: parseInt(e.target.value) })} style={{ width: '100%', padding: '0.8rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }} required />
                            </div>
                            <div style={{ flex: 1 }}>
                                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>Base Price ($)</label>
                                <input type="number" step="0.01" value={formData.basePrice} onChange={e => setFormData({ ...formData, basePrice: parseFloat(e.target.value) })} style={{ width: '100%', padding: '0.8rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }} required />
                            </div>
                        </div>
                        <div>
                            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>Driver ID (Testing)</label>
                            <input type="number" value={formData.driverId} onChange={e => setFormData({ ...formData, driverId: parseInt(e.target.value) })} style={{ width: '100%', padding: '0.8rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }} required />
                        </div>
                        <button type="submit" className="btn-primary" style={{ marginTop: '1rem' }}>Add Taxi</button>
                    </form>
                </div>
            </div>
        </div>
    );
}
