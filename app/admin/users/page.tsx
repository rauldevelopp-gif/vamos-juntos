'use client';

import React, { useState, useEffect } from 'react';
import {
    Users, Shield, AlertTriangle, CheckCircle, Search, Filter,
    RefreshCw, Trash2, Key, Ban, Bell, FileText, Sliders, Calendar, ArrowRight, Eye, ShieldCheck, Lock, Activity
} from 'lucide-react';
import {
    getSystemUsers,
    updateUserRoleAction,
    updateUserStatusAction,
    sendUserWarningAction,
    deleteUserAction,
    getUserDisciplinaryHistory,
    getCurrentUserAction
} from './actions';

export default function UsersManagementPage() {
    const [currentUser, setCurrentUser] = useState<any>(null);
    const [authLoading, setAuthLoading] = useState(true);

    const [users, setUsers] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [filterRole, setFilterRole] = useState('Todos');
    const [filterStatus, setFilterStatus] = useState('Todos');
    const [refreshKey, setRefreshKey] = useState(0);

    // Selected user for details drawer
    const [selectedUser, setSelectedUser] = useState<any>(null);
    const [disciplinaryHistory, setDisciplinaryHistory] = useState<any[]>([]);
    const [historyLoading, setHistoryLoading] = useState(false);

    // Form inputs for action states
    const [newRole, setNewRole] = useState('');
    const [blockStatus, setBlockStatus] = useState('');
    const [blockReason, setBlockReason] = useState('Uso indebido');
    const [customBlockReasonText, setCustomBlockReasonText] = useState('');
    
    // Warning Form inputs
    const [warningTitle, setWarningTitle] = useState('Advertencia Operativa');
    const [warningMsg, setWarningMsg] = useState('Evite modificar tarifas o realizar cancelaciones masivas sin previa autorización.');
    const [warningSeverity, setWarningSeverity] = useState('WARN'); // INFO, WARN, RISK, CRITICAL
    const [warningBehavior, setWarningBehavior] = useState('CONFIRM'); // POPUP, ON_LOGIN, CONFIRM, PERSISTENT
    const [warningExpiry, setWarningExpiry] = useState('');

    useEffect(() => {
        getCurrentUserAction()
            .then(res => {
                if (res.success && res.user) {
                    setCurrentUser(res.user);
                }
                setAuthLoading(false);
            })
            .catch(err => {
                console.error("Auth check failed in users page:", err);
                setAuthLoading(false);
            });
    }, []);

    const isSuperAdmin = currentUser?.role === 'SUPER_ADMIN' || currentUser?.username?.toLowerCase() === 'admin';

    useEffect(() => {
        if (!isSuperAdmin) return;

        setLoading(true);
        getSystemUsers()
            .then(res => {
                if (res.success && res.data) {
                    setUsers(res.data);
                }
                setLoading(false);
            })
            .catch(err => {
                console.error("Error loading users:", err);
                setLoading(false);
            });
    }, [refreshKey, isSuperAdmin]);

    useEffect(() => {
        if (selectedUser) {
            setHistoryLoading(true);
            getUserDisciplinaryHistory(selectedUser.id)
                .then(res => {
                    if (res.success && res.data) {
                        setDisciplinaryHistory(res.data);
                    }
                    setHistoryLoading(false);
                })
                .catch(err => {
                    console.error("Error loading history:", err);
                    setHistoryLoading(false);
                });
        }
    }, [selectedUser, refreshKey]);

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

    const handleRefresh = () => {
        setRefreshKey(prev => prev + 1);
    };

    const handleRoleUpdate = async () => {
        if (!selectedUser || !newRole) return;
        const res = await updateUserRoleAction(selectedUser.id, newRole);
        if (res.success) {
            setSelectedUser({ ...selectedUser, role: newRole });
            handleRefresh();
        }
    };

    const handleStatusUpdate = async () => {
        if (!selectedUser || !blockStatus) return;
        const reason = blockReason === 'Otro' ? customBlockReasonText : blockReason;
        const res = await updateUserStatusAction(selectedUser.id, blockStatus, reason);
        if (res.success) {
            setSelectedUser({ ...selectedUser, status: blockStatus });
            handleRefresh();
        }
    };

    const handleSendWarning = async () => {
        if (!selectedUser || !warningTitle || !warningMsg) return;
        const res = await sendUserWarningAction(
            selectedUser.id,
            warningTitle,
            warningMsg,
            warningSeverity,
            warningBehavior,
            warningExpiry || undefined
        );
        if (res.success) {
            alert('Advertencia push disciplinaria enviada con éxito!');
            setWarningTitle('Advertencia Operativa');
            setWarningMsg('Evite modificar tarifas o realizar cancelaciones masivas sin previa autorización.');
            handleRefresh();
        }
    };

    const handleDeleteUser = async (type: 'LOGICAL' | 'PHYSICAL') => {
        if (!selectedUser) return;
        const confirmMsg = type === 'LOGICAL' 
            ? '¿Está seguro de realizar la eliminación lógica? El usuario dejará de poder ingresar, pero su historial y logs administrativos serán conservados por auditoría.'
            : '⚠️ ATENCIÓN: Esta es una eliminación FÍSICA permanente. Se borrarán todos los datos del usuario y es IRREVERSIBLE. ¿Desea continuar?';
        
        if (window.confirm(confirmMsg)) {
            const res = await deleteUserAction(selectedUser.id, type);
            if (res.success) {
                setSelectedUser(null);
                handleRefresh();
            }
        }
    };

    const getStatusColor = (status: string) => {
        switch(status) {
            case 'ACTIVO': return '#10b981';
            case 'SUSPENDIDO': return '#f59e0b';
            case 'BLOQUEADO': return 'var(--accent)';
            case 'REVISION': return '#06b6d4';
            default: return '#94a3b8';
        }
    };

    const getSeverityColor = (sev: string) => {
        switch(sev) {
            case 'INFO': return '#3b82f6'; // Azul
            case 'WARN': return '#f59e0b'; // Amarillo
            case 'RISK': return '#f97316'; // Naranja
            case 'CRITICAL': return 'var(--accent)'; // Rojo
            default: return '#94a3b8';
        }
    };

    const filteredUsers = users.filter(u => {
        const matchesSearch = u.username.toLowerCase().includes(search.toLowerCase()) || 
                              u.name.toLowerCase().includes(search.toLowerCase()) ||
                              u.email.toLowerCase().includes(search.toLowerCase());
        const matchesRole = filterRole === 'Todos' || u.role === filterRole;
        const matchesStatus = filterStatus === 'Todos' || u.status === filterStatus;
        return matchesSearch && matchesRole && matchesStatus;
    });



    return (
        <div style={{ maxWidth: '1400px', margin: '0 auto', minHeight: '100vh', padding: '1rem 0' }}>
            {/* Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
                <div>
                    <h1 style={{ fontSize: '2rem', fontWeight: 800, margin: 0, display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <span className="text-gradient">👥 Gestión de Usuarios</span>
                    </h1>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginTop: '0.25rem' }}>
                        Administración global de perfiles, asignación de roles, bloqueos preventivos y envío de advertencias disciplinarias.
                    </p>
                </div>
                <button onClick={handleRefresh} className="btn-glass-nav" style={{ padding: '0.5rem 1rem', fontSize: '0.85rem' }}>
                    <RefreshCw size={15} style={{ animation: loading ? 'spin 1s linear infinite' : 'none' }} />
                    Refrescar Lista
                </button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '2rem', transition: 'all 0.3s ease' }}>
                {/* Users List Panel */}
                <div className="glass-panel" style={{ padding: '1.5rem' }}>
                    {/* Filters Bar */}
                    <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '1.5rem', flexWrap: 'wrap', alignItems: 'center' }}>
                        <div style={{ position: 'relative', flex: 1, minWidth: '220px' }}>
                            <Search size={16} style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                            <input
                                type="text"
                                placeholder="Buscar por usuario, nombre o email..."
                                value={search}
                                onChange={e => setSearch(e.target.value)}
                                style={{
                                    width: '100%',
                                    padding: '0.55rem 1rem 0.55rem 2.2rem',
                                    borderRadius: '10px',
                                    background: 'rgba(255,255,255,0.03)',
                                    border: '1px solid var(--border-glass)',
                                    color: 'white',
                                    fontSize: '0.82rem',
                                    outline: 'none',
                                    fontFamily: 'inherit'
                                }}
                            />
                        </div>

                        <select value={filterRole} onChange={e => setFilterRole(e.target.value)} className="btn-glass-nav" style={{ fontSize: '0.8rem', background: 'var(--bg-main)' }}>
                            <option value="Todos">Rol: Todos</option>
                            <option value="SUPER_ADMIN">SUPER_ADMIN</option>
                            <option value="ADMIN">ADMIN</option>
                            <option value="AUDITOR">AUDITOR</option>
                            <option value="OPERATOR">OPERATOR</option>
                            <option value="USER">USER</option>
                        </select>

                        <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)} className="btn-glass-nav" style={{ fontSize: '0.8rem', background: 'var(--bg-main)' }}>
                            <option value="Todos">Estado: Todos</option>
                            <option value="ACTIVO">ACTIVO</option>
                            <option value="SUSPENDIDO">SUSPENDIDO</option>
                            <option value="BLOQUEADO">BLOQUEADO</option>
                            <option value="REVISION">REVISION</option>
                        </select>
                    </div>

                    {/* Table / List View */}
                    <div className="desktop-only" style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid var(--border-glass)', borderRadius: '24px', overflow: 'hidden' }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                            <thead>
                                <tr style={{ background: 'rgba(255,255,255,0.03)', borderBottom: '1px solid var(--border-glass)' }}>
                                    {['Usuario / ID', 'Nombre / Email', 'Rol', 'Estado', 'Acciones'].map(h => (
                                        <th key={h} style={{ padding: '1.2rem', color: 'var(--text-muted)', fontWeight: 600, fontSize: '0.9rem' }}>{h}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {loading && users.length === 0 ? (
                                    <tr>
                                        <td colSpan={5} style={{ textAlign: 'center', padding: '3rem' }}>
                                            <RefreshCw size={24} style={{ animation: 'spin 1s linear infinite', color: 'var(--primary)', margin: '0 auto' }} />
                                            <p style={{ color: 'var(--text-muted)', marginTop: '1rem' }}>Cargando usuarios...</p>
                                        </td>
                                    </tr>
                                ) : filteredUsers.length === 0 ? (
                                    <tr>
                                        <td colSpan={5} style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>Ningún usuario coincide con los filtros aplicados.</td>
                                    </tr>
                                ) : (
                                    filteredUsers.map((u) => {
                                        const isFocused = selectedUser?.id === u.id;
                                        return (
                                            <tr 
                                                key={u.id} 
                                                className="hover-row"
                                                style={{ 
                                                    borderBottom: '1px solid var(--border-glass)', 
                                                    background: isFocused ? 'rgba(139,92,246,0.05)' : 'transparent',
                                                    transition: 'var(--transition-smooth)' 
                                                }} 
                                            >
                                                <td style={{ padding: '1.2rem' }}>
                                                    <div style={{ fontWeight: 700, color: 'white', fontSize: '1.05rem' }}>{u.username}</div>
                                                    <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>ID #{u.id}</div>
                                                </td>
                                                <td style={{ padding: '1.2rem' }}>
                                                    <div style={{ color: 'white', fontWeight: 500 }}>{u.name}</div>
                                                    <div style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>{u.email}</div>
                                                </td>
                                                <td style={{ padding: '1.2rem' }}>
                                                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', fontWeight: 600, fontSize: '0.9rem', color: u.role === 'ADMIN' || u.role === 'SUPER_ADMIN' ? 'var(--primary)' : 'white' }}>
                                                        <Shield size={16} /> {u.role}
                                                    </span>
                                                </td>
                                                <td style={{ padding: '1.2rem' }}>
                                                    <span style={{
                                                        padding: '0.4rem 0.8rem',
                                                        borderRadius: '10px',
                                                        background: `${getStatusColor(u.status)}15`,
                                                        color: getStatusColor(u.status),
                                                        fontSize: '0.8rem',
                                                        fontWeight: 700
                                                    }}>
                                                        {u.status}
                                                    </span>
                                                </td>
                                                <td style={{ padding: '1.2rem' }}>
                                                    <button
                                                        onClick={() => {
                                                            setSelectedUser(u);
                                                            setNewRole(u.role);
                                                            setBlockStatus(u.status);
                                                        }}
                                                        className="btn-glass-nav"
                                                        style={{ padding: '0.5rem 1rem', borderRadius: '12px', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}
                                                    >
                                                        <Eye size={16} /> Gestionar
                                                    </button>
                                                </td>
                                            </tr>
                                        );
                                    })
                                )}
                            </tbody>
                        </table>
                    </div>

                    <div className="mobile-only" style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
                        {loading && users.length === 0 ? (
                            <div style={{ textAlign: 'center', padding: '4rem' }}>
                                <RefreshCw size={32} style={{ animation: 'spin 1s linear infinite', color: 'var(--primary)', margin: '0 auto' }} />
                                <p style={{ color: 'var(--text-muted)', marginTop: '1rem' }}>Cargando usuarios...</p>
                            </div>
                        ) : filteredUsers.length === 0 ? (
                            <div style={{ textAlign: 'center', padding: '4rem', color: 'var(--text-muted)' }}>Ningún usuario coincide con los filtros.</div>
                        ) : (
                            filteredUsers.map((u) => (
                                <div key={u.id} className="user-card-mobile" style={{
                                    padding: '1.5rem',
                                    borderRadius: '24px',
                                    border: '1px solid rgba(255, 255, 255, 0.3)',
                                    background: selectedUser?.id === u.id ? 'rgba(139,92,246,0.1)' : 'rgba(255, 255, 255, 0.08)',
                                    boxShadow: '0 10px 30px rgba(0, 0, 0, 0.5)',
                                    transition: 'all 0.3s'
                                }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                                        <div>
                                            <div style={{ fontWeight: 800, fontSize: '1.2rem', color: 'white', marginBottom: '0.2rem' }}>{u.username}</div>
                                            <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>ID #{u.id}</div>
                                        </div>
                                        <span style={{
                                            padding: '0.4rem 0.8rem',
                                            borderRadius: '10px',
                                            background: `${getStatusColor(u.status)}15`,
                                            color: getStatusColor(u.status),
                                            fontSize: '0.75rem',
                                            fontWeight: 700
                                        }}>
                                            {u.status}
                                        </span>
                                    </div>
                                    
                                    <div style={{ marginBottom: '1rem', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                                        <div style={{ marginBottom: '0.3rem', color: 'white', fontWeight: 500 }}>{u.name}</div>
                                        <div>{u.email}</div>
                                    </div>
                                    
                                    <div style={{ background: 'rgba(255,255,255,0.03)', borderRadius: '20px', padding: '1rem', marginBottom: '1.2rem', border: '1px solid var(--border-glass)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                        <Shield size={16} color={u.role === 'ADMIN' || u.role === 'SUPER_ADMIN' ? 'var(--primary)' : 'var(--text-muted)'} />
                                        <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'white' }}>{u.role}</span>
                                    </div>
                                    
                                    <button
                                        onClick={() => {
                                            setSelectedUser(u);
                                            setNewRole(u.role);
                                            setBlockStatus(u.status);
                                        }}
                                        className="btn-premium"
                                        style={{ width: '100%', padding: '0.9rem', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.6rem' }}
                                    >
                                        <Eye size={18} /> Gestionar Perfil
                                    </button>
                                </div>
                            ))
                        )}
                    </div>
                </div>

                {/* Details Modal / Control Panel */}
                {selectedUser && (
                    <div className="modal-overlay" onClick={() => setSelectedUser(null)}>
                        <div className="modal-content glass-panel" onClick={e => e.stopPropagation()} style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                            {/* Drawer Header */}
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border-glass)', paddingBottom: '0.75rem' }}>
                                <div>
                                    <h3 style={{ margin: 0, color: 'white', fontSize: '1rem' }}>Ficha de Control Administrativo</h3>
                                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Gestionando cuenta de: <strong>{selectedUser.username}</strong></span>
                                </div>
                                <button 
                                    onClick={() => setSelectedUser(null)} 
                                    style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', fontSize: '1.1rem', fontWeight: 800 }}
                                >
                                    X
                                </button>
                            </div>

                        {/* Profile metrics */}
                        <div className="glass-card" style={{ padding: '1rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                <span style={{ color: 'var(--text-muted)', fontSize: '0.78rem' }}>Identificador:</span>
                                <strong style={{ color: 'white', fontSize: '0.78rem' }}>ID #{selectedUser.id}</strong>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                <span style={{ color: 'var(--text-muted)', fontSize: '0.78rem' }}>Nombre Completo:</span>
                                <strong style={{ color: 'white', fontSize: '0.78rem' }}>{selectedUser.name}</strong>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                <span style={{ color: 'var(--text-muted)', fontSize: '0.78rem' }}>Correo Electrónico:</span>
                                <strong style={{ color: 'white', fontSize: '0.78rem' }}>{selectedUser.email}</strong>
                            </div>
                        </div>

                        {/* Action 1: Change User Role */}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                            <label style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Cambiar Rol Operativo</label>
                            <div style={{ display: 'flex', gap: '0.5rem' }}>
                                <select 
                                    value={newRole} 
                                    onChange={e => setNewRole(e.target.value)} 
                                    className="btn-glass-nav" 
                                    style={{ flex: 1, fontSize: '0.78rem', background: 'var(--bg-main)' }}
                                >
                                    <option value="USER">USER (Cliente Regular)</option>
                                    <option value="OPERATOR">OPERATOR (Operador Flotas/Reservas)</option>
                                    <option value="AUDITOR">AUDITOR (Auditor Global)</option>
                                    <option value="ADMIN">ADMIN (Administrador de Sistema)</option>
                                    <option value="SUPER_ADMIN">SUPER_ADMIN (Super Administrador)</option>
                                </select>
                                <button 
                                    onClick={handleRoleUpdate}
                                    className="btn-premium" 
                                    style={{ padding: '0.5rem 1rem', borderRadius: '10px', fontSize: '0.78rem' }}
                                >
                                    Asignar
                                </button>
                            </div>
                        </div>

                        {/* Action 2: Change Lock Status / Suspensions */}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                            <label style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Estados de Bloqueo y Suspensiones</label>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                <div style={{ display: 'flex', gap: '0.5rem' }}>
                                    <select 
                                        value={blockStatus} 
                                        onChange={e => setBlockStatus(e.target.value)} 
                                        className="btn-glass-nav" 
                                        style={{ flex: 1, fontSize: '0.78rem', background: 'var(--bg-main)' }}
                                    >
                                        <option value="ACTIVO">ACTIVO (Acceso Normal)</option>
                                        <option value="SUSPENDIDO">SUSPENDIDO (Bloqueo Temporal)</option>
                                        <option value="BLOQUEADO">BLOQUEADO (Bloqueo Total)</option>
                                        <option value="REVISION">REVISION (Bajo Inspección)</option>
                                    </select>
                                    <select 
                                        value={blockReason} 
                                        onChange={e => setBlockReason(e.target.value)} 
                                        className="btn-glass-nav" 
                                        style={{ fontSize: '0.78rem', background: 'var(--bg-main)' }}
                                    >
                                        <option value="Fraude">Motivo: Fraude</option>
                                        <option value="Spam">Motivo: Spam</option>
                                        <option value="Uso indebido">Uso indebido</option>
                                        <option value="Accesos sospechosos">Accesos sospechosos</option>
                                        <option value="Manipulación de datos">Manipulación de datos</option>
                                        <option value="Otro">Otro Motivo</option>
                                    </select>
                                </div>
                                {blockReason === 'Otro' && (
                                    <input 
                                        type="text" 
                                        placeholder="Especifique el motivo de la suspensión..." 
                                        value={customBlockReasonText}
                                        onChange={e => setCustomBlockReasonText(e.target.value)}
                                        style={{
                                            padding: '0.45rem',
                                            borderRadius: '8px',
                                            background: 'rgba(255,255,255,0.03)',
                                            border: '1px solid var(--border-glass)',
                                            color: 'white',
                                            fontSize: '0.78rem',
                                            outline: 'none'
                                        }}
                                    />
                                )}
                                <button 
                                    onClick={handleStatusUpdate}
                                    className="btn-premium" 
                                    style={{ padding: '0.5rem', borderRadius: '10px', fontSize: '0.78rem', width: '100%', background: 'linear-gradient(135deg, #f59e0b, #d97706)' }}
                                >
                                    Actualizar Estado de Cuenta
                                </button>
                            </div>
                        </div>

                        {/* Action 3: Send Customizable Warning Push Message */}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', background: 'rgba(255,255,255,0.01)', border: '1px dashed var(--border-glass)', padding: '1rem', borderRadius: '10px' }}>
                            <strong style={{ fontSize: '0.75rem', color: 'white', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                                <Bell size={13} color="var(--primary)" /> Redactar Nota Push / Advertencia Directa
                            </strong>
                            
                            <input 
                                type="text" 
                                placeholder="Título del popup (ej: Advertencia Masiva)" 
                                value={warningTitle}
                                onChange={e => setWarningTitle(e.target.value)}
                                style={{
                                    padding: '0.45rem',
                                    borderRadius: '8px',
                                    background: 'var(--bg-main)',
                                    border: '1px solid var(--border-glass)',
                                    color: 'white',
                                    fontSize: '0.78rem',
                                    outline: 'none'
                                }}
                            />

                            <textarea 
                                placeholder="Mensaje descriptivo de la advertencia disciplinaria..." 
                                value={warningMsg}
                                onChange={e => setWarningMsg(e.target.value)}
                                rows={2}
                                style={{
                                    padding: '0.45rem',
                                    borderRadius: '8px',
                                    background: 'var(--bg-main)',
                                    border: '1px solid var(--border-glass)',
                                    color: 'white',
                                    fontSize: '0.78rem',
                                    outline: 'none',
                                    resize: 'none',
                                    fontFamily: 'inherit'
                                }}
                            />

                            <div style={{ display: 'flex', gap: '0.5rem' }}>
                                <select 
                                    value={warningSeverity} 
                                    onChange={e => setWarningSeverity(e.target.value)} 
                                    className="btn-glass-nav" 
                                    style={{ flex: 1, fontSize: '0.75rem', padding: '0.35rem 0.5rem', background: 'var(--bg-main)' }}
                                >
                                    <option value="INFO">Severidad: Informativo (Azul)</option>
                                    <option value="WARN">Severidad: Advertencia (Amarillo)</option>
                                    <option value="RISK">Severidad: Riesgo (Naranja)</option>
                                    <option value="CRITICAL">Severidad: Crítico (Rojo)</option>
                                </select>
                                <select 
                                    value={warningBehavior} 
                                    onChange={e => setWarningBehavior(e.target.value)} 
                                    className="btn-glass-nav" 
                                    style={{ flex: 1, fontSize: '0.75rem', padding: '0.35rem 0.5rem', background: 'var(--bg-main)' }}
                                >
                                    <option value="POPUP">Popup simple al entrar</option>
                                    <option value="CONFIRM">Popup obligatorio confirmación</option>
                                    <option value="PERSISTENT">Persistente hasta lectura</option>
                                </select>
                            </div>

                            <button 
                                onClick={handleSendWarning}
                                className="btn-premium" 
                                style={{ padding: '0.45rem', borderRadius: '8px', fontSize: '0.75rem', width: '100%' }}
                            >
                                Enviar Advertencia Push
                            </button>
                        </div>

                        {/* Disciplinary History Timeline */}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                            <label style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>📜 Bitácora Disciplinaria</label>
                            
                            <div style={{ maxHeight: '150px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                                {historyLoading ? (
                                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Cargando bitácora...</span>
                                ) : disciplinaryHistory.length === 0 ? (
                                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontStyle: 'italic' }}>Sin antecedentes disciplinarios en el sistema.</span>
                                ) : (
                                    disciplinaryHistory.map((h, i) => (
                                        <div key={i} style={{ padding: '0.5rem', background: 'rgba(255,255,255,0.01)', borderRadius: '6px', border: '1px solid var(--border-glass)' }}>
                                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.15rem' }}>
                                                <strong style={{ fontSize: '0.78rem', color: 'white' }}>{h.action}</strong>
                                                <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>{new Date(h.createdAt).toLocaleDateString()}</span>
                                            </div>
                                            <p style={{ margin: 0, fontSize: '0.75rem', color: 'var(--text-muted)' }}>{h.reason}</p>
                                            <div style={{ fontSize: '0.65rem', color: 'var(--primary)', marginTop: '0.15rem', textAlign: 'right' }}>Admin: {h.adminName}</div>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>

                        {/* Action 4: Account Deletion (Logical / Physical) */}
                        <div style={{ borderTop: '1px solid var(--border-glass)', paddingTop: '1rem', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
                            <button 
                                onClick={() => handleDeleteUser('LOGICAL')}
                                className="btn-glass-nav" 
                                style={{ padding: '0.5rem', fontSize: '0.75rem', justifyContent: 'center', borderColor: 'rgba(239,68,68,0.2)', color: '#fca5a5' }}
                            >
                                Eliminación Lógica
                            </button>
                            <button 
                                onClick={() => handleDeleteUser('PHYSICAL')}
                                className="btn-premium" 
                                style={{ padding: '0.5rem', borderRadius: '8px', fontSize: '0.75rem', justifyContent: 'center', background: 'linear-gradient(135deg, var(--accent), #e11d48)' }}
                            >
                                Eliminación Física
                            </button>
                        </div>
                    </div>
                    </div>
                )}
            </div>

            <style jsx>{`
                @media (max-width: 768px) {
                    .desktop-only { display: none !important; }
                    .mobile-only { display: flex !important; }
                }
                @media (min-width: 769px) {
                    .desktop-only { display: block !important; }
                    .mobile-only { display: none !important; }
                }
                .hover-row:hover { background: rgba(255, 255, 255, 0.02) !important; }
                .modal-overlay {
                    position: fixed; top: 0; left: 0; right: 0; bottom: 0;
                    background: rgba(0, 0, 0, 0.85); backdrop-filter: blur(12px);
                    display: flex; align-items: center; justify-content: center;
                    z-index: 9999; animation: fadeIn 0.3s ease; padding: 1rem;
                }
                .modal-content {
                    width: 100%; max-width: 550px; border-radius: 25px; padding: 0;
                    animation: slideUp 0.4s cubic-bezier(0.4, 0, 0.2, 1);
                    max-height: 90vh; overflow-y: auto;
                }
                @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
                @keyframes slideUp { from { transform: translateY(30px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
            `}</style>
        </div>
    );
}
