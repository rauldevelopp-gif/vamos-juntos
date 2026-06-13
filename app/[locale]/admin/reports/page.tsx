'use client';
import { useLanguage } from '@/context/LanguageContext';
import { tr, setLanguage } from '@/lib/tr';
import React, { useState, useEffect } from 'react';
import {
    BarChart2, DollarSign, Users, ShoppingCart, Settings, Package,
    Star, Globe, AlertTriangle, TrendingUp, ChevronRight, Calendar,
    Filter, Download, RefreshCw, Loader2, X, CheckCircle, Clock,
    FileText, Activity, Map, Bell, Briefcase, Target, CreditCard,
    ArrowUpRight, ArrowDownRight, Minus, Search
} from 'lucide-react';
import {
    getComprehensiveFinancialReports,
    getClientReports,
    getPackageReports,
    getTaxiDriverReports,
    getYachtReports,
    getRestaurantReports,
    getDestinationReports,
    getOperationalReports,
    getMarketingReports,
    getSystemLogs,
    getAdminDashboardKPIs,
    getDetailedReservations,
} from './actions';
import { TimelineAreaChart, ComparativeBarChart, PremiumDonutChart, InteractiveHeatMap, SystemLogTerminal } from './reports-charts';

// ─── Types ────────────────────────────────────────────────────────────────────
type Period = 'semana' | 'mes' | 'trimestre' | 'año';

interface KpiCardProps {
    label: string;
    value: string | number;
    icon: React.ElementType;
    color: string;
    trend?: number;
    sub?: string;
}

// ─── KPI Card ─────────────────────────────────────────────────────────────────
function KpiCard({ label, value, icon: Icon, color, trend, sub }: KpiCardProps) {
    return (
        <div className="glass-card" style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 500 }}>{label}</span>
                <div style={{ width: 32, height: 32, borderRadius: 8, background: `${color}22`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Icon size={16} color={color} />
                </div>
            </div>
            <div style={{ fontSize: '1.6rem', fontWeight: 800, color: 'white', lineHeight: 1 }}>{value}</div>
            {(trend !== undefined || sub) && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.75rem' }}>
                    {trend !== undefined && (
                        <>
                            {trend > 0 ? <ArrowUpRight size={12} color="#10b981" /> : trend < 0 ? <ArrowDownRight size={12} color="#ef4444" /> : <Minus size={12} color="#94a3b8" />}
                            <span style={{ color: trend > 0 ? '#10b981' : trend < 0 ? '#ef4444' : '#94a3b8', fontWeight: 600 }}>{Math.abs(trend)}%</span>
                        </>
                    )}
                    {sub && <span style={{ color: 'var(--text-muted)' }}>{sub}</span>}
                </div>
            )}
        </div>
    );
}

// ─── Period Selector ──────────────────────────────────────────────────────────
function PeriodSelector({ value, onChange }: { value: Period; onChange: (p: Period) => void }) {
    const options: { key: Period; label: string }[] = [
        { key: 'semana', label:tr("Semana") },
        { key: 'mes', label:tr("Mes") },
        { key: 'trimestre', label:tr("Trimestre") },
        { key: 'año', label:tr("Año") },
    ];
    return (
        <div style={{ display: 'flex', background: 'rgba(255,255,255,0.04)', borderRadius: 12, padding: 4, border: '1px solid var(--border-glass)', gap: 2 }}>
            {options.map(opt => (
                <button
                    key={opt.key}
                    onClick={() => onChange(opt.key)}
                    style={{
                        padding: '0.4rem 0.85rem',
                        borderRadius: 9,
                        border: 'none',
                        background: value === opt.key ? 'var(--primary)' : 'transparent',
                        color: value === opt.key ? 'white' : 'var(--text-muted)',
                        fontWeight: 600,
                        fontSize: '0.78rem',
                        cursor: 'pointer',
                        transition: 'all 0.2s ease',
                        fontFamily: 'inherit'
                    }}
                >{opt.label}</button>
            ))}
        </div>
    );
}

// ─── Section Header ───────────────────────────────────────────────────────────
function SectionHeader({ title, subtitle, icon: Icon, color }: { title: string; subtitle: string; icon: React.ElementType; color: string }) {
    return (
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem', marginBottom: '1.5rem' }}>
            <div style={{ width: 40, height: 40, borderRadius: 12, background: `${color}22`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <Icon size={20} color={color} />
            </div>
            <div>
                <h2 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'white', margin: 0 }}>{title}</h2>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', margin: 0 }}>{subtitle}</p>
            </div>
        </div>
    );
}

// ─── Chart Panel ──────────────────────────────────────────────────────────────
function ChartPanel({ title, children, minHeight = 300 }: { title?: string; children: React.ReactNode; minHeight?: number }) {
    return (
        <div className="glass-panel" style={{ padding: '1.5rem', minHeight }}>
            {title && <h3 style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '1.25rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{title}</h3>}
            {children}
        </div>
    );
}

// ─── Status Badge ─────────────────────────────────────────────────────────────
function Badge({ label, color }: { label: string; color: string }) {
    return (
        <span style={{ padding: '0.2rem 0.6rem', borderRadius: 6, background: `${color}22`, color, fontSize: '0.72rem', fontWeight: 700, border: `1px solid ${color}44` }}>
            {label}
        </span>
    );
}

// ─── Mini Bar ─────────────────────────────────────────────────────────────────
function MiniBar({ value, max, color }: { value: number; max: number; color: string }) {
    const pct = Math.max((value / max) * 100, 2);
    return (
        <div style={{ height: 6, background: 'rgba(255,255,255,0.06)', borderRadius: 3, overflow: 'hidden' }}>
            <div style={{ height: '100%', width: `${pct}%`, background: color, borderRadius: 3, transition: 'width 0.8s ease' }} />
        </div>
    );
}

// ─── Report Module Components ─────────────────────────────────────────────────

// 1. RESERVAS
function ReservasModule({ period }: { period: Period }) {
    const [activeSubTab, setActiveSubTab] = useState<'general' | 'estados' | 'destinos' | 'ocupacion'>('general');
    const [data, setData] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [refreshKey, setRefreshKey] = useState(0);

    // Advanced Filters State
    const [showFilters, setShowFilters] = useState(false);
    const [search, setSearch] = useState('');
    const [startDate, setStartDate] = useState('');
    const [travelDate, setTravelDate] = useState('');
    const [status, setStatus] = useState('Todos');
    const [agency, setAgency] = useState('Todas');
    const [advisor, setAdvisor] = useState('Todos');
    const [destination, setDestination] = useState('Todos');
    const [channel, setChannel] = useState('Todos');
    const [paymentMethod, setPaymentMethod] = useState('Todos');
    const [minVal, setMinVal] = useState('');
    const [maxVal, setMaxVal] = useState('');

    // Detailed reservations state
    const [reservations, setReservations] = useState<any[]>([]);
    const [loadingRes, setLoadingRes] = useState(false);
    const [selectedRes, setSelectedRes] = useState<any>(null); // Details Drawer

    useEffect(() => {
        setLoading(true);
        Promise.all([getComprehensiveFinancialReports(), getAdminDashboardKPIs()]).then(([fin, kpi]) => {
            setData({ fin, kpi });
            setLoading(false);
        });
    }, [period]);

    useEffect(() => {
        setLoadingRes(true);
        getDetailedReservations({
            search: search || undefined,
            startDate: startDate || undefined,
            travelDate: travelDate || undefined,
            status: status !== 'Todos' ? status : undefined,
            agency: agency !== 'Todas' ? agency : undefined,
            advisor: advisor !== 'Todos' ? advisor : undefined,
            destination: destination !== 'Todos' ? destination : undefined,
            channel: channel !== 'Todos' ? channel : undefined,
            paymentMethod: paymentMethod !== 'Todos' ? paymentMethod : undefined,
            minValue: minVal ? parseFloat(minVal) : undefined,
            maxValue: maxVal ? parseFloat(maxVal) : undefined,
        }).then(res => {
            if (res.success && res.data) {
                setReservations(res.data);
            }
            setLoadingRes(false);
        });
    }, [search, startDate, travelDate, status, agency, advisor, destination, channel, paymentMethod, minVal, maxVal, refreshKey]);

    if (loading) return <div style={{ display: 'flex', justifyContent: 'center', padding: '3rem' }}><Loader2 size={28} style={{ color: 'var(--primary)', animation: 'spin 1s linear infinite' }} /></div>;

    const fin = data?.fin;
    const kpiData = data?.kpi?.data;
    const timeline = fin?.timeline || [];

    const weeklyTimeline = period === 'semana'
        ? [
            { label: 'Lun', Reservas: 8, Ingresos: 4200 },
            { label: 'Mar', Reservas: 12, Ingresos: 6800 },
            { label: 'Mié', Reservas: 9, Ingresos: 5100 },
            { label: 'Jue', Reservas: 15, Ingresos: 8400 },
            { label: 'Vie', Reservas: 22, Ingresos: 12200 },
            { label: 'Sáb', Reservas: 31, Ingresos: 18500 },
            { label: 'Dom', Reservas: 19, Ingresos: 10800 },
        ]
        : timeline;

    const statuses = [
        { label: 'Confirmadas', value: kpiData?.totalReservations || 45, color: '#10b981' },
        { label: 'Pendientes', value: fin?.kpis?.pending || 8, color: '#f59e0b' },
        { label: 'Canceladas', value: fin?.kpis?.cancelled || 3, color: '#ef4444' },
        { label: 'Cotizaciones', value: 6, color: '#8b5cf6' },
        { label: 'En Curso', value: 4, color: '#06b6d4' },
        { label: 'Finalizadas', value: fin?.kpis?.paid || 34, color: '#94a3b8' },
    ];
    const totalStatus = statuses.reduce((s, x) => s + x.value, 0);

    // Dynamic stats derived from filtered list
    const filteredCount = reservations.length;
    const filteredActiveCount = reservations.filter(r => ['Confirmada', 'En curso', 'Parcialmente pagada'].includes(r.status)).length;
    const filteredCancelledCount = reservations.filter(r => r.status === 'Cancelada').length;
    const filteredTotalAmount = reservations.reduce((s, r) => s + (r.grossValue + r.taxes - r.discounts), 0);
    const filteredAverageAmount = filteredCount > 0 ? Math.round(filteredTotalAmount / filteredCount) : 0;
    const filteredConversion = filteredCount > 0 ? ((reservations.filter(r => r.status !== 'Cotización' && r.status !== 'Cancelada').length / filteredCount) * 100).toFixed(1) : '0';

    // CSV Exporter
    const exportToCSV = () => {
        const headers = [
            'Código de Reserva', 'Consecutivo', 'Fecha de Creación', 'Fecha de Viaje', 'Fecha de Regreso',
            'Cliente Principal', 'Cantidad Pasajeros', 'Desglose Pax', 'Paquete', 'Destino', 'Hotel',
            'Transporte',tr("Estado"), 'Valor Bruto', 'Descuento', 'Impuesto', 'Comisión',tr("Total Pagado"),
            'Saldo Pendiente', 'Usuario Creador', 'Agencia', 'Asesor', 'Canal Venta', 'Metodo Pago'
        ];
        const rows = reservations.map(r => [
            r.id, r.consecutivo, r.createdAt, r.date, r.returnDate,
            r.customerName, r.passengers, r.paxBreakdown, r.packageName, r.destination, r.hotel,
            r.transport, r.status, r.grossValue, r.discounts, r.taxes, r.commission, r.totalPaid,
            r.pendingBalance, r.creatorUser, r.agency, r.advisor, r.channel, r.paymentMethod
        ]);

        const csvContent = "data:text/csv;charset=utf-8," 
            + [headers.join(','), ...rows.map(e => e.map(val => `"${String(val).replace(/"/g, '""')}"`).join(','))].join('\n');
        
        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", `Reporte_Reservas_${new Date().toISOString().split('T')[0]}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const subTabs = [
        { id: 'general', label: 'Reporte General (1.1)' },
        { id: 'estados', label: 'Por Estado (1.2)' },
        { id: 'destinos', label: 'Por Destino (1.3)' },
        { id: 'ocupacion', label: 'Ocupación (1.4)' }
    ];

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <SectionHeader 
                title={tr("Reporte de Reservas")} 
                subtitle={tr("Gestión de reservas, conversiones por estados, destinos populares y ocupación de cupos")} 
                icon={Calendar} 
                color="#8b5cf6" 
            />

            {/* Sub Tabs Pill Navigation */}
            <div style={{ display: 'flex', gap: '0.5rem', background: 'rgba(255,255,255,0.02)', padding: '4px', borderRadius: '12px', border: '1px solid var(--border-glass)', width: 'fit-content' }}>
                {subTabs.map(t => (
                    <button
                        key={t.id}
                        onClick={() => setActiveSubTab(t.id as any)}
                        style={{
                            padding: '0.45rem 1rem',
                            borderRadius: '8px',
                            border: 'none',
                            background: activeSubTab === t.id ? 'var(--primary)' : 'transparent',
                            color: activeSubTab === t.id ? 'white' : 'var(--text-muted)',
                            fontWeight: 600,
                            fontSize: '0.78rem',
                            cursor: 'pointer',
                            transition: 'all 0.2s ease',
                            fontFamily: 'inherit'
                        }}
                    >
                        {t.label}
                    </button>
                ))}
            </div>

            {/* TAB 1: REPORTE GENERAL DE RESERVAS */}
            {activeSubTab === 'general' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                    {/* KPIs Row */}
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '1rem' }}>
                        <KpiCard label={tr("Total Reservas")} value={filteredCount} icon={Calendar} color="#8b5cf6" trend={12} sub="filtradas" />
                        <KpiCard label={tr("Reservas Activas")} value={filteredActiveCount} icon={CheckCircle} color="#10b981" trend={8} />
                        <KpiCard label="Canceladas" value={filteredCancelledCount} icon={X} color="#ef4444" trend={-5} />
                        <KpiCard label={tr("Ticket Promedio")} value={`$${filteredAverageAmount.toLocaleString()}`} icon={DollarSign} color="#f59e0b" trend={3} />
                        <KpiCard label={tr("Conversión")} value={`${filteredConversion}%`} icon={Target} color="#06b6d4" trend={1.2} sub="cotización → venta" />
                    </div>

                    {/* Filter Action Bar */}
                    <div className="glass-panel" style={{ padding: '1rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', alignItems: 'center' }}>
                            <div style={{ position: 'relative', flex: 1, minWidth: '240px' }}>
                                <input
                                    type="text"
                                    placeholder={tr("Buscar por cliente, código, paquete, hotel...")}
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    style={{
                                        width: '100%',
                                        padding: '0.55rem 1rem 0.55rem 2.2rem',
                                        borderRadius: '10px',
                                        background: 'rgba(255,255,255,0.03)',
                                        border: '1px solid var(--border-glass)',
                                        color: 'white',
                                        fontSize: '0.82rem',
                                        fontFamily: 'inherit',
                                        outline: 'none'
                                    }}
                                />
                                <div style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }}>
                                    <Loader2 size={16} style={{ display: loadingRes ? 'block' : 'none', animation: 'spin 1s linear infinite' }} />
                                    {!loadingRes && <span style={{ display: 'flex', alignItems: 'center' }}><Search size={16} /></span>}
                                </div>
                            </div>

                            <button
                                onClick={() => setShowFilters(!showFilters)}
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '0.4rem',
                                    padding: '0.55rem 1rem',
                                    borderRadius: '10px',
                                    border: '1px solid var(--border-glass)',
                                    background: showFilters ? 'rgba(139,92,246,0.15)' : 'rgba(255,255,255,0.03)',
                                    color: showFilters ? 'white' : 'var(--text-muted)',
                                    cursor: 'pointer',
                                    fontSize: '0.8rem',
                                    fontWeight: 600,
                                    transition: 'all 0.2s'
                                }}
                            >
                                <Filter size={15} />
                                <span>{showFilters ?tr("Ocultar Filtros") :tr("Filtros Avanzados")}</span>
                            </button>

                            <button
                                onClick={exportToCSV}
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '0.4rem',
                                    padding: '0.55rem 1rem',
                                    borderRadius: '10px',
                                    border: 'none',
                                    background: 'var(--primary)',
                                    color: 'white',
                                    cursor: 'pointer',
                                    fontSize: '0.8rem',
                                    fontWeight: 600,
                                    transition: 'all 0.2s',
                                    marginLeft: 'auto'
                                }}
                            >
                                <Download size={15} />
                                <span>{tr("Exportar CSV")}</span>
                            </button>
                        </div>

                        {/* Collapsible Advanced Filters Section */}
                        {showFilters && (
                            <div style={{
                                display: 'grid',
                                gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                                gap: '0.75rem',
                                padding: '1rem',
                                background: 'rgba(255,255,255,0.01)',
                                borderRadius: '10px',
                                border: '1px dashed var(--border-glass)',
                                marginTop: '0.25rem'
                            }}>
                                {/* Creation Date */}
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                                    <label style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: 600 }}>Fecha Creación</label>
                                    <input
                                        type="date"
                                        value={startDate}
                                        onChange={(e) => setStartDate(e.target.value)}
                                        style={{
                                            padding: '0.45rem',
                                            borderRadius: '8px',
                                            background: 'rgba(5,7,10,0.5)',
                                            border: '1px solid var(--border-glass)',
                                            color: 'white',
                                            fontSize: '0.78rem',
                                            outline: 'none'
                                        }}
                                    />
                                </div>

                                {/* Travel Date */}
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                                    <label style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: 600 }}>{tr("Fecha Viaje")}</label>
                                    <input
                                        type="date"
                                        value={travelDate}
                                        onChange={(e) => setTravelDate(e.target.value)}
                                        style={{
                                            padding: '0.45rem',
                                            borderRadius: '8px',
                                            background: 'rgba(5,7,10,0.5)',
                                            border: '1px solid var(--border-glass)',
                                            color: 'white',
                                            fontSize: '0.78rem',
                                            outline: 'none'
                                        }}
                                    />
                                </div>

                                {/* Status */}
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                                    <label style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: 600 }}>{tr("Estado")}</label>
                                    <select
                                        value={status}
                                        onChange={(e) => setStatus(e.target.value)}
                                        style={{
                                            padding: '0.45rem',
                                            borderRadius: '8px',
                                            background: 'rgba(5,7,10,0.5)',
                                            border: '1px solid var(--border-glass)',
                                            color: 'white',
                                            fontSize: '0.78rem',
                                            outline: 'none'
                                        }}
                                    >
                                        <option value="Todos">Todos</option>
                                        <option value="Cotización">Cotización</option>
                                        <option value={tr("Pendiente")}>{tr("Pendiente")}</option>
                                        <option value="Parcialmente pagada">Parcialmente pagada</option>
                                        <option value={tr("Confirmada")}>{tr("Confirmada")}</option>
                                        <option value="En curso">En curso</option>
                                        <option value="Finalizada">Finalizada</option>
                                        <option value={tr("Cancelada")}>{tr("Cancelada")}</option>
                                        <option value="Reembolsada">Reembolsada</option>
                                    </select>
                                </div>

                                {/* Agency */}
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                                    <label style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: 600 }}>Agencia</label>
                                    <select
                                        value={agency}
                                        onChange={(e) => setAgency(e.target.value)}
                                        style={{
                                            padding: '0.45rem',
                                            borderRadius: '8px',
                                            background: 'rgba(5,7,10,0.5)',
                                            border: '1px solid var(--border-glass)',
                                            color: 'white',
                                            fontSize: '0.78rem',
                                            outline: 'none'
                                        }}
                                    >
                                        <option value="Todas">Todas</option>
                                        <option value="Viajes Cancún SA">Viajes Cancún SA</option>
                                        <option value="Caribe Tours">Caribe Tours</option>
                                        <option value="Mundo VIP">Mundo VIP</option>
                                        <option value="Directo Web">Directo Web</option>
                                        <option value="Agencia Expedia">Agencia Expedia</option>
                                        <option value="Directo Cliente">Directo Cliente</option>
                                    </select>
                                </div>

                                {/* Advisor */}
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                                    <label style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: 600 }}>Asesor</label>
                                    <select
                                        value={advisor}
                                        onChange={(e) => setAdvisor(e.target.value)}
                                        style={{
                                            padding: '0.45rem',
                                            borderRadius: '8px',
                                            background: 'rgba(5,7,10,0.5)',
                                            border: '1px solid var(--border-glass)',
                                            color: 'white',
                                            fontSize: '0.78rem',
                                            outline: 'none'
                                        }}
                                    >
                                        <option value="Todos">Todos</option>
                                        <option value="Carlos Gómez">Carlos Gómez</option>
                                        <option value="Elena Ruiz">Elena Ruiz</option>
                                        <option value="Sofía Castro">Sofía Castro</option>
                                        <option value="Roberto Díaz">Roberto Díaz</option>
                                        <option value="Sistema Auto">Sistema Auto</option>
                                    </select>
                                </div>

                                {/* Destination */}
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                                    <label style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: 600 }}>Destino</label>
                                    <select
                                        value={destination}
                                        onChange={(e) => setDestination(e.target.value)}
                                        style={{
                                            padding: '0.45rem',
                                            borderRadius: '8px',
                                            background: 'rgba(5,7,10,0.5)',
                                            border: '1px solid var(--border-glass)',
                                            color: 'white',
                                            fontSize: '0.78rem',
                                            outline: 'none'
                                        }}
                                    >
                                        <option value="Todos">Todos</option>
                                        <option value="Cancún">Cancún</option>
                                        <option value="Tulum">Tulum</option>
                                        <option value="Playa del Carmen">Playa del Carmen</option>
                                        <option value="Cozumel">Cozumel</option>
                                        <option value="Isla Mujeres">Isla Mujeres</option>
                                    </select>
                                </div>

                                {/* Channel */}
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                                    <label style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: 600 }}>Canal de Venta</label>
                                    <select
                                        value={channel}
                                        onChange={(e) => setChannel(e.target.value)}
                                        style={{
                                            padding: '0.45rem',
                                            borderRadius: '8px',
                                            background: 'rgba(5,7,10,0.5)',
                                            border: '1px solid var(--border-glass)',
                                            color: 'white',
                                            fontSize: '0.78rem',
                                            outline: 'none'
                                        }}
                                    >
                                        <option value="Todos">Todos</option>
                                        <option value="Sitio Web">Sitio Web</option>
                                        <option value="WhatsApp">WhatsApp</option>
                                        <option value="Llamada">Llamada</option>
                                        <option value="Agencia Afiliada">Agencia Afiliada</option>
                                        <option value="Instagram">Instagram</option>
                                    </select>
                                </div>

                                {/* Value range */}
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                                    <label style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: 600 }}>Valor Mín / Máx</label>
                                    <div style={{ display: 'flex', gap: '0.3rem' }}>
                                        <input
                                            type="number"
                                            placeholder="Min"
                                            value={minVal}
                                            onChange={(e) => setMinVal(e.target.value)}
                                            style={{
                                                width: '50%',
                                                padding: '0.45rem',
                                                borderRadius: '8px',
                                                background: 'rgba(5,7,10,0.5)',
                                                border: '1px solid var(--border-glass)',
                                                color: 'white',
                                                fontSize: '0.78rem',
                                                outline: 'none'
                                            }}
                                        />
                                        <input
                                            type="number"
                                            placeholder="Max"
                                            value={maxVal}
                                            onChange={(e) => setMaxVal(e.target.value)}
                                            style={{
                                                width: '50%',
                                                padding: '0.45rem',
                                                borderRadius: '8px',
                                                background: 'rgba(5,7,10,0.5)',
                                                border: '1px solid var(--border-glass)',
                                                color: 'white',
                                                fontSize: '0.78rem',
                                                outline: 'none'
                                            }}
                                        />
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Reservations Table */}
                    <ChartPanel title={`Listado de Reservas (${reservations.length})`}>
                        {loadingRes ? (
                            <div style={{ display: 'flex', justifyContent: 'center', padding: '3rem' }}><Loader2 size={24} style={{ color: 'var(--primary)', animation: 'spin 1s linear infinite' }} /></div>
                        ) : reservations.length === 0 ? (
                            <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)' }}>Ninguna reserva coincide con los filtros aplicados.</div>
                        ) : (
                            <div style={{ overflowX: 'auto' }}>
                                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.82rem' }}>
                                    <thead>
                                        <tr style={{ borderBottom: '1px solid var(--border-glass)' }}>
                                            {['Código', 'Consecutivo', 'Cliente Principal', 'Destino',tr("Fecha Viaje"), 'Total',tr("Estado"), 'Ficha'].map(h => (
                                                <th key={h} style={{ padding: '0.75rem 0.5rem', textAlign: 'left', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.04em', fontSize: '0.72rem' }}>{h}</th>
                                            ))}
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {reservations.map((r) => {
                                            const total = r.grossValue + r.taxes - r.discounts;
                                            const statusColor = r.status === 'Confirmada' || r.status === 'Finalizada' ? '#10b981'
                                                : r.status === 'Pendiente' || r.status === 'Parcialmente pagada' ? '#f59e0b'
                                                : r.status === 'Cotización' || r.status === 'En curso' ? '#8b5cf6'
                                                : '#ef4444';

                                            return (
                                                <tr key={r.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.03)', transition: 'background 0.2s ease' }} className="table-row-hover">
                                                    <td style={{ padding: '0.75rem 0.5rem', fontWeight: 700, color: 'white' }}>{r.id}</td>
                                                    <td style={{ padding: '0.75rem 0.5rem', color: 'var(--text-muted)' }}>#{r.consecutivo}</td>
                                                    <td style={{ padding: '0.75rem 0.5rem', fontWeight: 600, color: 'white' }}>{r.customerName}</td>
                                                    <td style={{ padding: '0.75rem 0.5rem', color: 'var(--text-muted)' }}>{r.destination}</td>
                                                    <td style={{ padding: '0.75rem 0.5rem', color: 'white' }}>{r.date}</td>
                                                    <td style={{ padding: '0.75rem 0.5rem', fontWeight: 700, color: '#10b981' }}>${total.toLocaleString()}</td>
                                                    <td style={{ padding: '0.75rem 0.5rem' }}>
                                                        <span style={{ padding: '0.2rem 0.5rem', borderRadius: '5px', background: `${statusColor}18`, color: statusColor, fontSize: '0.7rem', fontWeight: 700, border: `1px solid ${statusColor}33` }}>
                                                            {r.status}
                                                        </span>
                                                    </td>
                                                    <td style={{ padding: '0.75rem 0.5rem' }}>
                                                        <button
                                                            onClick={() => setSelectedRes(r)}
                                                            style={{
                                                                background: 'rgba(139,92,246,0.1)',
                                                                border: '1px solid rgba(139,92,246,0.2)',
                                                                color: '#a78bfa',
                                                                padding: '0.3rem 0.6rem',
                                                                borderRadius: '6px',
                                                                cursor: 'pointer',
                                                                fontWeight: 600,
                                                                fontSize: '0.75rem',
                                                                transition: 'all 0.2s'
                                                            }}
                                                        >
                                                            Ver Ficha
                                                        </button>
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </ChartPanel>

                    {/* Timeline area chart & distribution in bottom */}
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: '1.25rem' }}>
                        <ChartPanel title={tr("Evolución de Reservas e Ingresos")}>
                            <TimelineAreaChart
                                data={weeklyTimeline.map((d: any) => ({ label: d.label, Reservas: d.Reservas, Ingresos: d.Ingresos }))}
                                series={[
                                    { key: 'Ingresos', color: '#8b5cf6', label: 'Ingresos ($)' },
                                    { key:tr("Reservas"), color: '#06b6d4', label:tr("Reservas") },
                                ]}
                                height={265}
                            />
                        </ChartPanel>

                        <ChartPanel title={tr("Distribución por Estado")}>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                                {statuses.map((s, i) => (
                                    <div key={i}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.3rem' }}>
                                            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 500 }}>{s.label}</span>
                                            <span style={{ fontSize: '0.8rem', color: 'white', fontWeight: 700 }}>{s.value} <span style={{ color: 'var(--text-muted)', fontWeight: 400 }}>({((s.value / totalStatus) * 100).toFixed(0)}%)</span></span>
                                        </div>
                                        <MiniBar value={s.value} max={totalStatus} color={s.color} />
                                    </div>
                                ))}
                            </div>
                        </ChartPanel>
                    </div>
                </div>
            )}

            {/* TAB 2: RESERVAS POR ESTADO */}
            {activeSubTab === 'estados' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem' }}>
                        <ChartPanel title={tr("Métricas de Conversión y Flujo de Estados")}>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '0.5rem' }}>
                                {[
                                    { stage: 'Cotización → Pendiente', conv: '85%', desc: 'Porcentaje de presupuestos que pasan a reserva pendiente.', color: '#8b5cf6' },
                                    { stage: 'Pendiente → Confirmada', conv: '72%', desc: 'Porcentaje de clientes que completan su depósito inicial.', color: '#f59e0b' },
                                    { stage: 'Confirmada → En Curso', conv: '98%', desc: 'Viajeros que inician su viaje sin contratiempos.', color: '#10b981' },
                                    { stage: 'En Curso → Finalizada', conv: '100%', desc: 'Servicios cerrados exitosamente sin reclamaciones.', color: '#06b6d4' }
                                ].map((step, i) => (
                                    <div key={i} className="glass-card" style={{ padding: '1rem', borderLeft: `4px solid ${step.color}` }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.3rem' }}>
                                            <span style={{ fontWeight: 700, color: 'white', fontSize: '0.85rem' }}>{step.stage}</span>
                                            <span style={{ fontWeight: 800, color: step.color, fontSize: '1.1rem' }}>{step.conv}</span>
                                        </div>
                                        <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', margin: 0 }}>{step.desc}</p>
                                    </div>
                                ))}
                            </div>
                        </ChartPanel>

                        <ChartPanel title={tr("Tiempo Promedio de Permanencia en Cada Estado")}>
                            <ComparativeBarChart
                                data={[
                                    { category: 'Cotización', current: 3.2, previous: 4.1 },
                                    { category: 'Pendiente', current: 4.8, previous: 5.5 },
                                    { category: 'Confirmada', current: 12.5, previous: 14.2 },
                                    { category: 'En Curso', current: 5.0, previous: 4.8 }
                                ]}
                                currentLabel="Días Promedio Actual"
                                previousLabel="Días Promedio Histórico"
                                currentColor="#f59e0b"
                                previousColor="rgba(245,158,11,0.2)"
                                height={240}
                            />
                        </ChartPanel>
                    </div>

                    <ChartPanel title="Valor Económico Retenido en Cada Estado (USD)">
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
                            {[
                                { status: 'Cotizaciones Abiertas', count: 6, value: 18400, color: '#8b5cf6' },
                                { status: 'Pendientes de Pago', count: 8, value: 25700, color: '#f59e0b' },
                                { status: 'Confirmadas (Depósitos)', count: 34, value: 91200, color: '#10b981' },
                                { status: 'En Reembolso / Disputa', count: 2, value: 1850, color: '#ef4444' }
                            ].map((v, i) => (
                                <div key={i} className="glass-card" style={{ padding: '1.25rem', textAlign: 'center' }}>
                                    <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase' }}>{v.status}</span>
                                    <div style={{ fontSize: '1.8rem', fontWeight: 800, color: 'white', margin: '0.5rem 0' }}>${v.value.toLocaleString()}</div>
                                    <span style={{ fontSize: '0.75rem', color: v.color, fontWeight: 700 }}>{v.count} reservas</span>
                                    <div style={{ marginTop: '0.75rem' }}><MiniBar value={v.value} max={91200} color={v.color} /></div>
                                </div>
                            ))}
                        </div>
                    </ChartPanel>
                </div>
            )}

            {/* TAB 3: RESERVAS POR DESTINO */}
            {activeSubTab === 'destinos' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: '1.25rem' }}>
                        <ChartPanel title="Mapa de Calor & Concentración Geográfica">
                            <InteractiveHeatMap />
                        </ChartPanel>

                        <ChartPanel title="Ranking de Destinos Más Vendidos">
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                                {[
                                    { dest: 'Cancún', pct: 45, rev: 375000, margin: '58%', color: '#3b82f6' },
                                    { dest: 'Playa del Carmen', pct: 31, rev: 176000, margin: '52%', color: '#10b981' },
                                    { dest: 'Tulum', pct: 24, rev: 201000, margin: '61%', color: '#f59e0b' },
                                    { dest: 'Cozumel', pct: 15, rev: 147000, margin: '55%', color: '#06b6d4' },
                                    { dest: 'Isla Mujeres', pct: 12, rev: 119000, margin: '48%', color: '#ec4899' }
                                ].map((d, i) => (
                                    <div key={i} style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem' }}>
                                            <span style={{ fontWeight: 700, color: 'white' }}>{i+1}. {d.dest}</span>
                                            <span style={{ color: 'var(--text-muted)' }}>${d.rev.toLocaleString()} USD · <span style={{ color: '#10b981', fontWeight: 600 }}>{d.margin}</span></span>
                                        </div>
                                        <MiniBar value={d.pct} max={45} color={d.color} />
                                    </div>
                                ))}
                            </div>
                        </ChartPanel>
                    </div>

                    <ChartPanel title="Detalle por Destino — Pasajeros, Cancelaciones y Temporadas">
                        <div style={{ overflowX: 'auto' }}>
                            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.82rem' }}>
                                <thead>
                                    <tr style={{ borderBottom: '1px solid var(--border-glass)' }}>
                                        {['Destino',tr("Reservas"),tr("Pasajeros"), 'Ingresos USD', 'Cancelación %', 'Temporada Alta'].map(h => (
                                            <th key={h} style={{ padding: '0.75rem 0.5rem', textAlign: 'left', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.04em', fontSize: '0.72rem' }}>{h}</th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody>
                                    {[
                                        { name: 'Cancún', res: 125, pax: 504, rev: 375000, cancel: '3.1%', season: 'Dic - Abr · Jun - Ago' },
                                        { name: 'Tulum', res: 67, pax: 268, rev: 201000, cancel: '4.8%', season: 'Nov - Ene · Feb - Mar' },
                                        { name: 'Playa del Carmen', res: 88, pax: 352, rev: 176000, cancel: '2.5%', season: 'Dic - Ene · Jul - Ago' },
                                        { name: 'Cozumel', res: 42, pax: 168, rev: 147000, cancel: '1.8%', season: 'Ene - Abr' },
                                        { name: 'Isla Mujeres', res: 34, pax: 136, rev: 119000, cancel: '5.2%', season: 'Abr - Ago' }
                                    ].map((dst, i) => (
                                        <tr key={i} style={{ borderBottom: '1px solid rgba(255,255,255,0.03)' }}>
                                            <td style={{ padding: '0.75rem 0.5rem', fontWeight: 700, color: 'white' }}>{dst.name}</td>
                                            <td style={{ padding: '0.75rem 0.5rem', color: 'white' }}>{dst.res}</td>
                                            <td style={{ padding: '0.75rem 0.5rem', color: 'white' }}>{dst.pax} travelers</td>
                                            <td style={{ padding: '0.75rem 0.5rem', fontWeight: 700, color: '#10b981' }}>${dst.rev.toLocaleString()}</td>
                                            <td style={{ padding: '0.75rem 0.5rem', color: '#ef4444', fontWeight: 600 }}>{dst.cancel}</td>
                                            <td style={{ padding: '0.75rem 0.5rem', color: 'var(--text-muted)' }}>🌴 {dst.season}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </ChartPanel>
                </div>
            )}

            {/* TAB 4: OCUPACIÓN TURÍSTICA */}
            {activeSubTab === 'ocupacion' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem' }}>
                        {[
                            { name: 'Yates VIP & Excursiones', av: 180, sold: 142, blocked: 28, pct: 78.8, over: '0%', color: '#06b6d4' },
                            { name: 'Tours & Actividades Cenote', av: 350, sold: 290, blocked: 45, pct: 82.8, over: '1.2%', color: '#8b5cf6' },
                            { name: 'Transporte Flota Sprinters', av: 240, sold: 205, blocked: 25, pct: 85.4, over: '0%', color: '#ec4899' },
                            { name: 'Hoteles en Alianza VIP', av: 120, sold: 88, blocked: 24, pct: 73.3, over: '0%', color: '#10b981' }
                        ].map((o, i) => (
                            <div key={i} className="glass-card" style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'white' }}>{o.name}</span>
                                <div style={{ display: 'flex', alignItems: 'center', justifyYontent: 'space-between', margin: '0.5rem 0' }}>
                                    <div>
                                        <div style={{ fontSize: '1.4rem', fontWeight: 800, color: 'white' }}>{o.pct}%</div>
                                        <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Ocupación de cupos</span>
                                    </div>
                                    <div style={{ width: '48px', height: '48px', position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                        <svg width="48" height="48" viewBox="0 0 36 36">
                                            <circle cx="18" cy="18" r="16" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="3" />
                                            <circle cx="18" cy="18" r="16" fill="none" stroke={o.color} strokeWidth="3" 
                                                strokeDasharray={`${o.pct} 100`} strokeLinecap="round" transform="rotate(-90 18 18)" />
                                        </svg>
                                    </div>
                                </div>
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0.25rem', fontSize: '0.7rem', color: 'var(--text-muted)', borderTop: '1px solid var(--border-glass)', paddingTop: '0.5rem' }}>
                                    <div>Vendidos: <strong style={{ color: 'white' }}>{o.sold}</strong></div>
                                    <div>Libres: <strong style={{ color: 'white' }}>{o.av - o.sold - o.blocked}</strong></div>
                                    <div>Bloq: <strong style={{ color: 'white' }}>{o.blocked}</strong></div>
                                </div>
                                {parseFloat(o.over) > 0 && (
                                    <div style={{ marginTop: '0.4rem', padding: '0.2rem 0.5rem', background: '#ef444415', color: '#ef4444', border: '1px solid #ef444433', borderRadius: '5px', fontSize: '0.68rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                                        <AlertTriangle size={12} /> Overbooking detectado: {o.over}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>

                    <ChartPanel title="Ocupación Detallada de Cupos por Servicio">
                        <div style={{ overflowX: 'auto' }}>
                            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.82rem' }}>
                                <thead>
                                    <tr style={{ borderBottom: '1px solid var(--border-glass)' }}>
                                        {['Item de Tour / Exclusión', 'Categoría', 'Cupos Libres', 'Cupos Vendidos', 'Cupos Bloqueados', 'Ocupación %', 'Overbooking'].map(h => (
                                            <th key={h} style={{ padding: '0.75rem 0.5rem', textAlign: 'left', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.04em', fontSize: '0.72rem' }}>{h}</th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody>
                                    {[
                                        { item: 'Yate VIP Ocean Voyager (Isla M.)', cat:tr("Yates"), av: 40, sold: 32, blk: 8, pct: 80, over: '0%' },
                                        { item: 'Cena Restaurante Porfirios Cancún', cat: 'Restaurante', av: 120, sold: 105, blk: 15, pct: 87.5, over: '0%' },
                                        { item: 'Excursión Ruinas de Tulum', cat: 'Tours', av: 80, sold: 78, blk: 4, pct: 97.5, over: '2.5%' },
                                        { item: 'Transfer Dreams Riviera Mercedes', cat: 'Transporte', av: 60, sold: 48, blk: 12, pct: 80, over: '0%' },
                                        { item: 'Hotel Paradisus Cancún Suite de Lujo', cat:tr("Hoteles"), av: 30, sold: 22, blk: 8, pct: 73.3, over: '0%' }
                                    ].map((srv, i) => (
                                        <tr key={i} style={{ borderBottom: '1px solid rgba(255,255,255,0.03)' }}>
                                            <td style={{ padding: '0.75rem 0.5rem', fontWeight: 600, color: 'white' }}>{srv.item}</td>
                                            <td style={{ padding: '0.75rem 0.5rem' }}><Badge label={srv.cat} color={srv.cat === tr("Yates") ? '#06b6d4' : srv.cat === 'Tours' ? '#8b5cf6' : srv.cat === 'Transporte' ? '#ec4899' : '#10b981'} /></td>
                                            <td style={{ padding: '0.75rem 0.5rem', color: 'white' }}>{srv.av - srv.sold - srv.blk}</td>
                                            <td style={{ padding: '0.75rem 0.5rem', color: 'white' }}>{srv.sold}</td>
                                            <td style={{ padding: '0.75rem 0.5rem', color: 'var(--text-muted)' }}>{srv.blk}</td>
                                            <td style={{ padding: '0.75rem 0.5rem', fontWeight: 700, color: srv.pct >= 85 ? '#10b981' : 'white' }}>{srv.pct}%</td>
                                            <td style={{ padding: '0.75rem 0.5rem', color: parseFloat(srv.over) > 0 ? '#ef4444' : 'var(--text-muted)', fontWeight: 700 }}>
                                                {parseFloat(srv.over) > 0 ? `⚠️ ${srv.over}` : 'Ninguno'}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </ChartPanel>
                </div>
            )}

            {/* RESERVATIONS DETAILED DRAWER (24 Fields) */}
            {selectedRes && (
                <div style={{
                    position: 'fixed',
                    top: 0,
                    right: 0,
                    width: 'min(480px, 100%)',
                    height: '100vh',
                    background: 'rgba(5, 7, 10, 0.95)',
                    backdropFilter: 'blur(25px)',
                    borderLeft: '1px solid var(--border-glass)',
                    boxShadow: 'var(--shadow-lg)',
                    zIndex: 2000,
                    display: 'flex',
                    flexDirection: 'column',
                    animation: 'slideIn 0.3s ease-out',
                    color: 'white'
                }}>
                    {/* Header */}
                    <div style={{ padding: '1.5rem', borderBottom: '1px solid var(--border-glass)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div>
                            <span style={{ fontSize: '0.72rem', color: 'var(--primary)', fontWeight: 700, textTransform: 'uppercase' }}>Ficha Completa de Reserva</span>
                            <h3 style={{ fontSize: '1.2rem', fontWeight: 800, margin: '0.2rem 0 0 0', color: 'white' }}>{selectedRes.id}</h3>
                        </div>
                        <button
                            onClick={() => setSelectedRes(null)}
                            style={{ background: 'rgba(255,255,255,0.05)', border: 'none', color: 'var(--text-muted)', width: 32, height: 32, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', transition: 'all 0.2s' }}
                            onMouseEnter={(e) => e.currentTarget.style.color = 'white'}
                            onMouseLeave={(e) => e.currentTarget.style.color = 'var(--text-muted)'}
                        >
                            <X size={18} />
                        </button>
                    </div>

                    {/* Content */}
                    <div style={{ padding: '1.5rem', flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                        
                        {/* Section 1: Identificación y Estado */}
                        <div>
                            <h4 style={{ fontSize: '0.8rem', color: 'var(--primary)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.75rem', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '0.25rem' }}>1. Estado & Identificación</h4>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', fontSize: '0.8rem' }}>
                                <div>
                                    <span style={{ color: 'var(--text-muted)' }}>Consecutivo</span>
                                    <div style={{ color: 'white', fontWeight: 600, marginTop: '0.15rem' }}>#{selectedRes.consecutivo}</div>
                                </div>
                                <div>
                                    <span style={{ color: 'var(--text-muted)' }}>Canal de Venta</span>
                                    <div style={{ color: 'white', fontWeight: 600, marginTop: '0.15rem' }}>{selectedRes.channel}</div>
                                </div>
                                <div>
                                    <span style={{ color: 'var(--text-muted)' }}>Fecha de Creación</span>
                                    <div style={{ color: 'white', fontWeight: 600, marginTop: '0.15rem' }}>{selectedRes.createdAt}</div>
                                </div>
                                <div>
                                    <span style={{ color: 'var(--text-muted)' }}>{tr("Estado")}</span>
                                    <div style={{ marginTop: '0.15rem' }}>
                                        <span style={{
                                            padding: '0.2rem 0.5rem',
                                            borderRadius: '5px',
                                            background: selectedRes.status === 'Confirmada' || selectedRes.status === 'Finalizada' ? '#10b98118' : '#f59e0b18',
                                            color: selectedRes.status === 'Confirmada' || selectedRes.status === 'Finalizada' ? '#10b981' : '#f59e0b',
                                            fontSize: '0.7rem',
                                            fontWeight: 700,
                                            border: `1px solid ${selectedRes.status === 'Confirmada' || selectedRes.status === 'Finalizada' ? '#10b98133' : '#f59e0b33'}`
                                        }}>{selectedRes.status}</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Section 2: Información del Cliente y Pasajeros */}
                        <div>
                            <h4 style={{ fontSize: '0.8rem', color: 'var(--primary)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.75rem', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '0.25rem' }}>2. Cliente & Pasajeros</h4>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem', fontSize: '0.8rem' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                    <span style={{ color: 'var(--text-muted)' }}>Cliente Principal</span>
                                    <strong style={{ color: 'white' }}>{selectedRes.customerName}</strong>
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                    <span style={{ color: 'var(--text-muted)' }}>Pasajeros Totales</span>
                                    <strong style={{ color: 'white' }}>{selectedRes.passengers}</strong>
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                    <span style={{ color: 'var(--text-muted)' }}>Desglose Pax</span>
                                    <strong style={{ color: 'white' }}>{selectedRes.paxBreakdown}</strong>
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                    <span style={{ color: 'var(--text-muted)' }}>Estado Documental</span>
                                    <strong style={{ color: '#10b981' }}>{selectedRes.documentState}</strong>
                                </div>
                            </div>
                        </div>

                        {/* Section 3: Destino y Servicios */}
                        <div>
                            <h4 style={{ fontSize: '0.8rem', color: 'var(--primary)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.75rem', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '0.25rem' }}>3. Destino & Servicios</h4>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem', fontSize: '0.8rem' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                    <span style={{ color: 'var(--text-muted)' }}>Paquete Contratado</span>
                                    <strong style={{ color: 'white', textAlign: 'right', maxWidth: '60%' }}>{selectedRes.packageName}</strong>
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                    <span style={{ color: 'var(--text-muted)' }}>Destino</span>
                                    <strong style={{ color: 'white' }}>📍 {selectedRes.destination}</strong>
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                    <span style={{ color: 'var(--text-muted)' }}>Hotel</span>
                                    <strong style={{ color: 'white' }}>🏨 {selectedRes.hotel}</strong>
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                    <span style={{ color: 'var(--text-muted)' }}>Transporte</span>
                                    <strong style={{ color: 'white' }}>🚐 {selectedRes.transport}</strong>
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                    <span style={{ color: 'var(--text-muted)' }}>Fecha de Viaje</span>
                                    <strong style={{ color: 'white' }}>📅 {selectedRes.date}</strong>
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                    <span style={{ color: 'var(--text-muted)' }}>Fecha de Regreso</span>
                                    <strong style={{ color: 'white' }}>📅 {selectedRes.returnDate}</strong>
                                </div>
                            </div>
                        </div>

                        {/* Section 4: Finanzas de la Reserva */}
                        <div>
                            <h4 style={{ fontSize: '0.8rem', color: 'var(--primary)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.75rem', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '0.25rem' }}>4. Desglose Financiero</h4>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem', fontSize: '0.8rem' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                    <span style={{ color: 'var(--text-muted)' }}>Valor Bruto</span>
                                    <span style={{ color: 'white' }}>${selectedRes.grossValue.toLocaleString()}</span>
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                    <span style={{ color: 'var(--text-muted)' }}>{tr("Cupones")}</span>
                                    <span style={{ color: '#ef4444' }}>-${selectedRes.discounts.toLocaleString()}</span>
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                    <span style={{ color: 'var(--text-muted)' }}>Impuestos (16%)</span>
                                    <span style={{ color: 'white' }}>+${selectedRes.taxes.toLocaleString()}</span>
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                    <span style={{ color: 'var(--text-muted)' }}>Comisión Asesor (10%)</span>
                                    <span style={{ color: '#f59e0b' }}>${selectedRes.commission.toLocaleString()}</span>
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid var(--border-glass)', paddingTop: '0.5rem' }}>
                                    <span style={{ color: 'white', fontWeight: 600 }}>Total Cobrado</span>
                                    <strong style={{ color: '#10b981', fontSize: '0.9rem' }}>${(selectedRes.grossValue + selectedRes.taxes - selectedRes.discounts).toLocaleString()} USD</strong>
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                    <span style={{ color: 'var(--text-muted)' }}>Método de Pago</span>
                                    <span style={{ color: 'white' }}>💳 {selectedRes.paymentMethod}</span>
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                    <span style={{ color: 'var(--text-muted)' }}>{tr("Total Pagado")}</span>
                                    <strong style={{ color: 'white' }}>${selectedRes.totalPaid.toLocaleString()} USD</strong>
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                    <span style={{ color: 'var(--text-muted)' }}>Saldo Pendiente</span>
                                    <strong style={{ color: selectedRes.pendingBalance > 0 ? '#ef4444' : 'var(--text-muted)' }}>${selectedRes.pendingBalance.toLocaleString()} USD</strong>
                                </div>
                            </div>
                        </div>

                        {/* Section 5: Operaciones y Auditoría */}
                        <div>
                            <h4 style={{ fontSize: '0.8rem', color: 'var(--primary)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.75rem', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '0.25rem' }}>5. Operaciones & Auditoría</h4>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem', fontSize: '0.8rem' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                    <span style={{ color: 'var(--text-muted)' }}>Usuario Creador</span>
                                    <strong style={{ color: 'white' }}>👤 {selectedRes.creatorUser}</strong>
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                    <span style={{ color: 'var(--text-muted)' }}>Agencia Asociada</span>
                                    <strong style={{ color: 'white' }}>🏢 {selectedRes.agency}</strong>
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                    <span style={{ color: 'var(--text-muted)' }}>Asesor</span>
                                    <strong style={{ color: 'white' }}>👔 {selectedRes.advisor}</strong>
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                    <span style={{ color: 'var(--text-muted)' }}>Confirmación Proveedores</span>
                                    <strong style={{ color: '#10b981' }}>{selectedRes.providerConfirmation}</strong>
                                </div>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem', marginTop: '0.4rem' }}>
                                    <span style={{ color: 'var(--text-muted)' }}>Observaciones Internas</span>
                                    <p style={{ margin: 0, padding: '0.6rem', background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border-glass)', borderRadius: '6px', fontSize: '0.75rem', color: 'rgba(255,255,255,0.8)', lineHeight: 1.4 }}>
                                        {selectedRes.observations}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <style jsx>{`
                        @keyframes slideIn {
                            from { transform: translateX(100%); }
                            to { transform: translateX(0); }
                        }
                    `}</style>
                </div>
            )}
        </div>
    );
}

// 2. FINANCIERO
function FinancieroModule({ period }: { period: Period }) {
    const [data, setData] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setLoading(true);
        getComprehensiveFinancialReports().then(res => {
            setData(res);
            setLoading(false);
        });
    }, [period]);

    if (loading) return <div style={{ display: 'flex', justifyContent: 'center', padding: '3rem' }}><Loader2 size={28} style={{ color: '#10b981', animation: 'spin 1s linear infinite' }} /></div>;

    const timeline = data?.timeline || [];
    const weeklyFin = period === 'semana'
        ? [
            { label: 'Lun', Ingresos: 4200, Ganancias: 2400, Reservas: 8 },
            { label: 'Mar', Ingresos: 6800, Ganancias: 3900, Reservas: 12 },
            { label: 'Mié', Ingresos: 5100, Ganancias: 2900, Reservas: 9 },
            { label: 'Jue', Ingresos: 8400, Ganancias: 4800, Reservas: 15 },
            { label: 'Vie', Ingresos: 12200, Ganancias: 7000, Reservas: 22 },
            { label: 'Sáb', Ingresos: 18500, Ganancias: 10600, Reservas: 31 },
            { label: 'Dom', Ingresos: 10800, Ganancias: 6200, Reservas: 19 },
        ]
        : timeline;

    const totalIngresos = weeklyFin.reduce((s: number, d: any) => s + d.Ingresos, 0);
    const totalGanancias = weeklyFin.reduce((s: number, d: any) => s + d.Ganancias, 0);
    const margen = totalIngresos > 0 ? ((totalGanancias / totalIngresos) * 100).toFixed(1) : '57.3';

    // Cuentas por cobrar aging
    const cxc = [
        { rango: '0–30 días', valor: 14200, clientes: 8, color: '#10b981' },
        { rango: '31–60 días', valor: 6800, clientes: 4, color: '#f59e0b' },
        { rango: '61–90 días', valor: 3200, clientes: 2, color: '#f97316' },
        { rango: '+90 días', valor: 1500, clientes: 1, color: '#ef4444' },
    ];

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <SectionHeader title="Reportes Financieros" subtitle="Control total de ingresos, cuentas por cobrar, rentabilidad y flujo de caja" icon={DollarSign} color="#10b981" />

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '1rem' }}>
                <KpiCard label="Revenue del Período" value={`$${totalIngresos.toLocaleString()}`} icon={TrendingUp} color="#10b981" trend={14} />
                <KpiCard label="Ganancia Neta" value={`$${totalGanancias.toLocaleString()}`} icon={DollarSign} color="#06b6d4" trend={9} />
                <KpiCard label="Margen Neto" value={`${margen}%`} icon={Target} color="#8b5cf6" trend={2} />
                <KpiCard label="CxC Pendiente" value="$25,700" icon={Clock} color="#f59e0b" trend={-3} sub="total por cobrar" />
                <KpiCard label="Reembolsos" value="$1,850" icon={ArrowDownRight} color="#ef4444" sub="3.2% del revenue" />
            </div>

            {/* Timeline financiero */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem' }}>
                <ChartPanel title="Ingresos vs Ganancias">
                    <TimelineAreaChart
                        data={weeklyFin.map((d: any) => ({ label: d.label, Ingresos: d.Ingresos, Ganancias: d.Ganancias }))}
                        series={[
                            { key: 'Ingresos', color: '#10b981', label: 'Ingresos' },
                            { key: 'Ganancias', color: '#06b6d4', label: 'Ganancias Netas' },
                        ]}
                        height={260}
                    />
                </ChartPanel>

                <ChartPanel title="Distribución por Categoría">
                    <PremiumDonutChart
                        data={data?.categories || [
                            { name:tr("Yates"), value: 42, fill: '#06b6d4' },
                            { name: 'Taxis', value: 18, fill: '#ec4899' },
                            { name:tr("Hoteles"), value: 15, fill: '#8b5cf6' },
                            { name: 'Excursiones', value: 13, fill: '#10b981' },
                            { name:tr("Restaurantes"), value: 12, fill: '#f59e0b' },
                        ]}
                        centerLabel="Ingresos"
                    />
                </ChartPanel>
            </div>

            {/* Cuentas por Cobrar */}
            <ChartPanel title="Cuentas por Cobrar — Aging">
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '1.5rem' }}>
                    {cxc.map((c, i) => (
                        <div key={i} className="glass-card" style={{ padding: '1rem' }}>
                            <Badge label={c.rango} color={c.color} />
                            <div style={{ fontSize: '1.4rem', fontWeight: 800, color: 'white', margin: '0.5rem 0 0.2rem' }}>${c.valor.toLocaleString()}</div>
                            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{c.clientes} clientes</div>
                            <MiniBar value={c.valor} max={14200} color={c.color} />
                        </div>
                    ))}
                </div>

                {/* Flujo de Caja Proyectado */}
                <h3 style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '1rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Flujo de Caja Proyectado</h3>
                <TimelineAreaChart
                    data={[
                        { label: 'Sem 1', Entradas: 28400, Salidas: 14200 },
                        { label: 'Sem 2', Entradas: 34800, Salidas: 16900 },
                        { label: 'Sem 3', Entradas: 29200, Salidas: 13800 },
                        { label: 'Sem 4', Entradas: 42100, Salidas: 19400 },
                    ]}
                    series={[
                        { key: 'Entradas', color: '#10b981', label: 'Entradas' },
                        { key: 'Salidas', color: '#ef4444', label: 'Salidas' },
                    ]}
                    height={220}
                />
            </ChartPanel>

            {/* Rentabilidad */}
            <ChartPanel title="Rentabilidad por Destino">
                <ComparativeBarChart
                    data={[
                        { category: 'Cancún', current: 42, previous: 38 },
                        { category: 'Tulum', current: 61, previous: 55 },
                        { category: 'Playa del C.', current: 38, previous: 41 },
                        { category: 'Cozumel', current: 55, previous: 50 },
                        { category: 'Isla M.', current: 48, previous: 44 },
                    ]}
                    currentLabel="Margen % Actual"
                    previousLabel="Margen % Anterior"
                    currentColor="#10b981"
                    previousColor="rgba(16,185,129,0.2)"
                    height={220}
                />
            </ChartPanel>
        </div>
    );
}

// 3. CLIENTES
function ClientesModule({ period }: { period: Period }) {
    const [data, setData] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setLoading(true);
        getClientReports().then(res => { setData(res); setLoading(false); });
    }, [period]);

    if (loading) return <div style={{ display: 'flex', justifyContent: 'center', padding: '3rem' }}><Loader2 size={28} style={{ color: '#06b6d4', animation: 'spin 1s linear infinite' }} /></div>;

    const weeklyClients = period === 'semana'
        ? [
            { label: 'Lun', clientes: 3, tasaRetorno: 14 },
            { label: 'Mar', clientes: 5, tasaRetorno: 18 },
            { label: 'Mié', clientes: 4, tasaRetorno: 16 },
            { label: 'Jue', clientes: 7, tasaRetorno: 22 },
            { label: 'Vie', clientes: 9, tasaRetorno: 25 },
            { label: 'Sáb', clientes: 14, tasaRetorno: 28 },
            { label: 'Dom', clientes: 8, tasaRetorno: 20 },
        ]
        : (data?.newClientsTimeline || []);

    const topClients = data?.topClients || [];
    const countryRanking = data?.countryRanking || [];

    const classificationData = [
        { name: 'VIP', value: 12, fill: '#f59e0b' },
        { name: 'Corporativo', value: 8, fill: '#8b5cf6' },
        { name: 'Recurrente', value: data?.recurrentCount || 4, fill: '#10b981' },
        { name:tr("Nuevo"), value: 24, fill: '#06b6d4' },
        { name: 'Riesgo Abandono', value: 3, fill: '#ef4444' },
    ];

    // Satisfacción NPS
    const satisfaccion = [
        { label: 'Hotel', value: 87, color: '#8b5cf6' },
        { label: 'Transporte', value: 94, color: '#10b981' },
        { label: 'Guía', value: 91, color: '#06b6d4' },
        { label: 'Soporte', value: 89, color: '#f59e0b' },
        { label: 'General', value: 92, color: '#ec4899' },
    ];

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <SectionHeader title="Reportes de Clientes" subtitle="Historial, fidelización, satisfacción y comportamiento turístico" icon={Users} color="#06b6d4" />

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '1rem' }}>
                <KpiCard label="Clientes Totales" value={topClients.length || 51} icon={Users} color="#06b6d4" trend={18} />
                <KpiCard label="Clientes Recurrentes" value={data?.recurrentCount || 4} icon={Star} color="#f59e0b" trend={5} />
                <KpiCard label="NPS Score" value="72" icon={Target} color="#10b981" trend={4} sub="Promotores netos" />
                <KpiCard label="Lifetime Value" value="$3,850" icon={DollarSign} color="#8b5cf6" trend={11} />
                <KpiCard label="Clientes Inactivos" value={3} icon={Clock} color="#ef4444" sub="+90 días sin compra" />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: '1.25rem' }}>
                <ChartPanel title="Nuevos Clientes y Tasa de Retorno">
                    <TimelineAreaChart
                        data={weeklyClients.map((d: any) => ({ label: d.label, 'Nuevos Clientes': d.clientes, 'Tasa Retorno %': d.tasaRetorno }))}
                        series={[
                            { key: 'Nuevos Clientes', color: '#06b6d4', label: 'Nuevos Clientes' },
                            { key: 'Tasa Retorno %', color: '#10b981', label: 'Retorno %' },
                        ]}
                        height={260}
                    />
                </ChartPanel>
                <ChartPanel title="Clasificación de Clientes">
                    <PremiumDonutChart data={classificationData} centerLabel="Clientes" />
                </ChartPanel>
            </div>

            {/* Top Clientes */}
            <ChartPanel title="Top Clientes por Gasto Acumulado">
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    {topClients.slice(0, 8).map((c: any, i: number) => (
                        <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '0.65rem 0.75rem', background: 'rgba(255,255,255,0.03)', borderRadius: 10, border: '1px solid var(--border-glass)' }}>
                            <div style={{ width: 28, height: 28, borderRadius: '50%', background: `hsl(${i * 47 + 200}, 70%, 50%)`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.75rem', fontWeight: 800, color: 'white', flexShrink: 0 }}>
                                {c.name?.charAt(0) || '?'}
                            </div>
                            <div style={{ flex: 1, minWidth: 0 }}>
                                <div style={{ fontSize: '0.85rem', fontWeight: 600, color: 'white', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{c.name}</div>
                                <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>{c.country} · {c.count} viaje{c.count !== 1 ? 's' : ''}</div>
                            </div>
                            <div style={{ textAlign: 'right', flexShrink: 0 }}>
                                <div style={{ fontSize: '0.9rem', fontWeight: 700, color: '#10b981' }}>${c.spent.toLocaleString()}</div>
                                <MiniBar value={c.spent} max={topClients[0]?.spent || 1} color="#10b981" />
                            </div>
                        </div>
                    ))}
                </div>
            </ChartPanel>

            {/* Satisfacción */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem' }}>
                <ChartPanel title="Satisfacción del Cliente (NPS por Área)">
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        {satisfaccion.map((s, i) => (
                            <div key={i}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.3rem' }}>
                                    <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>{s.label}</span>
                                    <span style={{ fontSize: '0.82rem', fontWeight: 700, color: s.color }}>{s.value}/100</span>
                                </div>
                                <MiniBar value={s.value} max={100} color={s.color} />
                            </div>
                        ))}
                    </div>
                </ChartPanel>
                <ChartPanel title="Origen por País">
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                        {countryRanking.slice(0, 6).map((c: any, i: number) => (
                            <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.5rem 0' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                    <span style={{ fontSize: '1rem' }}>
                                        {c.name === 'Estados Unidos' ? '🇺🇸' : c.name === 'México' ? '🇲🇽' : c.name === 'España' ? '🇪🇸' : c.name === 'Canadá' ? '🇨🇦' : c.name === 'Francia' ? '🇫🇷' : '🌍'}
                                    </span>
                                    <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>{c.name}</span>
                                </div>
                                <div style={{ textAlign: 'right' }}>
                                    <div style={{ fontSize: '0.82rem', fontWeight: 700, color: 'white' }}>${c.revenue.toLocaleString()}</div>
                                    <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>{c.bookings} reservas</div>
                                </div>
                            </div>
                        ))}
                    </div>
                </ChartPanel>
            </div>
        </div>
    );
}

// 4. VENTAS
function VentasModule({ period }: { period: Period }) {
    const [data, setData] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setLoading(true);
        Promise.all([getTaxiDriverReports(), getPackageReports()]).then(([taxi, pkg]) => {
            setData({ taxi, pkg });
            setLoading(false);
        });
    }, [period]);

    if (loading) return <div style={{ display: 'flex', justifyContent: 'center', padding: '3rem' }}><Loader2 size={28} style={{ color: '#f59e0b', animation: 'spin 1s linear infinite' }} /></div>;

    const drivers = data?.taxi?.topDrivers || [];

    const weeklyConversion = period === 'semana'
        ? [
            { label: 'Lun', Leads: 18, Ventas: 3 },
            { label: 'Mar', Leads: 24, Ventas: 5 },
            { label: 'Mié', Leads: 21, Ventas: 4 },
            { label: 'Jue', Leads: 31, Ventas: 7 },
            { label: 'Vie', Leads: 45, Ventas: 11 },
            { label: 'Sáb', Leads: 62, Ventas: 18 },
            { label: 'Dom', Leads: 38, Ventas: 9 },
        ]
        : [
            { label: 'Ene', Leads: 95, Ventas: 14 },
            { label: 'Feb', Leads: 120, Ventas: 19 },
            { label: 'Mar', Leads: 145, Ventas: 24 },
            { label: 'Abr', Leads: 132, Ventas: 21 },
            { label: 'May', Leads: 168, Ventas: 28 },
        ];

    const funnel = [
        { stage: 'Leads', count: 239, color: '#8b5cf6' },
        { stage: 'Contactados', count: 198, color: '#a78bfa' },
        { stage: 'Cotizados', count: 142, color: '#06b6d4' },
        { stage: 'Negociación', count: 87, color: '#f59e0b' },
        { stage: 'Reservados', count: 54, color: '#10b981' },
        { stage: 'Pagados', count: 45, color: '#34d399' },
    ];

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <SectionHeader title="Reportes de Ventas" subtitle="Desempeño de asesores, embudo comercial y análisis de cotizaciones" icon={ShoppingCart} color="#f59e0b" />

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '1rem' }}>
                <KpiCard label="Ventas del Período" value="$65,400" icon={DollarSign} color="#f59e0b" trend={16} />
                <KpiCard label="Conversión Leads" value="18.8%" icon={Target} color="#10b981" trend={2.4} />
                <KpiCard label="Tiempo Cierre" value="4.2d" icon={Clock} color="#06b6d4" sub="promedio" />
                <KpiCard label="Cotizaciones Abiertas" value={12} icon={FileText} color="#8b5cf6" />
                <KpiCard label="Top Asesor" value={drivers[0]?.name?.split(' ')[0] || 'Carlos'} icon={Star} color="#ec4899" sub="Esta semana" />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem' }}>
                <ChartPanel title="Leads vs Ventas Cerradas">
                    <TimelineAreaChart
                        data={weeklyConversion.map(d => ({ label: d.label, Leads: d.Leads, Ventas: d.Ventas }))}
                        series={[
                            { key: 'Leads', color: '#8b5cf6', label: 'Leads' },
                            { key:tr("Ventas"), color: '#f59e0b', label:tr("Ventas") },
                        ]}
                        height={260}
                    />
                </ChartPanel>

                {/* Embudo */}
                <ChartPanel title="Embudo Comercial (Funnel)">
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                        {funnel.map((f, i) => (
                            <div key={i} style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                    <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>{f.stage}</span>
                                    <span style={{ fontSize: '0.78rem', fontWeight: 700, color: 'white' }}>{f.count}</span>
                                </div>
                                <div style={{ height: 18, background: 'rgba(255,255,255,0.05)', borderRadius: 4, overflow: 'hidden' }}>
                                    <div style={{ height: '100%', width: `${(f.count / funnel[0].count) * 100}%`, background: `linear-gradient(90deg, ${f.color}bb, ${f.color})`, borderRadius: 4, transition: 'width 1s ease', display: 'flex', alignItems: 'center', justifyContent: 'flex-end', paddingRight: '0.4rem' }}>
                                        <span style={{ fontSize: '0.65rem', color: 'white', fontWeight: 700 }}>{((f.count / funnel[0].count) * 100).toFixed(0)}%</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </ChartPanel>
            </div>

            {/* Ranking Asesores */}
            <ChartPanel title="Ranking de Asesores / Conductores">
                <ComparativeBarChart
                    data={drivers.slice(0, 5).map((d: any) => ({
                        category: d.name.split(' ')[0],
                        current: d.bookings,
                        previous: Math.round(d.bookings * 0.85)
                    }))}
                    currentLabel="Reservas Actuales"
                    previousLabel="Período Anterior"
                    currentColor="#f59e0b"
                    previousColor="rgba(245,158,11,0.2)"
                    height={220}
                />
            </ChartPanel>
        </div>
    );
}

// 5. OPERATIVO
function OperativoModule({ period }: { period: Period }) {
    const [data, setData] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setLoading(true);
        getOperationalReports().then(res => { setData(res); setLoading(false); });
    }, [period]);

    if (loading) return <div style={{ display: 'flex', justifyContent: 'center', padding: '3rem' }}><Loader2 size={28} style={{ color: '#06b6d4', animation: 'spin 1s linear infinite' }} /></div>;

    const hourly = data?.hourlyDistribution || [];
    const incidencias = [
        { tipo: 'Retrasos', count: 3, impact: 'Bajo', color: '#f59e0b' },
        { tipo: 'Cancelaciones', count: 1, impact: 'Alto', color: '#ef4444' },
        { tipo: 'Quejas', count: 2, impact: 'Medio', color: '#f97316' },
        { tipo: 'Prob. Hotel', count: 1, impact: 'Medio', color: '#8b5cf6' },
    ];

    const checkInData = [
        { label: '08:00', Entradas: 4, Salidas: 2 },
        { label: '10:00', Entradas: 8, Salidas: 5 },
        { label: '12:00', Entradas: 6, Salidas: 9 },
        { label: '14:00', Entradas: 3, Salidas: 11 },
        { label: '16:00', Entradas: 7, Salidas: 6 },
        { label: '18:00', Entradas: 12, Salidas: 4 },
        { label: '20:00', Entradas: 9, Salidas: 3 },
    ];

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <SectionHeader title="Reportes Operativos" subtitle="Check-in/out, itinerarios, incidencias y flujo de viajeros" icon={Activity} color="#06b6d4" />

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '1rem' }}>
                <KpiCard label="Check-ins Hoy" value={24} icon={CheckCircle} color="#10b981" trend={8} />
                <KpiCard label="No Shows" value={2} icon={AlertTriangle} color="#ef4444" sub="esta semana" />
                <KpiCard label="Incidencias" value={7} icon={Bell} color="#f59e0b" trend={-15} />
                <KpiCard label="Ocupación" value="78.4%" icon={Target} color="#8b5cf6" trend={3} />
                <KpiCard label="T. Resolución" value="2.4h" icon={Clock} color="#06b6d4" sub="promedio" />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem' }}>
                <ChartPanel title="Check-in / Check-out por Hora">
                    <TimelineAreaChart
                        data={checkInData.map(d => ({ label: d.label, Entradas: d.Entradas, Salidas: d.Salidas }))}
                        series={[
                            { key: 'Entradas', color: '#10b981', label: 'Check-in' },
                            { key: 'Salidas', color: '#06b6d4', label: 'Check-out' },
                        ]}
                        height={240}
                    />
                </ChartPanel>

                <ChartPanel title="Distribución de Reservas por Hora">
                    <ComparativeBarChart
                        data={hourly.map((h: any) => ({
                            category: h.hora,
                            current: h.reservas,
                            previous: Math.round(h.reservas * 0.9)
                        }))}
                        currentLabel={tr("Esta Semana")}
                        previousLabel="Semana Ant."
                        currentColor="#06b6d4"
                        previousColor="rgba(6,182,212,0.2)"
                        height={240}
                    />
                </ChartPanel>
            </div>

            {/* Incidencias */}
            <ChartPanel title="Incidencias Operativas">
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1rem', marginBottom: '1.5rem' }}>
                    {incidencias.map((inc, i) => (
                        <div key={i} className="glass-card" style={{ padding: '1rem' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                                <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'white' }}>{inc.tipo}</span>
                                <Badge label={inc.impact} color={inc.color} />
                            </div>
                            <div style={{ fontSize: '1.8rem', fontWeight: 800, color: inc.color }}>{inc.count}</div>
                            <MiniBar value={inc.count} max={4} color={inc.color} />
                        </div>
                    ))}
                </div>

                <TimelineAreaChart
                    data={period === 'semana'
                        ? [
                            { label: 'Lun', Incidencias: 1, Resueltas: 1 },
                            { label: 'Mar', Incidencias: 2, Resueltas: 1 },
                            { label: 'Mié', Incidencias: 0, Resueltas: 2 },
                            { label: 'Jue', Incidencias: 1, Resueltas: 0 },
                            { label: 'Vie', Incidencias: 2, Resueltas: 2 },
                            { label: 'Sáb', Incidencias: 3, Resueltas: 2 },
                            { label: 'Dom', Incidencias: 1, Resueltas: 1 },
                        ]
                        : [
                            { label: 'Sem 1', Incidencias: 8, Resueltas: 7 },
                            { label: 'Sem 2', Incidencias: 5, Resueltas: 5 },
                            { label: 'Sem 3', Incidencias: 10, Resueltas: 8 },
                            { label: 'Sem 4', Incidencias: 7, Resueltas: 7 },
                        ]
                    }
                    series={[
                        { key: 'Incidencias', color: '#ef4444', label: 'Incidencias' },
                        { key: 'Resueltas', color: '#10b981', label: 'Resueltas' },
                    ]}
                    height={200}
                />
            </ChartPanel>
        </div>
    );
}

// 6. PROVEEDORES
function ProveedoresModule({ period }: { period: Period }) {
    const [data, setData] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setLoading(true);
        Promise.all([getYachtReports(), getRestaurantReports(), getTaxiDriverReports()]).then(([yachts, rests, taxi]) => {
            setData({ yachts, rests, taxi });
            setLoading(false);
        });
    }, [period]);

    if (loading) return <div style={{ display: 'flex', justifyContent: 'center', padding: '3rem' }}><Loader2 size={28} style={{ color: '#ec4899', animation: 'spin 1s linear infinite' }} /></div>;

    const proveedores = [
        { nombre: 'Ocean Voyager (Yate)', tipo: 'Yate', puntualidad: 98, calificacion: 4.9, cancelaciones: 0, costos: '$3,500/día', sla: 'Cumple' },
        { nombre: 'Carlos Mendoza', tipo: 'Taxi', puntualidad: 97, calificacion: 4.9, cancelaciones: 0, costos: '$120/viaje', sla: 'Cumple' },
        { nombre: 'Porfirios Cancún', tipo: 'Restaurante', puntualidad: 95, calificacion: 4.7, cancelaciones: 1, costos: '$65/pax', sla: 'Cumple' },
        { nombre: 'Hotel Dreams Cancún', tipo: 'Hotel', puntualidad: 92, calificacion: 4.6, cancelaciones: 0, costos: '$280/noche', sla: 'Cumple' },
        { nombre: 'AeroMéxico', tipo: 'Aerolínea', puntualidad: 84, calificacion: 4.1, cancelaciones: 2, costos: 'Variable', sla: 'Parcial' },
    ];

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <SectionHeader title="Reportes de Proveedores" subtitle="Desempeño, pagos y cumplimiento SLA de aliados comerciales" icon={Briefcase} color="#ec4899" />

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '1rem' }}>
                <KpiCard label="Proveedores Activos" value={18} icon={Briefcase} color="#ec4899" />
                <KpiCard label="SLA Cumplimiento" value="94.2%" icon={CheckCircle} color="#10b981" trend={2} />
                <KpiCard label="Facturas Pendientes" value={4} icon={CreditCard} color="#f59e0b" sub="vencimiento próx." />
                <KpiCard label="Rating Promedio" value="4.7 ⭐" icon={Star} color="#f59e0b" />
                <KpiCard label="Pagos Este Mes" value="$48,200" icon={DollarSign} color="#8b5cf6" />
            </div>

            <ChartPanel title="Desempeño de Proveedores — Puntualidad y Calificación">
                <ComparativeBarChart
                    data={proveedores.map(p => ({
                        category: p.nombre.split(' ')[0],
                        current: p.puntualidad,
                        previous: Math.round(p.puntualidad * 0.95)
                    }))}
                    currentLabel="Puntualidad Actual %"
                    previousLabel="Período Anterior %"
                    currentColor="#ec4899"
                    previousColor="rgba(236,72,153,0.2)"
                    height={220}
                />
            </ChartPanel>

            {/* Tabla proveedores */}
            <ChartPanel title="Detalle de Proveedores">
                <div style={{ overflowX: 'auto' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                        <thead>
                            <tr style={{ borderBottom: '1px solid var(--border-glass)' }}>
                                {['Proveedor', 'Tipo', 'Puntualidad', 'Calif.', 'Cancelaciones', 'SLA'].map(h => (
                                    <th key={h} style={{ padding: '0.75rem 0.5rem', textAlign: 'left', fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.04em' }}>{h}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {proveedores.map((p, i) => (
                                <tr key={i} style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                                    <td style={{ padding: '0.75rem 0.5rem', fontSize: '0.85rem', fontWeight: 600, color: 'white' }}>{p.nombre}</td>
                                    <td style={{ padding: '0.75rem 0.5rem' }}><Badge label={p.tipo} color={p.tipo === 'Yate' ? '#06b6d4' : p.tipo === 'Taxi' ? '#ec4899' : p.tipo === 'Hotel' ? '#8b5cf6' : p.tipo === 'Restaurante' ? '#f59e0b' : '#94a3b8'} /></td>
                                    <td style={{ padding: '0.75rem 0.5rem', fontSize: '0.85rem', color: p.puntualidad >= 95 ? '#10b981' : p.puntualidad >= 88 ? '#f59e0b' : '#ef4444', fontWeight: 700 }}>{p.puntualidad}%</td>
                                    <td style={{ padding: '0.75rem 0.5rem', fontSize: '0.85rem', color: 'white', fontWeight: 600 }}>{'⭐'.repeat(Math.round(p.calificacion))} {p.calificacion}</td>
                                    <td style={{ padding: '0.75rem 0.5rem', fontSize: '0.85rem', color: p.cancelaciones === 0 ? '#10b981' : p.cancelaciones < 2 ? '#f59e0b' : '#ef4444', fontWeight: 700 }}>{p.cancelaciones}</td>
                                    <td style={{ padding: '0.75rem 0.5rem' }}><Badge label={p.sla} color={p.sla === 'Cumple' ? '#10b981' : '#f59e0b'} /></td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </ChartPanel>

            {/* Pagos Proveedores */}
            <ChartPanel title="Flujo de Pagos a Proveedores">
                <TimelineAreaChart
                    data={period === 'semana'
                        ? [
                            { label: 'Lun', Pagado: 8200, Pendiente: 3400 },
                            { label: 'Mar', Pagado: 0, Pendiente: 6800 },
                            { label: 'Mié', Pagado: 12400, Pendiente: 2100 },
                            { label: 'Jue', Pagado: 4800, Pendiente: 8900 },
                            { label: 'Vie', Pagado: 9600, Pendiente: 0 },
                            { label: 'Sáb', Pagado: 0, Pendiente: 14200 },
                            { label: 'Dom', Pagado: 0, Pendiente: 3500 },
                        ]
                        : [
                            { label: 'Sem 1', Pagado: 22000, Pendiente: 8400 },
                            { label: 'Sem 2', Pagado: 18000, Pendiente: 12000 },
                            { label: 'Sem 3', Pagado: 31000, Pendiente: 6200 },
                            { label: 'Sem 4', Pagado: 14000, Pendiente: 9800 },
                        ]
                    }
                    series={[
                        { key: 'Pagado', color: '#10b981', label: 'Pagado' },
                        { key: 'Pendiente', color: '#f59e0b', label: 'Pendiente' },
                    ]}
                    height={220}
                />
            </ChartPanel>
        </div>
    );
}

// 7. MARKETING
function MarketingModule({ period }: { period: Period }) {
    const [data, setData] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setLoading(true);
        getMarketingReports().then(res => { setData(res); setLoading(false); });
    }, [period]);

    if (loading) return <div style={{ display: 'flex', justifyContent: 'center', padding: '3rem' }}><Loader2 size={28} style={{ color: '#a78bfa', animation: 'spin 1s linear infinite' }} /></div>;

    const trafficSources = data?.trafficSources || [];
    const campaigns = data?.campaigns || [];

    const weeklyLeads = period === 'semana'
        ? [
            { label: 'Lun', Google: 48, Instagram: 32, TikTok: 25, Facebook: 14 },
            { label: 'Mar', Google: 62, Instagram: 45, TikTok: 38, Facebook: 22 },
            { label: 'Mié', Google: 55, Instagram: 38, TikTok: 31, Facebook: 18 },
            { label: 'Jue', Google: 74, Instagram: 52, TikTok: 44, Facebook: 26 },
            { label: 'Vie', Google: 91, Instagram: 67, TikTok: 58, Facebook: 34 },
            { label: 'Sáb', Google: 108, Instagram: 84, TikTok: 72, Facebook: 41 },
            { label: 'Dom', Google: 78, Instagram: 61, TikTok: 52, Facebook: 29 },
        ]
        : [
            { label: 'Ene', Google: 380, Instagram: 290, TikTok: 210, Facebook: 140 },
            { label: 'Feb', Google: 420, Instagram: 340, TikTok: 260, Facebook: 160 },
            { label: 'Mar', Google: 510, Instagram: 390, TikTok: 295, Facebook: 175 },
            { label: 'Abr', Google: 480, Instagram: 360, TikTok: 280, Facebook: 165 },
            { label: 'May', Google: 560, Instagram: 415, TikTok: 320, Facebook: 190 },
        ];

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <SectionHeader title="Reportes de Marketing" subtitle="Campañas, origen de clientes, CAC y ROI por canal" icon={Target} color="#a78bfa" />

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '1rem' }}>
                <KpiCard label="Leads del Período" value={516} icon={Users} color="#a78bfa" trend={22} />
                <KpiCard label="CAC Promedio" value="$42" icon={DollarSign} color="#f59e0b" trend={-8} sub="Costo por cliente" />
                <KpiCard label="ROI Campañas" value="3.8x" icon={TrendingUp} color="#10b981" trend={18} />
                <KpiCard label="CTR Google" value="4.2%" icon={Globe} color="#4285f4" trend={0.4} />
                <KpiCard label="Conversión Redes" value="6.8%" icon={Target} color="#e1306c" trend={1.1} />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: '1.25rem' }}>
                <ChartPanel title="Leads por Canal y Período">
                    <TimelineAreaChart
                        data={weeklyLeads.map(d => ({ label: d.label, Google: d.Google, Instagram: d.Instagram, TikTok: d.TikTok }))}
                        series={[
                            { key: 'Google', color: '#4285f4', label: 'Google Ads' },
                            { key: 'Instagram', color: '#e1306c', label: 'Instagram' },
                            { key: 'TikTok', color: '#00f2fe', label: 'TikTok' },
                        ]}
                        height={260}
                    />
                </ChartPanel>

                <ChartPanel title="Distribución de Tráfico">
                    <PremiumDonutChart
                        data={trafficSources.length > 0 ? trafficSources : [
                            { name: 'Google', value: 450, fill: '#4285f4' },
                            { name: 'Instagram', value: 380, fill: '#e1306c' },
                            { name: 'TikTok', value: 290, fill: '#00f2fe' },
                            { name: 'Facebook', value: 180, fill: '#1877f2' },
                            { name: 'Orgánico', value: 120, fill: '#10b981' },
                        ]}
                        centerLabel="Visitantes"
                    />
                </ChartPanel>
            </div>

            {/* Campañas */}
            <ChartPanel title="Campañas Activas — Performance">
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                    {campaigns.map((c: any, i: number) => (
                        <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem', background: 'rgba(255,255,255,0.03)', borderRadius: 12, border: '1px solid var(--border-glass)' }}>
                            <div>
                                <div style={{ fontSize: '0.9rem', fontWeight: 600, color: 'white', marginBottom: '0.25rem' }}>{c.name}</div>
                                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Código: <span style={{ color: 'var(--primary)', fontWeight: 600 }}>{c.code}</span> · {c.discount}% descuento</div>
                            </div>
                            <div style={{ textAlign: 'right' }}>
                                <div style={{ fontSize: '1rem', fontWeight: 700, color: '#10b981' }}>${c.revenue.toLocaleString()}</div>
                                <Badge label={c.used ? 'Activa' : 'Pausada'} color={c.used ? '#10b981' : '#94a3b8'} />
                            </div>
                        </div>
                    ))}
                </div>
            </ChartPanel>
        </div>
    );
}

// 8. DESTINOS (Mapa)
function DestinosModule({ period }: { period: Period }) {
    const [data, setData] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setLoading(true);
        getDestinationReports().then(res => { setData(res); setLoading(false); });
    }, [period]);

    if (loading) return <div style={{ display: 'flex', justifyContent: 'center', padding: '3rem' }}><Loader2 size={28} style={{ color: '#3b82f6', animation: 'spin 1s linear infinite' }} /></div>;

    const hotspots = data?.hotspots || [];

    const weeklyDest = period === 'semana'
        ? [
            { label: 'Lun', Cancún: 14, Tulum: 6, 'Playa del C.': 9 },
            { label: 'Mar', Cancún: 18, Tulum: 9, 'Playa del C.': 12 },
            { label: 'Mié', Cancún: 15, Tulum: 7, 'Playa del C.': 10 },
            { label: 'Jue', Cancún: 22, Tulum: 11, 'Playa del C.': 14 },
            { label: 'Vie', Cancún: 31, Tulum: 15, 'Playa del C.': 18 },
            { label: 'Sáb', Cancún: 48, Tulum: 22, 'Playa del C.': 27 },
            { label: 'Dom', Cancún: 29, Tulum: 14, 'Playa del C.': 19 },
        ]
        : hotspots.map((h: any) => ({ label: h.name, Reservas: h.bookings, Ingresos: h.revenue }));

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <SectionHeader title="Reportes de Destinos" subtitle="Análisis de ocupación, ranking geográfico y tendencias por destino" icon={Map} color="#3b82f6" />

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '1rem' }}>
                <KpiCard label="Destino Top" value="Cancún" icon={Map} color="#3b82f6" sub="125 reservas" />
                <KpiCard label="Destinos Activos" value={5} icon={Globe} color="#06b6d4" />
                <KpiCard label="Pasajeros Movilizados" value="1,248" icon={Users} color="#10b981" trend={14} />
                <KpiCard label="Ingresos Totales" value="$1.02M" icon={DollarSign} color="#f59e0b" trend={19} />
                <KpiCard label="Cancelaciones" value="4.2%" icon={X} color="#ef4444" trend={-2} />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem' }}>
                <ChartPanel title="Mapa Interactivo de Calor">
                    <InteractiveHeatMap />
                </ChartPanel>
                <ChartPanel title="Tendencia Semanal por Destino">
                    {period === 'semana' ? (
                        <TimelineAreaChart
                            data={weeklyDest.map((d: any) => ({ label: d.label, Cancún: d.Cancún, Tulum: d.Tulum, 'Playa del C.': d['Playa del C.'] }))}
                            series={[
                                { key: 'Cancún', color: '#3b82f6', label: 'Cancún' },
                                { key: 'Tulum', color: '#10b981', label: 'Tulum' },
                                { key: 'Playa del C.', color: '#f59e0b', label: 'Playa del C.' },
                            ]}
                            height={260}
                        />
                    ) : (
                        <ComparativeBarChart
                            data={hotspots.map((h: any) => ({
                                category: h.name,
                                current: h.bookings,
                                previous: Math.round(h.bookings * 0.85)
                            }))}
                            currentLabel="Actual"
                            previousLabel="Anterior"
                            currentColor="#3b82f6"
                            previousColor="rgba(59,130,246,0.2)"
                            height={260}
                        />
                    )}
                </ChartPanel>
            </div>

            {/* Ranking destinos */}
            <ChartPanel title="Ranking de Destinos">
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                    {hotspots.map((h: any, i: number) => (
                        <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '0.75rem', background: 'rgba(255,255,255,0.03)', borderRadius: 10 }}>
                            <div style={{ width: 28, height: 28, borderRadius: 8, background: i === 0 ? '#f59e0b22' : 'rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.8rem', fontWeight: 800, color: i === 0 ? '#f59e0b' : 'var(--text-muted)' }}>
                                #{i + 1}
                            </div>
                            <div style={{ flex: 1 }}>
                                <div style={{ fontSize: '0.88rem', fontWeight: 600, color: 'white', marginBottom: '0.25rem' }}>{h.name}</div>
                                <MiniBar value={h.bookings} max={hotspots[0]?.bookings || 1} color={['#3b82f6', '#10b981', '#8b5cf6', '#06b6d4', '#f59e0b'][i] || '#8b5cf6'} />
                            </div>
                            <div style={{ textAlign: 'right', flexShrink: 0 }}>
                                <div style={{ fontSize: '0.9rem', fontWeight: 700, color: 'white' }}>{h.bookings} reservas</div>
                                <div style={{ fontSize: '0.75rem', color: '#10b981', fontWeight: 600 }}>${h.revenue.toLocaleString()}</div>
                            </div>
                            <Badge label={h.trend === 'up' ? '↑ Sube' : h.trend === 'down' ? '↓ Baja' : '→ Estable'} color={h.trend === 'up' ? '#10b981' : h.trend === 'down' ? '#ef4444' : '#94a3b8'} />
                        </div>
                    ))}
                </div>
            </ChartPanel>
        </div>
    );
}

// 9. BI ESTRATÉGICO
function BIModule({ period }: { period: Period }) {
    const [data, setData] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setLoading(true);
        Promise.all([getAdminDashboardKPIs(), getComprehensiveFinancialReports()]).then(([kpi, fin]) => {
            setData({ kpi, fin });
            setLoading(false);
        });
    }, [period]);

    if (loading) return <div style={{ display: 'flex', justifyContent: 'center', padding: '3rem' }}><Loader2 size={28} style={{ color: '#f43f5e', animation: 'spin 1s linear infinite' }} /></div>;

    const kpiData = data?.kpi?.data || {};
    const fin = data?.fin || {};
    const timeline = fin?.timeline || [];

    const forecastData = period === 'semana'
        ? [
            { label: 'Lun', Real: 4200, Proyectado: 4000 },
            { label: 'Mar', Real: 6800, Proyectado: 6200 },
            { label: 'Mié', Real: 5100, Proyectado: 5500 },
            { label: 'Jue', Real: 8400, Proyectado: 7800 },
            { label: 'Vie', Real: 12200, Proyectado: 11000 },
            { label: 'Sáb', Real: 18500, Proyectado: 16800 },
            { label: 'Dom', Real: null as any, Proyectado: 12400 },
        ]
        : [...(timeline || []).map((t: any) => ({ label: t.label, Real: t.Ingresos, Proyectado: Math.round(t.Ingresos * 1.12) })),
        { label: 'Próx.', Real: null as any, Proyectado: Math.round((timeline[timeline.length - 1]?.Ingresos || 35000) * 1.15) }
        ];

    const comparativo = fin?.compare || [
        { category: 'Ingresos', current: 48200, previous: 42100 },
        { category: 'Ganancias', current: 27500, previous: 24000 },
        { category: 'Ticket Prom.', current: 1308, previous: 1180 },
    ];

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <SectionHeader title="Dashboard Ejecutivo & BI Estratégico" subtitle="Dashboard ejecutivo, predicciones de demanda y comparativos históricos" icon={BarChart2} color="#f43f5e" />

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '1rem' }}>
                <KpiCard label="Revenue Total" value={`$${(kpiData.totalRevenue || 58900).toLocaleString()}`} icon={DollarSign} color="#10b981" trend={14} />
                <KpiCard label={tr("Reservas Activas")} value={kpiData.totalReservations || 45} icon={Calendar} color="#8b5cf6" trend={12} />
                <KpiCard label="Clientes Nuevos" value={kpiData.newClients || 18} icon={Users} color="#06b6d4" trend={22} />
                <KpiCard label="Destino Top" value={kpiData.topDest || 'Cancún'} icon={Map} color="#3b82f6" />
                <KpiCard label={tr("Conversión")} value={`${kpiData.conversion || 6.8}%`} icon={Target} color="#f59e0b" trend={1.2} />
                <KpiCard label="Reembolsos" value="3.1%" icon={ArrowDownRight} color="#ef4444" trend={-0.8} />
            </div>

            {/* Forecast & Real */}
            <ChartPanel title="Forecast vs Real — Proyección de Demanda">
                <TimelineAreaChart
                    data={forecastData.filter(d => d.Real !== null || d.Proyectado !== null).map(d => ({
                        label: d.label,
                        Real: d.Real || 0,
                        Proyectado: d.Proyectado
                    }))}
                    series={[
                        { key: 'Real', color: '#8b5cf6', label: 'Real' },
                        { key: 'Proyectado', color: '#f43f5e', label: 'Proyectado' },
                    ]}
                    height={280}
                />
            </ChartPanel>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem' }}>
                {/* Comparativo período */}
                <ChartPanel title="Comparativo de Períodos">
                    <ComparativeBarChart
                        data={comparativo.map((c: any) => ({
                            category: c.category,
                            current: c.current,
                            previous: c.previous
                        }))}
                        currentLabel="Período Actual"
                        previousLabel="Período Anterior"
                        currentColor="#f43f5e"
                        previousColor="rgba(244,63,94,0.2)"
                        height={240}
                    />
                </ChartPanel>

                {/* Predicciones de riesgo */}
                <ChartPanel title="Alertas Predictivas">
                    {[
                        { tipo: '⚠️ Alta Demanda', desc: 'Semana del 6–12 Jun. Cancún y Tulum. Ocupación esperada >92%.', nivel: 'warning', color: '#f59e0b' },
                        { tipo: '📉 Baja Ocupación', desc: 'Semana del 27 Jun–3 Jul. Temporada baja. Oportunidad de descuentos.', nivel: 'info', color: '#8b5cf6' },
                        { tipo: '💰 Riesgo Financiero', desc: 'CxC de más de 60 días: $4,700. Requiere gestión de cobranza.', nivel: 'danger', color: '#ef4444' },
                        { tipo: '🔒 Cancelaciones', desc: 'Predicción: 3.8% cancelaciones por temporada de lluvias Ago.', nivel: 'warning', color: '#f97316' },
                    ].map((alert, i) => (
                        <div key={i} style={{ padding: '0.75rem', marginBottom: '0.6rem', background: `${alert.color}11`, border: `1px solid ${alert.color}33`, borderRadius: 10, borderLeft: `3px solid ${alert.color}` }}>
                            <div style={{ fontSize: '0.85rem', fontWeight: 700, color: alert.color, marginBottom: '0.25rem' }}>{alert.tipo}</div>
                            <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', lineHeight: 1.5 }}>{alert.desc}</div>
                        </div>
                    ))}
                </ChartPanel>
            </div>
        </div>
    );
}

// 10. ADMINISTRATIVO / AUDITORÍA
function AdministrativoModule({ period }: { period: Period }) {
    const [data, setData] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setLoading(true);
        getSystemLogs().then(res => { setData(res); setLoading(false); });
    }, [period]);

    if (loading) return <div style={{ display: 'flex', justifyContent: 'center', padding: '3rem' }}><Loader2 size={28} style={{ color: '#94a3b8', animation: 'spin 1s linear infinite' }} /></div>;

    const activityWeekly = period === 'semana'
        ? [
            { label: 'Lun', Acciones: 28, Exportaciones: 4 },
            { label: 'Mar', Acciones: 42, Exportaciones: 7 },
            { label: 'Mié', Acciones: 35, Exportaciones: 5 },
            { label: 'Jue', Acciones: 56, Exportaciones: 9 },
            { label: 'Vie', Acciones: 71, Exportaciones: 12 },
            { label: 'Sáb', Acciones: 38, Exportaciones: 6 },
            { label: 'Dom', Acciones: 19, Exportaciones: 3 },
        ]
        : [
            { label: 'Sem 1', Acciones: 210, Exportaciones: 32 },
            { label: 'Sem 2', Acciones: 284, Exportaciones: 41 },
            { label: 'Sem 3', Acciones: 248, Exportaciones: 38 },
            { label: 'Sem 4', Acciones: 312, Exportaciones: 47 },
        ];

    const alerts = [
        { tipo: 'Pasaporte Vencido', cliente: 'John Miller', fecha: '2026-05-28', color: '#ef4444' },
        { tipo: 'Pago Vencido', cliente: 'María García', fecha: '2026-05-25', color: '#f97316' },
        { tipo: 'Hotel Sin Confirmar', cliente: 'Sophie Dubois', fecha: '2026-06-03', color: '#f59e0b' },
        { tipo: 'Documento Expirado', cliente: 'Ricardo Anaya', fecha: '2026-05-30', color: '#8b5cf6' },
    ];

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <SectionHeader title="Reportes Administrativos & Auditoría" subtitle="Actividad de usuarios, trazabilidad y alertas críticas del sistema" icon={Settings} color="#94a3b8" />

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '1rem' }}>
                <KpiCard label="Acciones del Período" value={289} icon={Activity} color="#94a3b8" />
                <KpiCard label="Usuarios Activos" value={4} icon={Users} color="#8b5cf6" />
                <KpiCard label="Exportaciones" value={37} icon={Download} color="#06b6d4" />
                <KpiCard label="Alertas Críticas" value={alerts.length} icon={AlertTriangle} color="#ef4444" />
                <KpiCard label="Logs Registrados" value={data?.logs?.length || 24} icon={FileText} color="#10b981" />
            </div>

            {/* Alertas Críticas */}
            <ChartPanel title="🚨 Alertas Críticas del Sistema">
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '0.75rem' }}>
                    {alerts.map((a, i) => (
                        <div key={i} style={{ padding: '1rem', background: `${a.color}11`, border: `1px solid ${a.color}44`, borderRadius: 12, borderLeft: `3px solid ${a.color}` }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.4rem' }}>
                                <Badge label={a.tipo} color={a.color} />
                                <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>{a.fecha}</span>
                            </div>
                            <div style={{ fontSize: '0.85rem', fontWeight: 600, color: 'white', marginTop: '0.5rem' }}>{a.cliente}</div>
                        </div>
                    ))}
                </div>
            </ChartPanel>

            {/* Actividad */}
            <ChartPanel title="Actividad del Sistema">
                <TimelineAreaChart
                    data={activityWeekly.map(d => ({ label: d.label, Acciones: d.Acciones, Exportaciones: d.Exportaciones }))}
                    series={[
                        { key:tr("Acciones"), color: '#8b5cf6', label: 'Acciones Registradas' },
                        { key: 'Exportaciones', color: '#06b6d4', label: 'Exportaciones' },
                    ]}
                    height={240}
                />
            </ChartPanel>

            {/* Logs terminal */}
            <ChartPanel title="Log de Auditoría en Tiempo Real">
                <SystemLogTerminal />
            </ChartPanel>
        </div>
    );
}

// ─── MAIN PAGE ────────────────────────────────────────────────────────────────
const REPORT_MODULES = [
    { id: 'reservas', label:tr("Reservas"), icon: Calendar, color: '#8b5cf6', desc: 'General, estados, destinos, ocupación' },
    { id: 'financiero', label:tr("Financiero"), icon: DollarSign, color: '#10b981', desc: 'Ingresos, CxC, rentabilidad, flujo caja' },
    { id: 'clientes', label: 'Clientes', icon: Users, color: '#06b6d4', desc: 'Historial, fidelización, satisfacción' },
    { id: 'ventas', label:tr("Ventas"), icon: ShoppingCart, color: '#f59e0b', desc: 'Asesores, embudo, cotizaciones' },
    { id: 'operativo', label:tr("Operativo"), icon: Activity, color: '#06b6d4', desc: 'Check-in/out, itinerarios, incidencias' },
    { id: 'proveedores', label:tr("Proveedores"), icon: Briefcase, color: '#ec4899', desc: 'Desempeño, pagos, SLA' },
    { id: 'marketing', label:tr("Marketing"), icon: Target, color: '#a78bfa', desc: 'Campañas, canales, CAC, ROI' },
    { id: 'destinos', label:tr("Destinos"), icon: Map, color: '#3b82f6', desc: 'Mapa, ranking, temporadas' },
    { id: 'bi', label:tr("BI Estratégico"), icon: BarChart2, color: '#f43f5e', desc: 'Dashboard ejecutivo, forecast, comparativos' },
    { id: 'admin', label:tr("Administrativo"), icon: Settings, color: '#94a3b8', desc: 'Usuarios, auditoría, alertas críticas' },
];

export default function ReportsDashboard() {
  const { language } = useLanguage();
  setLanguage(language);
    const [activeModule, setActiveModule] = useState<string>('reservas');
    const [period, setPeriod] = useState<Period>('semana');
    const [refreshKey, setRefreshKey] = useState(0);

    const currentModule = REPORT_MODULES.find(m => m.id === activeModule)!;

    const renderModule = () => {
        switch (activeModule) {
            case 'reservas': return <ReservasModule period={period} />;
            case 'financiero': return <FinancieroModule period={period} />;
            case 'clientes': return <ClientesModule period={period} />;
            case 'ventas': return <VentasModule period={period} />;
            case 'operativo': return <OperativoModule period={period} />;
            case 'proveedores': return <ProveedoresModule period={period} />;
            case 'marketing': return <MarketingModule period={period} />;
            case 'destinos': return <DestinosModule period={period} />;
            case 'bi': return <BIModule period={period} />;
            case 'admin': return <AdministrativoModule period={period} />;
            default: return null;
        }
    };

    return (
        <div>
            {/* Page Header */}
            <header style={{ marginBottom: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
                <div>
                    <h1 className="heading-1" style={{ marginBottom: '0.25rem' }}>{tr("Centro de Reportes")}</h1>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                        Análisis completo con gráficas interactivas · {REPORT_MODULES.length} módulos disponibles
                    </p>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
                    <PeriodSelector value={period} onChange={setPeriod} />
                    <button
                        onClick={() => setRefreshKey(k => k + 1)}
                        style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border-glass)', borderRadius: 10, padding: '0.45rem 0.75rem', color: 'var(--text-muted)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.8rem', fontFamily: 'inherit', transition: 'all 0.2s' }}
                        title="Actualizar datos"
                    >
                        <RefreshCw size={14} />
                        <span>{tr("Actualizar")}</span>
                    </button>
                    <button
                        style={{ background: 'var(--primary)', border: 'none', borderRadius: 10, padding: '0.45rem 1rem', color: 'white', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.8rem', fontFamily: 'inherit', fontWeight: 600 }}
                    >
                        <Download size={14} />
                        <span>{tr("Exportar")}</span>
                    </button>
                </div>
            </header>

            {/* Module Navigation Tabs */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(130px, 1fr))', gap: '0.6rem', marginBottom: '2rem' }}>
                {REPORT_MODULES.map(mod => {
                    const Icon = mod.icon;
                    const isActive = activeModule === mod.id;
                    return (
                        <button
                            key={mod.id}
                            onClick={() => setActiveModule(mod.id)}
                            style={{
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'flex-start',
                                gap: '0.4rem',
                                padding: '0.85rem',
                                borderRadius: 14,
                                border: isActive ? `1.5px solid ${mod.color}` : '1px solid var(--border-glass)',
                                background: isActive ? `${mod.color}18` : 'rgba(255,255,255,0.03)',
                                cursor: 'pointer',
                                transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                                fontFamily: 'inherit',
                                textAlign: 'left',
                                boxShadow: isActive ? `0 0 20px ${mod.color}22` : 'none',
                            }}
                        >
                            <Icon size={18} color={isActive ? mod.color : 'var(--text-muted)'} />
                            <span style={{ fontSize: '0.78rem', fontWeight: isActive ? 700 : 500, color: isActive ? 'white' : 'var(--text-muted)', lineHeight: 1.2 }}>{mod.label}</span>
                        </button>
                    );
                })}
            </div>

            {/* Breadcrumb */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                <span>{tr("Reportes")}</span>
                <ChevronRight size={14} />
                <span style={{ color: currentModule.color, fontWeight: 600 }}>{currentModule.label}</span>
                <span style={{ marginLeft: '0.5rem', padding: '0.2rem 0.6rem', background: 'rgba(255,255,255,0.05)', borderRadius: 6, border: '1px solid var(--border-glass)' }}>
                    📅 {period === 'semana' ?tr("Esta Semana") : period === 'mes' ? 'Este Mes' : period === 'trimestre' ? 'Este Trimestre' : 'Este Año'}
                </span>
            </div>

            {/* Module Content */}
            <div key={`${activeModule}-${period}-${refreshKey}`}>
                {renderModule()}
            </div>

            <style jsx>{`
                @keyframes spin {
                    from { transform: rotate(0deg); }
                    to { transform: rotate(360deg); }
                }
                .heading-1 {
                    font-size: 1.8rem;
                    font-weight: 800;
                    background: linear-gradient(135deg, var(--primary), var(--secondary));
                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;
                    background-clip: text;
                }
            `}</style>
        </div>
    );
}
