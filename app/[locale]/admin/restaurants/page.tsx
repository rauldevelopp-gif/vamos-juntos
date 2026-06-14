'use client';

import { tr } from '@/lib/tr';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowLeft, Plus, MapPin, X, Loader2, Edit2, Trash2, Utensils } from 'lucide-react';
import { getRestaurants, deleteRestaurant } from './actions';
import RestaurantFormModal from './RestaurantFormModal';
import RestaurantExcelUpload from './RestaurantExcelUpload';
import ConfirmModal from '@/components/ConfirmModal';
import { toast } from 'react-hot-toast';

interface Restaurant {
    id: number;
    name: string;
    cuisine: string;
    city: string;
    state: string;
    status: string;
    priceRange: string;
    coordinates: string;
}

export default function RestaurantsPage() {
    const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedRestaurant, setSelectedRestaurant] = useState<Restaurant | null>(null);
    const [formModalOpen, setFormModalOpen] = useState(false);
    const [editRestaurant, setEditRestaurant] = useState<Restaurant | null>(null);

    const [confirmModalData, setConfirmModalData] = useState<{ isOpen: boolean, id: number | null, name: string }>({ isOpen: false, id: null, name: '' });

    const fetchRestaurants = async () => {
        setLoading(true);
        const result = await getRestaurants();
        if (result.success && result.data) {
            setRestaurants(result.data);
        }
        setLoading(false);
    };

    useEffect(() => {
        fetchRestaurants();
    }, []);

    const confirmDelete = (id: number, name: string) => {
        setConfirmModalData({ isOpen: true, id, name });
    };

    const executeDelete = async () => {
        if (!confirmModalData.id) return;
        const idToDelete = confirmModalData.id;
        setConfirmModalData({ isOpen: false, id: null, name: '' });
        
        const loadingToast = toast.loading('Eliminando...');
        const res = await deleteRestaurant(idToDelete);
        
        if (res.success) {
            toast.success('Restaurante eliminado exitosamente', { id: loadingToast });
            fetchRestaurants();
        } else {
            toast.error(res.error || 'Error al eliminar', { id: loadingToast });
        }
    };

    const closeModal = () => setSelectedRestaurant(null);

    return (
        <div className="container" style={{ padding: '2rem', animation: 'fadeIn 0.5s ease' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <Link href="/admin" className="btn-glass-nav" style={{ padding: '0.8rem', borderRadius: '12px' }}>
                        <ArrowLeft size={20} />
                    </Link>
                    <div>
                        <h1 style={{ fontSize: '2.5rem', fontWeight: 800, margin: 0 }} className="text-gradient">{tr("Restaurantes")}</h1>
                        <p style={{ color: 'var(--text-muted)', margin: '0.2rem 0 0 0' }}>{tr("Gestiona restaurantes y ofertas culinarias")}</p>
                    </div>
                </div>
                
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <RestaurantExcelUpload onSuccess={fetchRestaurants} />
                    <button onClick={() => { setEditRestaurant(null); setFormModalOpen(true); }} className="btn-premium" style={{ padding: '0.8rem 1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <Plus size={18} strokeWidth={2.5} />
                        <span className="btn-text-mobile-hide">{tr("Nuevo Restaurante")}</span>
                    </button>
                </div>
            </div>

            {/* Desktop View */}
            <div className="desktop-only" style={{ background: 'rgba(5, 7, 10, 0.6)', border: '1px solid var(--border-glass)', borderRadius: '24px', overflow: 'hidden' }}>
                {loading ? (
                    <div style={{ padding: '4rem', textAlign: 'center', color: 'var(--text-muted)' }}>
                        <Loader2 size={40} className="animate-spin" style={{ margin: '0 auto 1rem', color: 'var(--primary)' }} />
                        Cargando restaurantes...
                    </div>
                ) : restaurants.length === 0 ? (
                    <div style={{ padding: '4rem', textAlign: 'center', color: 'var(--text-muted)' }}>
                        <Utensils size={48} style={{ margin: '0 auto 1rem', opacity: 0.2 }} />
                        No hay restaurantes registrados. Comienza agregando uno nuevo.
                    </div>
                ) : (
                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                        <thead>
                            <tr style={{ background: 'rgba(255, 255, 255, 0.02)', borderBottom: '1px solid var(--border-glass)' }}>
                                <th style={{ padding: '1.5rem', textAlign: 'left', color: 'var(--text-muted)', fontWeight: 600 }}>Nombre</th>
                                <th style={{ padding: '1.5rem', textAlign: 'left', color: 'var(--text-muted)', fontWeight: 600 }}>Tipo de Cocina</th>
                                <th style={{ padding: '1.5rem', textAlign: 'left', color: 'var(--text-muted)', fontWeight: 600 }}>Ubicación</th>
                                <th style={{ padding: '1.5rem', textAlign: 'center', color: 'var(--text-muted)', fontWeight: 600 }}>Rango Precio</th>
                                <th style={{ padding: '1.5rem', textAlign: 'left', color: 'var(--text-muted)', fontWeight: 600 }}>Estado</th>
                                <th style={{ padding: '1.5rem', textAlign: 'right', color: 'var(--text-muted)', fontWeight: 600 }}>Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {restaurants.map((restaurant) => (
                                <tr key={restaurant.id} className="hover-row" style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.05)', transition: 'background 0.2s' }}>
                                    <td style={{ padding: '1.5rem', fontWeight: 600 }}>{restaurant.name}</td>
                                    <td style={{ padding: '1.5rem', color: 'var(--text-muted)' }}>{restaurant.cuisine}</td>
                                    <td style={{ padding: '1.5rem', color: 'var(--text-muted)' }}>{restaurant.city}, {restaurant.state}</td>
                                    <td style={{ padding: '1.5rem', textAlign: 'center' }}>
                                        <span style={{
                                            background: 'rgba(255,255,255,0.05)', padding: '0.3rem 0.8rem', borderRadius: '12px', fontSize: '0.85rem'
                                        }}>
                                            {restaurant.priceRange}
                                        </span>
                                    </td>
                                    <td style={{ padding: '1.5rem' }}>
                                        <span style={{
                                            padding: '0.4rem 0.8rem', borderRadius: '20px', fontSize: '0.85rem', fontWeight: 600,
                                            background: restaurant.status === 'Abierto' ? 'rgba(16, 185, 129, 0.1)' : 
                                                        restaurant.status === 'Cerrado' ? 'rgba(244, 63, 94, 0.1)' : 'rgba(245, 158, 11, 0.1)',
                                            color: restaurant.status === 'Abierto' ? '#10b981' : 
                                                   restaurant.status === 'Cerrado' ? '#f43f5e' : '#f59e0b'
                                        }}>
                                            {restaurant.status}
                                        </span>
                                    </td>
                                    <td style={{ padding: '1.5rem' }}>
                                        <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
                                            <button onClick={() => setSelectedRestaurant(restaurant)} className="btn-glass-nav" style={{ padding: '0.5rem', borderRadius: '10px', width: '36px', height: '36px', display: 'flex', alignItems: 'center', justifyContent: 'center' }} title="Ver Mapa">
                                                <MapPin size={16} strokeWidth={2} />
                                            </button>
                                            <button onClick={() => { setEditRestaurant(restaurant); setFormModalOpen(true); }} className="btn-glass-nav" style={{ padding: '0.5rem', borderRadius: '10px', width: '36px', height: '36px', display: 'flex', alignItems: 'center', justifyContent: 'center' }} title="Editar">
                                                <Edit2 size={16} strokeWidth={2} />
                                            </button>
                                            <button onClick={() => confirmDelete(restaurant.id, restaurant.name)} className="btn-glass-nav" style={{ padding: '0.5rem', borderRadius: '10px', width: '36px', height: '36px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#f43f5e' }} title="Eliminar">
                                                <Trash2 size={16} strokeWidth={2} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>

            {/* Mobile View */}
            <div className="mobile-only" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {loading ? (
                    <div style={{ padding: '2rem', textAlign: 'center' }}><Loader2 className="animate-spin" style={{ margin: '0 auto' }} /></div>
                ) : restaurants.length === 0 ? (
                    <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)' }}>No hay restaurantes registrados.</div>
                ) : (
                    restaurants.map((restaurant) => (
                        <div key={restaurant.id} className="restaurant-card-mobile" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                <div>
                                    <h3 style={{ margin: '0 0 0.3rem 0', fontSize: '1.3rem', fontWeight: 700 }}>{restaurant.name}</h3>
                                    <p style={{ margin: 0, color: 'var(--text-muted)', fontSize: '0.9rem' }}>{restaurant.city}, {restaurant.state}</p>
                                    <span style={{ display: 'inline-block', marginTop: '0.5rem', fontSize: '0.85rem', color: 'var(--primary)' }}>{restaurant.cuisine} • {restaurant.priceRange}</span>
                                </div>
                            </div>
                            
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '0.5rem', paddingTop: '1rem', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
                                <span style={{
                                    padding: '0.3rem 0.6rem', borderRadius: '12px', fontSize: '0.8rem', fontWeight: 600,
                                    background: restaurant.status === 'Abierto' ? 'rgba(16, 185, 129, 0.1)' : 
                                                restaurant.status === 'Cerrado' ? 'rgba(244, 63, 94, 0.1)' : 'rgba(245, 158, 11, 0.1)',
                                    color: restaurant.status === 'Abierto' ? '#10b981' : 
                                           restaurant.status === 'Cerrado' ? '#f43f5e' : '#f59e0b'
                                }}>
                                    {restaurant.status}
                                </span>
                                <div style={{ display: 'flex', gap: '0.5rem' }}>
                                    <button onClick={() => { setEditRestaurant(restaurant); setFormModalOpen(true); }} className="btn-glass-nav" style={{ padding: '0.5rem', borderRadius: '12px' }}>
                                        <Edit2 size={16} />
                                    </button>
                                    <button onClick={() => confirmDelete(restaurant.id, restaurant.name)} className="btn-glass-nav" style={{ padding: '0.5rem', borderRadius: '12px', color: '#f43f5e' }}>
                                        <Trash2 size={16} />
                                    </button>
                                    <button onClick={() => setSelectedRestaurant(restaurant)} className="btn-premium" style={{ padding: '0.6rem 1rem', borderRadius: '14px', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                                        <MapPin size={16} /> Mapa
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>

            {/* Map Modal */}
            {selectedRestaurant && (
                <div className="modal-overlay" onClick={closeModal}>
                    <div className="modal-content glass-panel" onClick={e => e.stopPropagation()} style={{ background: 'var(--bg-card)', border: '1px solid var(--border-glass)' }}>
                        <div style={{ padding: '1.5rem', borderBottom: '1px solid rgba(255,255,255,0.1)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <div>
                                <h3 style={{ margin: 0, fontSize: '1.4rem' }}>{selectedRestaurant.name}</h3>
                                <p style={{ margin: 0, color: 'var(--text-muted)', fontSize: '0.9rem' }}>{selectedRestaurant.city} - {selectedRestaurant.status}</p>
                            </div>
                            <button className="btn-glass-nav" onClick={closeModal} style={{ padding: '0.5rem', borderRadius: '50%' }}><X size={20} /></button>
                        </div>
                        <div style={{ width: '100%', height: '450px', borderRadius: '0 0 25px 25px', overflow: 'hidden', background: '#05070a' }}>
                            <iframe width="100%" height="100%" frameBorder="0" style={{ border: 0 }} src={`https://maps.google.com/maps?q=${selectedRestaurant.coordinates}&t=k&z=15&ie=UTF8&iwloc=&output=embed`} allowFullScreen></iframe>
                        </div>
                    </div>
                </div>
            )}

            {formModalOpen && (
                <RestaurantFormModal 
                    restaurant={editRestaurant} 
                    onClose={() => setFormModalOpen(false)} 
                    onSuccess={() => {
                        setFormModalOpen(false);
                        fetchRestaurants();
                    }} 
                />
            )}

            <ConfirmModal
                isOpen={confirmModalData.isOpen}
                title="Confirmar Eliminación"
                message={<>¿Estás seguro de que deseas eliminar el restaurante <strong>&quot;{confirmModalData.name}&quot;</strong>? Esta acción no se puede deshacer.</>}
                onConfirm={executeDelete}
                onCancel={() => setConfirmModalData({ isOpen: false, id: null, name: '' })}
                confirmText="Eliminar"
                cancelText="Cancelar"
                isDestructive={true}
            />

            <style jsx>{`
                @media (max-width: 768px) {
                    .desktop-only { display: none !important; }
                    .mobile-only { display: block !important; }
                }
                @media (min-width: 769px) {
                    .desktop-only { display: block !important; }
                    .mobile-only { display: none !important; }
                }
                .hover-row:hover { background: rgba(255, 255, 255, 0.02); }
                .restaurant-card-mobile {
                    padding: 1.5rem;
                    border-radius: 24px;
                    border: 1px solid rgba(255, 255, 255, 0.1) !important;
                    background: rgba(255, 255, 255, 0.03) !important;
                }
                .modal-overlay {
                    position: fixed; top: 0; left: 0; right: 0; bottom: 0;
                    background: rgba(0, 0, 0, 0.85); backdrop-filter: blur(12px);
                    display: flex; align-items: center; justify-content: center;
                    z-index: 9999; animation: fadeIn 0.3s ease;
                }
                .modal-content {
                    width: 90%; max-width: 800px; border-radius: 25px; padding: 0;
                    animation: slideUp 0.4s cubic-bezier(0.4, 0, 0.2, 1);
                }
                @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
                @keyframes slideUp { from { transform: translateY(30px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
            `}</style>
        </div>
    );
}
