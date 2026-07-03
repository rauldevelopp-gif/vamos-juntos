'use client';

import { useState } from 'react';
import { X, Loader2 } from 'lucide-react';
import { createRestaurant, updateRestaurant } from './actions';
import { toast } from 'react-hot-toast';

interface RestaurantFormModalProps {
    restaurant?: any | null;
    onClose: () => void;
    onSuccess: () => void;
}

export default function RestaurantFormModal({ restaurant, onClose, onSuccess }: RestaurantFormModalProps) {
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: restaurant?.name || '',
        cuisine: restaurant?.cuisine || 'Mariscos',
        city: restaurant?.city || '',
        state: restaurant?.state || '',
        status: restaurant?.status || 'Abierto',
        priceRange: restaurant?.priceRange || '$$',
        coordinates: restaurant?.coordinates || ''
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        const loadingToast = toast.loading('Guardando...');

        const res = restaurant 
            ? await updateRestaurant(restaurant.id, formData)
            : await createRestaurant(formData);

        if (res.success) {
            toast.success('Restaurante guardado exitosamente', { id: loadingToast });
            onSuccess();
        } else {
            toast.error(res.error || 'Error al guardar el restaurante', { id: loadingToast });
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
                        {restaurant ? 'Editar Restaurante' : 'Nuevo Restaurante'}
                    </h2>
                    <button type="button" onClick={onClose} style={{ background: 'rgba(255,255,255,0.1)', border: 'none', color: 'white', cursor: 'pointer', padding: '0.5rem', borderRadius: '50%', display: 'flex' }}>
                        <X size={24} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem' }}>
                        <div style={{ gridColumn: '1 / -1' }}>
                            <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-muted)' }}>Nombre del Restaurante</label>
                            <input required type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="input-glass" style={{ width: '100%', padding: '0.8rem', borderRadius: '12px' }} placeholder="Ej: La Parrilla" />
                        </div>
                        <div>
                            <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-muted)' }}>Tipo de Cocina</label>
                            <input required type="text" value={formData.cuisine} onChange={e => setFormData({...formData, cuisine: e.target.value})} className="input-glass" style={{ width: '100%', padding: '0.8rem', borderRadius: '12px' }} placeholder="Ej: Mariscos, Mexicana, Italiana" />
                        </div>
                        <div>
                            <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-muted)' }}>Rango de Precio</label>
                            <select value={formData.priceRange} onChange={e => setFormData({...formData, priceRange: e.target.value})} className="input-glass" style={{ width: '100%', padding: '0.8rem', borderRadius: '12px', background: 'rgba(5, 7, 10, 0.9)' }}>
                                <option value="$">$ (Económico)</option>
                                <option value="$$">$$ (Moderado)</option>
                                <option value="$$$">$$$ (Caro)</option>
                                <option value="$$$$">$$$$ (Exclusivo)</option>
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
                                <option value="Abierto">Abierto</option>
                                <option value="Cerrado">Cerrado</option>
                                <option value="Mantenimiento">Mantenimiento</option>
                            </select>
                        </div>
                    </div>

                    <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                        <button type="button" onClick={onClose} className="btn-secondary" style={{ flex: 1, padding: '1rem', borderRadius: '12px' }}>
                            Cancelar
                        </button>
                        <button type="submit" className="btn-premium" disabled={loading} style={{ flex: 2, padding: '1rem', borderRadius: '12px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                            {loading ? <Loader2 className="animate-spin" /> : 'Guardar Restaurante'}
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
