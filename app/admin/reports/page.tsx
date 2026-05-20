'use client';

import React, { useState, useEffect } from 'react';
import { 
    getEffectiveReservations, 
    getMonthlyRevenue, 
    getDriverRankings, 
    getPopularDestinations, 
    getAvailabilityStats,
    getRevenueDetailsByMonth,
    getYachtsDetails
} from './actions';
import { Loader2, DollarSign, TrendingUp, Users, MapPin, Anchor, Car, X } from 'lucide-react';

interface PieChartData {
    name: string;
    value: number;
    fill: string;
}

interface RevenueData { name: string; Ingresos: number; }
interface DriverRanking { name: string; Puntuacion: number; }
interface DestinationData { name: string; Selecciones: number; }
interface DetailedRevenue { dateStr: string; Reservas: number; Paquetes: number; isEstimate: boolean; }
interface DetailedYacht { name: string; capacity: number; location: string; price_day: number; }

export default function ReportsDashboard() {
    const [loading, setLoading] = useState(true);
    const [selectedReport, setSelectedReport] = useState<string | null>(null);
    const [selectedDetail, setSelectedDetail] = useState<{ title: string, subtitle: string, value: string | number } | null>(null);
    const [detailedRevenueData, setDetailedRevenueData] = useState<DetailedRevenue[] | null>(null);
    const [detailedYachtsData, setDetailedYachtsData] = useState<DetailedYacht[] | null>(null);
    const [detailLoading, setDetailLoading] = useState(false);
    const [metrics, setMetrics] = useState({
        effectiveReservations: 0,
        totalRevenue: 0,
        monthlyRevenueData: [] as RevenueData[],
        driverRankings: [] as DriverRanking[],
        popularDestinations: [] as DestinationData[],
        drivers: { data: [] as PieChartData[], total: 0, available: 0 },
        yachts: { data: [] as PieChartData[], total: 0, available: 0 }
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
                    totalRev = resRev.data.reduce((sum: number, item: RevenueData) => sum + item.Ingresos, 0);
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

    const handleChartClick = async (title: string, subtitle: string, value: string | number) => {
        setSelectedDetail({ title, subtitle, value });
        setDetailedRevenueData(null);
        setDetailedYachtsData(null);
        if (title === 'Ingresos') {
            setDetailLoading(true);
            const res = await getRevenueDetailsByMonth(subtitle);
            if (res.success) {
                setDetailedRevenueData(res.data);
            }
            setDetailLoading(false);
        } else if (title === 'Proporción de Yates') {
            setDetailLoading(true);
            const isAvailable = subtitle === 'Disponibles';
            const res = await getYachtsDetails(isAvailable);
            if (res.success) {
                setDetailedYachtsData(res.data);
            }
            setDetailLoading(false);
        }
    };

    const renderCustomBarChart = <
        T extends Record<string, string | number>
        >(
        data: T[],
        dataKey: keyof T,
        nameKey: keyof T,
        color: string,
        title: string
        ) => {
        if (!data || data.length === 0)
            return <div style={{ color: 'var(--text-muted)' }}>No hay datos suficientes</div>;

        const maxValue = Math.max(
            ...data.map((d) => Number(d[dataKey]) || 0),
            1
        );

        return (
            <div style={{ width: '100%', height: '100%' }}>
            <h3 style={{ marginBottom: '2rem', color }}>{title}</h3>

            <div
                style={{
                display: 'flex',
                alignItems: 'flex-end',
                height: '300px',
                gap: '1rem',
                borderBottom: '1px solid rgba(255,255,255,0.1)',
                }}
            >
                {data.map((item, idx) => {
                const value = Number(item[dataKey]) || 0;
                const heightPct = Math.max((value / maxValue) * 100, 5);

                return (
                    <div
                    key={idx}
                    style={{
                        flex: 1,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        height: '100%',
                        justifyContent: 'flex-end',
                        cursor: 'pointer',
                        transition: 'transform 0.2s'
                    }}
                    onClick={() => handleChartClick(title, String(item[nameKey]), value > 1000 ? '$' + value.toLocaleString() : value)}
                    onMouseEnter={(e) => { e.currentTarget.style.transform = 'scale(1.05)' }}
                    onMouseLeave={(e) => { e.currentTarget.style.transform = 'scale(1)' }}
                    >
                    <div
                        style={{
                        fontSize: '0.8rem',
                        color: 'rgba(255,255,255,0.7)',
                        marginBottom: '0.5rem',
                        }}
                    >
                        {value > 1000 ? '$' + value.toLocaleString() : value}
                    </div>

                    <div
                        style={{
                        width: '100%',
                        height: `${heightPct}%`,
                        backgroundColor: color,
                        borderRadius: '4px 4px 0 0',
                        transition: 'height 1s ease-out',
                        }}
                    />

                    <div
                        style={{
                        fontSize: '0.75rem',
                        marginTop: '0.5rem',
                        color: 'var(--text-muted)',
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        maxWidth: '100%',
                        textAlign: 'center',
                        }}
                    >
                        {String(item[nameKey])}
                    </div>
                    </div>
                );
                })}
            </div>
            </div>
        );
    };

    const renderCustomPieChart = (
        data: PieChartData[],
        title: string,
        colorTitle: string
        ) => {
        if (!data || data.length === 0) return null;

        const total = data.reduce((sum, item) => sum + item.value, 0);

        let currentAngle = 0;

        const conicStops = data
            .map((item) => {
            const percentage = (item.value / total) * 100;
            const stop = `${item.fill} ${currentAngle}% ${currentAngle + percentage}%`;
            currentAngle += percentage;
            return stop;
            })
            .join(', ');

        return (
            <div
            style={{
                width: '100%',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
            }}
            >
            <h3 style={{ marginBottom: '2rem', color: colorTitle }}>{title}</h3>

            <div
                style={{
                width: '200px',
                height: '200px',
                borderRadius: '50%',
                background: `conic-gradient(${conicStops})`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '2rem',
                boxShadow: '0 0 20px rgba(0,0,0,0.5)',
                position: 'relative'
                }}
            >
                <div
                style={{
                    width: '120px',
                    height: '120px',
                    backgroundColor: 'var(--bg-card)',
                    borderRadius: '50%',
                }}
                />
            </div>

            <div style={{ display: 'flex', gap: '2rem' }}>
                {data.map((item, idx) => (
                <div
                    key={idx}
                    style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', padding: '0.5rem', borderRadius: '8px', transition: 'background 0.2s' }}
                    onClick={() => handleChartClick(title, item.name, item.value)}
                    onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.1)' }}
                    onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent' }}
                >
                    <div
                    style={{
                        width: '15px',
                        height: '15px',
                        backgroundColor: item.fill,
                        borderRadius: '3px',
                    }}
                    />

                    <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>
                    {item.name}:{' '}
                    <strong style={{ color: 'white' }}>{item.value}</strong>
                    </span>
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
                <h1 className="heading-1">Reportes Avanzados</h1>
                <p style={{ color: 'var(--text-muted)' }}>Bienvenido, Administrador. Haz clic en las tarjetas y elementos del gráfico para ver detalles.</p>
            </header>

            <div className="dashboard-stats-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))' }}>
                {/* 1. Reservas Efectivas */}
                <div 
                    className="glass-card" 
                    style={{ padding: '1.5rem', cursor: 'pointer', border: selectedReport === 'reservations' ? '2px solid #8b5cf6' : '' }}
                    onClick={() => { setSelectedReport('reservations'); setSelectedDetail(null); }}
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
                    onClick={() => { setSelectedReport('revenue'); setSelectedDetail(null); }}
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
                    onClick={() => { setSelectedReport('drivers_rank'); setSelectedDetail(null); }}
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
                    onClick={() => { setSelectedReport('destinations'); setSelectedDetail(null); }}
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
                    onClick={() => { setSelectedReport('drivers_avail'); setSelectedDetail(null); }}
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
                    onClick={() => { setSelectedReport('yachts_avail'); setSelectedDetail(null); }}
                >
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>Yates Disponibles</p>
                        <Anchor size={18} color="#06b6d4" />
                    </div>
                    <div style={{ fontSize: '2rem', fontWeight: 700, margin: '0.5rem 0' }}>{metrics.yachts.available} / {metrics.yachts.total}</div>
                    <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Ver gráfico</span>
                </div>
            </div>

            <section style={{ marginTop: '3rem', display: 'flex', gap: '2rem', flexWrap: 'wrap' }}>
                <div className="glass-panel" style={{ padding: '2rem', minHeight: '400px', flex: '1 1 600px' }}>
                    {renderChart()}
                </div>

                {selectedDetail && (
                    <div className="glass-panel" style={{ padding: '2rem', flex: '1 1 400px', position: 'relative', display: 'flex', flexDirection: 'column', textAlign: 'center', maxHeight: '500px', overflowY: 'auto' }}>
                        <button 
                            onClick={() => setSelectedDetail(null)}
                            style={{ position: 'absolute', top: '1rem', right: '1rem', background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}
                        >
                            <X size={20} />
                        </button>
                        <h4 style={{ color: 'var(--primary)', marginBottom: '0.5rem', fontSize: '1.1rem' }}>Detalle Ampliado</h4>
                        <p style={{ fontSize: '1.2rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>{selectedDetail.title}</p>
                        
                        {selectedDetail.title !== 'Ingresos' && (
                            <div style={{ fontSize: '2.5rem', fontWeight: 800, margin: '1rem 0', color: 'white' }}>
                                {selectedDetail.value}
                            </div>
                        )}
                        <p style={{ fontSize: '1.1rem', color: 'rgba(255,255,255,0.8)' }}>
                            {selectedDetail.subtitle}
                        </p>

                        {selectedDetail.title === 'Ingresos' && (
                            <div style={{ marginTop: '1.5rem', textAlign: 'left' }}>
                                <h5 style={{ color: 'white', marginBottom: '1rem', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '0.5rem' }}>Desglose Diario de Ganancias</h5>
                                {detailLoading ? (
                                    <div style={{ display: 'flex', justifyContent: 'center', padding: '2rem' }}>
                                        <Loader2 className="animate-spin" style={{ color: 'var(--primary)' }} />
                                    </div>
                                ) : detailedRevenueData && detailedRevenueData.length > 0 ? (
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                        {detailedRevenueData.filter(d => d.Reservas > 0 || d.Paquetes > 0).map((dayData, idx) => (
                                            <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', padding: '0.5rem', background: 'rgba(255,255,255,0.05)', borderRadius: '8px' }}>
                                                <span style={{ color: 'var(--text-muted)', fontWeight: 600 }}>{dayData.dateStr}</span>
                                                <div style={{ display: 'flex', gap: '1rem', fontSize: '0.9rem', alignItems: 'center' }}>
                                                    {dayData.Reservas > 0 && <span style={{ color: '#8b5cf6' }}>Reservas: ${dayData.Reservas.toLocaleString()}</span>}
                                                    {dayData.Paquetes > 0 && (
                                                        <span style={{ color: '#10b981', display: 'flex', alignItems: 'center', gap: '0.2rem' }}>
                                                            Paquetes: ${dayData.Paquetes.toLocaleString()}
                                                            {dayData.isEstimate && (
                                                                <span style={{ fontSize: '0.7rem', background: 'rgba(239, 68, 68, 0.2)', color: '#ef4444', padding: '2px 4px', borderRadius: '4px' }}>Estimado</span>
                                                            )}
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <p style={{ color: 'var(--text-muted)' }}>No hay datos diarios para mostrar.</p>
                                )}
                            </div>
                        )}

                        {selectedDetail.title === 'Proporción de Yates' && (
                            <div style={{ marginTop: '1.5rem', textAlign: 'left', width: '100%' }}>
                                <h5 style={{ color: 'white', marginBottom: '1rem', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '0.5rem' }}>Listado de Yates {selectedDetail.subtitle}</h5>
                                {detailLoading ? (
                                    <div style={{ display: 'flex', justifyContent: 'center', padding: '2rem' }}>
                                        <Loader2 className="animate-spin" style={{ color: 'var(--primary)' }} />
                                    </div>
                                ) : detailedYachtsData && detailedYachtsData.length > 0 ? (
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                        {detailedYachtsData.map((yacht, idx) => (
                                            <div key={idx} style={{ padding: '0.75rem', background: 'rgba(255,255,255,0.05)', borderRadius: '8px' }}>
                                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.25rem' }}>
                                                    <span style={{ color: 'white', fontWeight: 600 }}>{yacht.name}</span>
                                                    <span style={{ color: 'var(--primary)', fontWeight: 600 }}>${yacht.price_day}/día</span>
                                                </div>
                                                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                                                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}><Anchor size={14}/> Capacidad: {yacht.capacity}</span>
                                                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}><MapPin size={14}/> {yacht.location}</span>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <p style={{ color: 'var(--text-muted)' }}>No hay yates en esta categoría.</p>
                                )}
                            </div>
                        )}
                    </div>
                )}
            </section>
        </div>
    );
}
