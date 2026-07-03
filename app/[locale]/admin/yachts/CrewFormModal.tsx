'use client';

import { useState } from 'react';
import { X, Loader2, Upload, UserCircle } from 'lucide-react';
import { createCrew, updateCrew } from './actions';
import { toast } from 'react-hot-toast';
import Image from 'next/image';

interface CrewFormModalProps {
    yachtId: number;
    crewMember?: any | null;
    onClose: () => void;
    onSuccess: () => void;
}

export default function CrewFormModal({ yachtId, crewMember, onClose, onSuccess }: CrewFormModalProps) {
    const [loading, setLoading] = useState(false);
    const [uploadingImage, setUploadingImage] = useState(false);
    
    const [formData, setFormData] = useState({
        name: crewMember?.name || '',
        role: crewMember?.role || 'Capitán',
        experience: crewMember?.experience || '',
        phone: crewMember?.phone || '',
        photo: crewMember?.photo || '',
        yachtId: yachtId
    });

    const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        
        setUploadingImage(true);
        const loadingToast = toast.loading('Subiendo foto...');
        try {
            const form = new FormData();
            form.append('file', file);
            
            const res = await fetch('/api/upload', {
                method: 'POST',
                body: form
            });
            
            const data = await res.json();
            if (data.success) {
                setFormData({ ...formData, photo: data.url });
                toast.success('Foto subida', { id: loadingToast });
            } else {
                toast.error('Error al subir', { id: loadingToast });
            }
        } catch (error) {
            console.error("Upload error", error);
            toast.error("Error al subir foto", { id: loadingToast });
        } finally {
            setUploadingImage(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        const loadingToast = toast.loading('Guardando...');

        const res = crewMember 
            ? await updateCrew(crewMember.id, formData)
            : await createCrew(formData);

        if (res.success) {
            toast.success('Tripulante guardado', { id: loadingToast });
            onSuccess();
        } else {
            toast.error(res.error || 'Error al guardar', { id: loadingToast });
            setLoading(false);
        }
    };

    return (
        <div className="modal-overlay" onClick={onClose} style={{
            position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(10px)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 10000, padding: '1rem'
        }}>
            <div className="glass-panel" onClick={e => e.stopPropagation()} style={{
                background: 'var(--bg-card)', width: '100%', maxWidth: '500px', borderRadius: '24px',
                padding: '2rem', border: '1px solid var(--border-glass)',
                maxHeight: '90vh', overflowY: 'auto'
            }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                    <h2 style={{ fontSize: '1.5rem', fontWeight: 800, margin: 0, color: 'white' }}>
                        {crewMember ? 'Editar Tripulante' : 'Nuevo Tripulante'}
                    </h2>
                    <button type="button" onClick={onClose} style={{ background: 'rgba(255,255,255,0.1)', border: 'none', color: 'white', cursor: 'pointer', padding: '0.5rem', borderRadius: '50%', display: 'flex' }}>
                        <X size={20} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                    
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
                        <div style={{ position: 'relative', width: '100px', height: '100px', borderRadius: '20px', overflow: 'hidden', border: '2px solid var(--border-glass)', background: 'rgba(255,255,255,0.02)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            {formData.photo ? (
                                <Image src={formData.photo} alt="Foto" fill style={{ objectFit: 'cover' }} unoptimized />
                            ) : (
                                <UserCircle size={40} color="var(--text-muted)" />
                            )}
                            {uploadingImage && (
                                <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    <Loader2 className="animate-spin" color="white" />
                                </div>
                            )}
                        </div>
                        
                        <label style={{ cursor: 'pointer', padding: '0.5rem 1rem', background: 'rgba(255,255,255,0.05)', borderRadius: '12px', border: '1px solid var(--border-glass)', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <Upload size={16} /> Subir Foto
                            <input type="file" accept="image/*" style={{ display: 'none' }} onChange={handleUpload} disabled={uploadingImage} />
                        </label>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '1rem' }}>
                        <div>
                            <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-muted)', fontSize: '0.9rem' }}>Nombre Completo</label>
                            <input required type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="input-glass" style={{ width: '100%', padding: '0.8rem', borderRadius: '12px' }} />
                        </div>
                        <div>
                            <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-muted)', fontSize: '0.9rem' }}>Rol / Cargo</label>
                            <select value={formData.role} onChange={e => setFormData({...formData, role: e.target.value})} className="input-glass" style={{ width: '100%', padding: '0.8rem', borderRadius: '12px', background: 'rgba(5, 7, 10, 0.9)' }}>
                                <option value="Capitán">Capitán</option>
                                <option value="Marinero">Marinero</option>
                                <option value="Chef">Chef</option>
                                <option value="Anfitrión/a">Anfitrión/a</option>
                                <option value="Guía Turístico">Guía Turístico</option>
                                <option value="Seguridad">Seguridad</option>
                                <option value="Limpieza">Limpieza</option>
                            </select>
                        </div>
                        <div>
                            <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-muted)', fontSize: '0.9rem' }}>Experiencia</label>
                            <input required type="text" value={formData.experience} onChange={e => setFormData({...formData, experience: e.target.value})} className="input-glass" style={{ width: '100%', padding: '0.8rem', borderRadius: '12px' }} placeholder="Ej: 5 años" />
                        </div>
                        <div>
                            <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-muted)', fontSize: '0.9rem' }}>Teléfono (Opcional)</label>
                            <input type="tel" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} className="input-glass" style={{ width: '100%', padding: '0.8rem', borderRadius: '12px' }} placeholder="+52 998 000 0000" />
                        </div>
                    </div>

                    <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                        <button type="button" onClick={onClose} className="btn-secondary" style={{ flex: 1, padding: '1rem', borderRadius: '12px' }}>
                            Cancelar
                        </button>
                        <button type="submit" className="btn-premium" disabled={loading} style={{ flex: 2, padding: '1rem', borderRadius: '12px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                            {loading ? <Loader2 className="animate-spin" /> : 'Guardar'}
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
