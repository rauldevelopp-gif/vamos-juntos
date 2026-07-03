'use client';

import { tr, setLanguage } from '@/lib/tr';
import { useState, useEffect } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import Link from 'next/link';
import { ArrowLeft, Plus, MapPin, Loader2, Edit2, Trash2, Plane } from 'lucide-react';
import { getAirports, deleteAirport } from './actions';
import AirportFormModal from './AirportFormModal';
import AirportExcelUpload from './AirportExcelUpload';
import ConfirmModal from '@/components/ConfirmModal';
import { toast } from 'react-hot-toast';

interface Airport {
    id: number;
    name: string;
    location: string;
    iata: string;
    city: string;
    state: string;
    status: string;
    coordinates: string;
}

export default function AirportsPage() {
    const { language } = useLanguage();
    setLanguage(language);
    const [airports, setAirports] = useState<Airport[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedAirport, setSelectedAirport] = useState<Airport | null>(null);
    const [formModalOpen, setFormModalOpen] = useState(false);
    const [editAirport, setEditAirport] = useState<Airport | null>(null);

    const [confirmModalData, setConfirmModalData] = useState<{ isOpen: boolean, id: number | null, name: string }>({ isOpen: false, id: null, name: '' });

    const fetchAirports = async () => {
        setLoading(true);
        const result = await getAirports();
        if (result.success && result.data) {
            setAirports(result.data);
        }
        setLoading(false);
    };

    useEffect(() => {
        fetchAirports();
    }, []);

    const confirmDelete = (id: number, name: string) => {
        setConfirmModalData({ isOpen: true, id, name });
    };

    const executeDelete = async () => {
        if (!confirmModalData.id) return;
        const idToDelete = confirmModalData.id;
        setConfirmModalData({ isOpen: false, id: null, name: '' });
        
        const loadingToast = toast.loading('Eliminando...');
        const res = await deleteAirport(idToDelete);
        
        if (res.success) {
            toast.success('Aeropuerto eliminado exitosamente', { id: loadingToast });
            fetchAirports();
        } else {
            toast.error(res.error || 'Error al eliminar', { id: loadingToast });
        }
    };

    const closeModal = () => setSelectedAirport(null);

    return (
        <div className="container" style={{ padding: '2rem', animation: 'fadeIn 0.5s ease' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <Link href="/admin" className="btn-glass-nav" style={{ padding: '0.8rem', borderRadius: '12px' }}>
                        <ArrowLeft size={20} />
                    </Link>
                    <div>
                        <h1 style={{ fontSize: '2.5rem', fontWeight: 800, margin: 0 }} className="text-gradient">{tr("Aeropuertos")}</h1>
                        <p style={{ color: 'var(--text-muted)', margin: '0.2rem 0 0 0' }}>
                            {tr("Gestiona terminales aéreas para traslados")}
                        </p>
                    </div>
                </div>
                
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <AirportExcelUpload onSuccess={fetchAirports} />
                    <button onClick={() => { setEditAirport(null); setFormModalOpen(true); }} className="btn-premium" style={{ padding: '0.8rem 1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <Plus size={18} strokeWidth={2.5} />
                        <span className="btn-text-mobile-hide">{tr("Nuevo Aeropuerto")}</span>
                    </button>
                </div>
            </div>

            {/* Desktop View */}
            <div className="desktop-only" style={{ background: 'rgba(5, 7, 10, 0.6)', border: '1px solid var(--border-glass)', borderRadius: '24px', overflow: 'hidden' }}>
                {loading ? (
                    <div style={{ padding: '4rem', textAlign: 'center', color: 'var(--text-muted)' }}>
                        <Loader2 size={40} className="animate-spin" style={{ margin: '0 auto 1rem', color: 'var(--primary)' }} />
                        Cargando aeropuertos...
                    </div>
                ) : airports.length === 0 ? (
                    <div style={{ padding: '4rem', textAlign: 'center', color: 'var(--text-muted)' }}>
                        <Plane size={48} style={{ margin: '0 auto 1rem', opacity: 0.2 }} />
                        No hay aeropuertos registrados. Comienza agregando uno nuevo.
                    </div>
                ) : (
                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                        <thead>
                            <tr style={{ background: 'rgba(255, 255, 255, 0.02)', borderBottom: '1px solid var(--border-glass)' }}>
                                <th style={{ padding: '1.5rem', textAlign: 'left', color: 'var(--text-muted)', fontWeight: 600 }}>IATA</th>
                                <th style={{ padding: '1.5rem', textAlign: 'left', color: 'var(--text-muted)', fontWeight: 600 }}>Nombre</th>
                                <th style={{ padding: '1.5rem', textAlign: 'left', color: 'var(--text-muted)', fontWeight: 600 }}>Ubicación</th>
                                <th style={{ padding: '1.5rem', textAlign: 'left', color: 'var(--text-muted)', fontWeight: 600 }}>Estado</th>
                                <th style={{ padding: '1.5rem', textAlign: 'right', color: 'var(--text-muted)', fontWeight: 600 }}>Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {airports.map((airport) => (
                                <tr key={airport.id} className="hover-row" style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.05)', transition: 'background 0.2s' }}>
                                    <td style={{ padding: '1.5rem' }}>
                                        <span style={{ background: 'rgba(255,255,255,0.1)', padding: '0.4rem 0.8rem', borderRadius: '8px', fontWeight: 700, letterSpacing: '0.05em' }}>
                                            {airport.iata}
                                        </span>
                                    </td>
                                    <td style={{ padding: '1.5rem', fontWeight: 600 }}>{airport.name}</td>
                                    <td style={{ padding: '1.5rem', color: 'var(--text-muted)' }}>{airport.city}, {airport.state}</td>
                                    <td style={{ padding: '1.5rem' }}>
                                        <span style={{
                                            padding: '0.4rem 0.8rem', borderRadius: '20px', fontSize: '0.85rem', fontWeight: 600,
                                            background: airport.status === 'Operativo' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(245, 158, 11, 0.1)',
                                            color: airport.status === 'Operativo' ? '#10b981' : '#f59e0b'
                                        }}>
                                            {airport.status}
                                        </span>
                                    </td>
                                    <td style={{ padding: '1.5rem' }}>
                                        <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
                                            <button onClick={() => setSelectedAirport(airport)} className="btn-glass-nav" style={{ padding: '0.5rem', borderRadius: '10px', width: '36px', height: '36px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                                <MapPin size={16} strokeWidth={2} />
                                            </button>
                                            <button onClick={() => { setEditAirport(airport); setFormModalOpen(true); }} className="btn-glass-nav" style={{ padding: '0.5rem', borderRadius: '10px', width: '36px', height: '36px', display: 'flex', alignItems: 'center', justifyContent: 'center' }} title="Editar">
                                                <Edit2 size={16} strokeWidth={2} />
                                            </button>
                                            <button onClick={() => confirmDelete(airport.id, airport.name)} className="btn-glass-nav" style={{ padding: '0.5rem', borderRadius: '10px', width: '36px', height: '36px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#f43f5e' }} title="Eliminar">
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
                ) : airports.length === 0 ? (
                    <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)' }}>No hay aeropuertos registrados.</div>
                ) : (
                    airports.map((airport) => (
                        <div key={airport.id} className="airport-card-mobile" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                <div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                                        <span style={{ background: 'rgba(255,255,255,0.1)', padding: '0.2rem 0.6rem', borderRadius: '6px', fontWeight: 700, fontSize: '0.8rem' }}>
                                            {airport.iata}
                                        </span>
                                        <h3 style={{ margin: 0, fontSize: '1.2rem', fontWeight: 700 }}>{airport.name}</h3>
                                    </div>
                                    <p style={{ margin: 0, color: 'var(--text-muted)', fontSize: '0.9rem' }}>{airport.city}, {airport.state}</p>
                                </div>
                            </div>
                            
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '0.5rem', paddingTop: '1rem', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
                                <span style={{
                                    padding: '0.3rem 0.6rem', borderRadius: '12px', fontSize: '0.8rem', fontWeight: 600,
                                    background: airport.status === 'Operativo' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(245, 158, 11, 0.1)',
                                    color: airport.status === 'Operativo' ? '#10b981' : '#f59e0b'
                                }}>
                                    {airport.status}
                                </span>
                                <div style={{ display: 'flex', gap: '0.5rem' }}>
                                    <button onClick={() => { setEditAirport(airport); setFormModalOpen(true); }} className="btn-glass-nav" style={{ padding: '0.5rem', borderRadius: '12px' }}>
                                        <Edit2 size={16} />
                                    </button>
                                    <button onClick={() => confirmDelete(airport.id, airport.name)} className="btn-glass-nav" style={{ padding: '0.5rem', borderRadius: '12px', color: '#f43f5e' }}>
                                        <Trash2 size={16} />
                                    </button>
                                    <button onClick={() => setSelectedAirport(airport)} className="btn-premium" style={{ padding: '0.6rem 1rem', borderRadius: '14px', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                                        <MapPin size={16} /> Mapa
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>

            {/* Map Modal */}
            {selectedAirport && (
                <div className="modal-overlay" onClick={closeModal}>
                    <div className="modal-content glass-panel" onClick={e => e.stopPropagation()} style={{ background: 'var(--bg-card)', border: '1px solid var(--border-glass)' }}>
                        <div style={{ padding: '1.5rem', borderBottom: '1px solid rgba(255,255,255,0.1)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <div>
                                <h3 style={{ margin: 0, fontSize: '1.4rem' }}>{selectedAirport.name}</h3>
                                <p style={{ margin: 0, color: 'var(--text-muted)', fontSize: '0.9rem' }}>{selectedAirport.city}</p>
                            </div>
                            <button className="btn-glass-nav" onClick={closeModal} style={{ padding: '0.5rem', borderRadius: '50%' }}><X size={20} /></button>
                        </div>
                        <div style={{ width: '100%', height: '450px', borderRadius: '0 0 25px 25px', overflow: 'hidden', background: '#05070a' }}>
                            <iframe width="100%" height="100%" frameBorder="0" style={{ border: 0 }} src={`https://maps.google.com/maps?q=${selectedAirport.coordinates}&t=k&z=15&ie=UTF8&iwloc=&output=embed`} allowFullScreen></iframe>
                        </div>
                    </div>
                </div>
            )}

            {formModalOpen && (
                <AirportFormModal 
                    airport={editAirport} 
                    onClose={() => setFormModalOpen(false)} 
                    onSuccess={() => {
                        setFormModalOpen(false);
                        fetchAirports();
                    }} 
                />
            )}

            <ConfirmModal
                isOpen={confirmModalData.isOpen}
                title="Confirmar Eliminación"
                message={<>¿Estás seguro de que deseas eliminar el aeropuerto <strong>&quot;{confirmModalData.name}&quot;</strong>? Esta acción no se puede deshacer.</>}
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
                .airport-card-mobile {
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
