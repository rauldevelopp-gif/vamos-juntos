'use client';

import { useState } from 'react';
import { X, Loader2, Music, Wind, Dog, Cigarette, GlassWater, Wifi, Briefcase, Smartphone, Upload, UserCircle, Trash2, Camera } from 'lucide-react';
import { createTaxi, updateTaxi } from './actions';
import { tr, setLanguage } from '@/lib/tr';
import { toast } from 'react-hot-toast';
import Image from 'next/image';
import { useLanguage } from '@/context/LanguageContext';

interface TaxiFormModalProps {
    taxi?: any;
    onClose: () => void;
    onSuccess: () => void;
}

const AVAILABLE_AMENITIES = [
    { name: 'Música', icon: Music },
    { name: 'A/C', icon: Wind },
    { name: 'Mascotas', icon: Dog },
    { name: 'Fumar', icon: Cigarette },
    { name: 'Bebidas', icon: GlassWater },
    { name: 'WiFi', icon: Wifi },
    { name: 'Equipaje Extra', icon: Briefcase }
];

export default function TaxiFormModal({ taxi, onClose, onSuccess }: TaxiFormModalProps) {
    const { language } = useLanguage();
    setLanguage(language);

    const [loading, setLoading] = useState(false);
    const [uploadingDriver, setUploadingDriver] = useState(false);
    const [uploadingGallery, setUploadingGallery] = useState(false);

    const [formData, setFormData] = useState({
        plate: taxi?.plate || '',
        brand: taxi?.brand || '',
        model: taxi?.model || '',
        year: taxi?.year || new Date().getFullYear(),
        color: taxi?.color || 'Blanco',
        type: taxi?.type || 'Sedan',
        passengers: taxi?.passengers || 4,
        luggage: taxi?.luggage || 2,
        status: taxi?.status || 'Disponible',
        amenities: taxi?.amenities || [],
        gallery: taxi?.gallery || [],
        driverName: taxi?.driver?.name || '',
        driverLicense: taxi?.driver?.license || '',
        driverPhone: taxi?.driver?.phone || '',
        driverExpiration: taxi?.driver?.expiration || '',
        driverPhoto: taxi?.driver?.photo || ''
    });

    const handleDriverUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        
        setUploadingDriver(true);
        const loadingToast = toast.loading(tr('Subiendo foto del conductor...'));
        try {
            const form = new FormData();
            form.append('file', file);
            const res = await fetch('/api/upload', { method: 'POST', body: form });
            const data = await res.json();
            if (data.success) {
                setFormData({ ...formData, driverPhoto: data.url });
                toast.success(tr('Foto subida'), { id: loadingToast });
            } else {
                toast.error(tr('Error al subir'), { id: loadingToast });
            }
        } catch (error) {
            toast.error(tr("Error al subir foto"), { id: loadingToast });
        } finally {
            setUploadingDriver(false);
        }
    };

    const handleGalleryUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (!files || files.length === 0) return;
        
        setUploadingGallery(true);
        const loadingToast = toast.loading(tr(`Subiendo ${files.length} foto(s)...`));
        try {
            const newUrls: string[] = [];
            for (let i = 0; i < files.length; i++) {
                const form = new FormData();
                form.append('file', files[i]);
                const res = await fetch('/api/upload', { method: 'POST', body: form });
                const data = await res.json();
                if (data.success) {
                    newUrls.push(data.url);
                }
            }
            if (newUrls.length > 0) {
                setFormData({ ...formData, gallery: [...formData.gallery, ...newUrls] });
                toast.success(tr('Fotos del vehículo subidas'), { id: loadingToast });
            } else {
                toast.error(tr('Error al subir'), { id: loadingToast });
            }
        } catch (error) {
            toast.error(tr("Error al subir fotos"), { id: loadingToast });
        } finally {
            setUploadingGallery(false);
        }
    };

    const removeGalleryImage = (index: number) => {
        const updated = [...formData.gallery];
        updated.splice(index, 1);
        setFormData({ ...formData, gallery: updated });
    };

    const toggleAmenity = (amenityName: string) => {
        setFormData(prev => {
            const list = prev.amenities;
            if (list.includes(amenityName)) {
                return { ...prev, amenities: list.filter((a: string) => a !== amenityName) };
            } else {
                return { ...prev, amenities: [...list, amenityName] };
            }
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        setLoading(true);
        
        const payload = {
            ...formData,
            year: Number(formData.year),
            passengers: Number(formData.passengers),
            luggage: Number(formData.luggage)
        };

        const res = taxi 
            ? await updateTaxi(taxi.id, payload)
            : await createTaxi(payload);

        setLoading(false);
        if (res.success) {
            onSuccess();
        } else {
            toast.error(tr('Error:') + ' ' + (res.error || tr('No se pudo guardar')));
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
                    <h2 style={{ margin: 0 }}>{taxi ? tr('Editar Vehículo') : tr('Registrar Nuevo Vehículo')}</h2>
                    <button onClick={onClose} style={{ background: 'none', border: 'none', color: 'white', cursor: 'pointer', padding: '0.5rem', display: 'flex', borderRadius: '50%', backgroundColor: 'rgba(255,255,255,0.1)' }}>
                        <X size={20} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} style={{ display: 'grid', gap: '1.5rem' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                        <div>
                            <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-muted)' }}>{tr('Placa / Matrícula')}</label>
                            <input required type="text" value={formData.plate} onChange={e => setFormData({...formData, plate: e.target.value})} className="input-glass" style={{ width: '100%', padding: '0.8rem', borderRadius: '12px', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border-glass)', color: 'white' }} placeholder="ABC-1234" />
                        </div>
                        <div>
                            <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-muted)' }}>{tr('Marca')}</label>
                            <input required type="text" value={formData.brand} onChange={e => setFormData({...formData, brand: e.target.value})} className="input-glass" style={{ width: '100%', padding: '0.8rem', borderRadius: '12px', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border-glass)', color: 'white' }} placeholder="Toyota" />
                        </div>
                        <div>
                            <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-muted)' }}>{tr('Modelo')}</label>
                            <input required type="text" value={formData.model} onChange={e => setFormData({...formData, model: e.target.value})} className="input-glass" style={{ width: '100%', padding: '0.8rem', borderRadius: '12px', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border-glass)', color: 'white' }} placeholder="Camry" />
                        </div>
                        <div>
                            <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-muted)' }}>{tr('Año')}</label>
                            <input required type="number" value={formData.year} onChange={e => setFormData({...formData, year: Number(e.target.value)})} className="input-glass" style={{ width: '100%', padding: '0.8rem', borderRadius: '12px', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border-glass)', color: 'white' }} />
                        </div>
                        <div>
                            <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-muted)' }}>{tr('Color')}</label>
                            <input required type="text" value={formData.color} onChange={e => setFormData({...formData, color: e.target.value})} className="input-glass" style={{ width: '100%', padding: '0.8rem', borderRadius: '12px', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border-glass)', color: 'white' }} />
                        </div>
                        <div>
                            <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-muted)' }}>{tr('Categoría (Tipo)')}</label>
                            <select value={formData.type} onChange={e => setFormData({...formData, type: e.target.value})} className="input-glass" style={{ width: '100%', padding: '0.8rem', borderRadius: '12px', background: '#05070a', border: '1px solid var(--border-glass)', color: 'white' }}>
                                <option value="Sedan">Sedan</option>
                                <option value="SUV">SUV</option>
                                <option value="Van">Van</option>
                                <option value="Minivan">Minivan</option>
                                <option value="Lujo">Lujo</option>
                            </select>
                        </div>
                        <div>
                            <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-muted)' }}>{tr('Capacidad (Pasajeros)')}</label>
                            <input required type="number" min="1" value={formData.passengers} onChange={e => setFormData({...formData, passengers: Number(e.target.value)})} className="input-glass" style={{ width: '100%', padding: '0.8rem', borderRadius: '12px', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border-glass)', color: 'white' }} />
                        </div>
                        <div>
                            <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-muted)' }}>{tr('Maletas')}</label>
                            <input required type="number" min="0" value={formData.luggage} onChange={e => setFormData({...formData, luggage: Number(e.target.value)})} className="input-glass" style={{ width: '100%', padding: '0.8rem', borderRadius: '12px', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border-glass)', color: 'white' }} />
                        </div>
                    </div>

                    <div style={{ borderTop: '1px solid var(--border-glass)', paddingTop: '1.5rem' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                            <h3 style={{ margin: 0, fontSize: '1.1rem' }}>{tr('Galería del Vehículo')}</h3>
                            <label style={{ cursor: 'pointer', padding: '0.5rem 1rem', background: 'rgba(255,255,255,0.05)', borderRadius: '12px', border: '1px solid var(--border-glass)', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                {uploadingGallery ? <Loader2 size={16} className="animate-spin" /> : <Camera size={16} />}
                                {tr('Agregar Fotos')}
                                <input type="file" accept="image/*" multiple style={{ display: 'none' }} onChange={handleGalleryUpload} disabled={uploadingGallery} />
                            </label>
                        </div>
                        {formData.gallery.length > 0 ? (
                            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                                {formData.gallery.map((url: string, idx: number) => (
                                    <div key={idx} style={{ position: 'relative', width: '100px', height: '100px', borderRadius: '12px', overflow: 'hidden', border: '2px solid var(--border-glass)' }}>
                                        <Image src={url} alt={`Gallery ${idx}`} fill style={{ objectFit: 'cover' }} unoptimized />
                                        <button type="button" onClick={() => removeGalleryImage(idx)} style={{ position: 'absolute', top: '5px', right: '5px', background: 'rgba(239, 68, 68, 0.9)', color: 'white', border: 'none', borderRadius: '50%', width: '24px', height: '24px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
                                            <X size={14} />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div style={{ padding: '2rem', textAlign: 'center', background: 'rgba(255,255,255,0.02)', borderRadius: '16px', border: '1px dashed var(--border-glass)', color: 'var(--text-muted)' }}>
                                {tr('No hay fotos del vehículo. Sube algunas imágenes para mostrarlas a los clientes.')}
                            </div>
                        )}
                    </div>

                    <div style={{ borderTop: '1px solid var(--border-glass)', paddingTop: '1.5rem' }}>
                        <h3 style={{ margin: '0 0 1rem 0', fontSize: '1.1rem' }}>{tr('Datos del Conductor')}</h3>
                        
                        <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'flex-start', marginBottom: '1.5rem' }}>
                            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
                                <div style={{ position: 'relative', width: '90px', height: '90px', borderRadius: '20px', overflow: 'hidden', border: '2px solid var(--border-glass)', background: 'rgba(255,255,255,0.02)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    {formData.driverPhoto ? (
                                        <Image src={formData.driverPhoto} alt="Chofer" fill style={{ objectFit: 'cover' }} unoptimized />
                                    ) : (
                                        <UserCircle size={36} color="var(--text-muted)" />
                                    )}
                                    {uploadingDriver && (
                                        <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                            <Loader2 className="animate-spin" color="white" />
                                        </div>
                                    )}
                                </div>
                                <label style={{ cursor: 'pointer', padding: '0.4rem 0.8rem', background: 'rgba(255,255,255,0.05)', borderRadius: '8px', border: '1px solid var(--border-glass)', fontSize: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                                    <Upload size={14} /> {tr('Foto')}
                                    <input type="file" accept="image/*" style={{ display: 'none' }} onChange={handleDriverUpload} disabled={uploadingDriver} />
                                </label>
                            </div>

                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', flex: 1 }}>
                                <div>
                                    <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-muted)' }}>{tr('Nombre del Chofer')}</label>
                                    <input required type="text" value={formData.driverName} onChange={e => setFormData({...formData, driverName: e.target.value})} className="input-glass" style={{ width: '100%', padding: '0.8rem', borderRadius: '12px', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border-glass)', color: 'white' }} placeholder="Juan Pérez" />
                                </div>
                                <div>
                                    <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-muted)' }}>{tr('Licencia')}</label>
                                    <input required type="text" value={formData.driverLicense} onChange={e => setFormData({...formData, driverLicense: e.target.value})} className="input-glass" style={{ width: '100%', padding: '0.8rem', borderRadius: '12px', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border-glass)', color: 'white' }} placeholder="LIC-12345" />
                                </div>
                                <div>
                                    <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-muted)' }}>{tr('Teléfono')}</label>
                                    <input required type="text" value={formData.driverPhone} onChange={e => setFormData({...formData, driverPhone: e.target.value})} className="input-glass" style={{ width: '100%', padding: '0.8rem', borderRadius: '12px', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border-glass)', color: 'white' }} placeholder="+52 998 123 4567" />
                                </div>
                                <div>
                                    <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-muted)' }}>{tr('Vencimiento de Licencia')}</label>
                                    <input type="date" value={formData.driverExpiration} onChange={e => setFormData({...formData, driverExpiration: e.target.value})} className="input-glass" style={{ width: '100%', padding: '0.8rem', borderRadius: '12px', background: '#05070a', border: '1px solid var(--border-glass)', color: 'white', colorScheme: 'dark' }} />
                                </div>
                            </div>
                        </div>
                    </div>

                    <div style={{ borderTop: '1px solid var(--border-glass)', paddingTop: '1.5rem' }}>
                        <label style={{ display: 'block', marginBottom: '1rem', color: 'var(--text-muted)', fontSize: '1.1rem', fontWeight: 'bold' }}>{tr('Amenidades Disponibles')}</label>
                        <div style={{ display: 'flex', gap: '0.8rem', flexWrap: 'wrap' }}>
                            {AVAILABLE_AMENITIES.map(amenity => {
                                const Icon = amenity.icon;
                                const isSelected = formData.amenities.includes(amenity.name);
                                return (
                                    <button 
                                        type="button" 
                                        key={amenity.name}
                                        onClick={() => toggleAmenity(amenity.name)}
                                        style={{
                                            display: 'flex', alignItems: 'center', gap: '0.5rem',
                                            padding: '0.6rem 1rem', borderRadius: '12px',
                                            background: isSelected ? 'rgba(139, 92, 246, 0.2)' : 'rgba(255,255,255,0.05)',
                                            border: `1px solid ${isSelected ? 'var(--primary)' : 'var(--border-glass)'}`,
                                            color: isSelected ? 'white' : 'var(--text-muted)',
                                            cursor: 'pointer', transition: 'all 0.2s'
                                        }}
                                    >
                                        <Icon size={16} color={isSelected ? 'var(--primary)' : 'currentColor'} />
                                        <span style={{ fontSize: '0.9rem', fontWeight: isSelected ? 600 : 400 }}>{tr(amenity.name)}</span>
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                    
                    <div>
                        <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-muted)' }}>{tr('Estado')}</label>
                        <select value={formData.status} onChange={e => setFormData({...formData, status: e.target.value})} className="input-glass" style={{ width: '100%', padding: '0.8rem', borderRadius: '12px', background: '#05070a', border: '1px solid var(--border-glass)', color: 'white' }}>
                            <option value="Disponible">{tr('Disponible')}</option>
                            <option value="En Mantenimiento">{tr('En Mantenimiento')}</option>
                            <option value="Ocupado">{tr('Ocupado')}</option>
                        </select>
                    </div>

                    <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                        <button type="button" onClick={onClose} className="btn-secondary" style={{ flex: 1, padding: '1rem', borderRadius: '12px' }}>
                            {tr('Cancelar')}
                        </button>
                        <button type="submit" className="btn-premium" disabled={loading} style={{ flex: 2, padding: '1rem', borderRadius: '12px', fontWeight: 600, display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.5rem' }}>
                            {loading ? <Loader2 className="animate-spin" size={20} /> : null}
                            {taxi ? tr('Guardar Cambios') : tr('Registrar Vehículo')}
                        </button>
                    </div>
                </form>
            </div>
            <style jsx>{`
                .input-glass:focus {
                    background: rgba(255,255,255,0.1) !important;
                    outline: none;
                    border-color: var(--primary) !important;
                }
            `}</style>
        </div>
    );
}
