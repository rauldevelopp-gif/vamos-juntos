'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowLeft, Plus, X, Bed, Loader2, Edit, Trash2, Upload } from 'lucide-react';
import { getHotelRooms, saveHotelRoom, deleteHotelRoom } from '../../actions';

export default function HotelRoomsPage({ params }: { params: { id: string } }) {
    const hotelId = parseInt(params.id);
    const [rooms, setRooms] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [showForm, setShowForm] = useState(false);
    
    const [formData, setFormData] = useState({
        id: 0,
        hotelId: hotelId,
        type: 'Habitación Estándar',
        maxCapacity: 2,
        quantity: 1,
        basePrice: 100,
        cancellationPolicy: 'Cancelación gratuita hasta 24h antes.',
        status: 'Activa',
        gallery: [] as string[]
    });

    const [uploading, setUploading] = useState(false);

    const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (!files || files.length === 0) return;
        
        setUploading(true);
        try {
            const uploadedUrls = [...(formData.gallery || [])];
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
            setUploading(false);
        }
    };

    const removeImage = (index: number) => {
        const newGallery = [...(formData.gallery || [])];
        newGallery.splice(index, 1);
        setFormData({ ...formData, gallery: newGallery });
    };

    useEffect(() => {
        fetchRooms();
    }, [hotelId]);

    const fetchRooms = async () => {
        setLoading(true);
        const result = await getHotelRooms(hotelId);
        if (result.success && result.data) {
            setRooms(result.data);
        }
        setLoading(false);
    };

    const handleOpenForm = (room?: any) => {
        if (room) {
            setFormData({
                id: room.id,
                hotelId: room.hotelId,
                type: room.type,
                maxCapacity: room.maxCapacity,
                quantity: room.quantity,
                basePrice: room.basePrice,
                cancellationPolicy: room.cancellationPolicy || '',
                status: room.status,
                gallery: room.gallery || []
            });
        } else {
            setFormData({
                id: 0, hotelId, type: 'Habitación Estándar', maxCapacity: 2, quantity: 1, basePrice: 100, cancellationPolicy: '', status: 'Activa', gallery: []
            });
        }
        setShowForm(true);
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        const res = await saveHotelRoom(formData);
        if (res.success) {
            await fetchRooms();
            setShowForm(false);
        } else {
            alert(res.error);
        }
        setSaving(false);
    };

    const handleDelete = async (id: number) => {
        if (confirm('¿Estás seguro de eliminar esta habitación?')) {
            const res = await deleteHotelRoom(id);
            if (res.success) fetchRooms();
            else alert(res.error);
        }
    };

    return (
        <div style={{ padding: '1rem', maxWidth: '1000px', margin: '0 auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2.5rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <Link href="/admin/hotels" className="btn-glass-nav" style={{ width: '40px', height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '12px', textDecoration: 'none', padding: 0 }}>
                        <ArrowLeft size={20} strokeWidth={2} />
                    </Link>
                    <div>
                        <h1 style={{ fontSize: '1.8rem', fontWeight: 800, margin: 0 }} className="text-gradient">
                            Habitaciones
                        </h1>
                        <p style={{ color: 'var(--text-muted)', margin: '0.5rem 0 0 0' }}>
                            Gestiona el inventario y precios por noche.
                        </p>
                    </div>
                </div>
                
                <button onClick={() => handleOpenForm()} className="btn-premium" style={{ padding: '0.8rem 1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <Plus size={18} strokeWidth={2.5} />
                    <span className="btn-text-mobile-hide">Añadir Habitación</span>
                </button>
            </div>

            {loading ? (
                <div style={{ textAlign: 'center', padding: '4rem' }}>
                    <Loader2 className="animate-spin" size={32} style={{ margin: '0 auto 1rem', color: '#8b5cf6' }} />
                </div>
            ) : rooms.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '6rem', background: 'rgba(255,255,255,0.02)', borderRadius: '24px' }}>
                    <Bed size={48} color="var(--text-muted)" style={{ margin: '0 auto 1rem' }} />
                    <h3>Sin habitaciones</h3>
                    <p style={{ color: 'var(--text-muted)' }}>Agrega tipos de habitación para que puedan reservar.</p>
                </div>
            ) : (
                <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '1rem' }}>
                    {rooms.map(room => (
                        <div key={room.id} className="glass-panel" style={{ borderRadius: '16px', padding: '1.5rem', border: '1px solid rgba(255,255,255,0.05)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
                            <div style={{ flex: '1 1 300px' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '0.5rem' }}>
                                    <h3 style={{ margin: 0, fontSize: '1.2rem' }}>{room.type}</h3>
                                    <span style={{ padding: '0.2rem 0.6rem', borderRadius: '8px', fontSize: '0.7rem', background: room.status === 'Activa' ? 'rgba(16,185,129,0.1)' : 'rgba(244,63,94,0.1)', color: room.status === 'Activa' ? '#10b981' : '#f43f5e' }}>{room.status}</span>
                                </div>
                                <div style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.6)', display: 'flex', gap: '1rem' }}>
                                    <span>Capacidad: {room.maxCapacity} pers.</span>
                                    <span>Inventario: {room.quantity} hab.</span>
                                </div>
                            </div>
                            <div style={{ textAlign: 'right' }}>
                                <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'white' }}>${room.basePrice} <small style={{ fontSize: '0.7rem', opacity: 0.5 }}>/ noche</small></div>
                            </div>
                            <div style={{ display: 'flex', gap: '0.5rem' }}>
                                <button onClick={() => handleOpenForm(room)} className="btn-glass-nav" style={{ padding: '0.6rem', borderRadius: '10px' }}><Edit size={16} /></button>
                                <button onClick={() => handleDelete(room.id)} className="btn-glass-nav" style={{ padding: '0.6rem', borderRadius: '10px', color: '#f43f5e' }}><Trash2 size={16} /></button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {showForm && (
                <div className="modal-overlay" onClick={() => setShowForm(false)}>
                    <div className="modal-content glass-panel" onClick={e => e.stopPropagation()}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1.5rem', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                            <h2 style={{ margin: 0 }}>{formData.id ? 'Editar Habitación' : 'Nueva Habitación'}</h2>
                            <button onClick={() => setShowForm(false)} className="btn-glass-nav" style={{ border: 'none', padding: '0.3rem' }}><X size={20} /></button>
                        </div>
                        <form onSubmit={handleSave} style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
                            <div className="form-grid">
                                <div className="input-group">
                                    <label>Tipo (Ej. Suite con vista al mar)</label>
                                    <input required type="text" value={formData.type} onChange={e => setFormData({...formData, type: e.target.value})} />
                                </div>
                                <div className="input-group">
                                    <label>Precio Base (por Noche)</label>
                                    <input required type="number" min="0" step="0.01" value={formData.basePrice} onChange={e => setFormData({...formData, basePrice: parseFloat(e.target.value)})} />
                                </div>
                                <div className="input-group">
                                    <label>Capacidad Máxima (Personas)</label>
                                    <input required type="number" min="1" value={formData.maxCapacity} onChange={e => setFormData({...formData, maxCapacity: parseInt(e.target.value)})} />
                                </div>
                                <div className="input-group">
                                    <label>Inventario (Cantidad disponible)</label>
                                    <input required type="number" min="1" value={formData.quantity} onChange={e => setFormData({...formData, quantity: parseInt(e.target.value)})} />
                                </div>
                                <div className="input-group" style={{ gridColumn: '1 / -1' }}>
                                    <label>Política de Cancelación</label>
                                    <input type="text" value={formData.cancellationPolicy} onChange={e => setFormData({...formData, cancellationPolicy: e.target.value})} />
                                </div>
                                <div className="input-group">
                                    <label>Estado</label>
                                    <select value={formData.status} onChange={e => setFormData({...formData, status: e.target.value})}>
                                        <option value="Activa">Activa</option>
                                        <option value="Inactiva">Inactiva</option>
                                    </select>
                                </div>
                            </div>
                            <div className="input-group" style={{ gridColumn: '1 / -1' }}>
                                <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-muted)' }}>Galería de Fotos</label>
                                <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', marginBottom: '1rem' }}>
                                    {(formData.gallery || []).map((url: string, idx: number) => (
                                        <div key={idx} style={{ position: 'relative', width: '100px', height: '100px', borderRadius: '12px', overflow: 'hidden', border: '1px solid var(--border-glass)' }}>
                                            <img src={url} alt="Gallery item" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                            <button type="button" onClick={() => removeImage(idx)} style={{ position: 'absolute', top: 4, right: 4, background: 'rgba(0,0,0,0.6)', border: 'none', borderRadius: '50%', color: 'white', cursor: 'pointer', padding: '4px' }}>
                                                <X size={14} />
                                            </button>
                                        </div>
                                    ))}
                                    <label style={{ width: '100px', height: '100px', borderRadius: '12px', border: '2px dashed var(--border-glass)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: 'var(--text-muted)', background: 'rgba(255,255,255,0.02)' }}>
                                        {uploading ? <Loader2 className="animate-spin" size={24} /> : <Upload size={24} />}
                                        <span style={{ fontSize: '0.7rem', marginTop: '0.5rem' }}>Subir</span>
                                        <input type="file" multiple accept="image/*" onChange={handleUpload} style={{ display: 'none' }} disabled={uploading} />
                                    </label>
                                </div>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '1rem' }}>
                                <button type="button" onClick={() => setShowForm(false)} className="btn-secondary" style={{ padding: '0.8rem 1.5rem', borderRadius: '12px' }}>Cancelar</button>
                                <button type="submit" disabled={saving} className="btn-premium" style={{ padding: '0.8rem 1.5rem', borderRadius: '12px' }}>
                                    {saving ? 'Guardando...' : 'Guardar Habitación'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            <style jsx>{`
                .modal-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.8); backdrop-filter: blur(5px); display: flex; align-items: center; justify-content: center; z-index: 9999; }
                .modal-content { width: 95%; max-width: 600px; border-radius: 20px; background: #0f1115; }
                .form-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; }
                .input-group { display: flex; flex-direction: column; gap: 0.4rem; }
                .input-group label { font-size: 0.8rem; font-weight: 700; color: rgba(255,255,255,0.6); }
                .input-group input, .input-group select, .input-group textarea { background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1); padding: 0.8rem; border-radius: 10px; color: white; font-family: inherit; }
                @media (max-width: 600px) { .form-grid { grid-template-columns: 1fr; } }
            `}</style>
        </div>
    );
}
