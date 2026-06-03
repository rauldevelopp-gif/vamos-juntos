'use client';
import { useLanguage } from '@/context/LanguageContext';
import { tr, setLanguage } from '@/lib/tr';
import React, { useState, useEffect, useRef } from 'react';
import {
    ShieldAlert, Activity, Terminal, Users, DollarSign, Key,
    FileSpreadsheet, TrendingUp, Lock, AlertCircle, CheckCircle,
    Calendar, Settings, Search, Filter, Download, RefreshCw,
    Sliders, Database, Cpu, Layers, Eye, BookOpen, Clock, AlertTriangle, Play
} from 'lucide-react';
import {
    getSuperAuditLogs,
    getIncidentsAndAlerts,
    resolveIncidentAction,
    triggerExportLogAction,
    getSystemPerformanceLogs
} from './actions';
import { getCurrentUserAction } from '../users/actions';

type TabType = 
    | 'auditoria' 
    | 'actividad' 
    | 'criticos' 
    | 'seguridad' 
    | 'financiero' 
    | 'reservas' 
    | 'paquetes' 
    | 'administrativo' 
    | 'incidentes' 
    | 'sistema';

export default function SuperReportsPage() {
  const { language } = useLanguage();
  setLanguage(language);
    const [currentUser, setCurrentUser] = useState<any>(null);
    const [authLoading, setAuthLoading] = useState(true);

    const [activeTab, setActiveTab] = useState<TabType>('auditoria');
    const [loading, setLoading] = useState(true);
    const [auditLogs, setAuditLogs] = useState<any[]>([]);
    const [incidents, setIncidents] = useState<any[]>([]);
    const [performance, setPerformance] = useState<any>(null);
    const [refreshKey, setRefreshKey] = useState(0);

    // Advanced search / filters
    const [search, setSearch] = useState('');
    const [filterModule, setFilterModule] = useState('Todos');
    const [filterAction, setFilterAction] = useState('Todos');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');

    // Detailed JSON modal
    const [selectedLog, setSelectedLog] = useState<any>(null);

    // Reservation track simulation
    const [selectedResId, setSelectedResId] = useState('RV-2026-0012');

    useEffect(() => {
        getCurrentUserAction()
            .then(res => {
                if (res.success && res.user) {
                    setCurrentUser(res.user);
                }
                setAuthLoading(false);
            })
            .catch(err => {
                console.error("Auth check failed:", err);
                setAuthLoading(false);
            });
    }, []);

    const isSuperAdmin = currentUser?.role === 'SUPER_ADMIN' || currentUser?.username?.toLowerCase() === 'admin';

    useEffect(() => {
        if (!isSuperAdmin) return;

        setLoading(true);
        Promise.all([
            getSuperAuditLogs({
                search: search || undefined,
                module: filterModule !== 'Todos' ? filterModule : undefined,
                actionType: filterAction !== 'Todos' ? filterAction : undefined,
                startDate: startDate || undefined,
                endDate: endDate || undefined
            }),
            getIncidentsAndAlerts(),
            getSystemPerformanceLogs()
        ]).then(([logsRes, incRes, perfRes]) => {
            if (logsRes.success && logsRes.data) setAuditLogs(logsRes.data);
            if (incRes.success && incRes.data) setIncidents(incRes.data);
            if (perfRes.success) setPerformance(perfRes);
            setLoading(false);
        }).catch(err => {
            console.error("Error loading super reports:", err);
            setLoading(false);
        });
    }, [search, filterModule, filterAction, startDate, endDate, refreshKey, isSuperAdmin]);

    const handleRefresh = () => {
        setRefreshKey(prev => prev + 1);
    };

    if (authLoading) {
        return (
            <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', height: '60vh', gap: '1rem' }}>
                <Activity size={32} style={{ animation: 'spin 1.5s linear infinite', color: 'var(--primary)' }} />
                <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Verificando credenciales de seguridad...</p>
            </div>
        );
    }

    if (!isSuperAdmin) {
        return (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '70vh', padding: '2rem' }}>
                <div className="glass-panel" style={{
                    padding: '3rem',
                    maxWidth: '560px',
                    width: '100%',
                    textAlign: 'center',
                    background: 'rgba(10, 2, 5, 0.95)',
                    border: '1px solid rgba(244, 63, 94, 0.3)',
                    boxShadow: '0 0 35px rgba(244, 63, 94, 0.15)',
                    borderRadius: '20px',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '1.5rem',
                    animation: 'scaleUp 0.3s ease-out'
                }}>
                    <div style={{
                        width: '64px',
                        height: '64px',
                        borderRadius: '16px',
                        background: 'rgba(244, 63, 94, 0.1)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        border: '1px solid rgba(244, 63, 94, 0.3)',
                        marginBottom: '0.5rem'
                    }}>
                        <Lock size={32} color="var(--accent)" />
                    </div>
                    <div>
                        <h2 style={{ fontSize: '1.5rem', fontWeight: 900, color: 'white', margin: 0, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                            Acceso Restringido
                        </h2>
                        <div style={{
                            padding: '0.15rem 0.6rem',
                            borderRadius: '4px',
                            background: 'rgba(244, 63, 94, 0.15)',
                            color: 'var(--accent)',
                            fontSize: '0.65rem',
                            fontWeight: 800,
                            display: 'inline-block',
                            marginTop: '0.4rem',
                            textTransform: 'uppercase'
                        }}>
                            Nivel 3: Solo Super Admin
                        </div>
                        <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: 1.6, marginTop: '1.25rem', marginBottom: 0 }}>
                            Esta sección contiene información confidencial de trazabilidad general, auditoría de logs técnicos y control financiero. Su perfil actual no cuenta con las credenciales necesarias.
                        </p>
                    </div>

                    <div style={{ 
                        width: '100%', 
                        background: 'rgba(255,255,255,0.01)', 
                        border: '1px dashed var(--border-glass)', 
                        padding: '1rem', 
                        borderRadius: '10px',
                        textAlign: 'left',
                        fontSize: '0.75rem',
                        color: 'var(--text-muted)',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '0.4rem'
                    }}>
                        <div>• <strong>Evento registrado:</strong> Intento de acceso no autorizado</div>
                        <div>• <strong>Usuario:</strong> {currentUser?.username || 'Invitado'} (Rol: {currentUser?.role || 'Ninguno'})</div>
                        <div>• <strong>Fecha/Hora:</strong> {new Date().toLocaleString()}</div>
                        <div>• <strong>Código de Seguridad:</strong> SEC-403-AUDIT</div>
                    </div>

                    <a 
                        href="/admin" 
                        className="btn-premium" 
                        style={{ 
                            width: '100%', 
                            justifyContent: 'center', 
                            textDecoration: 'none', 
                            padding: '0.75rem',
                            borderRadius: '12px',
                            fontWeight: 700
                        }}
                    >
                        Volver al Dashboard
                    </a>
                </div>
            </div>
        );
    }

    const handleResolveIncident = async (id: number) => {
        const res = await resolveIncidentAction(id);
        if (res.success) {
            handleRefresh();
        }
    };

    const handleExportCSV = async () => {
        await triggerExportLogAction();
        
        const headers = ['ID',tr("Usuario"),tr("Rol"), 'Fecha y Hora', 'IP', 'Dispositivo', 'Navegador', 'Acción', 'Módulo', 'Resultado', 'Empresa/Tenant', 'Detalle'];
        const rows = auditLogs.map(l => [
            l.id, l.username, l.role, l.timestamp, l.ipAddress, l.device, l.browser, l.actionType, l.module, l.result, l.tenantId, l.details
        ]);

        const csvContent = "data:text/csv;charset=utf-8,\uFEFF" 
            + [headers.join(','), ...rows.map(e => e.map(val => `"${String(val).replace(/"/g, '""')}"`).join(','))].join('\n');
        
        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", `Auditoria_ControlInterno_${new Date().toISOString().split('T')[0]}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        handleRefresh();
    };

    // Derived counts
    const criticalLogs = auditLogs.filter(l => ['CAMBIO_PRECIO', 'CAMBIO_ROL', 'BLOQUEO_USUARIO', 'EXPORTACION_DATOS'].includes(l.actionType));
    const activeIncidents = incidents.filter(i => i.status === 'ABIERTO');

    const renderHeader = () => (
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
            <div>
                <h1 style={{ fontSize: '2rem', fontWeight: 800, margin: 0, display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <span className="text-gradient">🔐 Admin Reportes</span>
                </h1>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginTop: '0.25rem' }}>
                    Auditoría general, trazabilidad, seguridad técnica y monitoreo preventivo de operaciones críticas.
                </p>
            </div>
            <div style={{ display: 'flex', gap: '0.75rem' }}>
                <button onClick={handleRefresh} className="btn-glass-nav" style={{ padding: '0.5rem 1rem', fontSize: '0.85rem' }}>
                    <RefreshCw size={15} style={{ animation: loading ? 'spin 1s linear infinite' : 'none' }} />
                    Sincronizar
                </button>
                <button onClick={handleExportCSV} className="btn-premium" style={{ padding: '0.5rem 1.25rem', fontSize: '0.85rem', borderRadius: '10px' }}>
                    <Download size={15} />
                    Exportar Auditoría (CSV)
                </button>
            </div>
        </div>
    );

    const renderTabs = () => {
        const tabs: { key: TabType; name: string; icon: React.ElementType; badge?: number }[] = [
            { key: 'auditoria', name: '1. Auditoría General', icon: Layers },
            { key: 'actividad', name: '2. Actividad Usuarios', icon: Users },
            { key: 'criticos', name: '3. Cambios Críticos', icon: ShieldAlert, badge: criticalLogs.length || undefined },
            { key: 'seguridad', name: '4. Seguridad y Accesos', icon: Lock },
            { key: 'financiero', name: '5. Operaciones Financieras', icon: DollarSign },
            { key: 'reservas', name: '6. Historial Reservas', icon: Calendar },
            { key: 'paquetes', name: '7. Modificación Paquetes', icon: Sliders },
            { key: 'administrativo', name: '8. Acciones Admin', icon: Key },
            { key: 'incidentes', name: '9. Incidentes y Alertas', icon: AlertCircle, badge: activeIncidents.length || undefined },
            { key: 'sistema', name: '10. Logs del Sistema', icon: Terminal }
        ];

        return (
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem', borderBottom: '1px solid var(--border-glass)', paddingBottom: '0.75rem', marginBottom: '2rem' }}>
                {tabs.map(t => {
                    const isActive = activeTab === t.key;
                    const Icon = t.icon;
                    return (
                        <button
                            key={t.key}
                            onClick={() => setActiveTab(t.key)}
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.5rem',
                                padding: '0.6rem 1.1rem',
                                borderRadius: '10px',
                                border: isActive ? '1px solid rgba(139,92,246,0.3)' : '1px solid transparent',
                                background: isActive ? 'rgba(139, 92, 246, 0.12)' : 'rgba(255,255,255,0.02)',
                                color: isActive ? 'var(--primary)' : 'var(--text-muted)',
                                cursor: 'pointer',
                                transition: 'var(--transition-smooth)',
                                fontWeight: isActive ? 600 : 500,
                                fontSize: '0.82rem',
                                fontFamily: 'inherit',
                                position: 'relative'
                            }}
                        >
                            <Icon size={16} color={isActive ? 'var(--primary)' : 'currentColor'} />
                            <span>{t.name}</span>
                            {t.badge !== undefined && (
                                <span style={{
                                    background: 'var(--accent)',
                                    color: 'white',
                                    fontSize: '0.65rem',
                                    fontWeight: 800,
                                    borderRadius: '50%',
                                    width: '18px',
                                    height: '18px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    marginLeft: '0.2rem'
                                }}>
                                    {t.badge}
                                </span>
                            )}
                        </button>
                    );
                })}
            </div>
        );
    };

    if (loading && auditLogs.length === 0) {
        return (
            <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', height: '60vh', gap: '1rem' }}>
                <Activity size={32} style={{ animation: 'spin 1.5s linear infinite', color: 'var(--primary)' }} />
                <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Compilando reportes y trazas de auditoría...</p>
            </div>
        );
    }

    return (
        <div style={{ maxWidth: '1400px', margin: '0 auto', minHeight: '100vh', padding: '1rem 0' }}>
            {renderHeader()}
            {renderTabs()}

            {/* TAB CONTENT PANELS */}
            <div className="glass-panel" style={{ padding: '2rem', minHeight: '500px' }}>

                {/* MODULE 1: AUDITORÍA GENERAL */}
                {activeTab === 'auditoria' && (
                    <div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
                            <div>
                                <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'white', margin: 0 }}>Registro de Auditoría General</h3>
                                <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem', margin: 0 }}>Listado completo de todas las transacciones y operaciones ejecutadas.</p>
                            </div>
                            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                                <select value={filterModule} onChange={e => setFilterModule(e.target.value)} className="btn-glass-nav" style={{ fontSize: '0.78rem', background: 'var(--bg-main)' }}>
                                    <option value="Todos">Módulo: Todos</option>
                                    <option value="AUTH">AUTH</option>
                                    <option value="RESERVAS">RESERVAS</option>
                                    <option value="PAQUETES">PAQUETES</option>
                                    <option value="USUARIOS">USUARIOS</option>
                                    <option value="SEGURIDAD">SEGURIDAD</option>
                                    <option value="AUDITORIA">AUDITORIA</option>
                                </select>
                                <input 
                                    type="text" 
                                    placeholder="Buscar usuario o detalle..." 
                                    value={search}
                                    onChange={e => setSearch(e.target.value)}
                                    style={{
                                        padding: '0.45rem 1rem',
                                        borderRadius: '8px',
                                        background: 'rgba(255,255,255,0.03)',
                                        border: '1px solid var(--border-glass)',
                                        color: 'white',
                                        fontSize: '0.78rem',
                                        outline: 'none',
                                        width: '200px'
                                    }}
                                />
                            </div>
                        </div>

                        <div style={{ overflowX: 'auto' }}>
                            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.82rem' }}>
                                <thead>
                                    <tr style={{ borderBottom: '1px solid var(--border-glass)', textAlign: 'left' }}>
                                        {['Fecha y Hora', 'Usuario (Rol)', 'Acción Ejecutada', 'Módulo', 'IP / Dispositivo', 'Resultado', 'Detalle JSON'].map(h => (
                                            <th key={h} style={{ padding: '0.8rem 0.5rem', color: 'var(--text-muted)', fontWeight: 600, fontSize: '0.72rem', textTransform: 'uppercase' }}>{h}</th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody>
                                    {auditLogs.length === 0 ? (
                                        <tr>
                                            <td colSpan={7} style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>Ningún registro de auditoría coincide con los filtros.</td>
                                        </tr>
                                    ) : (
                                        auditLogs.map((l) => (
                                            <tr key={l.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.02)', transition: 'background 0.2s' }} className="table-row-hover">
                                                <td style={{ padding: '0.8rem 0.5rem', whiteSpace: 'nowrap', color: 'var(--text-muted)' }}>{new Date(l.timestamp).toLocaleString()}</td>
                                                <td style={{ padding: '0.8rem 0.5rem', fontWeight: 600, color: 'white' }}>
                                                    {l.username} <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: 400 }}>({l.role})</span>
                                                </td>
                                                <td style={{ padding: '0.8rem 0.5rem' }}>
                                                    <span style={{ fontWeight: 700, color: 'white' }}>{l.actionType}</span>
                                                </td>
                                                <td style={{ padding: '0.8rem 0.5rem' }}>
                                                    <span style={{ padding: '0.15rem 0.4rem', borderRadius: '4px', background: 'rgba(255,255,255,0.05)', fontSize: '0.7rem' }}>{l.module}</span>
                                                </td>
                                                <td style={{ padding: '0.8rem 0.5rem', color: 'var(--text-muted)', whiteSpace: 'nowrap' }}>{l.ipAddress} • {l.device}</td>
                                                <td style={{ padding: '0.8rem 0.5rem' }}>
                                                    <span style={{
                                                        padding: '0.15rem 0.4rem',
                                                        borderRadius: '4px',
                                                        background: l.result === 'SUCCESS' ? 'rgba(16,185,129,0.1)' : 'rgba(239,68,68,0.1)',
                                                        color: l.result === 'SUCCESS' ? '#10b981' : '#ef4444',
                                                        fontSize: '0.7rem',
                                                        fontWeight: 700,
                                                        border: `1px solid ${l.result === 'SUCCESS' ? 'rgba(16,185,129,0.2)' : 'rgba(239,68,68,0.2)'}`
                                                    }}>
                                                        {l.result}
                                                    </span>
                                                </td>
                                                <td style={{ padding: '0.8rem 0.5rem' }}>
                                                    {(l.beforeData || l.afterData) ? (
                                                        <button 
                                                            onClick={() => setSelectedLog(l)}
                                                            className="btn-glass-nav" 
                                                            style={{ padding: '0.2rem 0.5rem', fontSize: '0.7rem', display: 'flex', alignItems: 'center', gap: '0.25rem' }}
                                                        >
                                                            <Eye size={12} /> Inspeccionar
                                                        </button>
                                                    ) : (
                                                        <span style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>Sin datos</span>
                                                    )}
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {/* MODULE 2: ACTIVIDAD DE USUARIOS */}
                {activeTab === 'actividad' && (
                    <div>
                        <div style={{ marginBottom: '1.5rem' }}>
                            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'white', margin: 0 }}>Comportamiento e Interacción de Usuarios</h3>
                            <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem', margin: 0 }}>Análisis granular de módulos, accesos diarios e interacciones por cuenta.</p>
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '2rem', flexWrap: 'wrap' }}>
                            <div className="glass-card" style={{ padding: '1.5rem' }}>
                                <h4 style={{ color: 'white', fontSize: '0.85rem', textTransform: 'uppercase', marginBottom: '1rem' }}>Módulos Más Utilizados (Operaciones)</h4>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                                    {[
                                        { name:tr("Reservas"), value: 82, pct: 45, color: '#8b5cf6' },
                                        { name: 'Paquetes Turísticos', value: 45, pct: 25, color: '#06b6d4' },
                                        { name: 'Seguridad / Autenticación', value: 31, pct: 17, color: '#f59e0b' },
                                        { name: 'Administrativo General', value: 24, pct: 13, color: '#10b981' }
                                    ].map((m, i) => (
                                        <div key={i}>
                                            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem', marginBottom: '0.25rem' }}>
                                                <span style={{ color: 'white', fontWeight: 600 }}>{m.name}</span>
                                                <span style={{ color: 'var(--text-muted)' }}>{m.value} acciones ({m.pct}%)</span>
                                            </div>
                                            <div style={{ height: '6px', background: 'rgba(255,255,255,0.05)', borderRadius: '3px', overflow: 'hidden' }}>
                                                <div style={{ height: '100%', width: `${m.pct}%`, background: m.color, borderRadius: '3px' }} />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="glass-card" style={{ padding: '1.5rem' }}>
                                <h4 style={{ color: 'white', fontSize: '0.85rem', textTransform: 'uppercase', marginBottom: '1rem' }}>Resumen de Actividad por Cuenta</h4>
                                <div style={{ overflowY: 'auto', maxHeight: '180px', fontSize: '0.8rem' }}>
                                    {[
                                        { username: 'Admin', role: 'ADMIN', activeTime: '4.5 hrs', actions: 120, lastIp: '192.168.1.15' },
                                        { username: 'Carlos', role: 'OPERATOR', activeTime: '6.2 hrs', actions: 58, lastIp: '187.33.22.90' },
                                        { username: 'Juan', role: 'USER', activeTime: '0.8 hrs', actions: 14, lastIp: '186.22.45.101' },
                                        { username: 'Ana', role: 'AUDITOR', activeTime: '1.5 hrs', actions: 8, lastIp: '200.12.98.5' }
                                    ].map((u, i) => (
                                        <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '0.4rem 0', borderBottom: '1px solid rgba(255,255,255,0.03)' }}>
                                            <div>
                                                <strong style={{ color: 'white' }}>{u.username}</strong>{' '}
                                                <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>({u.role})</span>
                                            </div>
                                            <div style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>
                                                Tiempo: {u.activeTime} • <strong>{u.actions} act.</strong>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* MODULE 3: CAMBIOS CRÍTICOS */}
                {activeTab === 'criticos' && (
                    <div>
                        <div style={{ marginBottom: '1.5rem' }}>
                            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'white', margin: 0 }}>Historial de Modificaciones Críticas</h3>
                            <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem', margin: 0 }}>Auditoría rigurosa de variaciones en tarifas, comisiones, cupones y roles.</p>
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                            {criticalLogs.length === 0 ? (
                                <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-muted)' }} className="glass-card">No se han registrado cambios críticos recientes.</div>
                            ) : (
                                criticalLogs.map(l => (
                                    <div key={l.id} className="glass-card" style={{ padding: '1rem', borderLeft: '4px solid var(--accent)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
                                        <div>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
                                                <span style={{ background: 'rgba(244,63,94,0.1)', color: 'var(--accent)', padding: '0.15rem 0.4rem', borderRadius: '4px', fontSize: '0.7rem', fontWeight: 700 }}>CRÍTICO</span>
                                                <strong style={{ color: 'white', fontSize: '0.85rem' }}>{l.actionType}</strong>
                                                <span style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>por {l.username} ({l.role})</span>
                                            </div>
                                            <p style={{ margin: 0, fontSize: '0.8rem', color: 'white' }}>{l.details}</p>
                                            <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>{new Date(l.timestamp).toLocaleString()} • IP: {l.ipAddress}</span>
                                        </div>
                                        <button onClick={() => setSelectedLog(l)} className="btn-glass-nav" style={{ padding: '0.3rem 0.6rem', fontSize: '0.75rem' }}>
                                            Comparar Diffs
                                        </button>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                )}

                {/* MODULE 4: SEGURIDAD Y ACCESOS */}
                {activeTab === 'seguridad' && (
                    <div>
                        <div style={{ marginBottom: '1.5rem' }}>
                            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'white', margin: 0 }}>Control de Autenticación y Accesos</h3>
                            <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem', margin: 0 }}>Monitoreo de inicios de sesión fallidos, ubicaciones de red sospechosas y tipos de dispositivos.</p>
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: '1.5rem', flexWrap: 'wrap' }}>
                            <div className="glass-card" style={{ padding: '1.5rem' }}>
                                <h4 style={{ color: 'white', fontSize: '0.85rem', textTransform: 'uppercase', marginBottom: '1rem' }}>Accesos Recientes e Intentos sospechosos</h4>
                                <div style={{ overflowX: 'auto' }}>
                                    <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.78rem' }}>
                                        <thead>
                                            <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.05)', textAlign: 'left' }}>
                                                <th style={{ padding: '0.4rem', color: 'var(--text-muted)' }}>{tr("Usuario")}</th>
                                                <th style={{ padding: '0.4rem', color: 'var(--text-muted)' }}>IP / Ubicación</th>
                                                <th style={{ padding: '0.4rem', color: 'var(--text-muted)' }}>Dispositivo</th>
                                                <th style={{ padding: '0.4rem', color: 'var(--text-muted)' }}>{tr("Estado")}</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {[
                                                { user: 'Admin', ip: '192.168.1.15', geo: 'Localhost', device: 'Windows PC (Chrome)', status: 'ÉXITO', time: 'hace 5 min' },
                                                { user: 'Juan', ip: '186.22.45.101', geo: 'México, DF', device: 'Android Phone (Chrome)', status: 'ÉXITO', time: 'hace 20 min' },
                                                { user: 'hacker123', ip: '103.45.92.1', geo: 'China, Beijing', device: 'Unknown Linux (Curl)', status: 'FALLIDO', time: 'hace 45 min' },
                                                { user: 'Carlos', ip: '187.33.22.90', geo: 'México, DF', device: 'iPhone 15 (Safari)', status: 'ÉXITO', time: 'hace 1.5 hrs' }
                                            ].map((a, i) => (
                                                <tr key={i} style={{ borderBottom: '1px solid rgba(255,255,255,0.02)' }}>
                                                    <td style={{ padding: '0.5rem 0.4rem', fontWeight: 600, color: 'white' }}>{a.user}</td>
                                                    <td style={{ padding: '0.5rem 0.4rem', color: 'var(--text-muted)' }}>{a.ip} <span style={{ fontSize: '0.65rem' }}>({a.geo})</span></td>
                                                    <td style={{ padding: '0.5rem 0.4rem', color: 'var(--text-muted)' }}>{a.device}</td>
                                                    <td style={{ padding: '0.5rem 0.4rem' }}>
                                                        <span style={{
                                                            color: a.status === 'ÉXITO' ? '#10b981' : '#ef4444',
                                                            fontWeight: 700
                                                        }}>{a.status}</span>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>

                            <div className="glass-card" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                <h4 style={{ color: 'white', fontSize: '0.85rem', textTransform: 'uppercase', marginBottom: '0.5rem' }}>Distribución de Dispositivos</h4>
                                {[
                                    { name: 'Windows PC', pct: 60, color: '#8b5cf6' },
                                    { name: 'Android Phone', pct: 20, color: '#06b6d4' },
                                    { name: 'iPhone / Mac', pct: 15, color: '#ec4899' },
                                    { name: 'Otros / Linux', pct: 5, color: '#f59e0b' }
                                ].map((d, i) => (
                                    <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.78rem' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                            <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: d.color }} />
                                            <span style={{ color: 'var(--text-muted)' }}>{d.name}</span>
                                        </div>
                                        <strong style={{ color: 'white' }}>{d.pct}%</strong>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}

                {/* MODULE 5: OPERACIONES FINANCIERAS */}
                {activeTab === 'financiero' && (
                    <div>
                        <div style={{ marginBottom: '1.5rem' }}>
                            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'white', margin: 0 }}>Auditoría de Operaciones Financieras</h3>
                            <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem', margin: 0 }}>Fiscalización de transacciones críticas como reembolsos de cobros, comisiones asignadas y pasarelas de pago.</p>
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '1.5rem' }}>
                            <div className="glass-card" style={{ padding: '1rem', textAlign: 'center' }}>
                                <span style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>Pagos Procesados (Prisma)</span>
                                <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#10b981', marginTop: '0.25rem' }}>$48,900 USD</div>
                            </div>
                            <div className="glass-card" style={{ padding: '1rem', textAlign: 'center' }}>
                                <span style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>Reembolsos Autorizados</span>
                                <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--accent)', marginTop: '0.25rem' }}>$2,850 USD</div>
                            </div>
                            <div className="glass-card" style={{ padding: '1rem', textAlign: 'center' }}>
                                <span style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>Ajustes Manuales Administrativos</span>
                                <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#f59e0b', marginTop: '0.25rem' }}>$1,200 USD</div>
                            </div>
                        </div>

                        <div className="glass-card" style={{ padding: '1.5rem' }}>
                            <h4 style={{ color: 'white', fontSize: '0.85rem', textTransform: 'uppercase', marginBottom: '1rem' }}>Trazabilidad de Pasarela de Pagos (Simulado Stripe / PayPal)</h4>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.8rem' }}>
                                {[
                                    { desc: 'Reembolso procesado en reserva #RV-2026-0012 por cancelación parcial.', mount: '-$450.00', status: 'COMPLETADO', gateway: 'Stripe API' },
                                    { desc: 'Pago aprobado para tour yate privado.', mount: '+$3,500.00', status: 'APROBADO', gateway: 'Stripe API' },
                                    { desc: 'Pago de reserva de hotel rechazado por fondos insuficientes.', mount: '$0.00', status: 'RECHAZADO', gateway: 'PayPal SDK' }
                                ].map((t, i) => (
                                    <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '0.5rem', background: 'rgba(255,255,255,0.01)', borderRadius: '6px', border: '1px solid var(--border-glass)' }}>
                                        <div>
                                            <span style={{ color: 'white', fontWeight: 600 }}>{t.desc}</span>
                                            <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: '0.15rem' }}>Pasarela: {t.gateway}</div>
                                        </div>
                                        <div style={{ textAlign: 'right' }}>
                                            <strong style={{ color: t.mount.startsWith('+') ? '#10b981' : t.mount.startsWith('-') ? 'var(--accent)' : 'white' }}>{t.mount}</strong>
                                            <div style={{ fontSize: '0.75rem', fontWeight: 800, color: t.status === 'APROBADO' || t.status === 'COMPLETADO' ? '#10b981' : 'var(--accent)' }}>{t.status}</div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}

                {/* MODULE 6: HISTORIAL DE RESERVAS (VISUAL FLOW) */}
                {activeTab === 'reservas' && (
                    <div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
                            <div>
                                <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'white', margin: 0 }}>Historial Visual de la Reserva</h3>
                                <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem', margin: 0 }}>Trazabilidad visual paso a paso de los estados y modificaciones críticas de una reserva.</p>
                            </div>
                            <div>
                                <input 
                                    type="text" 
                                    placeholder="Código de Reserva (e.g. RV-2026-0012)" 
                                    value={selectedResId}
                                    onChange={e => setSelectedResId(e.target.value)}
                                    style={{
                                        padding: '0.45rem 1rem',
                                        borderRadius: '8px',
                                        background: 'rgba(255,255,255,0.03)',
                                        border: '1px solid var(--border-glass)',
                                        color: 'white',
                                        fontSize: '0.78rem',
                                        outline: 'none',
                                        width: '240px'
                                    }}
                                />
                            </div>
                        </div>

                        <div className="glass-card" style={{ padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1.5rem', position: 'relative' }}>
                            <div style={{ borderBottom: '1px dashed var(--border-glass)', paddingBottom: '0.5rem', display: 'flex', justifyContent: 'space-between' }}>
                                <strong style={{ color: 'white' }}>Ficha de Trazabilidad: {selectedResId}</strong>
                                <span style={{ fontSize: '0.8rem', color: '#10b981', fontWeight: 700 }}>{tr("Confirmada")}</span>
                            </div>

                            {/* visual timeline line */}
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', position: 'relative', paddingLeft: '1.5rem' }}>
                                <div style={{ position: 'absolute', left: '4px', top: '10px', bottom: '10px', width: '2px', background: 'rgba(139,92,246,0.3)' }} />
                                
                                {[
                                    { actor: 'Juan (Cliente)', title: 'Creada por Juan', desc: 'Reserva inicial registrada en línea. Valor total de $2,850 USD.', time: '12/05/2026 - 14:22:10', success: true },
                                    { actor: 'Ana (Agente)', title: 'Modificada por Ana', desc: 'Se modificó el itinerario. Cambio de hotel agregando habitación Suite Premium en Hotel Riu.', time: '13/05/2026 - 09:12:00', success: true },
                                    { actor: 'Stripe API', title: 'Pago Confirmado', desc: 'Depósito inicial de $1,425 USD recibido correctamente a través de Stripe Gateway.', time: '13/05/2026 - 09:15:30', success: true },
                                    { actor: 'Carlos (Operador)', title: 'Cambiado Hotel', desc: 'Hotel Riu confirmado y notificado. Cupo bloqueado con éxito.', time: '14/05/2026 - 11:30:00', success: true },
                                    { actor: 'Admin (SuperAdmin)', title: 'Cancelada Parcialmente', desc: 'Se aplicó reembolso del 20% en taxi transfer por retraso de vuelo.', time: '15/05/2026 - 16:45:00', success: true }
                                ].map((step, idx) => (
                                    <div key={idx} style={{ position: 'relative' }}>
                                        <span style={{
                                            position: 'absolute',
                                            left: '-23px',
                                            top: '4px',
                                            width: '10px',
                                            height: '10px',
                                            borderRadius: '50%',
                                            background: '#8b5cf6',
                                            border: '2px solid white'
                                        }} />
                                        <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.5rem' }}>
                                            <strong style={{ color: 'white', fontSize: '0.85rem' }}>{step.title}</strong>
                                            <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>{step.time}</span>
                                        </div>
                                        <p style={{ margin: '0.2rem 0 0 0', fontSize: '0.8rem', color: 'var(--text-muted)' }}>{step.desc} <span style={{ color: '#8b5cf6', fontWeight: 600 }}>[Responsable: {step.actor}]</span></p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}

                {/* MODULE 7: MODIFICACIÓN DE PAQUETES */}
                {activeTab === 'paquetes' && (
                    <div>
                        <div style={{ marginBottom: '1.5rem' }}>
                            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'white', margin: 0 }}>Trazabilidad de Paquetes Turísticos</h3>
                            <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem', margin: 0 }}>Registro estricto de variaciones en cupos de excursiones, inclusiones de tours e itinerarios críticos.</p>
                        </div>

                        <div style={{ overflowX: 'auto' }}>
                            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.8rem' }}>
                                <thead>
                                    <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.05)', textAlign: 'left' }}>
                                        {['Paquete / ID', 'Modificación Ejecutada', 'Itinerario / Cupos', 'Tarifa Anterior', 'Tarifa Nueva', 'Usuario Editor'].map(h => (
                                            <th key={h} style={{ padding: '0.6rem', color: 'var(--text-muted)' }}>{h}</th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody>
                                    {[
                                        { name: 'Caribe VIP: Yates & Gastronomía', action: 'Inclusiones Removidas', detail: 'Se removió el almuerzo de mariscos en restaurante La Brasa.', before: '$2,850', after: '$2,600', editor: 'Admin' },
                                        { name: 'Exploración de Playas Escondidas', action: 'Cambio de Cupos', detail: 'Disponibilidad de plazas incrementada de 12 a 20 cupos.', before: '12 cupos', after: '20 cupos', editor: 'Carlos' },
                                        { name: 'Aventura Total en Isla Mujeres', action: 'Itinerario Modificado', detail: 'Se agregó parada adicional en ruinas arqueológicas.', before: '$1,850', after: '$1,950', editor: 'Admin' }
                                    ].map((p, i) => (
                                        <tr key={i} style={{ borderBottom: '1px solid rgba(255,255,255,0.02)' }}>
                                            <td style={{ padding: '0.6rem', fontWeight: 700, color: 'white' }}>{p.name}</td>
                                            <td style={{ padding: '0.6rem' }}>
                                                <span style={{ color: '#f59e0b', fontWeight: 600 }}>{p.action}</span>
                                            </td>
                                            <td style={{ padding: '0.6rem', color: 'var(--text-muted)' }}>{p.detail}</td>
                                            <td style={{ padding: '0.6rem', color: 'var(--text-muted)' }}>{p.before}</td>
                                            <td style={{ padding: '0.6rem', color: '#10b981', fontWeight: 700 }}>{p.after}</td>
                                            <td style={{ padding: '0.6rem', color: 'white' }}>{p.editor}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {/* MODULE 8: ACCIONES ADMINISTRATIVAS */}
                {activeTab === 'administrativo' && (
                    <div>
                        <div style={{ marginBottom: '1.5rem' }}>
                            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'white', margin: 0 }}>Acciones de Administradores</h3>
                            <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem', margin: 0 }}>Historial completo de creación/eliminación de usuarios, bloqueos o reajustes de credenciales.</p>
                        </div>

                        <div className="glass-card" style={{ padding: '1.5rem' }}>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.8rem' }}>
                                {auditLogs.filter(l => l.module === 'USUARIOS').length === 0 ? (
                                    <div style={{ color: 'var(--text-muted)', textAlign: 'center', padding: '2rem' }}>No se registran acciones administrativas sobre usuarios recientemente.</div>
                                ) : (
                                    auditLogs.filter(l => l.module === 'USUARIOS').map(l => (
                                        <div key={l.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '0.6rem', background: 'rgba(255,255,255,0.01)', borderRadius: '6px', border: '1px solid var(--border-glass)' }}>
                                            <div>
                                                <strong style={{ color: 'white' }}>{l.actionType}</strong>
                                                <p style={{ margin: '0.20rem 0 0 0', color: 'var(--text-muted)' }}>{l.details}</p>
                                            </div>
                                            <div style={{ textAlign: 'right', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                                                {new Date(l.timestamp).toLocaleDateString()}
                                                <div style={{ color: 'var(--primary)', fontWeight: 600 }}>por {l.username}</div>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>
                    </div>
                )}

                {/* MODULE 9: INCIDENTES Y BLOQUEOS */}
                {activeTab === 'incidentes' && (
                    <div>
                        <div style={{ marginBottom: '1.5rem' }}>
                            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'white', margin: 0 }}>Centro de Control de Incidentes y Alertas</h3>
                            <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem', margin: 0 }}>Alertas preventivas auto-detectadas por el motor inteligente de comportamiento sospechoso.</p>
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            {incidents.length === 0 ? (
                                <div className="glass-card" style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-muted)' }}>Ningún incidente o bloqueo preventivo activo.</div>
                            ) : (
                                incidents.map((inc) => {
                                    const isResolved = inc.status === 'RESUELTO';
                                    const severityColor = inc.severity === 'CRITICO' ? 'var(--accent)' : inc.severity === 'ALTO' ? '#f59e0b' : '#06b6d4';

                                    return (
                                        <div key={inc.id} className="glass-card" style={{ padding: '1.5rem', borderLeft: `5px solid ${severityColor}`, opacity: isResolved ? 0.6 : 1 }}>
                                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
                                                <div>
                                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
                                                        <span style={{ background: `${severityColor}22`, color: severityColor, padding: '0.15rem 0.4rem', borderRadius: '4px', fontSize: '0.7rem', fontWeight: 800 }}>{inc.severity}</span>
                                                        <h4 style={{ color: 'white', fontSize: '0.9rem', margin: 0 }}>{inc.title}</h4>
                                                    </div>
                                                    <p style={{ margin: '0.25rem 0', fontSize: '0.8rem', color: 'white' }}>{inc.description}</p>
                                                    <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Reportado el {new Date(inc.createdAt).toLocaleString()}</span>
                                                </div>
                                                <div style={{ display: 'flex', gap: '0.5rem' }}>
                                                    {isResolved ? (
                                                        <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', color: '#10b981', fontWeight: 700, fontSize: '0.8rem' }}>
                                                            <CheckCircle size={16} /> Resuelto
                                                        </span>
                                                    ) : (
                                                        <button 
                                                            onClick={() => handleResolveIncident(inc.id)}
                                                            className="btn-glass-nav" 
                                                            style={{ padding: '0.4rem 0.8rem', fontSize: '0.78rem', border: '1px solid rgba(16,185,129,0.3)', color: '#10b981' }}
                                                        >
                                                            Marcar Resuelto
                                                        </button>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })
                            )}
                        </div>
                    </div>
                )}

                {/* MODULE 10: LOGS DEL SISTEMA (DEBUG TERMINAL CONSOLE) */}
                {activeTab === 'sistema' && (
                    <div>
                        <div style={{ marginBottom: '1.5rem' }}>
                            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'white', margin: 0 }}>Monitoreo Técnico y Logs del Sistema</h3>
                            <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem', margin: 0 }}>Monitoreo de latencia, fallos de API y consola interactiva de depuración en tiempo real.</p>
                        </div>

                        {/* System hardware cards */}
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem', marginBottom: '1.5rem' }}>
                            <div className="glass-card" style={{ padding: '1rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                <Cpu size={24} color="#8b5cf6" />
                                <div>
                                    <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Carga CPU</div>
                                    <strong style={{ fontSize: '1.1rem', color: 'white' }}>{performance?.systemStatus?.cpuUsage || 24}%</strong>
                                </div>
                            </div>
                            <div className="glass-card" style={{ padding: '1rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                <Database size={24} color="#06b6d4" />
                                <div>
                                    <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Carga Memoria</div>
                                    <strong style={{ fontSize: '1.1rem', color: 'white' }}>{performance?.systemStatus?.memoryUsage || 68}%</strong>
                                </div>
                            </div>
                            <div className="glass-card" style={{ padding: '1rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                <Activity size={24} color="#10b981" />
                                <div>
                                    <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Sockets Activos</div>
                                    <strong style={{ fontSize: '1.1rem', color: 'white' }}>{performance?.systemStatus?.activeSockets || 450}</strong>
                                </div>
                            </div>
                            <div className="glass-card" style={{ padding: '1rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                <AlertTriangle size={24} color="var(--accent)" />
                                <div>
                                    <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Pool Database</div>
                                    <strong style={{ fontSize: '1.1rem', color: 'var(--accent)' }}>OF-LINE</strong>
                                </div>
                            </div>
                        </div>

                        {/* Interactive latency chart */}
                        <div className="glass-card" style={{ padding: '1.5rem', marginBottom: '1.5rem' }}>
                            <h4 style={{ color: 'white', fontSize: '0.85rem', marginBottom: '1rem', textTransform: 'uppercase' }}>Latencia Promedio y Tiempos de Respuesta (ms)</h4>
                            <div style={{ display: 'flex', height: '120px', alignItems: 'flex-end', gap: '2%', width: '100%', paddingBottom: '0.5rem', borderBottom: '1px solid var(--border-glass)' }}>
                                {performance?.latencyLogs?.map((l: any, i: number) => {
                                    const pct = (l.latency / 200) * 100;
                                    return (
                                        <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', height: '100%', justifyContent: 'flex-end' }}>
                                            <span style={{ fontSize: '0.65rem', color: 'white', marginBottom: '2px' }}>{l.latency}ms</span>
                                            <div style={{ width: '100%', height: `${pct}%`, background: 'linear-gradient(to top, rgba(139,92,246,0.3), #8b5cf6)', borderRadius: '4px 4px 0 0' }} />
                                            <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)', marginTop: '4px' }}>{l.time}</span>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Debug console terminal */}
                        <div style={{
                            background: '#030508',
                            borderRadius: '12px',
                            border: '1px solid #111',
                            padding: '1.5rem',
                            fontFamily: 'monospace',
                            color: '#10b981',
                            fontSize: '0.8rem',
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '0.5rem',
                            boxShadow: 'inset 0 0 20px rgba(0,255,0,0.05)'
                        }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #111', paddingBottom: '0.5rem', marginBottom: '0.5rem', color: '#94a3b8' }}>
                                <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                                    <Terminal size={14} color="#10b981" /> CONSOLA DE DIAGNÓSTICO DEL SISTEMA v1.0.0
                                </span>
                                <span style={{ color: 'var(--accent)', fontWeight: 800 }}>FAILURES MONITORED</span>
                            </div>
                            
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem', maxHeight: '180px', overflowY: 'auto' }}>
                                {performance?.errorLogs?.map((err: any) => (
                                    <div key={err.id}>
                                        <span style={{ color: '#94a3b8' }}>[{err.timestamp}]</span>{' '}
                                        <span style={{ 
                                            color: err.level === 'CRITICAL' ? 'var(--accent)' : err.level === 'ERROR' ? '#f59e0b' : '#3b82f6',
                                            fontWeight: 800
                                        }}>[{err.level}]</span>{' '}
                                        <span style={{ color: '#fff', fontWeight: 600 }}>({err.service}):</span>{' '}
                                        <span style={{ color: '#a7f3d0' }}>{err.message}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Diffs inspector modal */}
            {selectedLog && (
                <div style={{
                    position: 'fixed',
                    top: 0, left: 0, right: 0, bottom: 0,
                    background: 'rgba(0,0,0,0.8)',
                    backdropFilter: 'blur(5px)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    zIndex: 2100,
                    padding: '2rem'
                }}>
                    <div className="glass-panel" style={{ padding: '2rem', maxWidth: '640px', width: '100%', background: '#05070a' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border-glass)', paddingBottom: '0.75rem', marginBottom: '1.25rem' }}>
                            <strong style={{ fontSize: '1.1rem', color: 'white' }}>Inspección de Datos Diffs: #{selectedLog.id}</strong>
                            <button onClick={() => setSelectedLog(null)} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', fontSize: '1rem', fontWeight: 800 }}>X</button>
                        </div>
                        
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            {selectedLog.beforeData && (
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                                    <span style={{ fontSize: '0.75rem', color: 'var(--accent)', fontWeight: 700 }}>VALOR ANTERIOR (BEFORE)</span>
                                    <pre style={{
                                        background: 'rgba(239,68,68,0.05)',
                                        border: '1px solid rgba(239,68,68,0.15)',
                                        padding: '0.75rem',
                                        borderRadius: '8px',
                                        color: '#fca5a5',
                                        fontSize: '0.75rem',
                                        overflowX: 'auto',
                                        maxHeight: '120px'
                                    }}>{JSON.stringify(JSON.parse(selectedLog.beforeData), null, 2)}</pre>
                                </div>
                            )}

                            {selectedLog.afterData && (
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                                    <span style={{ fontSize: '0.75rem', color: '#10b981', fontWeight: 700 }}>VALOR NUEVO (AFTER)</span>
                                    <pre style={{
                                        background: 'rgba(16,185,129,0.05)',
                                        border: '1px solid rgba(16,185,129,0.15)',
                                        padding: '0.75rem',
                                        borderRadius: '8px',
                                        color: '#a7f3d0',
                                        fontSize: '0.75rem',
                                        overflowX: 'auto',
                                        maxHeight: '120px'
                                    }}>{JSON.stringify(JSON.parse(selectedLog.afterData), null, 2)}</pre>
                                </div>
                            )}
                        </div>

                        <button onClick={() => setSelectedLog(null)} className="btn-glass-nav" style={{ width: '100%', marginTop: '1.5rem', justifyContent: 'center' }}>
                            Cerrar Inspector
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
