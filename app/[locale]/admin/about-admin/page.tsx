'use client';

import React, { useState, useEffect } from 'react';
import {
    Activity, Award, Lock, ShieldAlert, Users, Settings, Save, RefreshCw, 
    Plus, Trash2, Edit3, Calendar, Upload, FileText, Globe, Layers, 
    Star, Heart, Check, X, ShieldCheck, ChevronRight, Eye, Trash, LinkedIn,
    Image, ListOrdered, ArrowUp, ArrowDown
} from 'lucide-react';
import { getCurrentUserAction } from '@/app/admin/users/actions';
import {
    getAboutUsContentAction,
    getAboutUsVersionsAction,
    saveAboutUsContentAction,
    restoreAboutUsVersionAction
} from './actions';

type TabType = 'institucional' | 'hero' | 'historia' | 'equipo' | 'gallery' | 'stats' | 'testimonios' | 'seo' | 'estructura' | 'versiones';

export default function AboutUsAdminPage() {
    // Auth States
    const [currentUser, setCurrentUser] = useState<any>(null);
    const [authLoading, setAuthLoading] = useState(true);

    // Data States
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [activeTab, setActiveTab] = useState<TabType>('institucional');
    const [message, setMessage] = useState({ text: '', type: '' });
    const [content, setContent] = useState<any>(null);
    const [versions, setVersions] = useState<any[]>([]);

    // CRUD Temp Items
    const [newHistoryItem, setNewHistoryItem] = useState({ year: '', title: '', description: '', image: '' });
    const [newTeamMember, setNewTeamMember] = useState({ name: '', role: '', bio: '', photo: '', linkedin: '', isFeatured: false });
    const [newStatItem, setNewStatItem] = useState({ value: '', suffix: '', label: '', icon: '' });
    const [newTestimonial, setNewTestimonial] = useState({ clientName: '', clientPhoto: '', comment: '', country: '', rating: 5, approved: true });
    const [newGalleryItem, setNewGalleryItem] = useState({ url: '', category: '', order: 1, active: true });

    useEffect(() => {
        getCurrentUserAction()
            .then(res => {
                if (res.success && res.user) {
                    setCurrentUser(res.user);
                }
                setAuthLoading(false);
            })
            .catch(err => {
                console.error("Auth check failed in about us:", err);
                setAuthLoading(false);
            });
    }, []);

    const isSuperAdmin = currentUser?.role === 'SUPER_ADMIN' || currentUser?.username?.toLowerCase() === 'admin' || currentUser?.role === 'ADMIN';

    useEffect(() => {
        if (!isSuperAdmin) return;
        loadData();
    }, [isSuperAdmin]);

    const loadData = async () => {
        setLoading(true);
        try {
            const [contentRes, versionsRes] = await Promise.all([
                getAboutUsContentAction(),
                getAboutUsVersionsAction()
            ]);
            if (contentRes.success && contentRes.data) {
                setContent(contentRes.data);
            }
            if (versionsRes.success && versionsRes.data) {
                setVersions(versionsRes.data);
            }
        } catch (e) {
            console.error("Error loading about-us contents:", e);
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async () => {
        if (!isSuperAdmin || !content) return;
        setSaving(true);
        setMessage({ text: '', type: '' });
        try {
            const res = await saveAboutUsContentAction(content);
            if (res.success && res.data) {
                setContent(res.data);
                setMessage({ text: 'Cambios guardados e incrementada versión a v' + res.data.version, type: 'success' });
                loadData();
                setTimeout(() => setMessage({ text: '', type: '' }), 4000);
            }
        } catch (e: any) {
            setMessage({ text: e.message || 'Error al guardar.', type: 'error' });
        } finally {
            setSaving(false);
        }
    };

    const handleRestore = async (verNum: number) => {
        if (!window.confirm(`¿Está seguro de restaurar los contenidos a la versión #${verNum}? Se generará una nueva revisión.`)) return;
        setSaving(true);
        try {
            const res = await restoreAboutUsVersionAction(verNum);
            if (res.success && res.data) {
                setContent(res.data);
                setMessage({ text: `Versión #${verNum} restaurada exitosamente como versión #${res.data.version}`, type: 'success' });
                loadData();
            }
        } catch (e: any) {
            alert(e.message || 'Error al restaurar');
        } finally {
            setSaving(false);
        }
    };

    // Helper item insertions
    const addHistoryItem = () => {
        if (!newHistoryItem.year || !newHistoryItem.title) return;
        setContent({
            ...content,
            history: [...content.history, { ...newHistoryItem, id: 'hist-' + Date.now() }]
        });
        setNewHistoryItem({ year: '', title: '', description: '', image: '' });
    };

    const removeHistoryItem = (id: string) => {
        setContent({
            ...content,
            history: content.history.filter((h: any) => h.id !== id)
        });
    };

    const addTeamMember = () => {
        if (!newTeamMember.name || !newTeamMember.role) return;
        setContent({
            ...content,
            team: [...content.team, { ...newTeamMember, id: 'member-' + Date.now() }]
        });
        setNewTeamMember({ name: '', role: '', bio: '', photo: '', linkedin: '', isFeatured: false });
    };

    const removeTeamMember = (id: string) => {
        setContent({
            ...content,
            team: content.team.filter((t: any) => t.id !== id)
        });
    };

    const addStatItem = () => {
        if (!newStatItem.value || !newStatItem.label) return;
        setContent({
            ...content,
            stats: [...content.stats, { ...newStatItem, id: 'stat-' + Date.now() }]
        });
        setNewStatItem({ value: '', suffix: '', label: '', icon: '' });
    };

    const removeStatItem = (id: string) => {
        setContent({
            ...content,
            stats: content.stats.filter((s: any) => s.id !== id)
        });
    };

    const addTestimonial = () => {
        if (!newTestimonial.clientName || !newTestimonial.comment) return;
        setContent({
            ...content,
            testimonials: [...content.testimonials, { ...newTestimonial, id: 'test-' + Date.now() }]
        });
        setNewTestimonial({ clientName: '', clientPhoto: '', comment: '', country: '', rating: 5, approved: true });
    };

    const removeTestimonial = (id: string) => {
        setContent({
            ...content,
            testimonials: content.testimonials.filter((t: any) => t.id !== id)
        });
    };

    const addGalleryItem = () => {
        if (!newGalleryItem.url) return;
        setContent({
            ...content,
            gallery: [...content.gallery, { ...newGalleryItem, id: 'gal-' + Date.now() }]
        });
        setNewGalleryItem({ url: '', category: 'General', order: 1, active: true });
    };

    const removeGalleryItem = (id: string) => {
        setContent({
            ...content,
            gallery: content.gallery.filter((g: any) => g.id !== id)
        });
    };

    const moveSection = (index: number, direction: 'up' | 'down') => {
        const newOrder = [...(content.sectionsOrder || [])];
        if (direction === 'up' && index > 0) {
            [newOrder[index - 1], newOrder[index]] = [newOrder[index], newOrder[index - 1]];
        } else if (direction === 'down' && index < newOrder.length - 1) {
            [newOrder[index + 1], newOrder[index]] = [newOrder[index], newOrder[index + 1]];
        }
        setContent({ ...content, sectionsOrder: newOrder });
    };

    const sectionNames: Record<string, string> = {
        hero: 'Banner Principal (Hero)',
        mission: 'Misión, Visión y Valores',
        stats: 'Estadísticas / Métricas',
        history: 'Línea de Tiempo (Historia)',
        team: 'Equipo Directivo',
        gallery: 'Galería de Experiencias',
        testimonials: 'Testimonios',
        cta: 'Llamado a la Acción (CTA Final)'
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

    if (loading || !content) {
        return (
            <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', height: '60vh', gap: '1rem' }}>
                <Activity size={32} style={{ animation: 'spin 1.5s linear infinite', color: 'var(--primary)' }} />
                <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Cargando contenidos institucionales...</p>
            </div>
        );
    }

    const tabs: { key: TabType; name: string; icon: React.ElementType }[] = [
        { key: 'institucional', name: 'Información', icon: Award },
        { key: 'hero', name: 'Banner Hero', icon: Image },
        { key: 'historia', name: 'Historia Timeline', icon: Calendar },
        { key: 'equipo', name: 'Equipo Directivo', icon: Users },
        { key: 'gallery', name: 'Galería', icon: Upload },
        { key: 'stats', name: 'Estadísticas', icon: Settings },
        { key: 'testimonios', name: 'Testimonios', icon: Star },
        { key: 'estructura', name: 'Orden de Secciones', icon: ListOrdered },
        { key: 'seo', name: 'SEO & Meta', icon: Globe },
        { key: 'versiones', name: 'Historial Versiones', icon: Layers }
    ];

    return (
        <div style={{ maxWidth: '1400px', margin: '0 auto', minHeight: '100vh', padding: '1rem 0' }}>
            {/* Header */}
            <div className="header-top">
                <div>
                    <h1 style={{ fontSize: '2rem', fontWeight: 800, margin: 0, display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <span className="text-gradient">🔒 Quiénes Somos (Admin)</span>
                    </h1>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginTop: '0.25rem' }}>
                        Administración dinámica global de la sección institucional. Versión activa actual: <strong>v{content.version}</strong>.
                    </p>
                </div>
                <div style={{ display: 'flex', gap: '0.75rem' }}>
                    <button onClick={loadData} className="btn-glass-nav" style={{ padding: '0.5rem 1rem', fontSize: '0.85rem' }}>
                        <RefreshCw size={15} style={{ animation: loading ? 'spin 1s linear infinite' : 'none' }} />
                        Sincronizar
                    </button>
                    <button onClick={handleSave} disabled={saving} className="btn-premium" style={{ padding: '0.5rem 1.25rem', fontSize: '0.85rem', borderRadius: '10px' }}>
                        <Save size={15} />
                        {saving ? 'Guardando...' : 'Publicar Cambios'}
                    </button>
                </div>
            </div>

            {message.text && (
                <div style={{ 
                    padding: '1rem', 
                    borderRadius: '12px', 
                    marginBottom: '1.5rem', 
                    background: message.type === 'success' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)',
                    color: message.type === 'success' ? '#10b981' : '#ef4444',
                    border: `1px solid ${message.type === 'success' ? 'rgba(16, 185, 129, 0.3)' : 'rgba(239, 68, 68, 0.3)'}`,
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    fontWeight: 700,
                    fontSize: '0.85rem'
                }}>
                    <Check size={18} /> {message.text}
                </div>
            )}

            {/* Slider Tabs */}
            <div className="tabs-container">
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
                                transition: 'all 0.2s',
                                fontWeight: isActive ? 600 : 500,
                                fontSize: '0.82rem',
                                fontFamily: 'inherit'
                            }}
                        >
                            <Icon size={16} color={isActive ? 'var(--primary)' : 'currentColor'} />
                            <span>{t.name}</span>
                        </button>
                    );
                })}
            </div>

            {/* Content panel */}
            <div className="glass-panel" style={{ padding: '2rem', minHeight: '500px' }}>
                
                {/* 1. INFORMACION INSTITUCIONAL */}
                {activeTab === 'institucional' && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                        <h3 style={{ margin: 0, color: 'white' }}>Información Corporativa Principal</h3>
                        <div className="grid-2">
                            <div className="input-group-full">
                                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 800, color: 'var(--text-muted)', marginBottom: '0.4rem' }}>TÍTULO DE SECCIÓN</label>
                                <input 
                                    type="text" 
                                    className="input-admin-premium"
                                    value={content.title} 
                                    onChange={e => setContent({...content, title: e.target.value})} 
                                />
                            </div>
                            <div className="input-group-full">
                                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 800, color: 'var(--text-muted)', marginBottom: '0.4rem' }}>SUBTÍTULO</label>
                                <input 
                                    type="text" 
                                    className="input-admin-premium"
                                    value={content.subtitle} 
                                    onChange={e => setContent({...content, subtitle: e.target.value})} 
                                />
                            </div>
                        </div>

                        <div className="input-group-full">
                            <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 800, color: 'var(--text-muted)', marginBottom: '0.4rem' }}>DESCRIPCIÓN LARGA (Rich Text Editor)</label>
                            <textarea 
                                rows={5}
                                className="input-admin-premium"
                                style={{ fontFamily: 'inherit', resize: 'vertical' }}
                                value={content.description} 
                                onChange={e => setContent({...content, description: e.target.value})} 
                            />
                        </div>

                        <div className="grid-2" style={{ marginTop: '1rem' }}>
                            <div className="input-group-full">
                                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 800, color: 'var(--text-muted)', marginBottom: '0.4rem', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                                    <ShieldCheck size={14} color="#10b981" /> NUESTRA MISIÓN
                                </label>
                                <textarea 
                                    rows={4}
                                    className="input-admin-premium"
                                    style={{ fontFamily: 'inherit' }}
                                    value={content.mission} 
                                    onChange={e => setContent({...content, mission: e.target.value})} 
                                />
                            </div>
                            <div className="input-group-full">
                                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 800, color: 'var(--text-muted)', marginBottom: '0.4rem', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                                    <Eye size={14} color="#3b82f6" /> NUESTRA VISIÓN
                                </label>
                                <textarea 
                                    rows={4}
                                    className="input-admin-premium"
                                    style={{ fontFamily: 'inherit' }}
                                    value={content.vision} 
                                    onChange={e => setContent({...content, vision: e.target.value})} 
                                />
                            </div>
                        </div>
                    </div>
                )}

                {/* 2. HERO MULTIMEDIA */}
                {activeTab === 'hero' && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                        <h3 style={{ margin: 0, color: 'white' }}>Gestión Multimedia Hero Banner</h3>
                        
                        <div className="grid-2-1">
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                                <div className="input-group-full">
                                    <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 800, color: 'var(--text-muted)', marginBottom: '0.4rem' }}>TÍTULO DE TEXTO EN EL BANNER</label>
                                    <input 
                                        type="text" 
                                        className="input-admin-premium"
                                        value={content.heroTitle} 
                                        onChange={e => setContent({...content, heroTitle: e.target.value})} 
                                    />
                                </div>

                                <div className="grid-2-gap1">
                                    <div className="input-group-full">
                                        <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 800, color: 'var(--text-muted)', marginBottom: '0.4rem' }}>IMAGEN DE FONDO (DESKTOP)</label>
                                        <input 
                                            type="text" 
                                            className="input-admin-premium"
                                            value={content.heroDesktopImage} 
                                            onChange={e => setContent({...content, heroDesktopImage: e.target.value})} 
                                        />
                                    </div>
                                    <div className="input-group-full">
                                        <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 800, color: 'var(--text-muted)', marginBottom: '0.4rem' }}>IMAGEN DE FONDO (MOBILE)</label>
                                        <input 
                                            type="text" 
                                            className="input-admin-premium"
                                            value={content.heroMobileImage} 
                                            onChange={e => setContent({...content, heroMobileImage: e.target.value})} 
                                        />
                                    </div>
                                </div>

                                <div className="grid-2-1-gap1">
                                    <div className="input-group-full">
                                        <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 800, color: 'var(--text-muted)', marginBottom: '0.4rem' }}>VIDEO DE FONDO (.MP4 MAX 30MB)</label>
                                        <input 
                                            type="text" 
                                            className="input-admin-premium"
                                            value={content.heroVideoBg} 
                                            onChange={e => setContent({...content, heroVideoBg: e.target.value})} 
                                        />
                                    </div>
                                    <div className="input-group-full">
                                        <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 800, color: 'var(--text-muted)', marginBottom: '0.4rem' }}>OPACIDAD DE CAPA OVERLAY (%)</label>
                                        <input 
                                            type="number" 
                                            className="input-admin-premium"
                                            min="0" max="100"
                                            value={content.heroOpacity} 
                                            onChange={e => setContent({...content, heroOpacity: parseInt(e.target.value) || 0})} 
                                        />
                                    </div>
                                </div>

                                <div className="grid-2-gap1">
                                    <div className="input-group-full">
                                        <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 800, color: 'var(--text-muted)', marginBottom: '0.4rem' }}>TEXTO BOTÓN CTA</label>
                                        <input 
                                            type="text" 
                                            className="input-admin-premium"
                                            value={content.heroCtaText} 
                                            onChange={e => setContent({...content, heroCtaText: e.target.value})} 
                                        />
                                    </div>
                                    <div className="input-group-full">
                                        <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 800, color: 'var(--text-muted)', marginBottom: '0.4rem' }}>ENLACE CTA (URL SLUG)</label>
                                        <input 
                                            type="text" 
                                            className="input-admin-premium"
                                            value={content.heroCtaLink} 
                                            onChange={e => setContent({...content, heroCtaLink: e.target.value})} 
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Banner Real-time Simulator */}
                            <div className="glass-card" style={{ padding: '1rem', display: 'flex', flexDirection: 'column', gap: '0.5rem', height: 'fit-content' }}>
                                <span style={{ fontSize: '0.7rem', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Simulación Banner Hero (Previsualización)</span>
                                <div style={{
                                    height: '240px',
                                    borderRadius: '12px',
                                    position: 'relative',
                                    backgroundImage: `url(${content.heroDesktopImage})`,
                                    backgroundSize: 'cover',
                                    backgroundPosition: 'center',
                                    overflow: 'hidden',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    textAlign: 'center',
                                    padding: '1rem'
                                }}>
                                    <div style={{
                                        position: 'absolute',
                                        top: 0, left: 0, right: 0, bottom: 0,
                                        backgroundColor: `rgba(0,0,0, ${content.heroOpacity / 100})`,
                                        zIndex: 1
                                    }} />
                                    <div style={{ position: 'relative', zIndex: 2 }}>
                                        <h4 style={{ color: 'white', margin: '0 0 0.5rem 0', fontSize: '1.1rem', fontWeight: 800 }}>{content.heroTitle || 'Título del banner'}</h4>
                                        {content.heroCtaText && (
                                            <span style={{
                                                padding: '0.35rem 0.8rem',
                                                background: 'var(--primary)',
                                                color: 'white',
                                                borderRadius: '6px',
                                                fontSize: '0.7rem',
                                                fontWeight: 700,
                                                display: 'inline-block'
                                            }}>{content.heroCtaText}</span>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* 3. TIMELINE / HISTORIA */}
                {activeTab === 'historia' && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <h3 style={{ margin: 0, color: 'white' }}>Timeline / Hitos de la Empresa</h3>
                            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Crea y ordena la trayectoria histórica visual.</span>
                        </div>

                        {/* Interactive Hito CRUD Add */}
                        <div className="glass-card" style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '1rem', background: 'rgba(255,255,255,0.01)' }}>
                            <strong style={{ color: 'white', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                                <Plus size={14} color="var(--primary)" /> Añadir Nuevo Hito Histórico
                            </strong>
                            <div className="grid-history">
                                <div>
                                    <label style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>AÑO</label>
                                    <input 
                                        type="text" 
                                        placeholder="Ej: 2012"
                                        className="input-admin-premium"
                                        value={newHistoryItem.year} 
                                        onChange={e => setNewHistoryItem({...newHistoryItem, year: e.target.value})} 
                                    />
                                </div>
                                <div>
                                    <label style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>TÍTULO</label>
                                    <input 
                                        type="text" 
                                        placeholder="Ej: Lanzamiento del portal"
                                        className="input-admin-premium"
                                        value={newHistoryItem.title} 
                                        onChange={e => setNewHistoryItem({...newHistoryItem, title: e.target.value})} 
                                    />
                                </div>
                                <div>
                                    <label style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>FOTO REFERENCIAL (URL)</label>
                                    <input 
                                        type="text" 
                                        placeholder="Ej: https://..."
                                        className="input-admin-premium"
                                        value={newHistoryItem.image} 
                                        onChange={e => setNewHistoryItem({...newHistoryItem, image: e.target.value})} 
                                    />
                                </div>
                                <button 
                                    onClick={addHistoryItem}
                                    className="btn-premium" 
                                    style={{ padding: '0.45rem', borderRadius: '8px', fontSize: '0.75rem', justifyContent: 'center' }}
                                >
                                    Añadir
                                </button>
                            </div>
                            <div>
                                <label style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>DESCRIPCIÓN DEL ACONTECIMIENTO</label>
                                <input 
                                    type="text" 
                                    placeholder="Detalles sobre lo ocurrido..."
                                    className="input-admin-premium"
                                    value={newHistoryItem.description} 
                                    onChange={e => setNewHistoryItem({...newHistoryItem, description: e.target.value})} 
                                />
                            </div>
                        </div>

                        {/* List items */}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginTop: '1rem' }}>
                            {content.history.length === 0 ? (
                                <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)' }}>Sin hitos registrados en la línea del tiempo.</div>
                            ) : (
                                content.history.map((item: any) => (
                                    <div key={item.id} className="glass-card" style={{ padding: '1rem', display: 'flex', gap: '1rem', alignItems: 'center' }}>
                                        <div style={{
                                            fontSize: '1.25rem', fontWeight: 900, color: 'var(--primary)', 
                                            width: '80px', flexShrink: 0, textAlign: 'center', borderRight: '1px solid var(--border-glass)'
                                        }}>
                                            {item.year}
                                        </div>
                                        {item.image && (
                                            <div style={{ 
                                                width: '64px', height: '48px', borderRadius: '6px', 
                                                backgroundImage: `url(${item.image})`, backgroundSize: 'cover', backgroundPosition: 'center',
                                                flexShrink: 0
                                            }} />
                                        )}
                                        <div style={{ flex: 1 }}>
                                            <strong style={{ color: 'white', fontSize: '0.85rem' }}>{item.title}</strong>
                                            <p style={{ margin: '0.15rem 0 0 0', color: 'var(--text-muted)', fontSize: '0.78rem' }}>{item.description}</p>
                                        </div>
                                        <button 
                                            onClick={() => removeHistoryItem(item.id)}
                                            style={{ background: 'none', border: 'none', color: 'var(--accent)', cursor: 'pointer', padding: '0.5rem' }}
                                        >
                                            <Trash size={16} />
                                        </button>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                )}

                {/* 4. EQUIPO DIRECTIVO */}
                {activeTab === 'equipo' && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                        <h3 style={{ margin: 0, color: 'white' }}>Gestión del Equipo de Directivos</h3>
                        
                        {/* Member CRUD Add */}
                        <div className="glass-card" style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '1rem', background: 'rgba(255,255,255,0.01)' }}>
                            <strong style={{ color: 'white', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                                <Plus size={14} color="var(--primary)" /> Añadir Miembro del Equipo
                            </strong>
                            <div className="grid-team-4">
                                <div>
                                    <label style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>NOMBRE COMPLETO</label>
                                    <input 
                                        type="text" 
                                        placeholder="Ej: Alejandro Ruiz"
                                        className="input-admin-premium"
                                        value={newTeamMember.name} 
                                        onChange={e => setNewTeamMember({...newTeamMember, name: e.target.value})} 
                                    />
                                </div>
                                <div>
                                    <label style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>CARGO CORPORATIVO</label>
                                    <input 
                                        type="text" 
                                        placeholder="Ej: Director Ejecutivo"
                                        className="input-admin-premium"
                                        value={newTeamMember.role} 
                                        onChange={e => setNewTeamMember({...newTeamMember, role: e.target.value})} 
                                    />
                                </div>
                                <div>
                                    <label style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>FOTO PERFIL (URL)</label>
                                    <input 
                                        type="text" 
                                        placeholder="https://..."
                                        className="input-admin-premium"
                                        value={newTeamMember.photo} 
                                        onChange={e => setNewTeamMember({...newTeamMember, photo: e.target.value})} 
                                    />
                                </div>
                                <div>
                                    <label style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>LINKEDIN URL</label>
                                    <input 
                                        type="text" 
                                        placeholder="https://linkedin.com/in/..."
                                        className="input-admin-premium"
                                        value={newTeamMember.linkedin} 
                                        onChange={e => setNewTeamMember({...newTeamMember, linkedin: e.target.value})} 
                                    />
                                </div>
                            </div>
                            <div className="flex-responsive-row">
                                <div style={{ flex: 1 }}>
                                    <label style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>BIOGRAFÍA CORTA</label>
                                    <input 
                                        type="text" 
                                        placeholder="Breve reseña profesional..."
                                        className="input-admin-premium"
                                        value={newTeamMember.bio} 
                                        onChange={e => setNewTeamMember({...newTeamMember, bio: e.target.value})} 
                                    />
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '1rem', flexShrink: 0 }}>
                                    <label style={{ color: 'white', fontSize: '0.78rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                                        <input 
                                            type="checkbox" 
                                            checked={newTeamMember.isFeatured}
                                            onChange={e => setNewTeamMember({...newTeamMember, isFeatured: e.target.checked})}
                                        />
                                        Miembro Destacado (Principal)
                                    </label>
                                </div>
                                <button 
                                    onClick={addTeamMember}
                                    className="btn-premium" 
                                    style={{ padding: '0.5rem 1.5rem', borderRadius: '10px', fontSize: '0.78rem', alignSelf: 'end' }}
                                >
                                    Añadir Miembro
                                </button>
                            </div>
                        </div>

                        {/* List and visual Grid */}
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1rem', marginTop: '1rem' }}>
                            {content.team.map((member: any) => (
                                <div key={member.id} className="glass-card" style={{ padding: '1rem', display: 'flex', gap: '1rem', position: 'relative' }}>
                                    <div style={{
                                        width: '64px', height: '64px', borderRadius: '50%',
                                        backgroundImage: `url(${member.photo || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80'})`,
                                        backgroundSize: 'cover', backgroundPosition: 'center',
                                        flexShrink: 0,
                                        border: member.isFeatured ? '2px solid var(--primary)' : '1px solid var(--border-glass)'
                                    }} />
                                    <div style={{ flex: 1, minWidth: 0 }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                                            <strong style={{ color: 'white', fontSize: '0.85rem', display: 'block' }}>{member.name}</strong>
                                            {member.isFeatured && <span style={{ fontSize: '0.6rem', color: 'var(--primary)', background: 'rgba(139,92,246,0.1)', padding: '0.05rem 0.25rem', borderRadius: '4px', fontWeight: 800 }}>Destacado</span>}
                                        </div>
                                        <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: 600, display: 'block' }}>{member.role}</span>
                                        <p style={{ margin: '0.25rem 0 0 0', color: 'var(--text-muted)', fontSize: '0.72rem', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{member.bio}</p>
                                    </div>
                                    <button 
                                        onClick={() => removeTeamMember(member.id)}
                                        style={{ position: 'absolute', top: '0.5rem', right: '0.5rem', background: 'none', border: 'none', color: 'var(--accent)', cursor: 'pointer' }}
                                    >
                                        <Trash size={15} />
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* 5. GALERIA MULTIMEDIA */}
                {activeTab === 'gallery' && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                        <h3 style={{ margin: 0, color: 'white' }}>Galería Multimedia Corporativa</h3>
                        
                        {/* Drag & Drop simulator Upload */}
                        <div className="grid-2-1-gap15">
                            <div className="glass-card" style={{
                                border: '2px dashed var(--border-glass)', borderRadius: '16px',
                                padding: '2rem', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                                textAlign: 'center', gap: '0.75rem', background: 'rgba(255,255,255,0.01)'
                            }}>
                                <Upload size={32} color="var(--primary)" />
                                <div>
                                    <strong style={{ color: 'white', fontSize: '0.85rem' }}>Subir Imágenes y Documentos (Drag & Drop)</strong>
                                    <p style={{ color: 'var(--text-muted)', fontSize: '0.75rem', margin: '0.2rem 0 0 0' }}>Soporte para imágenes (PNG, WEBP, JPG), videos mp4 y catálogos PDF institucionales.</p>
                                </div>
                                <div style={{ display: 'flex', gap: '0.5rem', width: '100%', maxWidth: '340px', marginTop: '0.5rem' }}>
                                    <input 
                                        type="text" 
                                        placeholder="Pegar URL de imagen / archivo..."
                                        className="input-admin-premium"
                                        style={{ fontSize: '0.75rem', padding: '0.4rem 0.75rem' }}
                                        value={newGalleryItem.url} 
                                        onChange={e => setNewGalleryItem({...newGalleryItem, url: e.target.value})} 
                                    />
                                    <button onClick={addGalleryItem} className="btn-premium" style={{ padding: '0.4rem 1rem', fontSize: '0.75rem', borderRadius: '8px' }}>
                                        Vincular
                                    </button>
                                </div>
                            </div>

                            <div className="glass-card" style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                                <span style={{ fontSize: '0.72rem', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Filtros y Categorías</span>
                                <input 
                                    type="text" 
                                    placeholder="Categoría (Ej: Yates)"
                                    className="input-admin-premium"
                                    value={newGalleryItem.category} 
                                    onChange={e => setNewGalleryItem({...newGalleryItem, category: e.target.value})} 
                                />
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '0.5rem' }}>
                                    <span style={{ fontSize: '0.78rem', color: 'white' }}>Estado de Imagen:</span>
                                    <label style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', color: 'var(--text-muted)', fontSize: '0.75rem' }}>
                                        <input 
                                            type="checkbox" 
                                            checked={newGalleryItem.active}
                                            onChange={e => setNewGalleryItem({...newGalleryItem, active: e.target.checked})} 
                                        />
                                        Activa
                                    </label>
                                </div>
                            </div>
                        </div>

                        {/* Gallery grid list */}
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '1rem', marginTop: '1rem' }}>
                            {content.gallery.map((img: any) => (
                                <div key={img.id} className="glass-card" style={{ padding: '0.5rem', position: 'relative', overflow: 'hidden' }}>
                                    <div style={{ 
                                        height: '120px', borderRadius: '8px', 
                                        backgroundImage: `url(${img.url})`, backgroundSize: 'cover', backgroundPosition: 'center',
                                        opacity: img.active ? 1 : 0.4
                                    }} />
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '0.5rem', fontSize: '0.72rem' }}>
                                        <span style={{ color: 'white', background: 'rgba(255,255,255,0.05)', padding: '0.1rem 0.4rem', borderRadius: '4px' }}>{img.category || 'General'}</span>
                                        <span style={{ color: img.active ? '#10b981' : '#94a3b8', fontWeight: 700 }}>{img.active ? 'Activo' : 'Oculto'}</span>
                                    </div>
                                    <button 
                                        onClick={() => removeGalleryItem(img.id)}
                                        style={{ position: 'absolute', top: '0.75rem', right: '0.75rem', background: 'rgba(0,0,0,0.6)', border: 'none', color: 'var(--accent)', cursor: 'pointer', padding: '0.35rem', borderRadius: '4px' }}
                                    >
                                        <Trash size={13} />
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* 6. ESTADÍSTICAS CORPORATIVAS */}
                {activeTab === 'stats' && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                        <h3 style={{ margin: 0, color: 'white' }}>Estadísticas Corporativas y Logros</h3>
                        
                        {/* Stat Add */}
                        <div className="glass-card" style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '1rem', background: 'rgba(255,255,255,0.01)' }}>
                            <strong style={{ color: 'white', fontSize: '0.8rem' }}>Añadir Métrica / Logro Corporativo</strong>
                            <div className="grid-stat-4">
                                <div>
                                    <label style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>CANTIDAD / NÚMERO</label>
                                    <input 
                                        type="text" 
                                        placeholder="Ej: 500 o 15"
                                        className="input-admin-premium"
                                        value={newStatItem.value} 
                                        onChange={e => setNewStatItem({...newStatItem, value: e.target.value})} 
                                    />
                                </div>
                                <div>
                                    <label style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>SUFIJO / TEXTO</label>
                                    <input 
                                        type="text" 
                                        placeholder="Ej: + o Años"
                                        className="input-admin-premium"
                                        value={newStatItem.suffix} 
                                        onChange={e => setNewStatItem({...newStatItem, suffix: e.target.value})} 
                                    />
                                </div>
                                <div>
                                    <label style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>ETIQUETA DESCRIPTIVA</label>
                                    <input 
                                        type="text" 
                                        placeholder="Ej: Clientes satisfechos"
                                        className="input-admin-premium"
                                        value={newStatItem.label} 
                                        onChange={e => setNewStatItem({...newStatItem, label: e.target.value})} 
                                    />
                                </div>
                                <button 
                                    onClick={addStatItem}
                                    className="btn-premium" 
                                    style={{ padding: '0.45rem', borderRadius: '8px', fontSize: '0.75rem', justifyContent: 'center' }}
                                >
                                    Insertar
                                </button>
                            </div>
                        </div>

                        {/* List metrics */}
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem', marginTop: '1rem' }}>
                            {content.stats.map((stat: any) => (
                                <div key={stat.id} className="glass-card" style={{ padding: '1.25rem', textAlign: 'center', position: 'relative' }}>
                                    <div style={{ fontSize: '1.8rem', fontWeight: 900, color: 'var(--primary)' }}>
                                        {stat.value}{stat.suffix}
                                    </div>
                                    <div style={{ fontSize: '0.8rem', color: 'white', marginTop: '0.2rem' }}>{stat.label}</div>
                                    <button 
                                        onClick={() => removeStatItem(stat.id)}
                                        style={{ position: 'absolute', top: '0.5rem', right: '0.5rem', background: 'none', border: 'none', color: 'var(--accent)', cursor: 'pointer' }}
                                    >
                                        <Trash size={14} />
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* 7. TESTIMONIOS */}
                {activeTab === 'testimonios' && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                        <h3 style={{ margin: 0, color: 'white' }}>Testimonios de Clientes</h3>
                        
                        {/* Testimonial CRUD Add */}
                        <div className="glass-card" style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '1rem', background: 'rgba(255,255,255,0.01)' }}>
                            <strong style={{ color: 'white', fontSize: '0.8rem' }}>Crear Nuevo Testimonio</strong>
                            <div className="grid-test-4">
                                <div>
                                    <label style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>NOMBRE CLIENTE</label>
                                    <input 
                                        type="text" 
                                        placeholder="Ej: Sophia Loren"
                                        className="input-admin-premium"
                                        value={newTestimonial.clientName} 
                                        onChange={e => setNewTestimonial({...newTestimonial, clientName: e.target.value})} 
                                    />
                                </div>
                                <div>
                                    <label style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>FOTO CLIENTE (URL)</label>
                                    <input 
                                        type="text" 
                                        className="input-admin-premium"
                                        value={newTestimonial.clientPhoto} 
                                        onChange={e => setNewTestimonial({...newTestimonial, clientPhoto: e.target.value})} 
                                    />
                                </div>
                                <div>
                                    <label style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>PAÍS</label>
                                    <input 
                                        type="text" 
                                        placeholder="Ej: Italia"
                                        className="input-admin-premium"
                                        value={newTestimonial.country} 
                                        onChange={e => setNewTestimonial({...newTestimonial, country: e.target.value})} 
                                    />
                                </div>
                                <div>
                                    <label style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>ESTRELLAS</label>
                                    <select 
                                        className="input-admin-premium"
                                        style={{ background: 'var(--bg-main)', color: 'white' }}
                                        value={newTestimonial.rating} 
                                        onChange={e => setNewTestimonial({...newTestimonial, rating: parseInt(e.target.value) || 5})}
                                    >
                                        <option value="5">5 ★</option>
                                        <option value="4">4 ★</option>
                                        <option value="3">3 ★</option>
                                    </select>
                                </div>
                            </div>
                            <div className="flex-responsive-row">
                                <div style={{ flex: 1 }}>
                                    <label style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>COMENTARIO</label>
                                    <input 
                                        type="text" 
                                        placeholder="Excelente experiencia, súper recomendados..."
                                        className="input-admin-premium"
                                        value={newTestimonial.comment} 
                                        onChange={e => setNewTestimonial({...newTestimonial, comment: e.target.value})} 
                                    />
                                </div>
                                <button 
                                    onClick={addTestimonial}
                                    className="btn-premium" 
                                    style={{ padding: '0.5rem 1.5rem', borderRadius: '10px', fontSize: '0.78rem' }}
                                >
                                    Guardar
                                </button>
                            </div>
                        </div>

                        {/* List */}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginTop: '1rem' }}>
                            {content.testimonials.map((test: any) => (
                                <div key={test.id} className="glass-card" style={{ padding: '1rem', display: 'flex', gap: '1rem', position: 'relative', alignItems: 'center' }}>
                                    <div style={{
                                        width: '48px', height: '48px', borderRadius: '50%',
                                        backgroundImage: `url(${test.clientPhoto || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80'})`,
                                        backgroundSize: 'cover', backgroundPosition: 'center', flexShrink: 0
                                    }} />
                                    <div style={{ flex: 1 }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                            <strong style={{ color: 'white', fontSize: '0.85rem' }}>{test.clientName}</strong>
                                            <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>• {test.country}</span>
                                            <span style={{ fontSize: '0.7rem', color: '#f59e0b', fontWeight: 700 }}>{'★'.repeat(test.rating)}</span>
                                        </div>
                                        <p style={{ margin: '0.2rem 0 0 0', color: 'var(--text-muted)', fontSize: '0.78rem' }}>"{test.comment}"</p>
                                    </div>
                                    <div style={{ display: 'flex', gap: '0.5rem', flexShrink: 0, marginRight: '1.5rem' }}>
                                        <span style={{
                                            fontSize: '0.65rem', fontWeight: 800, padding: '0.15rem 0.4rem', borderRadius: '4px',
                                            background: test.approved ? 'rgba(16,185,129,0.1)' : 'rgba(239,68,68,0.1)',
                                            color: test.approved ? '#10b981' : '#ef4444'
                                        }}>{test.approved ? 'APROBADO' : 'OCULTO'}</span>
                                    </div>
                                    <button 
                                        onClick={() => removeTestimonial(test.id)}
                                        style={{ position: 'absolute', right: '0.5rem', background: 'none', border: 'none', color: 'var(--accent)', cursor: 'pointer' }}
                                    >
                                        <Trash size={15} />
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* 8. SEO & METADATA */}
                {activeTab === 'seo' && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                        <h3 style={{ margin: 0, color: 'white' }}>Optimización de Motores de Búsqueda (SEO)</h3>
                        
                        <div className="grid-2">
                            <div className="input-group-full">
                                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 800, color: 'var(--text-muted)', marginBottom: '0.4rem' }}>META TITLE (TÍTULO GOOGLE)</label>
                                <input 
                                    type="text" 
                                    className="input-admin-premium"
                                    value={content.seoTitle} 
                                    onChange={e => setContent({...content, seoTitle: e.target.value})} 
                                />
                            </div>
                            <div className="input-group-full">
                                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 800, color: 'var(--text-muted)', marginBottom: '0.4rem' }}>SEO FRIENDLY SLUG (RUTA URL)</label>
                                <input 
                                    type="text" 
                                    className="input-admin-premium"
                                    value={content.seoSlug} 
                                    onChange={e => setContent({...content, seoSlug: e.target.value})} 
                                />
                            </div>
                        </div>

                        <div className="input-group-full">
                            <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 800, color: 'var(--text-muted)', marginBottom: '0.4rem' }}>META DESCRIPTION (EXTRACTO BUSCADORES)</label>
                            <textarea 
                                rows={3}
                                className="input-admin-premium"
                                value={content.seoDescription} 
                                onChange={e => setContent({...content, seoDescription: e.target.value})} 
                            />
                        </div>

                        <div className="grid-2">
                            <div className="input-group-full">
                                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 800, color: 'var(--text-muted)', marginBottom: '0.4rem' }}>KEYWORDS (PALABRAS CLAVE)</label>
                                <input 
                                    type="text" 
                                    className="input-admin-premium"
                                    value={content.seoKeywords} 
                                    onChange={e => setContent({...content, seoKeywords: e.target.value})} 
                                />
                            </div>
                            <div className="input-group-full">
                                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 800, color: 'var(--text-muted)', marginBottom: '0.4rem' }}>OPEN GRAPH SHARE IMAGE (FACEBOOK / TWITTER)</label>
                                <input 
                                    type="text" 
                                    className="input-admin-premium"
                                    value={content.seoOgImage} 
                                    onChange={e => setContent({...content, seoOgImage: e.target.value})} 
                                />
                            </div>
                        </div>
                    </div>
                )}

                {/* ORDEN DE SECCIONES */}
                {activeTab === 'estructura' && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <h3 style={{ margin: 0, color: 'white' }}>Estructura y Orden de la Página</h3>
                            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Define en qué orden aparecen las secciones en la vista pública.</span>
                        </div>
                        
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                            {(!content.sectionsOrder || content.sectionsOrder.length === 0) && (
                                <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)' }}>No hay secciones configuradas. Por favor, guarda para inicializar.</div>
                            )}
                            {content.sectionsOrder?.map((sectionKey: string, index: number) => (
                                <div 
                                    key={sectionKey} 
                                    className="glass-card" 
                                    style={{ 
                                        padding: '1rem 1.5rem', 
                                        display: 'flex', 
                                        justifyContent: 'space-between',
                                        alignItems: 'center',
                                        background: 'rgba(255,255,255,0.02)',
                                        border: '1px solid var(--border-glass)'
                                    }}
                                >
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                        <div style={{ 
                                            width: '28px', height: '28px', borderRadius: '50%', 
                                            background: 'rgba(139, 92, 246, 0.1)', color: 'var(--primary)',
                                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                                            fontWeight: 800, fontSize: '0.8rem'
                                        }}>
                                            {index + 1}
                                        </div>
                                        <div>
                                            <strong style={{ color: 'white', display: 'block', fontSize: '0.9rem' }}>{sectionNames[sectionKey] || sectionKey}</strong>
                                            <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>ID interno: {sectionKey}</span>
                                        </div>
                                    </div>
                                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                                        <button 
                                            onClick={() => moveSection(index, 'up')}
                                            disabled={index === 0}
                                            className="btn-glass-nav"
                                            style={{ padding: '0.4rem', borderRadius: '8px', opacity: index === 0 ? 0.3 : 1, cursor: index === 0 ? 'not-allowed' : 'pointer' }}
                                        >
                                            <ArrowUp size={16} />
                                        </button>
                                        <button 
                                            onClick={() => moveSection(index, 'down')}
                                            disabled={index === content.sectionsOrder.length - 1}
                                            className="btn-glass-nav"
                                            style={{ padding: '0.4rem', borderRadius: '8px', opacity: index === content.sectionsOrder.length - 1 ? 0.3 : 1, cursor: index === content.sectionsOrder.length - 1 ? 'not-allowed' : 'pointer' }}
                                        >
                                            <ArrowDown size={16} />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* 9. CONTROL DE VERSIONES */}
                {activeTab === 'versiones' && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                        <h3 style={{ margin: 0, color: 'white' }}>Historial y Versionado de Quiénes Somos</h3>
                        
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                            {versions.length === 0 ? (
                                <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)' }}>Sin revisiones de contenido anteriores registradas.</div>
                            ) : (
                                [...versions].sort((a,b) => b.version - a.version).map((ver: any) => {
                                    const isActive = ver.version === content.version;
                                    return (
                                        <div 
                                            key={ver.version} 
                                            className="glass-card" 
                                            style={{ 
                                                padding: '1.25rem', 
                                                borderLeft: `4px solid ${isActive ? 'var(--primary)' : 'var(--border-glass)'}`,
                                                display: 'flex',
                                                justifyContent: 'space-between',
                                                alignItems: 'center',
                                                flexWrap: 'wrap',
                                                gap: '1rem'
                                            }}
                                        >
                                            <div>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.15rem' }}>
                                                    <strong style={{ color: 'white', fontSize: '0.9rem' }}>Versión #{ver.version}</strong>
                                                    {isActive && <span style={{ fontSize: '0.65rem', background: 'rgba(139,92,246,0.1)', color: 'var(--primary)', padding: '0.1rem 0.4rem', borderRadius: '4px', fontWeight: 800 }}>PUBLICADA Y ACTIVA</span>}
                                                </div>
                                                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                                                    Actualizado el: {new Date(ver.updatedAt).toLocaleString()} • Responsable: <strong>{ver.updatedBy || 'Admin'}</strong>
                                                </span>
                                                <p style={{ margin: '0.4rem 0 0 0', fontSize: '0.78rem', color: 'white' }}>"{ver.subtitle}"</p>
                                            </div>
                                            {!isActive && (
                                                <button 
                                                    onClick={() => handleRestore(ver.version)}
                                                    className="btn-glass-nav" 
                                                    style={{ padding: '0.4rem 1rem', fontSize: '0.75rem', borderRadius: '8px' }}
                                                >
                                                    Restaurar Versión
                                                </button>
                                            )}
                                        </div>
                                    );
                                })
                            )}
                        </div>
                    </div>
                )}

            </div>
            
            <style jsx global>{`
                .input-admin-premium {
                    width: 100%;
                    padding: 0.75rem 1rem;
                    border-radius: 10px;
                    background: rgba(255, 255, 255, 0.03);
                    border: 1px solid var(--border-glass);
                    color: white;
                    font-size: 0.85rem;
                    outline: none;
                    transition: all 0.2s;
                }
                .input-admin-premium:focus {
                    border-color: var(--primary);
                    background: rgba(139, 92, 246, 0.04);
                }
                
                .header-top { display: flex; justify-content: space-between; align-items: center; margin-bottom: 2rem; flex-wrap: wrap; gap: 1rem; }
                .tabs-container { display: flex; flex-wrap: wrap; gap: 0.4rem; border-bottom: 1px solid var(--border-glass); padding-bottom: 0.75rem; margin-bottom: 2rem; }
                .grid-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 1.5rem; }
                .grid-2-gap1 { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; }
                .grid-2-1 { display: grid; grid-template-columns: 2fr 1fr; gap: 2rem; }
                .grid-2-1-gap1 { display: grid; grid-template-columns: 2fr 1fr; gap: 1rem; }
                .grid-2-1-gap15 { display: grid; grid-template-columns: 2fr 1fr; gap: 1.5rem; }
                .grid-history { display: grid; grid-template-columns: 120px 2fr 2fr 1fr; gap: 1rem; align-items: end; }
                .grid-team-4 { display: grid; grid-template-columns: 1fr 1fr 1fr 1fr; gap: 1rem; }
                .grid-stat-4 { display: grid; grid-template-columns: 1fr 1fr 2fr 1fr; gap: 1rem; align-items: end; }
                .grid-test-4 { display: grid; grid-template-columns: 1fr 1fr 1fr 80px; gap: 1rem; }
                .flex-responsive-row { display: flex; gap: 1.5rem; align-items: center; }
                
                @media (max-width: 992px) {
                    .grid-history, .grid-team-4, .grid-test-4, .grid-stat-4 {
                        grid-template-columns: 1fr 1fr;
                    }
                }
                @media (max-width: 768px) {
                    .grid-2, .grid-2-gap1, .grid-2-1, .grid-2-1-gap1, .grid-2-1-gap15, 
                    .grid-history, .grid-team-4, .grid-test-4, .grid-stat-4 {
                        grid-template-columns: 1fr;
                        gap: 1rem;
                    }
                    .flex-responsive-row {
                        flex-direction: column;
                        align-items: stretch;
                        gap: 1rem;
                    }
                    .flex-responsive-row > button {
                        width: 100%;
                    }
                    .tabs-container {
                        flex-wrap: nowrap !important;
                        overflow-x: auto;
                        padding-bottom: 1rem !important;
                        -webkit-overflow-scrolling: touch;
                        scrollbar-width: none;
                    }
                    .tabs-container::-webkit-scrollbar {
                        display: none;
                    }
                    .tabs-container button {
                        white-space: nowrap;
                        flex-shrink: 0;
                    }
                    .header-top { 
                        flex-direction: column; 
                        align-items: flex-start !important; 
                    }
                    .header-top > div:last-child { 
                        width: 100%; 
                        justify-content: space-between; 
                    }
                }
            `}</style>
        </div>
    );
}
