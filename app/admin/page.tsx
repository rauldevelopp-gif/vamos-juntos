'use client';

import React, { useState, useEffect } from 'react';
import { 
    getEffectiveReservations, 
    getMonthlyRevenue, 
    getDriverRankings, 
    getPopularDestinations, 
    getAvailabilityStats 
} from './reports/actions';
import { Loader2, DollarSign, TrendingUp, Users, MapPin, Anchor, Car } from 'lucide-react';

export default function AdminDashboard() {
    const [loading, setLoading] = useState(true);
    const [selectedReport, setSelectedReport] = useState<string | null>(null);
    
    const [metrics, setMetrics] = useState({
        effectiveReservations: 0,
        totalRevenue: 0,
        monthlyRevenueData: [] as any[],
        driverRankings: [] as any[],
        popularDestinations: [] as any[],
        drivers: { data: [] as any[], total: 0, available: 0 },
        yachts: { data: [] as any[], total: 0, available: 0 }
    });

    useEffect(() => {
        const fetchMetrics = async () => {
            setLoading(true);
            try {
                const [resEff, resRev, resRank, resDest, resAvail] = await Promise.all([
                    getEffectiveReservations(),
                    getMonthlyRevenue(),
                    getDriverRankings(),
                    getPopularDestinations(),
                    getAvailabilityStats()
                ]);

                let totalRev = 0;
                if (resRev.success && resRev.data) {
                    totalRev = resRev.data.reduce((sum: number, item: any) => sum + item.Ingresos, 0);
                }

                setMetrics({
                    effectiveReservations: resEff.success ? resEff.count : 0,
                    totalRevenue: totalRev,
                    monthlyRevenueData: resRev.success ? resRev.data : [],
                    driverRankings: resRank.success ? resRank.data : [],
                    popularDestinations: resDest.success ? resDest.data : [],
                    drivers: resAvail.success && resAvail.drivers ? resAvail.drivers : { data: [], total: 0, available: 0 },
                    yachts: resAvail.success && resAvail.yachts ? resAvail.yachts : { data: [], total: 0, available: 0 }
                });
            } catch (e) {
                console.error("Error fetching metrics", e);
            }
            setLoading(false);
        };
        fetchMetrics();
    }, []);

    const renderCustomBarChart = (data: any[], dataKey: string, nameKey: string, color: string, title: string) => {
        if (!data || data.length === 0) return <div style={{ color: 'var(--text-muted)' }}>No hay datos suficientes</div>;
        
        const maxValue = Math.max(...data.map(d => d[dataKey] || 0), 1);
        
        return (
            <div style={{ width: '100%', height: '100%' }}>
                <h3 style={{ marginBottom: '2rem', color }}>{title}</h3>
                <div style={{ display: 'flex', alignItems: 'flex-end', height: '300px', gap: '1rem', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                    {data.map((item, idx) => {
                        const heightPct = Math.max((item[dataKey] / maxValue) * 100, 5); 
                        return (
                            <div key={idx} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', height: '100%', justifyContent: 'flex-end' }}>
                                <div style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.7)', marginBottom: '0.5rem' }}>
                                    {typeof item[dataKey] === 'number' && item[dataKey] > 1000 ? '$' + item[dataKey].toLocaleString() : item[dataKey]}
                                </div>
                                <div style={{ 
                                    width: '100%', 
                                    height: `${heightPct}%`, 
                                    backgroundColor: color, 
                                    borderRadius: '4px 4px 0 0',
                                    transition: 'height 1s ease-out'
                                }}></div>
                                <div style={{ fontSize: '0.75rem', marginTop: '0.5rem', color: 'var(--text-muted)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '100%', textAlign: 'center' }}>
                                    {item[nameKey]}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        );
    };

    const renderCustomPieChart = (data: any[], title: string, colorTitle: string) => {
        if (!data || data.length === 0) return null;
        
        const total = data.reduce((sum, item) => sum + item.value, 0);
        let currentAngle = 0;
        
        const conicStops = data.map(item => {
            const percentage = (item.value / total) * 100;
            const stop = `${item.fill} ${currentAngle}% ${currentAngle + percentage}%`;
            currentAngle += percentage;
            return stop;
        }).join(', ');

        return (
            <div style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <h3 style={{ marginBottom: '2rem', color: colorTitle }}>{title}</h3>
                
                <div style={{
                    width: '200px',
                    height: '200px',
                    borderRadius: '50%',
                    background: `conic-gradient(${conicStops})`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginBottom: '2rem',
                    boxShadow: '0 0 20px rgba(0,0,0,0.5)'
                }}>
                    <div style={{ width: '120px', height: '120px', backgroundColor: 'var(--bg-card)', borderRadius: '50%' }}></div>
                </div>

                <div style={{ display: 'flex', gap: '2rem' }}>
                    {data.map((item, idx) => (
                        <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <div style={{ width: '15px', height: '15px', backgroundColor: item.fill, borderRadius: '3px' }}></div>
                            <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>{item.name}: <strong style={{ color: 'white' }}>{item.value}</strong></span>
                        </div>
                    ))}
                </div>
            </div>
        );
    };

    const renderChart = () => {
        if (!selectedReport) return (
            <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-muted)' }}>
                Selecciona una métrica arriba para ver el reporte detallado
            </div>
        );

        switch (selectedReport) {
            case 'revenue':
                return renderCustomBarChart(metrics.monthlyRevenueData, 'Ingresos', 'name', '#10b981', 'Ingresos Mensuales Generados');
            case 'reservations':
                return renderCustomBarChart(metrics.monthlyRevenueData, 'Ingresos', 'name', '#8b5cf6', 'Evolución de Ingresos y Reservas');
            case 'drivers_rank':
                return renderCustomBarChart(metrics.driverRankings.slice(0, 5), 'Puntuacion', 'name', '#f59e0b', 'Top 5 Conductores por Puntuación');
            case 'destinations':
                return renderCustomBarChart(metrics.popularDestinations.slice(0, 5), 'Selecciones', 'name', '#3b82f6', 'Top 5 Destinos Más Seleccionados');
            case 'drivers_avail':
                return renderCustomPieChart(metrics.drivers.data, 'Proporción de Conductores', '#ec4899');
            case 'yachts_avail':
                return renderCustomPieChart(metrics.yachts.data, 'Proporción de Yates', '#06b6d4');
            default:
                return null;
        }
    };

    if (loading) {
        return (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh' }}>
                <Loader2 size={40} className="animate-spin" style={{ color: 'var(--primary)' }} />
            </div>
        );
    }

    return (
        <div>
            <header style={{ marginBottom: '3rem' }}>
                <h1 className="heading-1">Panel de Control (Reportes)</h1>
                <p style={{ color: 'var(--text-muted)' }}>Bienvenido, Administrador. Haz clic en las tarjetas para ver los gráficos detallados.</p>
            </header>

            <div className="dashboard-stats-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))' }}>
                {/* 1. Reservas Efectivas */}
                <div 
                    className="glass-card" 
                    style={{ padding: '1.5rem', cursor: 'pointer', border: selectedReport === 'reservations' ? '2px solid #8b5cf6' : '' }}
                    onClick={() => setSelectedReport('reservations')}
                >
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>Reservas Efectivas</p>
                        <TrendingUp size={18} color="#8b5cf6" />
                    </div>
                    <div style={{ fontSize: '2rem', fontWeight: 700, margin: '0.5rem 0' }}>{metrics.effectiveReservations}</div>
                    <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Ver gráfico</span>
                </div>

                {/* 2. Ingresos Mensuales */}
                <div 
                    className="glass-card" 
                    style={{ padding: '1.5rem', cursor: 'pointer', border: selectedReport === 'revenue' ? '2px solid #10b981' : '' }}
                    onClick={() => setSelectedReport('revenue')}
                >
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>Ingresos Generados</p>
                        <DollarSign size={18} color="#10b981" />
                    </div>
                    <div style={{ fontSize: '2rem', fontWeight: 700, margin: '0.5rem 0' }}>${metrics.totalRevenue.toLocaleString()}</div>
                    <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Ver gráfico</span>
                </div>

                {/* 3. Ranking Conductores */}
                <div 
                    className="glass-card" 
                    style={{ padding: '1.5rem', cursor: 'pointer', border: selectedReport === 'drivers_rank' ? '2px solid #f59e0b' : '' }}
                    onClick={() => setSelectedReport('drivers_rank')}
                >
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>Ranking Conductores</p>
                        <Users size={18} color="#f59e0b" />
                    </div>
                    <div style={{ fontSize: '2rem', fontWeight: 700, margin: '0.5rem 0' }}>{metrics.driverRankings.length > 0 ? metrics.driverRankings[0].Puntuacion : 0} ⭐</div>
                    <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Top Actual: {metrics.driverRankings.length > 0 ? metrics.driverRankings[0].name : 'N/A'}</span>
                </div>

                {/* 4. Destinos Populares */}
                <div 
                    className="glass-card" 
                    style={{ padding: '1.5rem', cursor: 'pointer', border: selectedReport === 'destinations' ? '2px solid #3b82f6' : '' }}
                    onClick={() => setSelectedReport('destinations')}
                >
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>Destino Top</p>
                        <MapPin size={18} color="#3b82f6" />
                    </div>
                    <div style={{ fontSize: '1.2rem', fontWeight: 700, margin: '1rem 0' }}>
                        {metrics.popularDestinations.length > 0 ? metrics.popularDestinations[0].name : 'Sin datos'}
                    </div>
                    <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Ver gráfico</span>
                </div>

                {/* 5. Disponibilidad Conductores */}
                <div 
                    className="glass-card" 
                    style={{ padding: '1.5rem', cursor: 'pointer', border: selectedReport === 'drivers_avail' ? '2px solid #ec4899' : '' }}
                    onClick={() => setSelectedReport('drivers_avail')}
                >
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>Conductores Disponibles</p>
                        <Car size={18} color="#ec4899" />
                    </div>
                    <div style={{ fontSize: '2rem', fontWeight: 700, margin: '0.5rem 0' }}>{metrics.drivers.available} / {metrics.drivers.total}</div>
                    <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Ver gráfico</span>
                </div>

                {/* 6. Disponibilidad Yates */}
                <div 
                    className="glass-card" 
                    style={{ padding: '1.5rem', cursor: 'pointer', border: selectedReport === 'yachts_avail' ? '2px solid #06b6d4' : '' }}
                    onClick={() => setSelectedReport('yachts_avail')}
                >
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>Yates Disponibles</p>
                        <Anchor size={18} color="#06b6d4" />
                    </div>
                    <div style={{ fontSize: '2rem', fontWeight: 700, margin: '0.5rem 0' }}>{metrics.yachts.available} / {metrics.yachts.total}</div>
                    <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Ver gráfico</span>
                </div>
            </div>

            <section style={{ marginTop: '3rem' }}>
                <div className="glass-panel" style={{ padding: '2rem', minHeight: '400px' }}>
                    {renderChart()}
                </div>
            </section>
        </div>
    );
}
