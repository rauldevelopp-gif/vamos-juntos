'use client';
import { useLanguage } from '@/context/LanguageContext';
import { tr, setLanguage } from '@/lib/tr';
import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { ArrowLeft, Calendar, BedDouble, CheckCircle2, Search, Clock, Users } from 'lucide-react';

interface HotelReservation {
    id: number;
    customerName: string;
    customerEmail: string;
    customerPhone: string;
    checkInDate: string;
    checkOutDate: string;
    guests: number;
    status: string;
    totalPrice: number;
    discountCode?: string | null;
    discountAmount?: number | null;
    createdAt: Date;
    hotel?: { name: string; city: string };
    room?: { type: string };
}

interface Props {
    reservations: HotelReservation[];
}

export default function HotelReservationsList({ reservations }: Props) {
  const { language } = useLanguage();
  setLanguage(language);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('ALL');
    const [dateFilter, setDateFilter] = useState('ALL');

    const getDaysDifference = (dateString: string) => {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const target = new Date(dateString + 'T00:00:00');
        return Math.ceil((target.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    };

    const getNights = (checkIn: string, checkOut: string) => {
        const a = new Date(checkIn + 'T00:00:00');
        const b = new Date(checkOut + 'T00:00:00');
        return Math.max(1, Math.ceil((b.getTime() - a.getTime()) / (1000 * 60 * 60 * 24)));
    };

    const getCountdownLabel = (dateString: string) => {
        const days = getDaysDifference(dateString);
        if (days < 0) return { text:tr("Ya pasó"), color: '#ef4444', bg: 'rgba(239, 68, 68, 0.1)' };
        if (days === 0) return { text: 'Hoy', color: '#10b981', bg: 'rgba(16, 185, 129, 0.1)' };
        if (days === 1) return { text:tr("Mañana"), color: '#f59e0b', bg: 'rgba(245, 158, 11, 0.1)' };
        return { text: `Faltan ${days} días`, color: '#8b5cf6', bg: 'rgba(139, 92, 246, 0.1)' };
    };

    const filtered = useMemo(() => {
        return reservations.filter(res => {
            if (searchTerm) {
                const term = searchTerm.toLowerCase();
                if (
                    !res.customerName.toLowerCase().includes(term) &&
                    !res.customerEmail.toLowerCase().includes(term) &&
                    !res.hotel?.name?.toLowerCase().includes(term)
                ) return false;
            }
            if (statusFilter !== 'ALL' && res.status !== statusFilter) return false;
            if (dateFilter !== 'ALL') {
                const diff = getDaysDifference(res.checkInDate);
                if (dateFilter === 'TODAY' && diff !== 0) return false;
                if (dateFilter === 'UPCOMING' && diff <= 0) return false;
                if (dateFilter === 'PAST' && diff > 0) return false;
            }
            return true;
        });
    }, [reservations, searchTerm, statusFilter, dateFilter]);

    const totalRevenue = filtered.reduce((sum, r) => sum + r.totalPrice, 0);

    return (
        <div style={{ padding: '1rem', maxWidth: '1200px', margin: '0 auto' }}>
            {/* Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2.5rem', flexWrap: 'wrap', gap: '1rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <Link href="/admin" className="btn-glass-nav" style={{ width: '40px', height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '12px', textDecoration: 'none', padding: 0 }}>
                        <ArrowLeft size={20} strokeWidth={2} />
                    </Link>
                    <div>
                        <h1 style={{ fontSize: '1.8rem', fontWeight: 800, margin: 0 }} className="text-gradient">{tr("Reservas de Hoteles")}</h1>
                        <p style={{ color: 'var(--text-muted)', margin: '0.5rem 0 0 0' }}>{tr("Gestión de todas las reservaciones de hospedaje.")}</p>
                    </div>
                </div>

                <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                    <div className="glass-panel" style={{ padding: '0.6rem 1.2rem', borderRadius: '14px', display: 'flex', alignItems: 'center', gap: '0.8rem', border: '1px solid rgba(139, 92, 246, 0.2)' }}>
                        <BedDouble size={18} color="var(--primary)" />
                        <span style={{ fontSize: '0.9rem', fontWeight: 700 }}>{filtered.length} Reservas</span>
                    </div>
                    <div className="glass-panel" style={{ padding: '0.6rem 1.2rem', borderRadius: '14px', display: 'flex', alignItems: 'center', gap: '0.8rem', border: '1px solid rgba(16, 185, 129, 0.2)' }}>
                        <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#10b981' }}>
                            ${totalRevenue.toLocaleString('en-US')} USD
                        </span>
                    </div>
                </div>
            </div>

            {/* Filter Bar */}
            <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem', flexWrap: 'wrap' }}>
                <div style={{ flex: '1 1 300px', position: 'relative' }}>
                    <Search size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                    <input
                        type="text"
                        placeholder="Buscar por cliente, email u hotel..."
                        value={searchTerm}
                        onChange={e => setSearchTerm(e.target.value)}
                        style={{ width: '100%', padding: '0.8rem 1rem 0.8rem 3rem', background: 'rgba(255,255,255,0.02)', border: '1px solid var(--border-glass)', borderRadius: '14px', color: 'white', outline: 'none' }}
                        onFocus={e => (e.target.style.borderColor = 'var(--primary)')}
                        onBlur={e => (e.target.style.borderColor = 'var(--border-glass)')}
                    />
                </div>
                <div style={{ display: 'flex', gap: '1rem', flex: '1 1 auto' }}>
                    <select
                        value={statusFilter}
                        onChange={e => setStatusFilter(e.target.value)}
                        style={{ flex: 1, padding: '0.8rem 1rem', background: 'rgba(255,255,255,0.02)', border: '1px solid var(--border-glass)', borderRadius: '14px', color: 'white', outline: 'none', cursor: 'pointer' }}
                    >
                        <option value="ALL" style={{ background: '#111' }}>{tr("Todos los Estados")}</option>
                        <option value="Confirmado" style={{ background: '#111' }}>Confirmado</option>
                        <option value={tr("Pendiente")} style={{ background: '#111' }}>{tr("Pendiente")}</option>
                        <option value="Cancelado" style={{ background: '#111' }}>Cancelado</option>
                    </select>
                    <select
                        value={dateFilter}
                        onChange={e => setDateFilter(e.target.value)}
                        style={{ flex: 1, padding: '0.8rem 1rem', background: 'rgba(255,255,255,0.02)', border: '1px solid var(--border-glass)', borderRadius: '14px', color: 'white', outline: 'none', cursor: 'pointer' }}
                    >
                        <option value="ALL" style={{ background: '#111' }}>{tr("Todas las Fechas")}</option>
                        <option value="TODAY" style={{ background: '#111' }}>Check-in Hoy</option>
                        <option value="UPCOMING" style={{ background: '#111' }}>{tr("Próximas")}</option>
                        <option value="PAST" style={{ background: '#111' }}>{tr("Ya Pasaron")}</option>
                    </select>
                </div>
            </div>

            {/* Desktop Table */}
            <div className="desktop-only" style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid var(--border-glass)', borderRadius: '24px', overflow: 'hidden', minHeight: '200px' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                    <thead>
                        <tr style={{ background: 'rgba(255,255,255,0.03)', borderBottom: '1px solid var(--border-glass)' }}>
                            <th style={{ padding: '1.2rem', color: 'var(--text-muted)', fontWeight: 600, fontSize: '0.9rem' }}>{tr("Cliente")}</th>
                            <th style={{ padding: '1.2rem', color: 'var(--text-muted)', fontWeight: 600, fontSize: '0.9rem' }}>Hotel / Habitación</th>
                            <th style={{ padding: '1.2rem', color: 'var(--text-muted)', fontWeight: 600, fontSize: '0.9rem' }}>Check-in / Check-out</th>
                            <th style={{ padding: '1.2rem', color: 'var(--text-muted)', fontWeight: 600, fontSize: '0.9rem' }}>{tr("Estado")}</th>
                            <th style={{ padding: '1.2rem', color: 'var(--text-muted)', fontWeight: 600, fontSize: '0.9rem' }}>{tr("Monto")}</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filtered.length === 0 ? (
                            <tr>
                                <td colSpan={5} style={{ padding: '4rem', textAlign: 'center', color: 'var(--text-muted)' }}>
                                    {tr("No se encontraron reservas con esos filtros.")}
                                </td>
                            </tr>
                        ) : (
                            filtered.map(res => {
                                const countdown = getCountdownLabel(res.checkInDate);
                                const nights = getNights(res.checkInDate, res.checkOutDate);
                                return (
                                    <tr key={res.id} className="hover-row" style={{ borderBottom: '1px solid var(--border-glass)' }}>
                                        <td style={{ padding: '1.2rem' }}>
                                            <div style={{ fontWeight: 600, color: 'var(--text-main)' }}>{res.customerName}</div>
                                            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{res.customerEmail}</div>
                                            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{res.customerPhone}</div>
                                        </td>
                                        <td style={{ padding: '1.2rem' }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                                <BedDouble size={14} color="var(--primary)" />
                                                <div style={{ fontWeight: 600 }}>{res.hotel?.name || '---'}</div>
                                            </div>
                                            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginLeft: '1.5rem' }}>{res.room?.type || '---'}</div>
                                            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginLeft: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.3rem', marginTop: '0.2rem' }}>
                                                <Users size={11} /> {res.guests} huéspedes · {nights} {nights === 1 ? 'noche' : 'noches'}
                                            </div>
                                        </td>
                                        <td style={{ padding: '1.2rem' }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontWeight: 600 }}>
                                                <Clock size={13} color="#10b981" /> {res.checkInDate}
                                            </div>
                                            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', margin: '0.2rem 0 0.3rem 1.2rem' }}>→ {res.checkOutDate}</div>
                                            <div style={{ display: 'inline-block', padding: '0.2rem 0.6rem', borderRadius: '6px', fontSize: '0.7rem', color: countdown.color, background: countdown.bg, fontWeight: 800, marginLeft: '1.2rem' }}>
                                                {countdown.text}
                                            </div>
                                        </td>
                                        <td style={{ padding: '1.2rem' }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                                                <CheckCircle2 size={14} color="#10b981" />
                                                <span style={{ padding: '0.3rem 0.7rem', borderRadius: '20px', background: 'rgba(16, 185, 129, 0.1)', color: '#10b981', fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase' }}>
                                                    {res.status}
                                                </span>
                                            </div>
                                        </td>
                                        <td style={{ padding: '1.2rem' }}>
                                            <div style={{ fontWeight: 800, fontSize: '1.1rem', color: 'white' }}>
                                                ${res.totalPrice.toLocaleString('en-US')} <span style={{ fontSize: '0.7rem', opacity: 0.5 }}>USD</span>
                                            </div>
                                            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
                                                Folio #{res.id.toString().padStart(5, '0')}
                                            </div>
                                            {res.discountCode && (
                                                <div style={{ marginTop: '0.4rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                                                    <span style={{ fontSize: '0.65rem', fontWeight: 800, color: '#10b981', background: 'rgba(16, 185, 129, 0.1)', padding: '0.2rem 0.5rem', borderRadius: '6px', textTransform: 'uppercase' }}>
                                                        Cupón: {res.discountCode}
                                                    </span>
                                                    <span style={{ fontSize: '0.7rem', color: '#10b981', fontWeight: 700 }}>
                                                        -${res.discountAmount?.toLocaleString('en-US')}
                                                    </span>
                                                </div>
                                            )}
                                        </td>
                                    </tr>
                                );
                            })
                        )}
                    </tbody>
                </table>
            </div>

            {/* Mobile Cards */}
            <div className="mobile-only">
                {filtered.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '4rem', color: 'var(--text-muted)' }}>
                        {tr("No hay reservas que coincidan.")}
                    </div>
                ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        {filtered.map(res => {
                            const countdown = getCountdownLabel(res.checkInDate);
                            const nights = getNights(res.checkInDate, res.checkOutDate);
                            return (
                                <div key={res.id} style={{ padding: '1.5rem', borderRadius: '24px', border: '1px solid var(--border-glass)', background: 'rgba(255,255,255,0.05)' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                                        <div>
                                            <div style={{ fontWeight: 800, fontSize: '1.1rem', color: 'white' }}>{res.customerName}</div>
                                            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{res.customerEmail}</div>
                                        </div>
                                        <div style={{ textAlign: 'right' }}>
                                            <div style={{ fontWeight: 800, color: 'white', fontSize: '1.2rem' }}>${res.totalPrice.toLocaleString('en-US')}</div>
                                            <span style={{ padding: '0.2rem 0.6rem', borderRadius: '8px', fontSize: '0.65rem', fontWeight: 800, background: 'rgba(16, 185, 129, 0.1)', color: '#10b981', textTransform: 'uppercase', display: 'inline-block' }}>
                                                {res.status}
                                            </span>
                                        </div>
                                    </div>
                                    <div style={{ background: 'rgba(255,255,255,0.03)', borderRadius: '16px', padding: '1rem', marginBottom: '1rem' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.4rem' }}>
                                            <BedDouble size={14} color="var(--primary)" />
                                            <div style={{ fontWeight: 700, fontSize: '0.9rem' }}>{res.hotel?.name || '---'} · {res.room?.type || '---'}</div>
                                        </div>
                                        <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{res.guests} huéspedes · {nights} {nights === 1 ? 'noche' : 'noches'}</div>
                                    </div>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <div style={{ fontSize: '0.85rem', fontWeight: 600 }}>{res.checkInDate} → {res.checkOutDate}</div>
                                        <div style={{ padding: '0.3rem 0.7rem', borderRadius: '8px', fontSize: '0.7rem', color: countdown.color, background: countdown.bg, fontWeight: 800 }}>
                                            {countdown.text}
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>

            <style jsx>{`
                @media (max-width: 768px) {
                    .desktop-only { display: none !important; }
                    .mobile-only { display: block !important; }
                }
                @media (min-width: 769px) {
                    .desktop-only { display: block !important; }
                    .mobile-only { display: none !important; }
                }
                .hover-row:hover { background: rgba(255,255,255,0.02); }
            `}</style>
        </div>
    );
}
