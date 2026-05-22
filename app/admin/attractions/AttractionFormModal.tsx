'use client';

import { useState } from 'react';
import { X, Upload, Loader2 } from 'lucide-react';
import { createAttraction, updateAttraction } from './actions';
import Image from 'next/image';

interface AttractionFormModalProps {
    attraction?: any;
    onClose: () => void;
    onSuccess: () => void;
}

export default function AttractionFormModal({ attraction, onClose, onSuccess }: AttractionFormModalProps) {
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: attraction?.name || '',
        category: attraction?.category || 'General',
        city: attraction?.city || '',
        state: attraction?.state || '',
        status: attraction?.status || 'Abierto',
        coordinates: attraction?.coordinates || '',
        recommendedTime: attraction?.recommendedTime || '2 Horas',
        description_long: attraction?.description_long || '',
        gallery: attraction?.gallery || []
    });

    const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (!files || files.length === 0) return;
        
        setLoading(true);
        try {
            const uploadedUrls = [...formData.gallery];
            for (let i = 0; i < files.length; i++) {
                const file = files[i];
                const form = new FormData();
                form.append('file', file);
                
                const res = await fetch('/api/upload', {
                    method: 'POST',
                    body: form
                });
                
                const data = await res.json();
                if (data.success) {
                    uploadedUrls.push(data.url);
                }
            }
            setFormData({ ...formData, gallery: uploadedUrls });
        } catch (error) {
            console.error("Upload error", error);
            alert("Error al subir imágenes");
        } finally {
            setLoading(false);
        }
    };

    const removeImage = (index: number) => {
        const newGallery = [...formData.gallery];
        newGallery.splice(index, 1);
        setFormData({ ...formData, gallery: newGallery });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        
        const res = attraction 
            ? await updateAttraction(attraction.id, formData)
            : await createAttraction(formData);

        setLoading(false);
        if (res.success) {
            onSuccess();
        } else {
            alert(res.error);
        }
    };

    return (
        <div className="modal-overlay" onClick={onClose} style={{
            position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
            background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(12px)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            zIndex: 1000, overflowY: 'auto', padding: '2rem'
        }}>
            <div className="glass-panel" onClick={e => e.stopPropagation()} style={{
                background: 'var(--bg-card)', border: '1px solid var(--border-glass)',
                borderRadius: '24px', width: '100%', maxWidth: '800px', maxHeight: '90vh',
                overflowY: 'auto', padding: '2rem'
            }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                    <h2 style={{ margin: 0 }}>{attraction ? 'Editar Atracción' : 'Registrar Nueva Atracción'}</h2>
                    <button onClick={onClose} style={{ background: 'none', border: 'none', color: 'white', cursor: 'pointer' }}>
                        <X size={24} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} style={{ display: 'grid', gap: '1.5rem' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                        <div>
                            <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-muted)' }}>Nombre</label>
                            <input required type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="input-glass" style={{ width: '100%', padding: '0.8rem', borderRadius: '12px', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border-glass)', color: 'white' }} />
                        </div>
                        <div>
                            <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-muted)' }}>Categoría</label>
                            <input required type="text" value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})} className="input-glass" style={{ width: '100%', padding: '0.8rem', borderRadius: '12px', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border-glass)', color: 'white' }} placeholder="Ej: Eco-Arqueológico" />
                        </div>
                        <div>
                            <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-muted)' }}>Ciudad</label>
                            <input required type="text" value={formData.city} onChange={e => setFormData({...formData, city: e.target.value})} className="input-glass" style={{ width: '100%', padding: '0.8rem', borderRadius: '12px', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border-glass)', color: 'white' }} />
                        </div>
                        <div>
                            <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-muted)' }}>Estado/Provincia</label>
                            <input required type="text" value={formData.state} onChange={e => setFormData({...formData, state: e.target.value})} className="input-glass" style={{ width: '100%', padding: '0.8rem', borderRadius: '12px', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border-glass)', color: 'white' }} />
                        </div>
                        <div>
                            <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-muted)' }}>Coordenadas</label>
                            <input required type="text" value={formData.coordinates} onChange={e => setFormData({...formData, coordinates: e.target.value})} className="input-glass" style={{ width: '100%', padding: '0.8rem', borderRadius: '12px', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border-glass)', color: 'white' }} />
                        </div>
                        <div>
                            <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-muted)' }}>Tiempo Recomendado</label>
                            <input required type="text" value={formData.recommendedTime} onChange={e => setFormData({...formData, recommendedTime: e.target.value})} className="input-glass" style={{ width: '100%', padding: '0.8rem', borderRadius: '12px', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border-glass)', color: 'white' }} placeholder="Ej: 4 Horas" />
                        </div>
                    </div>

                    <div>
                        <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-muted)' }}>Descripción Larga</label>
                        <textarea rows={4} value={formData.description_long} onChange={e => setFormData({...formData, description_long: e.target.value})} className="input-glass" style={{ width: '100%', padding: '0.8rem', borderRadius: '12px', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border-glass)', color: 'white', resize: 'vertical' }} placeholder="Descripción detallada" />
                    </div>

                    <div>
                        <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-muted)' }}>Galería de Fotos</label>
                        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', marginBottom: '1rem' }}>
                            {formData.gallery.map((url: string, idx: number) => (
                                <div key={idx} style={{ position: 'relative', width: '100px', height: '100px', borderRadius: '12px', overflow: 'hidden', border: '1px solid var(--border-glass)' }}>
                                    <Image src={url} alt="Gallery item" fill style={{ objectFit: 'cover' }} unoptimized />
                                    <button type="button" onClick={() => removeImage(idx)} style={{ position: 'absolute', top: 4, right: 4, background: 'rgba(0,0,0,0.6)', border: 'none', borderRadius: '50%', color: 'white', cursor: 'pointer', padding: '4px' }}>
                                        <X size={14} />
                                    </button>
                                </div>
                            ))}
                            <label style={{ width: '100px', height: '100px', borderRadius: '12px', border: '2px dashed var(--border-glass)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: 'var(--text-muted)', background: 'rgba(255,255,255,0.02)' }}>
                                {loading ? <Loader2 className="animate-spin" size={24} /> : <Upload size={24} />}
                                <span style={{ fontSize: '0.7rem', marginTop: '0.5rem' }}>Subir</span>
                                <input type="file" multiple accept="image/*" onChange={handleUpload} style={{ display: 'none' }} disabled={loading} />
                            </label>
                        </div>
                    </div>

                    <button type="submit" className="btn-premium" disabled={loading} style={{ padding: '1rem', borderRadius: '12px', fontWeight: 600, display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.5rem' }}>
                        {loading ? <Loader2 className="animate-spin" size={20} /> : null}
                        {attraction ? 'Guardar Cambios' : 'Registrar Atracción'}
                    </button>
                </form>
            </div>
        </div>
    );
}
