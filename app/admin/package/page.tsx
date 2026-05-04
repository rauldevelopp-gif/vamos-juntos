'use client';

import Link from 'next/link';
import { ArrowLeft, Plus, Edit2, Trash2, Calendar } from 'lucide-react';

export default function PackagesPage() {
    // Sample data for the list
    const packages = [
        { id: 1, name: 'Escapada de Lujo - Cancún', status: 'Activo', price: 1200, sales: 45, date: '2025-06-15', image: '/cancun_luxury_resort_1777913412420.png' },
        { id: 2, name: 'Aventura en la Selva', status: 'Borrador', price: 850, sales: 0, date: '2025-07-20', image: '/jungle_adventure_cenote_1777913424869.png' },
        { id: 3, name: 'Tour Gastronómico VIP', status: 'Activo', price: 600, sales: 128, date: '2025-05-10', image: '/vip_gastronomy_tour_1777913439696.png' },
    ];

    return (
        <div style={{ padding: '1rem', maxWidth: '1200px', margin: '0 auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2.5rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <Link href="/admin" className="btn-glass-nav" style={{ width: '40px', height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '12px', textDecoration: 'none', padding: 0 }}>
                        <ArrowLeft size={20} strokeWidth={2} />
                    </Link>
                    <div>
                        <h1 style={{ fontSize: '1.8rem', fontWeight: 800, margin: 0 }} className="text-gradient">
                            Paquetes Turísticos
                        </h1>
                        <p style={{ color: 'var(--text-muted)', margin: '0.5rem 0 0 0' }}>
                            Gestiona y crea nuevas experiencias para tus clientes.
                        </p>
                    </div>
                </div>
                
                <Link href="/admin/build" className="btn-premium" style={{ padding: '0.8rem 1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <Plus size={18} strokeWidth={2.5} />
                    <span className="btn-text-mobile-hide">Nuevo Paquete</span>
                </Link>
            </div>

            <div className="glass-panel" style={{ overflow: 'hidden', borderRadius: '20px' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                    <thead>
                        <tr style={{ background: 'rgba(255,255,255,0.03)', borderBottom: '1px solid var(--border-glass)' }}>
                            <th style={{ padding: '1.2rem', color: 'var(--text-muted)', fontWeight: 600, fontSize: '0.9rem' }}>Nombre del Paquete</th>
                            <th style={{ padding: '1.2rem', color: 'var(--text-muted)', fontWeight: 600, fontSize: '0.9rem' }}>Estado</th>
                            <th style={{ padding: '1.2rem', color: 'var(--text-muted)', fontWeight: 600, fontSize: '0.9rem' }}>Precio Base</th>
                            <th style={{ padding: '1.2rem', color: 'var(--text-muted)', fontWeight: 600, fontSize: '0.9rem' }}>Ventas</th>
                            <th style={{ padding: '1.2rem', color: 'var(--text-muted)', fontWeight: 600, fontSize: '0.9rem' }}>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {packages.map((pkg) => (
                            <tr key={pkg.id} style={{ borderBottom: '1px solid var(--border-glass)', transition: 'var(--transition-smooth)' }} className="hover-row">
                                <td style={{ padding: '1.2rem' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                        <div style={{ width: '50px', height: '50px', borderRadius: '10px', overflow: 'hidden', flexShrink: 0, border: '1px solid var(--border-glass)' }}>
                                            <img src={pkg.image} alt={pkg.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                        </div>
                                        <div>
                                            <div style={{ fontWeight: 600, color: 'var(--text-main)' }}>{pkg.name}</div>
                                            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                                                <Calendar size={12} strokeWidth={2} /> Creado el {pkg.date}
                                            </div>
                                        </div>
                                    </div>
                                </td>
                                <td style={{ padding: '1.2rem' }}>
                                    <span style={{ 
                                        padding: '0.3rem 0.8rem', 
                                        borderRadius: 'var(--radius-full)', 
                                        fontSize: '0.8rem', 
                                        background: pkg.status === 'Activo' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(245, 158, 11, 0.1)',
                                        color: pkg.status === 'Activo' ? '#10b981' : '#f59e0b',
                                        border: `1px solid ${pkg.status === 'Activo' ? 'rgba(16, 185, 129, 0.2)' : 'rgba(245, 158, 11, 0.2)'}`
                                    }}>
                                        {pkg.status}
                                    </span>
                                </td>
                                <td style={{ padding: '1.2rem', fontWeight: 600 }}>${pkg.price}</td>
                                <td style={{ padding: '1.2rem', color: 'var(--text-muted)' }}>{pkg.sales} unid.</td>
                                <td style={{ padding: '1.2rem' }}>
                                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                                        <button className="btn-glass-nav" style={{ padding: '0.5rem', borderRadius: '10px' }} title="Editar">
                                            <Edit2 size={16} strokeWidth={2} />
                                        </button>
                                        <button className="btn-glass-nav" style={{ padding: '0.5rem', borderRadius: '10px', color: 'var(--accent)' }} title="Eliminar">
                                            <Trash2 size={16} strokeWidth={2} />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <style jsx>{`
                .hover-row:hover {
                    background: rgba(255, 255, 255, 0.02);
                }
            `}</style>
        </div>
    );
}
