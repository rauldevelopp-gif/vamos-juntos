'use client';
import { useLanguage } from '@/context/LanguageContext';
import { tr, setLanguage } from '@/lib/tr';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowLeft, Plus, MapPin, X, Star, Loader2, Hotel as HotelIcon, Bed, Edit2, Trash2, Upload } from 'lucide-react';
import { getHotels, saveHotel, deleteHotel } from './actions';
import ConfirmModal from '@/components/ConfirmModal';
import HotelExcelUpload from './HotelExcelUpload';

export default function HotelsPage() {
  const { language } = useLanguage();
  setLanguage(language);
    const [hotels, setHotels] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    
    // Modal states
    const [showMapModal, setShowMapModal] = useState(false);
    const [showFormModal, setShowFormModal] = useState(false);
    const [selectedHotel, setSelectedHotel] = useState<any | null>(null);
    const [uploading, setUploading] = useState(false);
    const [confirmModalData, setConfirmModalData] = useState<{ isOpen: boolean, id: number | null, name: string }>({ isOpen: false, id: null, name: '' });

    const closeModal = () => {
        setShowMapModal(false);
        setSelectedHotel(null);
    };

    const [formData, setFormData] = useState({
        id: 0,
        name: '',
        description: '',
        category: 'Estándar',
        stars: 5,
        location: '',
        address: '',
        city: '',
        state: '',
        coordinates: '',
        phone: '',
        email: '',
        policies: '',
        checkInTime: '15:00',
        checkOutTime: '12:00',
        status: 'Disponible',
        gallery: [] as string[]
    });

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
        fetchHotels();
    }, []);

    const fetchHotels = async () => {
        setLoading(true);
        const result = await getHotels();
        if (result.success && result.data) {
            setHotels(result.data);
        }
        setLoading(false);
    };

    const handleOpenForm = (hotel?: any) => {
        if (hotel) {
            setFormData({
                id: hotel.id,
                name: hotel.name,
                description: hotel.description || '',
                category: hotel.category || 'Estándar',
                stars: hotel.stars,
                location: hotel.location || '',
                address: hotel.address || '',
                city: hotel.city,
                state: hotel.state,
                coordinates: hotel.coordinates,
                phone: hotel.phone || '',
                email: hotel.email || '',
                policies: hotel.policies || '',
                checkInTime: hotel.checkInTime || '15:00',
                checkOutTime: hotel.checkOutTime || '12:00',
                status: hotel.status,
                gallery: hotel.gallery || []
            });
        } else {
            setFormData({
                id: 0, name: '', description: '', category: 'Estándar', stars: 5,
                location: '', address: '', city: '', state: '', coordinates: '',
                phone: '', email: '', policies: '', checkInTime: '15:00', checkOutTime: '12:00', status: 'Disponible', gallery: []
            });
        }
        setShowFormModal(true);
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        const res = await saveHotel(formData);
        if (res.success) {
            await fetchHotels();
            setShowFormModal(false);
        } else {
            alert(res.error);
        }
        setSaving(false);
    };

    const handleDeleteClick = (id: number, name: string) => {
        setConfirmModalData({ isOpen: true, id, name });
    };

    const confirmDelete = async () => {
        if (!confirmModalData.id) return;
        const idToDelete = confirmModalData.id;
        setConfirmModalData({ isOpen: false, id: null, name: '' });
        
        const res = await deleteHotel(idToDelete);
        if (res.success) fetchHotels();
        else alert(res.error);
    };

    const renderStars = (count: number) => {
        return Array(count).fill(0).map((_, i) => (
            <Star key={i} size={12} fill="#f59e0b" color="#f59e0b" strokeWidth={0} />
        ));
    };

    return (
        <div style={{ padding: '1rem', maxWidth: '1200px', margin: '0 auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2.5rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <Link href="/admin" className="btn-glass-nav" style={{ width: '40px', height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '12px', textDecoration: 'none', padding: 0 }}>
                        <ArrowLeft size={20} strokeWidth={2} />
                    </Link>
                    <div>
                        <h1 style={{ fontSize: '1.8rem', fontWeight: 800, margin: 0 }} className="text-gradient">{tr("Gestión de Hoteles")}</h1>
                        <p style={{ color: 'var(--text-muted)', margin: '0.5rem 0 0 0' }}>{tr("Administra tu portafolio de alojamientos y habitaciones.")}</p>
                    </div>
                </div>
                <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                    <HotelExcelUpload onSuccess={fetchHotels} />
                    <button onClick={() => handleOpenForm()} className="btn-premium" style={{ padding: '0.8rem 1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <Plus size={18} strokeWidth={2.5} />
                        <span className="btn-text-mobile-hide">{tr("Añadir Hotel")}</span>
                    </button>
                </div>
            </div>

            {loading ? (
                <div style={{ textAlign: 'center', padding: '4rem' }}>
                    <Loader2 className="animate-spin" size={32} style={{ margin: '0 auto 1rem', color: '#8b5cf6' }} />
                    <p style={{ color: 'var(--text-muted)' }}>{tr("Cargando hoteles...")}</p>
                </div>
            ) : hotels.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '6rem', background: 'rgba(255,255,255,0.02)', borderRadius: '24px' }}>
                    <HotelIcon size={48} color="var(--text-muted)" style={{ margin: '0 auto 1rem' }} />
                    <h3>{tr("No hay hoteles registrados")}</h3>
                    <p style={{ color: 'var(--text-muted)' }}>Comienza agregando tu primer alojamiento.</p>
                </div>
            ) : (
                <div className="glass-panel" style={{ overflow: 'hidden', borderRadius: '20px' }}>
                    <table className="responsive-table" style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                        <thead>
                            <tr style={{ background: 'rgba(255,255,255,0.03)', borderBottom: '1px solid var(--border-glass)' }}>
                                <th style={{ padding: '0.8rem 1rem', color: 'var(--text-muted)', fontWeight: 600, fontSize: '0.8rem' }}>Hotel</th>
                                <th style={{ padding: '0.8rem 1rem', color: 'var(--text-muted)', fontWeight: 600, fontSize: '0.8rem' }}>{tr("Estado")}</th>
                                <th style={{ padding: '0.8rem 1rem', color: 'var(--text-muted)', fontWeight: 600, fontSize: '0.8rem' }}>Categoría</th>
                                <th style={{ padding: '0.8rem 1rem', color: 'var(--text-muted)', fontWeight: 600, fontSize: '0.8rem' }}>{tr("Ubicación")}</th>
                                <th style={{ padding: '0.8rem 1rem', color: 'var(--text-muted)', fontWeight: 600, fontSize: '0.8rem' }}>{tr("Acciones")}</th>
                            </tr>
                        </thead>
                        <tbody>
                            {hotels.map(hotel => (
                                <tr key={hotel.id} style={{ borderBottom: '1px solid var(--border-glass)', transition: 'var(--transition-smooth)' }} className="hover-row">
                                    <td style={{ padding: '0.8rem 1rem' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
                                            <div style={{ width: '45px', height: '45px', borderRadius: '10px', background: 'rgba(255,255,255,0.05)', overflow: 'hidden', flexShrink: 0 }}>
                                                {hotel.gallery && hotel.gallery.length > 0 ? (
                                                    <img src={hotel.gallery[0]} alt={hotel.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                                ) : (
                                                    <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                                        <HotelIcon size={20} color="var(--text-muted)" />
                                                    </div>
                                                )}
                                            </div>
                                            <div>
                                                <div style={{ fontWeight: 800, color: 'var(--text-main)', fontSize: '0.95rem' }}>{hotel.name}</div>
                                                <div style={{ display: 'flex', gap: '2px', marginTop: '2px' }}>{renderStars(hotel.stars)}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td style={{ padding: '0.8rem 1rem' }} data-label={tr("Estado")}>
                                        <span style={{ padding: '0.2rem 0.6rem', borderRadius: '15px', fontSize: '0.7rem', fontWeight: 700, background: hotel.status === 'Disponible' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(244, 63, 94, 0.1)', color: hotel.status === 'Disponible' ? '#10b981' : '#f43f5e' }}>
                                            {hotel.status}
                                        </span>
                                    </td>
                                    <td style={{ padding: '0.8rem 1rem' }} data-label="Categoría">
                                        <span style={{ fontWeight: 600, fontSize: '0.8rem' }}>{hotel.category}</span>
                                    </td>
                                    <td style={{ padding: '0.8rem 1rem' }} data-label={tr("Ubicación")}>
                                        <div style={{ fontSize: '0.9rem' }}>{hotel.city}</div>
                                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{hotel.state}</div>
                                    </td>
                                    <td style={{ padding: '0.8rem 1rem' }}>
                                        <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
                                            <button 
                                                onClick={() => { setSelectedHotel(hotel); setShowMapModal(true); }}
                                                className="btn-glass-nav"
                                                style={{ padding: '0.5rem', borderRadius: '8px', color: '#3b82f6' }}
                                                title="Ver en el mapa"
                                            >
                                                <MapPin size={16} />
                                            </button>
                                            <Link href={`/admin/hotels/${hotel.id}/rooms`} className="btn-secondary" style={{ padding: '0.5rem 0.6rem', borderRadius: '8px', textDecoration: 'none', color: 'white', display: 'flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.8rem' }}>
                                                <Bed size={16} /> ({hotel.rooms?.length || 0})
                                            </Link>
                                            <button onClick={() => handleOpenForm(hotel)} className="btn-glass-nav" style={{ padding: '0.5rem', borderRadius: '8px' }} title={tr("Editar")}>
                                                <Edit2 size={16} strokeWidth={2} />
                                            </button>
                                            <button onClick={() => handleDeleteClick(hotel.id, hotel.name)} className="btn-glass-nav" style={{ padding: '0.5rem', borderRadius: '8px', color: '#f43f5e' }} title={tr("Eliminar")}>
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {/* Form Modal */}
            {showFormModal && (
                <div className="modal-overlay" onClick={() => setShowFormModal(false)}>
                    <div className="modal-content glass-panel" onClick={e => e.stopPropagation()} style={{ overflowY: 'auto', padding: '1.5rem' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '1rem' }}>
                            <h2 style={{ margin: 0 }}>{formData.id ? 'Editar Hotel' :tr("Añadir Hotel")}</h2>
                            <button onClick={() => setShowFormModal(false)} className="btn-glass-nav" style={{ border: 'none', padding: '0.3rem' }}><X size={20} /></button>
                        </div>
                        <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                            <h3 style={{ fontSize: '1rem', marginBottom: '0.5rem', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '0.5rem' }}>Datos Generales</h3>
                            <div className="form-grid">
                                <div className="input-group">
                                    <label>Nombre del Hotel</label>
                                    <input required type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
                                </div>
                                <div className="input-group">
                                    <label>Categoría</label>
                                    <select value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})}>
                                        <option value="Estándar">Estándar</option>
                                        <option value="Boutique">Boutique</option>
                                        <option value="Resort">Resort</option>
                                        <option value="Hostal">Hostal</option>
                                        <option value="Cabañas">Cabañas</option>
                                    </select>
                                </div>
                                <div className="input-group">
                                    <label>Estrellas (1-5)</label>
                                    <input required type="number" min="1" max="5" value={formData.stars} onChange={e => setFormData({...formData, stars: parseInt(e.target.value)})} />
                                </div>
                                <div className="input-group">
                                    <label>{tr("Estado")}</label>
                                    <select value={formData.status} onChange={e => setFormData({...formData, status: e.target.value})}>
                                        <option value="Disponible">Disponible</option>
                                        <option value="Mantenimiento">Mantenimiento</option>
                                        <option value="Cerrado">Cerrado</option>
                                    </select>
                                </div>
                            </div>

                            <div className="input-group">
                                <label>Descripción Completa</label>
                                <textarea rows={3} value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})}></textarea>
                            </div>

                            <h3 style={{ fontSize: '1rem', marginTop: '1rem', marginBottom: '0.5rem', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '0.5rem' }}>Ubicación y Contacto</h3>
                            <div className="form-grid">
                                <div className="input-group">
                                    <label>{tr("Ciudad")}</label>
                                    <input required type="text" value={formData.city} onChange={e => setFormData({...formData, city: e.target.value})} />
                                </div>
                                <div className="input-group">
                                    <label>Estado / Región</label>
                                    <input required type="text" value={formData.state} onChange={e => setFormData({...formData, state: e.target.value})} />
                                </div>
                                <div className="input-group" style={{ gridColumn: '1 / -1' }}>
                                    <label>Dirección Exacta</label>
                                    <input type="text" value={formData.address} onChange={e => setFormData({...formData, address: e.target.value})} />
                                </div>
                                <div className="input-group">
                                    <label>Coordenadas (Lat, Lng)</label>
                                    <input type="text" value={formData.coordinates} onChange={e => setFormData({...formData, coordinates: e.target.value})} />
                                </div>
                                <div className="input-group">
                                    <label>{tr("Teléfono")}</label>
                                    <input type="text" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} />
                                </div>
                                <div className="input-group">
                                    <label>Email Contacto</label>
                                    <input type="email" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} />
                                </div>
                            </div>

                            <h3 style={{ fontSize: '1rem', marginTop: '1rem', marginBottom: '0.5rem', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '0.5rem' }}>Políticas y Horarios</h3>
                            <div className="form-grid">
                                <div className="input-group">
                                    <label>Check-In</label>
                                    <input type="time" value={formData.checkInTime} onChange={e => setFormData({...formData, checkInTime: e.target.value})} />
                                </div>
                                <div className="input-group">
                                    <label>Check-Out</label>
                                    <input type="time" value={formData.checkOutTime} onChange={e => setFormData({...formData, checkOutTime: e.target.value})} />
                                </div>
                                <div className="input-group" style={{ gridColumn: '1 / -1' }}>
                                    <label>Políticas del Hotel</label>
                                    <textarea rows={2} value={formData.policies} onChange={e => setFormData({...formData, policies: e.target.value})} placeholder="No fumar, se admiten mascotas..."></textarea>
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
                            </div>

                            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '1rem' }}>
                                <button type="button" onClick={() => setShowFormModal(false)} className="btn-secondary" style={{ padding: '0.8rem 1.5rem', borderRadius: '12px' }}>{tr("Cancelar")}</button>
                                <button type="submit" disabled={saving} className="btn-premium" style={{ padding: '0.8rem 1.5rem', borderRadius: '12px' }}>
                                    {saving ?tr("Guardando...") : tr('Guardar Hotel')}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Map Modal */}
            {showMapModal && selectedHotel && (
                <div className="modal-overlay" onClick={closeModal}>
                    <div className="modal-content glass-panel" onClick={e => e.stopPropagation()} style={{ padding: 0 }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', padding: '1.5rem' }}>
                            <div>
                                <h2 style={{ fontSize: '1.2rem', margin: 0 }}>📍 Ubicación: {selectedHotel.name}</h2>
                                <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', margin: '0.2rem 0 0 0' }}>{selectedHotel.city}, {selectedHotel.state}</p>
                            </div>
                            <button onClick={closeModal} style={{ background: 'none', border: 'none', color: 'white', cursor: 'pointer', padding: '5px' }}>
                                <X size={24} strokeWidth={1.5} />
                            </button>
                        </div>
                        <div style={{ width: '100%', height: '450px', overflow: 'hidden', background: '#05070a' }}>
                            <iframe
                                width="100%"
                                height="100%"
                                frameBorder="0"
                                style={{ border: 0 }}
                                src={`https://maps.google.com/maps?q=${selectedHotel.coordinates}&t=k&z=17&ie=UTF8&iwloc=&output=embed`}
                                allowFullScreen
                            ></iframe>
                        </div>
                        <div style={{ padding: '1.5rem', textAlign: 'right' }}>
                            <button className="btn-premium" style={{ padding: '0.8rem 1.5rem', borderRadius: '12px' }} onClick={closeModal}>{tr("Cerrar Mapa")}</button>
                        </div>
                    </div>
                </div>
            )}

            <ConfirmModal
                isOpen={confirmModalData.isOpen}
                title={tr("Confirmar Eliminación")}
                message={<>{tr("¿Estás seguro de que deseas eliminar el hotel")} <strong>"{confirmModalData.name}"</strong>? {tr("Se eliminarán también todas sus habitaciones. Esta acción no se puede deshacer.")}</>}
                onConfirm={confirmDelete}
                onCancel={() => setConfirmModalData({ isOpen: false, id: null, name: '' })}
            />

            <style jsx>{`
                .modal-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.8); backdrop-filter: blur(5px); display: flex; align-items: center; justify-content: center; z-index: 9999; }
                .modal-content { width: 95%; max-width: 800px; max-height: 90vh; border-radius: 20px; background: #0f1115; }
                .form-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; }
                .input-group { display: flex; flex-direction: column; gap: 0.4rem; }
                .input-group label { font-size: 0.8rem; font-weight: 700; color: rgba(255,255,255,0.6); }
                .input-group input, .input-group select, .input-group textarea { background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1); padding: 0.8rem; border-radius: 10px; color: white; font-family: inherit; }
                
                .hover-row:hover { background: rgba(255, 255, 255, 0.02); }
                @media (max-width: 768px) {
                    .form-grid { grid-template-columns: 1fr; }
                    .responsive-table, .responsive-table tbody, .responsive-table tr, .responsive-table td { display: block; width: 100%; }
                    .responsive-table thead { display: none; }
                    .responsive-table tr { margin-bottom: 1rem; border: 1px solid rgba(255,255,255,0.05) !important; border-radius: 16px; background: rgba(255,255,255,0.01); padding: 1rem; }
                    .responsive-table td { padding: 0.5rem 0 !important; border: none !important; display: flex; justify-content: space-between; align-items: center; }
                    .responsive-table td::before { content: attr(data-label); font-weight: 700; color: var(--text-muted); font-size: 0.8rem; text-transform: uppercase; }
                    .responsive-table td:first-child, .responsive-table td:last-child { justify-content: flex-start; }
                    .responsive-table td:first-child::before, .responsive-table td:last-child::before { display: none; }
                    .responsive-table td:last-child > div { width: 100%; }
                }
            `}</style>
        </div>
    );
}
