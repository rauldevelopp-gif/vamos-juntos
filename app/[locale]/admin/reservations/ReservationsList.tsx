'use client';
import { useLanguage } from '@/context/LanguageContext';
import { tr, setLanguage } from '@/lib/tr';
import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { ArrowLeft, Calendar, FileText, CheckCircle2, Search } from 'lucide-react';

interface Reservation {
    id: number;
    customerName: string;
    customerEmail: string;
    customerPhone: string;
    date: string;
    time: string;
    passengers: number;
    status: string;
    totalPrice: number;
    discountCode?: string;
    discountAmount?: number;
    package?: {
        name: string;
    };
}

interface ReservationsListProps {
    reservations: Reservation[];
}

export default function ReservationsList({ reservations }: ReservationsListProps) {
  const { language } = useLanguage();
  setLanguage(language);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('ALL');
    const [dateFilter, setDateFilter] = useState('ALL');

    const getDaysDifference = (dateString: string) => {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const targetDate = new Date(dateString + 'T00:00:00');
        
        const diffTime = targetDate.getTime() - today.getTime();
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return diffDays;
    };

    const getCountdownLabel = (dateString: string) => {
        const days = getDaysDifference(dateString);
        if (days < 0) return { text:tr("Ya pasó"), color: '#ef4444', bg: 'rgba(239, 68, 68, 0.1)' };
        if (days === 0) return { text:tr("Es Hoy"), color: '#10b981', bg: 'rgba(16, 185, 129, 0.1)' };
        if (days === 1) return { text:tr("Mañana"), color: '#f59e0b', bg: 'rgba(245, 158, 11, 0.1)' };
        return { text: `Faltan ${days} días`, color: '#8b5cf6', bg: 'rgba(139, 92, 246, 0.1)' };
    };

    const filteredReservations = useMemo(() => {
        return reservations.filter(res => {
            // Search
            if (searchTerm) {
                const term = searchTerm.toLowerCase();
                const matchName = res.customerName.toLowerCase().includes(term);
                const matchEmail = res.customerEmail.toLowerCase().includes(term);
                const matchPkg = res.package?.name?.toLowerCase().includes(term);
                if (!matchName && !matchEmail && !matchPkg) return false;
            }

            // Status
            if (statusFilter !== 'ALL' && res.status !== statusFilter) {
                return false;
            }

            // Date
            if (dateFilter !== 'ALL') {
                const diffDays = getDaysDifference(res.date);
                if (dateFilter === 'TODAY' && diffDays !== 0) return false;
                if (dateFilter === 'UPCOMING' && diffDays <= 0) return false;
                if (dateFilter === 'PAST' && diffDays > 0) return false;
            }

            return true;
        });
    }, [reservations, searchTerm, statusFilter, dateFilter]);

    return (
        <div style={{ padding: '1rem', maxWidth: '1200px', margin: '0 auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2.5rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <Link href="/admin" className="btn-glass-nav" style={{ width: '40px', height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '12px', textDecoration: 'none', padding: 0 }}>
                        <ArrowLeft size={20} strokeWidth={2} />
                    </Link>
                    <div>
                        <h1 style={{ fontSize: '1.8rem', fontWeight: 800, margin: 0 }} className="text-gradient">
                            {tr("Gestión de Reservas")}
                        </h1>
                        <p style={{ color: 'var(--text-muted)', margin: '0.5rem 0 0 0' }}>
                            {tr("Listado completo de reservaciones y seguimiento de tours.")}
                        </p>
                    </div>
                </div>
                
                <div className="glass-panel" style={{ padding: '0.6rem 1.2rem', borderRadius: '14px', display: 'flex', alignItems: 'center', gap: '0.8rem', border: '1px solid rgba(139, 92, 246, 0.2)' }}>
                    <Calendar size={18} color="var(--primary)" />
                    <span style={{ fontSize: '0.9rem', fontWeight: 700 }}>{filteredReservations.length} Reservas</span>
                </div>
            </div>

            {/* Filter Bar */}
            <div className="filter-bar" style={{ display: 'flex', gap: '1rem', marginBottom: '2rem', flexWrap: 'wrap' }}>
                <div style={{ flex: '1 1 300px', position: 'relative' }}>
                    <Search size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                    <input 
                        type="text" 
                        placeholder={tr("Buscar por cliente, email o paquete...")} 
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        style={{ width: '100%', padding: '0.8rem 1rem 0.8rem 3rem', background: 'rgba(255,255,255,0.02)', border: '1px solid var(--border-glass)', borderRadius: '14px', color: 'white', outline: 'none', transition: 'border-color 0.2s' }}
                        onFocus={(e) => e.target.style.borderColor = 'var(--primary)'}
                        onBlur={(e) => e.target.style.borderColor = 'var(--border-glass)'}
                    />
                </div>
                <div style={{ display: 'flex', gap: '1rem', flex: '1 1 auto' }}>
                    <select 
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        style={{ flex: 1, padding: '0.8rem 1rem', background: 'rgba(255,255,255,0.02)', border: '1px solid var(--border-glass)', borderRadius: '14px', color: 'white', outline: 'none', cursor: 'pointer' }}
                    >
                        <option value="ALL" style={{ background: '#111' }}>{tr("Todos los Estados")}</option>
                        <option value="Confirmado" style={{ background: '#111' }}>Confirmado</option>
                        <option value={tr("Pendiente")} style={{ background: '#111' }}>{tr("Pendiente")}</option>
                        <option value="Cancelado" style={{ background: '#111' }}>Cancelado</option>
                    </select>
                    
                    <select 
                        value={dateFilter}
                        onChange={(e) => setDateFilter(e.target.value)}
                        style={{ flex: 1, padding: '0.8rem 1rem', background: 'rgba(255,255,255,0.02)', border: '1px solid var(--border-glass)', borderRadius: '14px', color: 'white', outline: 'none', cursor: 'pointer' }}
                    >
                        <option value="ALL" style={{ background: '#111' }}>{tr("Todas las Fechas")}</option>
                        <option value="TODAY" style={{ background: '#111' }}>{tr("Es Hoy")}</option>
                        <option value="UPCOMING" style={{ background: '#111' }}>{tr("Próximas")}</option>
                        <option value="PAST" style={{ background: '#111' }}>{tr("Ya Pasaron")}</option>
                    </select>
                </div>
            </div>

            {/* Desktop View */}
            <div className="desktop-only" style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid var(--border-glass)', borderRadius: '24px', overflow: 'hidden', minHeight: '200px' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                    <thead>
                        <tr style={{ background: 'rgba(255,255,255,0.03)', borderBottom: '1px solid var(--border-glass)' }}>
                            <th style={{ padding: '1.2rem', color: 'var(--text-muted)', fontWeight: 600, fontSize: '0.9rem' }}>{tr("Cliente")}</th>
                            <th style={{ padding: '1.2rem', color: 'var(--text-muted)', fontWeight: 600, fontSize: '0.9rem' }}>{tr("Tour / Paquete")}</th>
                            <th style={{ padding: '1.2rem', color: 'var(--text-muted)', fontWeight: 600, fontSize: '0.9rem' }}>{tr("Fecha de Reserva")}</th>
                            <th style={{ padding: '1.2rem', color: 'var(--text-muted)', fontWeight: 600, fontSize: '0.9rem' }}>{tr("Estado")}</th>
                            <th style={{ padding: '1.2rem', color: 'var(--text-muted)', fontWeight: 600, fontSize: '0.9rem' }}>{tr("Monto")}</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredReservations.length === 0 ? (
                            <tr>
                                <td colSpan={5} style={{ padding: '4rem', textAlign: 'center', color: 'var(--text-muted)' }}>
                                    {tr("No se encontraron reservas con esos filtros.")}
                                </td>
                            </tr>
                        ) : (
                            filteredReservations.map((res: Reservation) => {
                                const countdown = getCountdownLabel(res.date);
                                return (
                                    <tr key={res.id} className="hover-row" style={{ borderBottom: '1px solid var(--border-glass)', transition: 'var(--transition-smooth)' }}>
                                        <td style={{ padding: '1.2rem' }}>
                                            <div style={{ fontWeight: 600, color: 'var(--text-main)' }}>{res.customerName}</div>
                                            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{res.customerEmail}</div>
                                            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{res.customerPhone}</div>
                                        </td>
                                        <td style={{ padding: '1.2rem' }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                                <FileText size={14} color="var(--primary)" />
                                                <div style={{ fontWeight: 600 }}>{res.package?.name || '---'}</div>
                                            </div>
                                            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginLeft: '1.5rem' }}>{res.passengers} Pasajeros</div>
                                        </td>
                                        <td style={{ padding: '1.2rem' }}>
                                            <div style={{ fontWeight: 600 }}>{res.date} • {res.time}</div>
                                            <div style={{ display: 'inline-block', padding: '0.2rem 0.6rem', borderRadius: '6px', fontSize: '0.7rem', marginTop: '0.3rem', color: countdown.color, background: countdown.bg, fontWeight: 800 }}>
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
                                            {res.discountCode && (
                                                <div style={{ marginTop: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
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

            {/* Mobile View */}
            <div className="mobile-only">
                {filteredReservations.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '4rem', color: 'var(--text-muted)' }}>
                        {tr("No hay reservas que coincidan.")}
                    </div>
                ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        {filteredReservations.map((res: Reservation) => {
                            const countdown = getCountdownLabel(res.date);
                            return (
                                <div key={res.id} className="reservation-card-mobile" style={{ padding: '1.5rem', borderRadius: '24px', border: '1px solid var(--border-glass)', background: 'rgba(255,255,255,0.05)' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                                        <div>
                                            <div style={{ fontWeight: 800, fontSize: '1.1rem', color: 'white' }}>{res.customerName}</div>
                                            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{res.customerEmail}</div>
                                        </div>
                                        <div style={{ textAlign: 'right' }}>
                                            <div style={{ fontWeight: 800, color: 'white', fontSize: '1.2rem' }}>${res.totalPrice.toLocaleString('en-US')}</div>
                                            <span style={{ padding: '0.2rem 0.6rem', borderRadius: '8px', fontSize: '0.65rem', fontWeight: 800, background: 'rgba(16, 185, 129, 0.1)', color: '#10b981', textTransform: 'uppercase', display: 'inline-block', marginBottom: '0.5rem' }}>
                                                {res.status}
                                            </span>
                                            {res.discountCode && (
                                                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '0.2rem' }}>
                                                    <span style={{ fontSize: '0.6rem', fontWeight: 800, color: '#10b981', textTransform: 'uppercase' }}>
                                                        Cupón: {res.discountCode}
                                                    </span>
                                                    <span style={{ fontSize: '0.7rem', color: '#10b981', fontWeight: 700 }}>
                                                        -${res.discountAmount?.toLocaleString('en-US')}
                                                    </span>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                    <div style={{ background: 'rgba(255,255,255,0.03)', borderRadius: '16px', padding: '1rem', marginBottom: '1rem' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.4rem' }}>
                                            <FileText size={14} color="var(--primary)" />
                                            <div style={{ fontWeight: 700, fontSize: '0.9rem' }}>{res.package?.name || '---'}</div>
                                        </div>
                                        <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{res.passengers} Pasajeros</div>
                                    </div>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <div style={{ fontSize: '0.9rem', fontWeight: 600 }}>{res.date} • {res.time}</div>
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
                .hover-row:hover { background: rgba(255, 255, 255, 0.02); }
            `}</style>
        </div>
    );
}
