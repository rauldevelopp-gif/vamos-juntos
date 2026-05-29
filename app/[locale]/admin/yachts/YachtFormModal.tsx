'use client';

import { useState } from 'react';
import { X, Upload, Loader2, Image as ImageIcon } from 'lucide-react';
import { createYacht, updateYacht } from './actions';
import Image from 'next/image';

interface YachtFormModalProps {
    yacht?: any;
    onClose: () => void;
    onSuccess: () => void;
}

export default function YachtFormModal({ yacht, onClose, onSuccess }: YachtFormModalProps) {
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: yacht?.name || '',
        brand: yacht?.brand || '',
        model: yacht?.model || '',
        year: yacht?.year || new Date().getFullYear(),
        length: yacht?.length || '',
        capacity: yacht?.capacity || 10,
        price_day: yacht?.price_day || 0,
        status: yacht?.status || 'Disponible',
        location: yacht?.location || '',
        coordinates: yacht?.coordinates || '',
        description_long: yacht?.description_long || '',
        gallery: yacht?.gallery || []
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
        
        const payload = {
            ...formData,
            year: Number(formData.year),
            capacity: Number(formData.capacity),
            price_day: Number(formData.price_day)
        };

        const res = yacht 
            ? await updateYacht(yacht.id, payload)
            : await createYacht(payload);

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
            zIndex: 9999, overflowY: 'auto', padding: '2rem'
        }}>
            <div className="glass-panel" onClick={e => e.stopPropagation()} style={{
                background: 'var(--bg-card)', border: '1px solid var(--border-glass)',
                borderRadius: '24px', width: '100%', maxWidth: '800px', maxHeight: '90vh',
                overflowY: 'auto', padding: '2rem'
            }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                    <h2 style={{ margin: 0 }}>{yacht ? 'Editar Yate' : 'Registrar Nuevo Yate'}</h2>
                    <button onClick={onClose} style={{ background: 'none', border: 'none', color: 'white', cursor: 'pointer' }}>
                        <X size={24} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} style={{ display: 'grid', gap: '1.5rem' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                        <div>
                            <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-muted)' }}>Nombre del Yate</label>
                            <input required type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="input-glass" style={{ width: '100%', padding: '0.8rem', borderRadius: '12px', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border-glass)', color: 'white' }} />
                        </div>
                        <div>
                            <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-muted)' }}>Marca</label>
                            <input required type="text" value={formData.brand} onChange={e => setFormData({...formData, brand: e.target.value})} className="input-glass" style={{ width: '100%', padding: '0.8rem', borderRadius: '12px', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border-glass)', color: 'white' }} />
                        </div>
                        <div>
                            <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-muted)' }}>Modelo</label>
                            <input required type="text" value={formData.model} onChange={e => setFormData({...formData, model: e.target.value})} className="input-glass" style={{ width: '100%', padding: '0.8rem', borderRadius: '12px', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border-glass)', color: 'white' }} />
                        </div>
                        <div>
                            <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-muted)' }}>Eslora (Ej: 60ft)</label>
                            <input required type="text" value={formData.length} onChange={e => setFormData({...formData, length: e.target.value})} className="input-glass" style={{ width: '100%', padding: '0.8rem', borderRadius: '12px', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border-glass)', color: 'white' }} />
                        </div>
                        <div>
                            <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-muted)' }}>Capacidad (Pasajeros)</label>
                            <input required type="number" value={formData.capacity} onChange={e => setFormData({...formData, capacity: e.target.value})} className="input-glass" style={{ width: '100%', padding: '0.8rem', borderRadius: '12px', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border-glass)', color: 'white' }} />
                        </div>
                        <div>
                            <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-muted)' }}>Tarifa Diaria (USD)</label>
                            <input required type="number" value={formData.price_day} onChange={e => setFormData({...formData, price_day: e.target.value})} className="input-glass" style={{ width: '100%', padding: '0.8rem', borderRadius: '12px', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border-glass)', color: 'white' }} />
                        </div>
                        <div>
                            <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-muted)' }}>Ubicación</label>
                            <input required type="text" value={formData.location} onChange={e => setFormData({...formData, location: e.target.value})} className="input-glass" style={{ width: '100%', padding: '0.8rem', borderRadius: '12px', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border-glass)', color: 'white' }} />
                        </div>
                        <div>
                            <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-muted)' }}>Coordenadas (Lat, Lng)</label>
                            <input required type="text" value={formData.coordinates} onChange={e => setFormData({...formData, coordinates: e.target.value})} className="input-glass" style={{ width: '100%', padding: '0.8rem', borderRadius: '12px', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border-glass)', color: 'white' }} />
                        </div>
                    </div>

                    <div>
                        <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-muted)' }}>Descripción Larga</label>
                        <textarea rows={4} value={formData.description_long} onChange={e => setFormData({...formData, description_long: e.target.value})} className="input-glass" style={{ width: '100%', padding: '0.8rem', borderRadius: '12px', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border-glass)', color: 'white', resize: 'vertical' }} placeholder="Detalles de la embarcación, amenidades, etc." />
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
                        {yacht ? 'Guardar Cambios' : 'Registrar Yate'}
                    </button>
                </form>
            </div>
        </div>
    );
}
