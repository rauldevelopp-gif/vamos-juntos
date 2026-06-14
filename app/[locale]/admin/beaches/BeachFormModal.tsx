'use client';

import { useState } from 'react';
import { X, Loader2, Upload } from 'lucide-react';
import { createBeach, updateBeach } from './actions';
import { toast } from 'react-hot-toast';
import Image from 'next/image';

interface BeachFormModalProps {
    beach?: any | null;
    onClose: () => void;
    onSuccess: () => void;
}

export default function BeachFormModal({ beach, onClose, onSuccess }: BeachFormModalProps) {
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: beach?.name || '',
        type: beach?.type || 'Pública',
        city: beach?.city || '',
        state: beach?.state || '',
        status: beach?.status || 'Abierta',
        popularity: beach?.popularity || 'Media',
        coordinates: beach?.coordinates || '',
        description_long: beach?.description_long || '',
        gallery: beach?.gallery || []
    });

    const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (!files || files.length === 0) return;
        
        setLoading(true);
        const loadingToast = toast.loading('Subiendo imágenes...');
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
            toast.success('Imágenes subidas', { id: loadingToast });
        } catch (error) {
            console.error("Upload error", error);
            toast.error("Error al subir imágenes", { id: loadingToast });
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
        const loadingToast = toast.loading('Guardando...');

        const res = beach 
            ? await updateBeach(beach.id, formData)
            : await createBeach(formData);

        if (res.success) {
            toast.success('Playa guardada exitosamente', { id: loadingToast });
            onSuccess();
        } else {
            toast.error(res.error || 'Error al guardar la playa', { id: loadingToast });
            setLoading(false);
        }
    };

    return (
        <div className="modal-overlay" onClick={onClose} style={{
            position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(10px)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999, padding: '1rem'
        }}>
            <div className="glass-panel" onClick={e => e.stopPropagation()} style={{
                background: 'var(--bg-card)', width: '100%', maxWidth: '650px', borderRadius: '24px',
                padding: '2rem', position: 'relative', border: '1px solid var(--border-glass)',
                maxHeight: '90vh', overflowY: 'auto'
            }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                    <h2 style={{ fontSize: '1.8rem', fontWeight: 800, margin: 0, color: 'white' }}>
                        {beach ? 'Editar Playa' : 'Nueva Playa'}
                    </h2>
                    <button type="button" onClick={onClose} style={{ background: 'rgba(255,255,255,0.1)', border: 'none', color: 'white', cursor: 'pointer', padding: '0.5rem', borderRadius: '50%', display: 'flex' }}>
                        <X size={24} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem' }}>
                        <div style={{ gridColumn: '1 / -1' }}>
                            <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-muted)' }}>Nombre de la Playa</label>
                            <input required type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="input-glass" style={{ width: '100%', padding: '0.8rem', borderRadius: '12px' }} placeholder="Ej: Playa Delfines" />
                        </div>
                        <div>
                            <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-muted)' }}>Tipo de Playa</label>
                            <select value={formData.type} onChange={e => setFormData({...formData, type: e.target.value})} className="input-glass" style={{ width: '100%', padding: '0.8rem', borderRadius: '12px', background: 'rgba(5, 7, 10, 0.9)' }}>
                                <option value="Pública">Pública</option>
                                <option value="Privada">Privada</option>
                                <option value="Virgen">Virgen</option>
                                <option value="Reserva Natural">Reserva Natural</option>
                            </select>
                        </div>
                        <div>
                            <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-muted)' }}>Popularidad</label>
                            <select value={formData.popularity} onChange={e => setFormData({...formData, popularity: e.target.value})} className="input-glass" style={{ width: '100%', padding: '0.8rem', borderRadius: '12px', background: 'rgba(5, 7, 10, 0.9)' }}>
                                <option value="Alta">Alta (Muy concurrida)</option>
                                <option value="Media">Media</option>
                                <option value="Baja">Baja (Tranquila)</option>
                            </select>
                        </div>
                        <div>
                            <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-muted)' }}>Ciudad</label>
                            <input required type="text" value={formData.city} onChange={e => setFormData({...formData, city: e.target.value})} className="input-glass" style={{ width: '100%', padding: '0.8rem', borderRadius: '12px' }} />
                        </div>
                        <div>
                            <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-muted)' }}>Estado / Provincia</label>
                            <input required type="text" value={formData.state} onChange={e => setFormData({...formData, state: e.target.value})} className="input-glass" style={{ width: '100%', padding: '0.8rem', borderRadius: '12px' }} />
                        </div>
                        <div>
                            <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-muted)' }}>Coordenadas (Lat,Lng)</label>
                            <input required type="text" value={formData.coordinates} onChange={e => setFormData({...formData, coordinates: e.target.value})} className="input-glass" style={{ width: '100%', padding: '0.8rem', borderRadius: '12px' }} placeholder="21.0583,-86.7779" />
                        </div>
                        <div>
                            <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-muted)' }}>Estado</label>
                            <select value={formData.status} onChange={e => setFormData({...formData, status: e.target.value})} className="input-glass" style={{ width: '100%', padding: '0.8rem', borderRadius: '12px', background: 'rgba(5, 7, 10, 0.9)' }}>
                                <option value="Abierta">Abierta</option>
                                <option value="Cerrada">Cerrada</option>
                                <option value="Bandera Roja">Bandera Roja (Peligro)</option>
                                <option value="Bandera Amarilla">Bandera Amarilla (Precaución)</option>
                            </select>
                        </div>
                        <div style={{ gridColumn: '1 / -1' }}>
                            <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-muted)' }}>Descripción Larga</label>
                            <textarea value={formData.description_long} onChange={e => setFormData({...formData, description_long: e.target.value})} className="input-glass" style={{ width: '100%', padding: '0.8rem', borderRadius: '12px', minHeight: '100px', resize: 'vertical' }} placeholder="Descripción atractiva del lugar..."></textarea>
                        </div>
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

                    <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                        <button type="button" onClick={onClose} className="btn-secondary" style={{ flex: 1, padding: '1rem', borderRadius: '12px' }}>
                            Cancelar
                        </button>
                        <button type="submit" className="btn-premium" disabled={loading} style={{ flex: 2, padding: '1rem', borderRadius: '12px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                            {loading ? <Loader2 className="animate-spin" /> : 'Guardar Playa'}
                        </button>
                    </div>
                </form>
            </div>
            
            <style jsx>{`
                .input-glass {
                    background: rgba(255,255,255,0.05);
                    border: 1px solid var(--border-glass);
                    color: white;
                    transition: all 0.2s;
                }
                .input-glass:focus {
                    background: rgba(255,255,255,0.1);
                    border-color: var(--primary);
                    outline: none;
                }
            `}</style>
        </div>
    );
}
