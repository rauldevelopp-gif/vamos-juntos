'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { 
    ArrowLeft, Plus, User, Briefcase, X, Star, Car,
    Music, Wind, Dog, Cigarette, GlassWater, Wifi, Smartphone, Loader2,
    QrCode, Download
} from 'lucide-react';
import { getTaxis } from './actions';
import { useRef } from 'react';
import { QRCodeCanvas } from 'qrcode.react';
import { toPng } from 'html-to-image';

interface Driver {
    id: number;
    name: string;
    phone: string;
    license: string;
    expiration: string | null;
    rating: number;
    photo: string | null;
}

interface Taxi {
    id: number;
    plate: string;
    brand: string;
    model: string;
    year: number;
    color: string;
    type: string;
    passengers: number;
    luggage: number;
    amenities: string[];
    status: string;
    driver: Driver;
}

export default function TaxisPage() {
    const [fleet, setFleet] = useState<Taxi[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedTaxi, setSelectedTaxi] = useState<Taxi | null>(null);
    const [qrTaxi, setQrTaxi] = useState<Taxi | null>(null);

    useEffect(() => {
        const fetchFleet = async () => {
            const result = await getTaxis();
            if (result.success && result.data) {
                // @ts-expect-error - Result data is compatible with Taxi[]
                setFleet(result.data);
            }
            setLoading(false);
        };
        fetchFleet();
    }, []);

    const getAmenityIcon = (amenity: string) => {
        const icons: Record<string, React.ElementType> = {
            'Música': Music, 'A/C': Wind, 'Mascotas': Dog, 'Fumar': Cigarette, 
            'Bar': GlassWater, 'Bebidas': GlassWater, 'WiFi': Wifi, 'Equipaje Extra': Briefcase
        };
        const Icon = icons[amenity] || Smartphone;
        return <Icon size={16} />;
    };

    const closeModal = () => setSelectedTaxi(null);

    return (
        <div style={{ padding: '1rem', maxWidth: '1200px', margin: '0 auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2.5rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <Link href="/admin" className="btn-glass-nav" style={{ width: '40px', height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '12px', textDecoration: 'none', padding: 0 }}>
                        <ArrowLeft size={20} strokeWidth={2} />
                    </Link>
                    <div>
                        <h1 style={{ fontSize: '1.8rem', fontWeight: 800, margin: 0 }} className="text-gradient">
                            Gestión de Flota (VIP)
                        </h1>
                        <p style={{ color: 'var(--text-muted)', margin: '0.5rem 0 0 0' }}>
                            Control de vehículos, servicios y perfiles de choferes.
                        </p>
                    </div>
                </div>
                
                <button className="btn-premium" style={{ padding: '0.8rem 1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <Plus size={18} strokeWidth={2.5} />
                    <span className="btn-text-mobile-hide">Nuevo Vehículo</span>
                </button>
            </div>

            {/* Desktop View */}
            <div className="desktop-only" style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid var(--border-glass)', borderRadius: '24px', overflow: 'hidden', minHeight: '300px' }}>
                {loading ? (
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '6rem', color: 'var(--text-muted)' }}>
                        <Loader2 className="animate-spin" size={32} style={{ marginBottom: '1rem', color: 'var(--primary)' }} />
                        <p>Sincronizando flota...</p>
                    </div>
                ) : fleet.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '6rem' }}>
                        <div style={{ width: '80px', height: '80px', borderRadius: '50%', background: 'rgba(255,255,255,0.02)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem' }}>
                            <Car size={32} color="var(--text-muted)" />
                        </div>
                        <h3>No hay vehículos registrados</h3>
                        <p style={{ color: 'var(--text-muted)' }}>Los nuevos vehículos aparecerán aquí.</p>
                    </div>
                ) : (
                    <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                        <thead>
                            <tr style={{ background: 'rgba(255,255,255,0.03)', borderBottom: '1px solid var(--border-glass)' }}>
                                <th style={{ padding: '1.2rem', color: 'var(--text-muted)', fontWeight: 600, fontSize: '0.9rem' }}>Vehículo / Placa</th>
                                <th style={{ padding: '1.2rem', color: 'var(--text-muted)', fontWeight: 600, fontSize: '0.9rem' }}>Chofer</th>
                                <th style={{ padding: '1.2rem', color: 'var(--text-muted)', fontWeight: 600, fontSize: '0.9rem' }}>Amenidades</th>
                                <th style={{ padding: '1.2rem', color: 'var(--text-muted)', fontWeight: 600, fontSize: '0.9rem' }}>Estado</th>
                                <th style={{ padding: '1.2rem', color: 'var(--text-muted)', fontWeight: 600, fontSize: '0.9rem' }}>Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {fleet.map((taxi) => (
                                <tr key={taxi.id} className="hover-row" style={{ borderBottom: '1px solid var(--border-glass)', transition: 'var(--transition-smooth)' }}>
                                    <td style={{ padding: '1.5rem 1.2rem' }}>
                                        <div style={{ fontWeight: 700, color: 'var(--text-main)', fontSize: '1.1rem' }}>{taxi.plate}</div>
                                        <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
                                            {taxi.brand} {taxi.model} ({taxi.year})
                                        </div>
                                    </td>
                                    <td style={{ padding: '1.5rem 1.2rem' }}>
                                        {taxi.driver ? (
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                                <div style={{ width: '42px', height: '42px', borderRadius: '50%', overflow: 'hidden', border: '2px solid var(--border-glass)', position: 'relative' }}>
                                                    <Image 
                                                        src={taxi.driver.photo || 'https://ui-avatars.com/api/?name=' + encodeURIComponent(taxi.driver.name)} 
                                                        alt={taxi.driver.name} 
                                                        fill
                                                        style={{ objectFit: 'cover' }}
                                                        unoptimized 
                                                    />
                                                </div>
                                                <div>
                                                    <div style={{ fontWeight: 600, fontSize: '0.95rem' }}>{taxi.driver.name}</div>
                                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.8rem', color: '#f59e0b' }}>
                                                        <Star size={12} fill="#f59e0b" strokeWidth={0} /> {taxi.driver.rating.toFixed(1)}
                                                    </div>
                                                </div>
                                            </div>
                                        ) : 'Sin asignar'}
                                    </td>
                                    <td style={{ padding: '1.5rem 1.2rem' }}>
                                        <div style={{ display: 'flex', gap: '0.6rem', flexWrap: 'wrap' }}>
                                            {taxi.amenities.map(amenity => (
                                                <div key={amenity} style={{ color: 'var(--text-muted)' }} title={amenity}>{getAmenityIcon(amenity)}</div>
                                            ))}
                                        </div>
                                    </td>
                                    <td style={{ padding: '1.5rem 1.2rem' }}>
                                        <span style={{ 
                                            padding: '0.4rem 0.8rem', borderRadius: '10px', fontSize: '0.8rem', fontWeight: 600,
                                            background: taxi.status === 'Disponible' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(59, 130, 246, 0.1)',
                                            color: taxi.status === 'Disponible' ? '#10b981' : '#3b82f6'
                                        }}>
                                            {taxi.status}
                                        </span>
                                    </td>
                                    <td style={{ padding: '1.5rem 1.2rem' }}>
                                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                                            <button onClick={() => setSelectedTaxi(taxi)} className="btn-glass-nav" style={{ padding: '0.6rem 1rem', borderRadius: '12px' }}>
                                                Detalles
                                            </button>
                                            <button onClick={() => setQrTaxi(taxi)} className="btn-glass-nav" style={{ padding: '0.6rem', borderRadius: '12px', color: '#8b5cf6' }} title="Generar QR Sticker">
                                                <QrCode size={18} />
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
            <div className="mobile-only">
                {loading ? (
                    <div style={{ textAlign: 'center', padding: '4rem' }}>
                        <Loader2 className="animate-spin" size={32} style={{ margin: '0 auto 1rem', color: 'var(--primary)' }} />
                        <p style={{ color: 'var(--text-muted)' }}>Sincronizando flota...</p>
                    </div>
                ) : fleet.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '6rem' }}>
                        <div style={{ width: '80px', height: '80px', borderRadius: '50%', background: 'rgba(255,255,255,0.02)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem' }}>
                            <Car size={32} color="var(--text-muted)" />
                        </div>
                        <h3>No hay vehículos registrados</h3>
                        <p style={{ color: 'var(--text-muted)' }}>Los nuevos vehículos aparecerán aquí.</p>
                    </div>
                ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem', padding: '0.5rem 0' }}>
                        {fleet.map((taxi) => (
                            <div key={taxi.id} className="taxi-card-mobile">
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.2rem' }}>
                                    <div>
                                        <div style={{ fontWeight: 800, fontSize: '1.3rem', color: 'var(--text-main)', marginBottom: '0.2rem' }}>{taxi.plate}</div>
                                        <div style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>{taxi.brand} {taxi.model} ({taxi.year})</div>
                                    </div>
                                    <span style={{ 
                                        padding: '0.4rem 0.8rem', borderRadius: '10px', fontSize: '0.75rem', fontWeight: 700,
                                        background: taxi.status === 'Disponible' ? 'rgba(16, 185, 129, 0.1)' : '#3b82f61a',
                                        color: taxi.status === 'Disponible' ? '#10b981' : '#3b82f6'
                                    }}>
                                        {taxi.status}
                                    </span>
                                </div>

                                <div style={{ background: 'rgba(255,255,255,0.03)', borderRadius: '20px', padding: '1.2rem', marginBottom: '1.2rem', border: '1px solid var(--border-glass)' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
                                        <div style={{ width: '50px', height: '50px', borderRadius: '50%', overflow: 'hidden', border: '2px solid var(--primary)', position: 'relative' }}>
                                            <Image 
                                                src={taxi.driver.photo || ''} 
                                                alt={taxi.driver.name} 
                                                fill
                                                style={{ objectFit: 'cover' }}
                                                unoptimized 
                                            />
                                        </div>
                                        <div>
                                            <div style={{ fontWeight: 700, fontSize: '1rem' }}>{taxi.driver.name}</div>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.85rem', color: '#f59e0b' }}>
                                                <Star size={14} fill="#f59e0b" strokeWidth={0} /> {taxi.driver.rating}
                                            </div>
                                        </div>
                                    </div>
                                    
                                    <div style={{ display: 'flex', gap: '0.8rem', flexWrap: 'wrap', borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '1rem' }}>
                                        {taxi.amenities.map(amenity => (
                                            <div key={amenity} style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', background: 'rgba(255,255,255,0.05)', padding: '0.4rem 0.8rem', borderRadius: '10px', fontSize: '0.75rem' }}>
                                                {getAmenityIcon(amenity)} {amenity}
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <div style={{ display: 'flex', gap: '0.8rem', marginTop: '1rem' }}>
                                    <button onClick={() => setSelectedTaxi(taxi)} className="btn-premium" style={{ flex: 1, padding: '0.9rem', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.6rem' }}>
                                        <User size={18} /> Perfil
                                    </button>
                                    <button onClick={() => setQrTaxi(taxi)} className="btn-glass-nav" style={{ padding: '0.9rem', borderRadius: '16px', color: '#8b5cf6', width: '50px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                        <QrCode size={20} />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {selectedTaxi && (
                <div className="modal-overlay" onClick={closeModal}>
                    <div className="modal-content glass-panel" onClick={e => e.stopPropagation()} style={{ maxWidth: '450px' }}>
                        <div style={{ position: 'relative', height: '120px', background: 'linear-gradient(135deg, var(--primary), var(--secondary))', borderTopLeftRadius: '25px', borderTopRightRadius: '25px' }}>
                            <button onClick={closeModal} style={{ position: 'absolute', top: '15px', right: '15px', background: 'rgba(0,0,0,0.2)', border: 'none', color: 'white', borderRadius: '50%', width: '32px', height: '32px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <X size={18} strokeWidth={2} />
                            </button>
                        </div>
                        
                        <div style={{ textAlign: 'center', marginTop: '-60px', padding: '0 2rem 2rem 2rem', position: 'relative', zIndex: 10 }}>
                            <div style={{ 
                                width: '120px', height: '120px', borderRadius: '50%', border: '4px solid #05070a', 
                                overflow: 'hidden', margin: '0 auto', boxShadow: '0 10px 25px rgba(0,0,0,0.6)', position: 'relative', background: '#111'
                            }}>
                                <Image 
                                    src={selectedTaxi.driver.photo || ''} 
                                    alt={selectedTaxi.driver.name} 
                                    fill
                                    style={{ objectFit: 'cover' }}
                                    unoptimized 
                                />
                            </div>
                            
                            <h2 style={{ fontSize: '1.5rem', margin: '1rem 0 0.25rem 0' }}>{selectedTaxi.driver.name}</h2>
                             <div style={{ display: 'flex', justifyContent: 'center', gap: '2px', marginBottom: '1.5rem' }}>
                                {Array(5).fill(0).map((_, i) => (
                                    <Star key={i} size={14} fill={i < Math.floor(selectedTaxi.driver.rating) ? '#f59e0b' : 'none'} color={i < Math.floor(selectedTaxi.driver.rating) ? '#f59e0b' : 'var(--text-muted)'} strokeWidth={2} />
                                ))}
                                <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginLeft: '5px' }}>({selectedTaxi.driver.rating})</span>
                            </div>

                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', textAlign: 'left', background: 'rgba(255,255,255,0.03)', padding: '1.5rem', borderRadius: '15px', border: '1px solid var(--border-glass)' }}>
                                <div>
                                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>ID Chofer</div>
                                    <div style={{ fontWeight: 600 }}>#{selectedTaxi.driver.id}</div>
                                </div>
                                <div>
                                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Licencia</div>
                                    <div style={{ fontWeight: 600 }}>{selectedTaxi.driver.license}</div>
                                </div>
                                <div>
                                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Teléfono</div>
                                    <div style={{ fontWeight: 600 }}>{selectedTaxi.driver.phone}</div>
                                </div>
                                <div>
                                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Expira</div>
                                    <div style={{ fontWeight: 600, color: '#f43f5e' }}>{selectedTaxi.driver.expiration}</div>
                                </div>
                            </div>
                            
                            <button className="btn-premium" style={{ width: '100%', marginTop: '2rem' }} onClick={closeModal}>Cerrar Ficha</button>
                        </div>
                    </div>
                </div>
            )}

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
                .taxi-card-mobile {
                    padding: 1.5rem;
                    border-radius: 24px;
                    border: 1px solid rgba(255, 255, 255, 0.3) !important;
                    background: rgba(255, 255, 255, 0.08) !important;
                    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);
                }
                .modal-overlay {
                    position: fixed; top: 0; left: 0; right: 0; bottom: 0;
                    background: rgba(0, 0, 0, 0.85); backdrop-filter: blur(12px);
                    display: flex; align-items: center; justify-content: center;
                    z-index: 1000; animation: fadeIn 0.3s ease;
                }
                .modal-content {
                    width: 90%; max-width: 800px; border-radius: 25px; padding: 0;
                    animation: slideUp 0.4s cubic-bezier(0.4, 0, 0.2, 1);
                }
                @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
                @keyframes slideUp { from { transform: translateY(30px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
            `}</style>
            {qrTaxi && (
                <TaxiQRCodeModal 
                    taxi={qrTaxi} 
                    onClose={() => setQrTaxi(null)} 
                />
            )}
        </div>
    );
}

const TaxiQRCodeModal = ({ taxi, onClose }: { taxi: Taxi, onClose: () => void }) => {
    const qrRef = useRef<HTMLDivElement>(null);
    const [downloading, setDownloading] = useState(false);

    const reserveUrl = `${window.location.origin}/packages?driverId=${taxi.driver.id}`;

    const downloadSticker = async () => {
        if (!qrRef.current) return;
        setDownloading(true);
        try {
            const dataUrl = await toPng(qrRef.current, { quality: 1.0, pixelRatio: 2 });
            const link = document.createElement('a');
            link.download = `QR-Taxi-VamosJuntos-${taxi.plate}.png`;
            link.href = dataUrl;
            link.click();
        } catch (err) {
            console.error('Error generating image', err);
        }
        setDownloading(false);
    };

    return (
        <div className="modal-overlay" onClick={onClose} style={{ zIndex: 3000 }}>
            <div className="qr-modal-container" onClick={e => e.stopPropagation()}>
                <button className="close-btn-modern" onClick={onClose} style={{ zIndex: 50 }}><X size={20} /></button>
                
                <div ref={qrRef} className="printable-content">
                    {/* Header with Brand Gradient */}
                    <div className="sticker-header-gradient">
                        <div className="sticker-brand-top">VAMOS JUNTOS</div>
                        <div className="sticker-service-label">PREMIUM TRANSPORT</div>
                    </div>

                    <div className="sticker-body">
                        {/* Overlapping Avatar */}
                        <div className="sticker-avatar-wrap">
                            <div className="sticker-avatar-inner">
                                {taxi.driver.photo ? (
                                    <Image src={taxi.driver.photo} alt={taxi.driver.name} fill style={{ objectFit: 'cover' }} unoptimized />
                                ) : (
                                    <div className="placeholder-visual"><User size={40} opacity={0.2} /></div>
                                )}
                            </div>
                        </div>

                        {/* Details Section */}
                        <div className="sticker-info-center">
                            <div className="sticker-label-tiny">MATRÍCULA</div>
                            <h2 className="sticker-plate">{taxi.plate}</h2>
                            <div className="sticker-vehicle-model">{taxi.brand} {taxi.model} ({taxi.year})</div>
                            <div className="sticker-driver-name">Chofer: {taxi.driver.name}</div>
                            <div className="sticker-rating">
                                {Array(5).fill(0).map((_, i) => (
                                    <Star key={i} size={10} fill={i < Math.floor(taxi.driver.rating) ? '#f59e0b' : 'none'} color={i < Math.floor(taxi.driver.rating) ? '#f59e0b' : '#d1d5db'} strokeWidth={2} />
                                ))}
                            </div>
                        </div>

                        {/* Bottom Row: Amenities + QR */}
                        <div className="sticker-bottom-row">
                            <div className="sticker-qr-section">
                                <div className="qr-box-rounded">
                                    <QRCodeCanvas 
                                        value={reserveUrl} 
                                        size={90} 
                                        level="H" 
                                        includeMargin={false}
                                        imageSettings={{
                                            src: "/icons/icon-192x192.png",
                                            x: undefined,
                                            y: undefined,
                                            height: 20,
                                            width: 20,
                                            excavate: true,
                                        }}
                                    />
                                </div>
                                <div className="qr-scan-hint">ESCANEA Y RESERVA</div>
                            </div>
                            
                            <div className="sticker-extra-info">
                                <div className="vehicle-desc-mini">{taxi.brand} {taxi.model}</div>
                                <div className="sticker-amenities-mini">
                                    {taxi.amenities.slice(0, 3).map((a, i) => (
                                        <span key={i} className="mini-tag">{a}</span>
                                    ))}
                                </div>
                                <div className="sticker-footer-text">VIP SERVICE 24/7</div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="modal-actions-bar">
                    <button onClick={downloadSticker} disabled={downloading} className="btn-download-premium">
                        {downloading ? <Loader2 className="animate-spin" size={20} /> : <Download size={20} />}
                        <span>Descargar Sticker QR para Taxi</span>
                    </button>
                </div>
            </div>
            
            <style jsx>{`
                .modal-overlay {
                    position: fixed; inset: 0; background: rgba(0,0,0,0.9);
                    backdrop-filter: blur(20px); display: flex; align-items: center; justify-content: center;
                    padding: 2rem; z-index: 5000;
                }
                .qr-modal-container {
                    width: 100%; max-width: 380px; background: #0a0a0a; border-radius: 40px;
                    overflow: hidden; position: relative; border: 1px solid rgba(255,255,255,0.1);
                    box-shadow: 0 40px 80px rgba(0,0,0,0.6); animation: modal-pop 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
                }
                @keyframes modal-pop { from { transform: scale(0.9); opacity: 0; } to { transform: scale(1); opacity: 1; } }
                .close-btn-modern {
                    position: absolute; top: 1rem; right: 1rem;
                    width: 2.2rem; height: 2.2rem; border-radius: 50%; background: rgba(0,0,0,0.3);
                    border: 1px solid rgba(255,255,255,0.2); color: white; display: flex; align-items: center; justify-content: center; cursor: pointer; transition: all 0.3s;
                }
                .close-btn-modern:hover { background: #ef4444; border-color: #ef4444; }

                .printable-content { background: white; text-align: center; color: #111; }
                
                .sticker-header-gradient { 
                    height: 90px; 
                    background: linear-gradient(135deg, #8b5cf6, #7c3aed); 
                    display: flex; 
                    flex-direction: column; 
                    align-items: center; 
                    justify-content: center;
                    color: white;
                }
                .sticker-brand-top { font-size: 1.1rem; font-weight: 900; letter-spacing: 0.15em; }
                .sticker-service-label { font-size: 0.5rem; font-weight: 800; opacity: 0.8; letter-spacing: 0.2em; margin-top: 0.2rem; }

                .sticker-body { padding: 0 1.5rem 1.5rem 1.5rem; position: relative; }
                
                .sticker-avatar-wrap { 
                    width: 90px; height: 90px; 
                    margin: -45px auto 0.75rem auto; 
                    border-radius: 50%; 
                    background: white; 
                    padding: 4px;
                    box-shadow: 0 10px 20px rgba(0,0,0,0.15);
                }
                .sticker-avatar-inner { width: 100%; height: 100%; border-radius: 50%; overflow: hidden; position: relative; background: #f3f4f6; }

                .sticker-info-center { margin-bottom: 1rem; }
                .sticker-label-tiny { font-size: 0.55rem; font-weight: 900; color: #8b5cf6; letter-spacing: 0.1em; margin-bottom: 0.2rem; }
                .sticker-plate { font-size: 1.8rem; font-weight: 900; margin: 0; color: #111; line-height: 1; letter-spacing: -0.02em; }
                .sticker-vehicle-model { font-size: 0.8rem; font-weight: 800; color: #111; margin-top: 0.2rem; }
                .sticker-driver-name { font-size: 0.7rem; font-weight: 700; color: #6b7280; margin-top: 0.1rem; }
                .sticker-rating { display: flex; justify-content: center; gap: 2px; margin-top: 0.25rem; }

                .sticker-bottom-row { 
                    display: flex; 
                    align-items: center; 
                    gap: 1.25rem; 
                    background: #f9fafb; 
                    padding: 0.8rem 1rem; 
                    border-radius: 16px;
                    border: 1px solid #f3f4f6;
                }
                .sticker-qr-section { display: flex; flex-direction: column; align-items: center; gap: 0.3rem; }
                .qr-box-rounded { padding: 0.3rem; background: white; border-radius: 10px; border: 1px solid #e5e7eb; }
                .qr-scan-hint { font-size: 0.45rem; font-weight: 900; color: #8b5cf6; }

                .sticker-extra-info { flex: 1; text-align: left; display: flex; flex-direction: column; gap: 0.4rem; }
                .vehicle-desc-mini { display: none; }
                .sticker-amenities-mini { display: flex; flex-wrap: wrap; gap: 0.2rem; }
                .mini-tag { font-size: 0.5rem; font-weight: 800; background: #fff; color: #6b7280; padding: 0.15rem 0.35rem; border-radius: 4px; border: 1px solid #e5e7eb; text-transform: uppercase; }
                .sticker-footer-text { font-size: 0.5rem; font-weight: 900; color: #9ca3af; letter-spacing: 0.1em; }

                .modal-actions-bar { padding: 1.25rem; background: #0a0a0a; border-top: 1px solid rgba(255,255,255,0.1); }
                .btn-download-premium { 
                    width: 100%; padding: 0.9rem; background: linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%); 
                    border: none; border-radius: 14px; color: white; font-weight: 800; font-size: 0.85rem; 
                    display: flex; align-items: center; justify-content: center; gap: 0.6rem; cursor: pointer; transition: all 0.3s;
                }
                .btn-download-premium:hover { transform: translateY(-2px); box-shadow: 0 10px 20px rgba(139, 92, 246, 0.4); }
                .btn-download-premium:disabled { opacity: 0.5; cursor: not-allowed; }
            `}</style>
        </div>
    );
}
