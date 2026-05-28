'use client';

import React, { useState, useEffect } from 'react';
import {
    Activity, Lock, ShieldCheck, Save, RefreshCw, Star, Heart, Check, X, 
    Upload, Trash2, Edit3, ShieldAlert, Award, FileText, ChevronRight, Play, Eye,
    Globe, HelpCircle, Plus, Trash, Star as StarIcon, MapPin, PlusCircle, Link as LinkIcon
} from 'lucide-react';
import { getCurrentUserAction } from '@/app/admin/users/actions';
import {
    getOperatorAboutUsContentAction,
    saveOperatorAboutUsContentAction
} from './actions';

type TabType = 'general' | 'multimedia' | 'specialties' | 'testimonios' | 'certificaciones' | 'social' | 'seo';

export default function AboutUsOperatorPage() {
    // Auth States
    const [currentUser, setCurrentUser] = useState<any>(null);
    const [authLoading, setAuthLoading] = useState(true);

    // Data States
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [activeTab, setActiveTab] = useState<TabType>('general');
    const [message, setMessage] = useState({ text: '', type: '' });
    const [content, setContent] = useState<any>(null);

    // CRUD Temp Items
    const [newGalleryItem, setNewGalleryItem] = useState('');
    const [newYoutubeEmbed, setNewYoutubeEmbed] = useState('');
    const [newTiktokEmbed, setNewTiktokEmbed] = useState('');
    const [newLanguage, setNewLanguage] = useState('');
    
    const [newTestimonial, setNewTestimonial] = useState({ clientName: '', clientPhoto: '', comment: '', rating: 5 });
    const [newCert, setNewCert] = useState({ name: '', issuer: '', year: '' });
    const [newStat, setNewStat] = useState({ label: '', value: '', suffix: '' });

    useEffect(() => {
        getCurrentUserAction()
            .then(res => {
                if (res.success && res.user) {
                    setCurrentUser(res.user);
                }
                setAuthLoading(false);
            })
            .catch(err => {
                console.error("Auth check failed in operator about us:", err);
                setAuthLoading(false);
            });
    }, []);

    const isAllowed = currentUser?.role === 'SUPER_ADMIN' || currentUser?.role === 'ADMIN' || currentUser?.role === 'OPERATOR' || currentUser?.username?.toLowerCase() === 'admin';

    useEffect(() => {
        if (!isAllowed) return;
        loadData();
    }, [isAllowed]);

    const loadData = async () => {
        setLoading(true);
        try {
            const res = await getOperatorAboutUsContentAction();
            if (res.success && res.data) {
                // Ensure array fields are initialized
                const d = res.data;
                if (!d.languages) d.languages = [];
                if (!d.gallery) d.gallery = [];
                if (!d.youtubeEmbeds) d.youtubeEmbeds = [];
                if (!d.tiktokEmbeds) d.tiktokEmbeds = [];
                if (!d.specialties) d.specialties = [];
                if (!d.certifications) d.certifications = [];
                if (!d.stats) d.stats = [];
                if (!d.testimonials) d.testimonials = [];

                setContent(d);
            }
        } catch (e) {
            console.error("Error loading operational content:", e);
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async (updatedContent: any = content) => {
        if (!isAllowed || !updatedContent) return;
        setSaving(true);
        setMessage({ text: '', type: '' });
        try {
            const res = await saveOperatorAboutUsContentAction(updatedContent);
            if (res.success && res.data) {
                setContent(res.data);
                setMessage({ text: 'Perfil de operador guardado con éxito (Versión #' + res.data.version + ')', type: 'success' });
                setTimeout(() => setMessage({ text: '', type: '' }), 4000);
            }
        } catch (e: any) {
            setMessage({ text: e.message || 'Error al guardar.', type: 'error' });
        } finally {
            setSaving(false);
        }
    };

    // Helper item pushers & pullers
    const addLanguage = () => {
        if (!newLanguage || content.languages.includes(newLanguage)) return;
        const updated = { ...content, languages: [...content.languages, newLanguage] };
        setContent(updated);
        setNewLanguage('');
    };

    const removeLanguage = (lang: string) => {
        const updated = { ...content, languages: content.languages.filter((l: string) => l !== lang) };
        setContent(updated);
    };

    const toggleSpecialty = (spec: string) => {
        const specs = [...content.specialties];
        const idx = specs.indexOf(spec);
        if (idx === -1) {
            specs.push(spec);
        } else {
            specs.splice(idx, 1);
        }
        setContent({ ...content, specialties: specs });
    };

    const addGalleryItem = () => {
        if (!newGalleryItem) return;
        const updated = { ...content, gallery: [...content.gallery, newGalleryItem] };
        setContent(updated);
        setNewGalleryItem('');
    };

    const removeGalleryItem = (url: string) => {
        const updated = { ...content, gallery: content.gallery.filter((g: string) => g !== url) };
        setContent(updated);
    };

    const addYoutubeEmbed = () => {
        if (!newYoutubeEmbed) return;
        const updated = { ...content, youtubeEmbeds: [...content.youtubeEmbeds, newYoutubeEmbed] };
        setContent(updated);
        setNewYoutubeEmbed('');
    };

    const removeYoutubeEmbed = (url: string) => {
        const updated = { ...content, youtubeEmbeds: content.youtubeEmbeds.filter((y: string) => y !== url) };
        setContent(updated);
    };

    const addTiktokEmbed = () => {
        if (!newTiktokEmbed) return;
        const updated = { ...content, tiktokEmbeds: [...content.tiktokEmbeds, newTiktokEmbed] };
        setContent(updated);
        setNewTiktokEmbed('');
    };

    const removeTiktokEmbed = (url: string) => {
        const updated = { ...content, tiktokEmbeds: content.tiktokEmbeds.filter((t: string) => t !== url) };
        setContent(updated);
    };

    const addTestimonial = () => {
        if (!newTestimonial.clientName || !newTestimonial.comment) return;
        const updated = { ...content, testimonials: [...content.testimonials, { ...newTestimonial, id: 'test-' + Date.now() }] };
        setContent(updated);
        setNewTestimonial({ clientName: '', clientPhoto: '', comment: '', rating: 5 });
    };

    const removeTestimonial = (idx: number) => {
        const updatedTestimonials = [...content.testimonials];
        updatedTestimonials.splice(idx, 1);
        setContent({ ...content, testimonials: updatedTestimonials });
    };

    const addCertification = () => {
        if (!newCert.name || !newCert.issuer) return;
        const updated = { ...content, certifications: [...content.certifications, newCert] };
        setContent(updated);
        setNewCert({ name: '', issuer: '', year: '' });
    };

    const removeCertification = (idx: number) => {
        const updatedCerts = [...content.certifications];
        updatedCerts.splice(idx, 1);
        setContent({ ...content, certifications: updatedCerts });
    };

    const addStat = () => {
        if (!newStat.label || !newStat.value) return;
        const updated = { ...content, stats: [...content.stats, newStat] };
        setContent(updated);
        setNewStat({ label: '', value: '', suffix: '' });
    };

    const removeStat = (idx: number) => {
        const updatedStats = [...content.stats];
        updatedStats.splice(idx, 1);
        setContent({ ...content, stats: updatedStats });
    };

    if (authLoading) {
        return (
            <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', height: '60vh', gap: '1rem' }}>
                <Activity size={32} style={{ animation: 'spin 1.5s linear infinite', color: 'var(--primary)' }} />
                <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Verificando credenciales de seguridad...</p>
            </div>
        );
    }

    if (!isAllowed) {
        return (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '70vh', padding: '2rem' }}>
                <div className="glass-panel" style={{
                    padding: '3rem', maxWidth: '560px', width: '100%', textAlign: 'center',
                    background: 'rgba(10, 2, 5, 0.95)', border: '1px solid rgba(244, 63, 94, 0.3)',
                    boxShadow: '0 0 35px rgba(244, 63, 94, 0.15)', borderRadius: '20px',
                    display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1.5rem'
                }}>
                    <Lock size={32} color="var(--accent)" />
                    <h2 style={{ fontSize: '1.5rem', fontWeight: 900, color: 'white', margin: 0, textTransform: 'uppercase' }}>Acceso Restringido</h2>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: 1.6 }}>Esta sección requiere un rol de operador o administrador autorizado.</p>
                </div>
            </div>
        );
    }

    if (loading || !content) {
        return (
            <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', height: '60vh', gap: '1rem' }}>
                <Activity size={32} style={{ animation: 'spin 1.5s linear infinite', color: 'var(--primary)' }} />
                <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Cargando perfil de operador...</p>
            </div>
        );
    }

    const tabs: { key: TabType; name: string; icon: React.ElementType }[] = [
        { key: 'general', name: '1. Información General', icon: Award },
        { key: 'multimedia', name: '2. Multimedia & Enlaces', icon: Upload },
        { key: 'specialties', name: '3. Especialidades & Logros', icon: Heart },
        { key: 'testimonios', name: '4. Testimonios Clientes', icon: Star },
        { key: 'certificaciones', name: '5. Certificaciones', icon: ShieldCheck },
        { key: 'social', name: '6. Redes Sociales', icon: Globe },
        { key: 'seo', name: '7. Configuración SEO', icon: Globe }
    ];

    const specialtyOptions = ['Luxury Travel', 'Adventure', 'Food Tours', 'Eco Tourism', 'VIP Services', 'Yate Privado', 'Cultura Maya', 'Pesca Deportiva', 'Snorkel Exclusivo'];

    return (
        <div style={{ maxWidth: '1400px', margin: '0 auto', minHeight: '100vh', padding: '1rem 0' }}>
            
            {/* Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
                <div>
                    <h1 style={{ fontSize: '2rem', fontWeight: 800, margin: 0, display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <span className="text-gradient">👥 Perfil de Operador</span>
                    </h1>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginTop: '0.25rem' }}>
                        Personaliza tu portafolio de operador. Nombre público: <strong>{content.name}</strong> • Versión activa: <strong>v{content.version}</strong>.
                    </p>
                </div>
                <div style={{ display: 'flex', gap: '0.75rem' }}>
                    <button onClick={loadData} className="btn-glass-nav" style={{ padding: '0.5rem 1rem', fontSize: '0.85rem' }}>
                        <RefreshCw size={15} style={{ animation: loading ? 'spin 1s linear infinite' : 'none' }} />
                        Recargar
                    </button>
                    <button onClick={() => handleSave()} disabled={saving} className="btn-premium" style={{ padding: '0.5rem 1.25rem', fontSize: '0.85rem', borderRadius: '10px' }}>
                        <Save size={15} />
                        {saving ? 'Guardando...' : 'Guardar y Publicar'}
                    </button>
                </div>
            </div>

            {message.text && (
                <div style={{ 
                    padding: '1rem', borderRadius: '12px', marginBottom: '1.5rem', 
                    background: message.type === 'success' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)',
                    color: message.type === 'success' ? '#10b981' : '#ef4444',
                    border: `1px solid ${message.type === 'success' ? 'rgba(16, 185, 129, 0.3)' : 'rgba(239, 68, 68, 0.3)'}`,
                    display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 700, fontSize: '0.85rem'
                }}>
                    <Check size={18} /> {message.text}
                </div>
            )}

            {/* Slider Tabs */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem', borderBottom: '1px solid var(--border-glass)', paddingBottom: '0.75rem', marginBottom: '2rem' }}>
                {tabs.map(t => {
                    const isActive = activeTab === t.key;
                    const Icon = t.icon;
                    return (
                        <button
                            key={t.key}
                            onClick={() => setActiveTab(t.key)}
                            style={{
                                display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.6rem 1.1rem',
                                borderRadius: '10px', border: isActive ? '1px solid rgba(139,92,246,0.3)' : '1px solid transparent',
                                background: isActive ? 'rgba(139, 92, 246, 0.12)' : 'rgba(255,255,255,0.02)',
                                color: isActive ? 'var(--primary)' : 'var(--text-muted)', cursor: 'pointer',
                                transition: 'all 0.2s', fontWeight: isActive ? 600 : 500, fontSize: '0.82rem', fontFamily: 'inherit'
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
                
                {/* TAB 1: INFORMACION GENERAL */}
                {activeTab === 'general' && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                        <h3 style={{ margin: 0, color: 'white' }}>Información Profesional de Contacto</h3>
                        <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '2rem' }} className="general-tab-grid">
                            
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                                <div className="input-group-full">
                                    <label className="input-label">NOMBRE DEL OPERADOR (PÚBLICO)</label>
                                    <input 
                                        type="text" className="input-admin-premium"
                                        value={content.name || ''} 
                                        onChange={e => setContent({...content, name: e.target.value})} 
                                    />
                                </div>
                                <div className="input-group-full">
                                    <label className="input-label">ESPECIALIDAD / TÍTULO DE LIDERAZGO</label>
                                    <input 
                                        type="text" className="input-admin-premium"
                                        placeholder="Ej: Guía de Yates de Lujo & Biólogo Marino"
                                        value={content.specialty || ''} 
                                        onChange={e => setContent({...content, specialty: e.target.value})} 
                                    />
                                </div>
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                                    <div className="input-group-full">
                                        <label className="input-label">AÑOS DE EXPERIENCIA</label>
                                        <input 
                                            type="number" className="input-admin-premium"
                                            value={content.yearsExperience || 0} 
                                            onChange={e => setContent({...content, yearsExperience: parseInt(e.target.value) || 0})} 
                                        />
                                    </div>
                                    <div className="input-group-full">
                                        <label className="input-label">UBICACIÓN PRINCIPAL</label>
                                        <input 
                                            type="text" className="input-admin-premium"
                                            placeholder="Ej: Cancún, Quintana Roo"
                                            value={content.location || ''} 
                                            onChange={e => setContent({...content, location: e.target.value})} 
                                        />
                                    </div>
                                </div>
                                <div className="input-group-full">
                                    <label className="input-label">BIOGRAFÍA Y FILOSOFÍA DE SERVICIO (Rich Text / HTML)</label>
                                    <textarea 
                                        rows={6} className="input-admin-premium"
                                        style={{ fontFamily: 'inherit', resize: 'vertical' }}
                                        value={content.bio || ''} 
                                        onChange={e => setContent({...content, bio: e.target.value})} 
                                    />
                                </div>
                            </div>

                            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                                <div className="input-group-full">
                                    <label className="input-label">FOTO DE PERFIL (URL)</label>
                                    <input 
                                        type="text" className="input-admin-premium"
                                        value={content.photo || ''} 
                                        onChange={e => setContent({...content, photo: e.target.value})} 
                                    />
                                    {content.photo && (
                                        <div style={{ width: '100px', height: '100px', borderRadius: '50%', overflow: 'hidden', marginTop: '0.75rem', border: '2px solid var(--primary)' }}>
                                            <img src={content.photo} alt="Avatar Preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                        </div>
                                    )}
                                </div>
                                <div className="input-group-full">
                                    <label className="input-label">IMAGEN DE PORTADA / BANNER (URL)</label>
                                    <input 
                                        type="text" className="input-admin-premium"
                                        value={content.banner || ''} 
                                        onChange={e => setContent({...content, banner: e.target.value})} 
                                    />
                                </div>
                                
                                {/* Languages selector */}
                                <div className="glass-card" style={{ padding: '1.25rem' }}>
                                    <strong style={{ color: 'white', fontSize: '0.8rem', display: 'block', marginBottom: '0.5rem' }}>Idiomas que Hablas</strong>
                                    <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.75rem' }}>
                                        <input 
                                            type="text" placeholder="Ej: Francés" className="input-admin-premium" style={{ fontSize: '0.8rem', padding: '0.4rem 0.75rem' }}
                                            value={newLanguage} onChange={e => setNewLanguage(e.target.value)}
                                        />
                                        <button onClick={addLanguage} className="btn-premium" style={{ padding: '0.4rem 1rem', fontSize: '0.78rem', borderRadius: '8px' }}><Plus size={14} /></button>
                                    </div>
                                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
                                        {content.languages.map((lang: string) => (
                                            <span key={lang} style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border-glass)', borderRadius: '6px', padding: '0.2rem 0.5rem', fontSize: '0.72rem', display: 'inline-flex', alignItems: 'center', gap: '0.25rem', color: 'white' }}>
                                                {lang}
                                                <X size={12} style={{ cursor: 'pointer' }} onClick={() => removeLanguage(lang)} />
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            </div>

                        </div>
                    </div>
                )}

                {/* TAB 2: MULTIMEDIA */}
                {activeTab === 'multimedia' && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                        <h3 style={{ margin: 0, color: 'white' }}>Galería y Videos Promocionales</h3>
                        
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }} className="general-tab-grid">
                            
                            {/* Gallery photos */}
                            <div className="glass-card" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                <strong style={{ color: 'white', fontSize: '0.85rem' }}>Imágenes de tus Tours (Galería)</strong>
                                <div style={{ display: 'flex', gap: '0.5rem' }}>
                                    <input 
                                        type="text" placeholder="Pegar URL de foto..." className="input-admin-premium" style={{ fontSize: '0.8rem', padding: '0.4rem' }}
                                        value={newGalleryItem} onChange={e => setNewGalleryItem(e.target.value)}
                                    />
                                    <button onClick={addGalleryItem} className="btn-premium" style={{ padding: '0.4rem 1rem', borderRadius: '8px', fontSize: '0.75rem' }}>Añadir</button>
                                </div>
                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(100px, 1fr))', gap: '0.75rem', marginTop: '0.5rem' }}>
                                    {content.gallery.map((url: string) => (
                                        <div key={url} style={{ position: 'relative', height: '80px', borderRadius: '8px', overflow: 'hidden' }}>
                                            <img src={url} alt="Gallery item" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                            <button 
                                                onClick={() => removeGalleryItem(url)}
                                                style={{ position: 'absolute', top: '0.25rem', right: '0.25rem', background: 'rgba(0,0,0,0.6)', border: 'none', borderRadius: '4px', padding: '0.25rem', color: 'var(--accent)', cursor: 'pointer' }}
                                            >
                                                <Trash size={12} />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Embed videos */}
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                <div className="glass-card" style={{ padding: '1.5rem' }}>
                                    <label className="input-label">VIDEO DE FONDO HERO / ACCENT (.MP4 URL)</label>
                                    <input 
                                        type="text" className="input-admin-premium" style={{ fontSize: '0.8rem' }}
                                        value={content.videoBg || ''} 
                                        onChange={e => setContent({...content, videoBg: e.target.value})} 
                                    />
                                </div>

                                <div className="glass-card" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                    <strong style={{ color: 'white', fontSize: '0.85rem' }}>Videos de YouTube (Enlaces)</strong>
                                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                                        <input 
                                            type="text" placeholder="https://www.youtube.com/watch?v=..." className="input-admin-premium" style={{ fontSize: '0.8rem', padding: '0.4rem' }}
                                            value={newYoutubeEmbed} onChange={e => setNewYoutubeEmbed(e.target.value)}
                                        />
                                        <button onClick={addYoutubeEmbed} className="btn-premium" style={{ padding: '0.4rem 1rem', borderRadius: '8px', fontSize: '0.75rem' }}>Añadir</button>
                                    </div>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                                        {content.youtubeEmbeds.map((url: string) => (
                                            <div key={url} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.75rem', background: 'rgba(255,255,255,0.02)', padding: '0.4rem 0.75rem', borderRadius: '8px' }}>
                                                <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '80%' }}>{url}</span>
                                                <Trash size={14} color="var(--accent)" style={{ cursor: 'pointer' }} onClick={() => removeYoutubeEmbed(url)} />
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>

                        </div>
                    </div>
                )}

                {/* TAB 3: ESPECIALIDADES */}
                {activeTab === 'specialties' && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                        <div>
                            <h3 style={{ margin: 0, color: 'white' }}>Tus Especialidades & Logros Numéricos</h3>
                            <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem', marginTop: '0.2rem' }}>Selecciona los temas en los que destacas y añade estadísticas para tu perfil público.</p>
                        </div>
                        
                        <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '2rem' }} className="general-tab-grid">
                            
                            {/* Specialties Checklist */}
                            <div className="glass-card" style={{ padding: '2rem' }}>
                                <strong style={{ color: 'white', fontSize: '0.9rem', display: 'block', marginBottom: '1.25rem' }}>Tags de Especialidades</strong>
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                                    {specialtyOptions.map(opt => {
                                        const isChecked = content.specialties.includes(opt);
                                        return (
                                            <label key={opt} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: isChecked ? 'white' : 'var(--text-muted)', fontSize: '0.85rem', cursor: 'pointer' }}>
                                                <input 
                                                    type="checkbox" checked={isChecked} 
                                                    onChange={() => toggleSpecialty(opt)} 
                                                />
                                                {opt}
                                            </label>
                                        );
                                    })}
                                </div>
                            </div>

                            {/* stats counters */}
                            <div className="glass-card" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                <strong style={{ color: 'white', fontSize: '0.85rem' }}>Métricas de Rendimiento (Contadores)</strong>
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0.5rem', alignItems: 'end' }}>
                                    <div>
                                        <label className="input-label" style={{ fontSize: '0.6rem' }}>VALOR (NÚMERO)</label>
                                        <input 
                                            type="text" placeholder="Ej: 350" className="input-admin-premium" style={{ padding: '0.4rem', fontSize: '0.8rem' }}
                                            value={newStat.value} onChange={e => setNewStat({...newStat, value: e.target.value})}
                                        />
                                    </div>
                                    <div>
                                        <label className="input-label" style={{ fontSize: '0.6rem' }}>SUFIJO</label>
                                        <input 
                                            type="text" placeholder="Ej: +" className="input-admin-premium" style={{ padding: '0.4rem', fontSize: '0.8rem' }}
                                            value={newStat.suffix} onChange={e => setNewStat({...newStat, suffix: e.target.value})}
                                        />
                                    </div>
                                    <div>
                                        <label className="input-label" style={{ fontSize: '0.6rem' }}>TEXTO / ETIQUETA</label>
                                        <input 
                                            type="text" placeholder="Ej: Tours" className="input-admin-premium" style={{ padding: '0.4rem', fontSize: '0.8rem' }}
                                            value={newStat.label} onChange={e => setNewStat({...newStat, label: e.target.value})}
                                        />
                                    </div>
                                </div>
                                <button onClick={addStat} className="btn-premium" style={{ padding: '0.4rem', borderRadius: '8px', fontSize: '0.75rem', justifyContent: 'center' }}>Añadir Estadística</button>
                                
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', marginTop: '0.5rem' }}>
                                    {content.stats.map((st: any, idx: number) => (
                                        <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(255,255,255,0.02)', padding: '0.4rem 0.75rem', borderRadius: '8px', fontSize: '0.8rem' }}>
                                            <span><strong>{st.value}{st.suffix}</strong> {st.label}</span>
                                            <Trash size={14} color="var(--accent)" style={{ cursor: 'pointer' }} onClick={() => removeStat(idx)} />
                                        </div>
                                    ))}
                                </div>
                            </div>

                        </div>
                    </div>
                )}

                {/* TAB 4: TESTIMONIOS */}
                {activeTab === 'testimonios' && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                        <h3 style={{ margin: 0, color: 'white' }}>Testimonios Específicos del Operador</h3>
                        
                        <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '2rem' }} className="general-tab-grid">
                            
                            <div className="glass-card" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                <strong style={{ color: 'white', fontSize: '0.85rem' }}>Crear Testimonio</strong>
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 80px', gap: '0.5rem' }}>
                                    <div>
                                        <label className="input-label" style={{ fontSize: '0.65rem' }}>CLIENTE NOMBRE</label>
                                        <input 
                                            type="text" placeholder="Ej: Sophia Loren" className="input-admin-premium" style={{ padding: '0.4rem', fontSize: '0.8rem' }}
                                            value={newTestimonial.clientName} onChange={e => setNewTestimonial({...newTestimonial, clientName: e.target.value})}
                                        />
                                    </div>
                                    <div>
                                        <label className="input-label" style={{ fontSize: '0.65rem' }}>FOTO CLIENTE (URL)</label>
                                        <input 
                                            type="text" placeholder="https://..." className="input-admin-premium" style={{ padding: '0.4rem', fontSize: '0.8rem' }}
                                            value={newTestimonial.clientPhoto} onChange={e => setNewTestimonial({...newTestimonial, clientPhoto: e.target.value})}
                                        />
                                    </div>
                                    <div>
                                        <label className="input-label" style={{ fontSize: '0.65rem' }}>RATING</label>
                                        <select 
                                            className="input-admin-premium" style={{ padding: '0.4rem', fontSize: '0.8rem', background: 'var(--bg-main)', color: 'white' }}
                                            value={newTestimonial.rating} onChange={e => setNewTestimonial({...newTestimonial, rating: parseInt(e.target.value) || 5})}
                                        >
                                            <option value="5">5 ★</option>
                                            <option value="4">4 ★</option>
                                            <option value="3">3 ★</option>
                                        </select>
                                    </div>
                                </div>
                                <div>
                                    <label className="input-label" style={{ fontSize: '0.65rem' }}>COMENTARIO</label>
                                    <input 
                                        type="text" placeholder="Excelente guía, muy profesional..." className="input-admin-premium" style={{ padding: '0.4rem', fontSize: '0.8rem' }}
                                        value={newTestimonial.comment} onChange={e => setNewTestimonial({...newTestimonial, comment: e.target.value})}
                                    />
                                </div>
                                <button onClick={addTestimonial} className="btn-premium" style={{ padding: '0.5rem', borderRadius: '10px', fontSize: '0.78rem' }}>Agregar Testimonio</button>
                            </div>

                            {/* List */}
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                {content.testimonials.map((test: any, idx: number) => (
                                    <div key={idx} className="glass-card" style={{ padding: '0.75rem 1rem', display: 'flex', gap: '0.75rem', alignItems: 'center', position: 'relative' }}>
                                        {test.clientPhoto && (
                                            <div style={{ width: '36px', height: '36px', borderRadius: '50%', overflow: 'hidden', flexShrink: 0 }}>
                                                <img src={test.clientPhoto} alt="Client avatar" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                            </div>
                                        )}
                                        <div style={{ flex: 1 }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.8rem' }}>
                                                <strong style={{ color: 'white' }}>{test.clientName}</strong>
                                                <span style={{ color: '#f59e0b' }}>{'★'.repeat(test.rating)}</span>
                                            </div>
                                            <p style={{ margin: 0, color: 'var(--text-muted)', fontSize: '0.72rem' }}>"{test.comment}"</p>
                                        </div>
                                        <Trash size={14} color="var(--accent)" style={{ cursor: 'pointer' }} onClick={() => removeTestimonial(idx)} />
                                    </div>
                                ))}
                            </div>

                        </div>
                    </div>
                )}

                {/* TAB 5: CERTIFICACIONES */}
                {activeTab === 'certificaciones' && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                        <h3 style={{ margin: 0, color: 'white' }}>Certificaciones y Licencias Oficiales</h3>
                        
                        <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '2rem' }} className="general-tab-grid">
                            
                            <div className="glass-card" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                <strong style={{ color: 'white', fontSize: '0.85rem' }}>Añadir Licencia / Diploma</strong>
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 80px', gap: '0.5rem', alignItems: 'end' }}>
                                    <div>
                                        <label className="input-label" style={{ fontSize: '0.65rem' }}>NOMBRE CERTIFICADO</label>
                                        <input 
                                            type="text" placeholder="Ej: Primeros Auxilios" className="input-admin-premium" style={{ padding: '0.4rem', fontSize: '0.8rem' }}
                                            value={newCert.name} onChange={e => setNewCert({...newCert, name: e.target.value})}
                                        />
                                    </div>
                                    <div>
                                        <label className="input-label" style={{ fontSize: '0.65rem' }}>EMISOR / ESCUELA</label>
                                        <input 
                                            type="text" placeholder="Ej: Cruz Roja" className="input-admin-premium" style={{ padding: '0.4rem', fontSize: '0.8rem' }}
                                            value={newCert.issuer} onChange={e => setNewCert({...newCert, issuer: e.target.value})}
                                        />
                                    </div>
                                    <div>
                                        <label className="input-label" style={{ fontSize: '0.65rem' }}>AÑO</label>
                                        <input 
                                            type="text" placeholder="Ej: 2022" className="input-admin-premium" style={{ padding: '0.4rem', fontSize: '0.8rem' }}
                                            value={newCert.year} onChange={e => setNewCert({...newCert, year: e.target.value})}
                                        />
                                    </div>
                                </div>
                                <button onClick={addCertification} className="btn-premium" style={{ padding: '0.5rem', borderRadius: '10px', fontSize: '0.78rem' }}>Añadir Acreditación</button>
                            </div>

                            {/* List */}
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                {content.certifications.map((c: any, idx: number) => (
                                    <div key={idx} className="glass-card" style={{ padding: '0.75rem 1rem', display: 'flex', justifyContext: 'space-between', alignItems: 'center' }}>
                                        <div style={{ flex: 1 }}>
                                            <strong style={{ color: 'white', fontSize: '0.85rem', display: 'block' }}>{c.name}</strong>
                                            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Emitido por: {c.issuer} • Año {c.year}</span>
                                        </div>
                                        <Trash size={14} color="var(--accent)" style={{ cursor: 'pointer' }} onClick={() => removeCertification(idx)} />
                                    </div>
                                ))}
                            </div>

                        </div>
                    </div>
                )}

                {/* TAB 6: REDES SOCIALES */}
                {activeTab === 'social' && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                        <h3 style={{ margin: 0, color: 'white' }}>Redes Sociales y Enlaces Corporativos</h3>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }} className="general-tab-grid">
                            
                            <div className="input-group-full">
                                <label className="input-label">VÍNCULO INSTAGRAM (URL)</label>
                                <input 
                                    type="text" className="input-admin-premium" placeholder="https://instagram.com/tu_usuario"
                                    value={content.instagram || ''} 
                                    onChange={e => setContent({...content, instagram: e.target.value})} 
                                />
                            </div>
                            <div className="input-group-full">
                                <label className="input-label">VÍNCULO FACEBOOK (URL)</label>
                                <input 
                                    type="text" className="input-admin-premium" placeholder="https://facebook.com/tu_pagina"
                                    value={content.facebook || ''} 
                                    onChange={e => setContent({...content, facebook: e.target.value})} 
                                />
                            </div>
                            <div className="input-group-full">
                                <label className="input-label">VÍNCULO TIKTOK (URL)</label>
                                <input 
                                    type="text" className="input-admin-premium" placeholder="https://tiktok.com/@tu_usuario"
                                    value={content.tiktok || ''} 
                                    onChange={e => setContent({...content, tiktok: e.target.value})} 
                                />
                            </div>
                            <div className="input-group-full">
                                <label className="input-label">VÍNCULO CANAL YOUTUBE (URL)</label>
                                <input 
                                    type="text" className="input-admin-premium" placeholder="https://youtube.com/@tu_canal"
                                    value={content.youtube || ''} 
                                    onChange={e => setContent({...content, youtube: e.target.value})} 
                                />
                            </div>
                            <div className="input-group-full">
                                <label className="input-label">WHATSAPP VÍNCULO DIRECTO (URL O NÚMERO)</label>
                                <input 
                                    type="text" className="input-admin-premium" placeholder="https://wa.me/529981234567"
                                    value={content.whatsapp || ''} 
                                    onChange={e => setContent({...content, whatsapp: e.target.value})} 
                                />
                            </div>
                            <div className="input-group-full">
                                <label className="input-label">SITIO WEB PERSONAL / PORTAFOLIO (URL)</label>
                                <input 
                                    type="text" className="input-admin-premium" placeholder="https://tuweb.com"
                                    value={content.website || ''} 
                                    onChange={e => setContent({...content, website: e.target.value})} 
                                />
                            </div>

                        </div>
                    </div>
                )}

                {/* TAB 7: CONFIGURACION SEO */}
                {activeTab === 'seo' && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                        <h3 style={{ margin: 0, color: 'white' }}>Optimización para Google y Buscadores (SEO)</h3>
                        
                        <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '1.5rem' }}>
                            <div className="input-group-full">
                                <label className="input-label">META TITLE (TÍTULO GOOGLE)</label>
                                <input 
                                    type="text" className="input-admin-premium"
                                    value={content.seoTitle || ''} 
                                    onChange={e => setContent({...content, seoTitle: e.target.value})} 
                                />
                            </div>
                            <div className="input-group-full">
                                <label className="input-label">SEO FRIENDLY SLUG (🔒 Protegido)</label>
                                <input 
                                    type="text" className="input-admin-premium" style={{ opacity: 0.6 }} disabled
                                    value={content.slug || ''} 
                                />
                            </div>
                        </div>

                        <div className="input-group-full">
                            <label className="input-label">META DESCRIPTION (EXTRACTO BUSCADORES)</label>
                            <textarea 
                                rows={3} className="input-admin-premium"
                                value={content.seoDescription || ''} 
                                onChange={e => setContent({...content, seoDescription: e.target.value})} 
                            />
                        </div>

                        <div className="input-group-full">
                            <label className="input-label">KEYWORDS (PALABRAS CLAVE GOOGLE)</label>
                            <input 
                                type="text" className="input-admin-premium"
                                value={content.seoKeywords || ''} 
                                onChange={e => setContent({...content, seoKeywords: e.target.value})} 
                            />
                        </div>
                    </div>
                )}

            </div>
            
            <style jsx>{`
                .input-label {
                    display: block; 
                    font-size: 0.72rem; 
                    font-weight: 800; 
                    color: var(--text-muted); 
                    margin-bottom: 0.4rem; 
                    letter-spacing: 0.5px;
                }
                @media (max-width: 992px) {
                    .general-tab-grid {
                        grid-template-columns: 1fr !important;
                        gap: 2rem !important;
                    }
                }
            `}</style>
        </div>
    );
}
