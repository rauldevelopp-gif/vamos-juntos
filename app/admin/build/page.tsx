'use client';

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { 
    Car, 
    Hotel, 
    Palmtree, 
    Anchor, 
    Utensils, 
    Camera, 
    Plus, 
    Trash2, 
    GripVertical, 
    Image as ImageIcon, 
    Upload, 
    Search,
    ArrowLeft,
    CheckCircle2,
    Copy,
    Info,
    Plane,
    X,
    Star,
    Phone,
    Loader2
} from 'lucide-react';
import Link from 'next/link';
import { getAirports } from '../airports/actions';
import { getHotels } from '../hotels/actions';
import { getBeaches } from '../beaches/actions';
import { getAttractions } from '../attractions/actions';
import { getRestaurants } from '../restaurants/actions';
import { getYachts } from '../yachts/actions';
import { createPackage } from '../package/actions';
import { getTaxis } from '../taxis/actions';
import { useRouter } from 'next/navigation';

// --- TYPES ---

type ItemType = 'aeropuerto' | 'hotel' | 'restaurante' | 'playa' | 'atraccion' | 'yate';

interface CatalogItem {
    id: number;
    name: string;
    type: ItemType;
    defaultPrice: number;
    details?: string;
    raw?: any;
}

interface PackageItem {
    id: string;
    itemId: number;
    type: ItemType;
    name: string;
    price: number;
    order: number;
    metadata?: {
        driverId?: number;
    };
}

interface Package {
    name: string;
    description: string;
    image: string | null;
    items: PackageItem[];
    total: number;
    driverId?: number;
}

// --- MOCK DATA ---

const CATEGORIES = [
    { type: 'aeropuerto', label: 'Vuelos/Aeropuertos', icon: <Plane size={24} /> },
    { type: 'hotel', label: 'Hoteles', icon: <Hotel size={24} /> },
    { type: 'restaurante', label: 'Restaurantes', icon: <Utensils size={24} /> },
    { type: 'playa', label: 'Playas', icon: <Palmtree size={24} /> },
    { type: 'atraccion', label: 'Atracciones', icon: <Camera size={24} /> },
    { type: 'yate', label: 'Yates/Marina', icon: <Anchor size={24} /> },
] as const;

const MOCK_DRIVERS = [
    { 
        id: 101, 
        name: 'Juan Carlos Pérez', 
        role: 'Driver VIP', 
        phone: '+52 998 123 4567', 
        rating: 4.9, 
        photo: 'https://i.pravatar.cc/150?u=101',
        taxi: { model: 'Toyota Sienna XL', plate: 'TX-99-CUN', capacity: '7 Pasajeros' }
    },
    { 
        id: 102, 
        name: 'Roberto Gómez', 
        role: 'Executive Driver', 
        phone: '+52 998 765 4321', 
        rating: 4.7, 
        photo: 'https://i.pravatar.cc/150?u=102',
        taxi: { model: 'Chevrolet Suburban', plate: 'EX-44-QR', capacity: '6 Pasajeros' }
    },
    { 
        id: 103, 
        name: 'Miguel Ángel Torres', 
        role: 'Professional Driver', 
        phone: '+52 998 555 1212', 
        rating: 4.8, 
        photo: 'https://i.pravatar.cc/150?u=103',
        taxi: { model: 'VW Transporter', plate: 'VAN-11-MX', capacity: '12 Pasajeros' }
    },
];

// --- COMPONENTS ---

const TypeIcon = ({ type, size = 18 }: { type: ItemType; size?: number }) => {
    switch (type) {
        case 'aeropuerto': return <Plane size={size} />;
        case 'hotel': return <Hotel size={size} />;
        case 'restaurante': return <Utensils size={size} />;
        case 'playa': return <Palmtree size={size} />;
        case 'atraccion': return <Camera size={size} />;
        case 'yate': return <Anchor size={size} />;
        default: return <Info size={size} />;
    }
};

const CatalogModal = ({ 
    type, 
    onClose, 
    onAddItem 
}: { 
    type: ItemType, 
    onClose: () => void, 
    onAddItem: (item: CatalogItem) => void 
}) => {
    const [search, setSearch] = useState('');
    const [items, setItems] = useState<CatalogItem[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                let result: any;
                switch (type) {
                    case 'aeropuerto': result = await getAirports(); break;
                    case 'hotel': result = await getHotels(); break;
                    case 'playa': result = await getBeaches(); break;
                    case 'atraccion': result = await getAttractions(); break;
                    case 'restaurante': result = await getRestaurants(); break;
                    case 'yate': result = await getYachts(); break;
                }

                if (result.success && result.data) {
                    const mapped: CatalogItem[] = result.data.map((item: any) => {
                        let details = '';
                        switch (type) {
                            case 'hotel': details = `${item.stars}⭐ • ${item.city}, ${item.state} • ${item.status}`; break;
                            case 'aeropuerto': details = `${item.iata} • ${item.city} • ${item.status}`; break;
                            case 'yate': details = `${item.brand} ${item.model} (${item.length}) • Cap: ${item.capacity}p • ${item.location}`; break;
                            case 'playa': details = `${item.type} • ${item.city} • Pop: ${item.popularity}`; break;
                            case 'atraccion': details = `${item.category} • ${item.city} • ${item.recommendedTime}`; break;
                            case 'restaurante': details = `${item.cuisine} • ${item.city} • ${item.priceRange}`; break;
                        }
                        return {
                            id: item.id,
                            name: item.name,
                            type: type,
                            defaultPrice: item.price_day || item.price || item.defaultPrice || 0,
                            details,
                            raw: item
                        };
                    });
                    setItems(mapped);
                }
            } catch (error) {
                console.error("Error loading catalog:", error);
            }
            setLoading(false);
        };
        fetchData();
    }, [type]);

    const filteredItems = useMemo(() => {
        return items.filter(item => 
            item.name.toLowerCase().includes(search.toLowerCase())
        );
    }, [items, search]);

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content glass-panel" style={{ maxWidth: '600px' }} onClick={e => e.stopPropagation()}>
                <div className="modal-header">
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        <div className="icon-box" style={{ background: 'rgba(139, 92, 246, 0.1)', color: '#8b5cf6' }}>
                            <TypeIcon type={type} size={24} />
                        </div>
                        <div>
                            <h2 className="modal-title">{CATEGORIES.find(c => c.type === type)?.label}</h2>
                            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', margin: 0 }}>Explora el catálogo de {type}s</p>
                        </div>
                    </div>
                    <button className="close-btn" onClick={onClose}>
                        <X size={24} />
                    </button>
                </div>

                <div className="search-section" style={{ padding: '0 0 1.5rem 0' }}>
                    <div className="input-with-icon">
                        <Search className="input-icon" size={16} />
                        <input 
                            type="text" 
                            placeholder={`Buscar ${type}...`} 
                            value={search}
                            autoFocus
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>
                </div>

                <div className="catalog-list custom-scrollbar" style={{ padding: 0, maxHeight: '450px' }}>
                    {loading ? (
                        <div style={{ textAlign: 'center', padding: '3rem' }}>
                            <Loader2 className="animate-spin" size={32} style={{ color: '#8b5cf6', margin: '0 auto' }} />
                            <p style={{ marginTop: '1rem', color: 'var(--text-muted)' }}>Sincronizando catálogo...</p>
                        </div>
                    ) : filteredItems.length === 0 ? (
                        <div className="no-results" style={{ padding: '3rem', textAlign: 'center', background: 'rgba(255,255,255,0.02)', borderRadius: '1rem' }}>
                            No se encontraron {type}s disponibles
                        </div>
                    ) : (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
                            {filteredItems.map(item => (
                                <div key={item.id} className="catalog-item-card" onClick={() => { onAddItem(item); onClose(); }}>
                                    <div className="item-main">
                                        <div className="details">
                                            <div className="name" style={{ fontSize: '1.05rem', marginBottom: '0.2rem' }}>{item.name}</div>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                                                <div className="category" style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.4)' }}>{item.details}</div>
                                                {type === 'yate' && (
                                                    <>
                                                        <div style={{ width: '3px', height: '3px', borderRadius: '50%', background: 'rgba(255,255,255,0.1)' }}></div>
                                                        <div className="category" style={{ fontSize: '0.75rem', color: '#8b5cf6', fontWeight: 800 }}>Tarifa: ${item.defaultPrice.toLocaleString()}</div>
                                                    </>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="item-price-tag">
                                        <div className="add-plus" style={{ background: 'rgba(139, 92, 246, 0.1)', color: '#8b5cf6' }}>
                                            <Plus size={16} strokeWidth={3} />
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

const PreviewFlyerModal = ({ pkg, onClose }: { pkg: Package, onClose: () => void }) => {
    return (
        <div className="modal-overlay" onClick={onClose} style={{ zIndex: 2000 }}>
            <div className="flyer-container" onClick={e => e.stopPropagation()}>
                <button className="flyer-close" onClick={onClose}><X size={24} /></button>
                
                <div className="flyer-hero">
                    {pkg.image ? (
                        <img src={pkg.image} alt={pkg.name} className="hero-img" />
                    ) : (
                        <div className="hero-placeholder">
                            <ImageIcon size={64} opacity={0.2} />
                        </div>
                    )}
                    <div className="hero-overlay">
                        <div className="flyer-badge">PREVIEW EXCLUSIVO</div>
                        <h1 className="flyer-title">{pkg.name || 'Sin nombre'}</h1>
                        <div className="flyer-meta">
                            <span>VAMOS JUNTOS • LUXURY TRAVEL</span>
                        </div>
                    </div>
                </div>

                <div className="flyer-body">
                    <div className="flyer-description">
                        <p>{pkg.description || 'Este paquete ha sido diseñado meticulosamente para ofrecer una experiencia inolvidable en el Caribe Mexicano.'}</p>
                    </div>

                    <div className="flyer-itinerary">
                        <h3>ITINERARIO SELECTO</h3>
                        <div className="flyer-items">
                            {pkg.items.length === 0 ? (
                                <p className="empty-msg">No se han añadido servicios aún.</p>
                            ) : (
                                pkg.items.map((item, idx) => (
                                    <div key={item.id} className="flyer-item-row">
                                        <div className="item-number">{(idx + 1).toString().padStart(2, '0')}</div>
                                        <div className="item-icon-wrap"><TypeIcon type={item.type} size={16} /></div>
                                        <div className="item-info">
                                            <div className="item-name">{item.name}</div>
                                            <div className="item-type">{item.type}</div>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>

                    {pkg.driverId && (
                        <div className="flyer-driver-section">
                            <div className="driver-label">CHOFER ASIGNADO</div>
                            <div className="driver-flyer-card">
                                <img src={MOCK_DRIVERS.find(d => d.id === pkg.driverId)?.photo} alt="Driver" />
                                <div className="driver-flyer-info">
                                    <div className="driver-flyer-name">{MOCK_DRIVERS.find(d => d.id === pkg.driverId)?.name}</div>
                                    <div className="driver-flyer-role">{MOCK_DRIVERS.find(d => d.id === pkg.driverId)?.role}</div>
                                </div>
                            </div>
                        </div>
                    )}

                    <div className="flyer-footer">
                        <div className="price-box">
                            <span className="label">PRECIO TOTAL</span>
                            <span className="value">${pkg.total.toLocaleString()} <small>USD</small></span>
                        </div>
                        <div className="contact-info">
                            <p>Reserva con tu Concierge VIP</p>
                            <div className="brand-logo">VAMOS JUNTOS</div>
                        </div>
                    </div>
                </div>
            </div>
            
            <style jsx>{`
                .flyer-container {
                    width: 100%;
                    max-width: 450px;
                    background: #0a0a0a;
                    border-radius: 30px;
                    overflow: hidden;
                    position: relative;
                    box-shadow: 0 30px 60px rgba(0,0,0,0.8);
                    border: 1px solid rgba(255,255,255,0.1);
                    animation: flyer-up 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
                }
                @keyframes flyer-up {
                    from { transform: translateY(50px) scale(0.9); opacity: 0; }
                    to { transform: translateY(0) scale(1); opacity: 1; }
                }
                .flyer-close {
                    position: absolute;
                    top: 1.5rem;
                    right: 1.5rem;
                    z-index: 10;
                    background: rgba(0,0,0,0.5);
                    backdrop-filter: blur(10px);
                    border: 1px solid rgba(255,255,255,0.2);
                    color: white;
                    width: 40px;
                    height: 40px;
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    cursor: pointer;
                }
                .flyer-hero {
                    height: 280px;
                    position: relative;
                    overflow: hidden;
                }
                .hero-img { width: 100%; height: 100%; object-fit: cover; }
                .hero-placeholder { width: 100%; height: 100%; background: linear-gradient(45deg, #1a1a1a, #2a2a2a); display: flex; align-items: center; justify-content: center; }
                .hero-overlay {
                    position: absolute;
                    inset: 0;
                    background: linear-gradient(to top, #0a0a0a, transparent);
                    display: flex;
                    flex-direction: column;
                    justify-content: flex-end;
                    padding: 2rem;
                }
                .flyer-badge {
                    font-size: 0.65rem;
                    font-weight: 900;
                    background: #8b5cf6;
                    color: white;
                    padding: 0.3rem 0.8rem;
                    border-radius: 5px;
                    width: fit-content;
                    margin-bottom: 0.75rem;
                    letter-spacing: 0.1em;
                }
                .flyer-title { font-size: 2rem; font-weight: 800; margin: 0; line-height: 1.1; color: white; text-shadow: 0 2px 10px rgba(0,0,0,0.5); }
                .flyer-meta { font-size: 0.7rem; color: rgba(255,255,255,0.5); margin-top: 0.5rem; font-weight: 700; letter-spacing: 0.1em; }
                
                .flyer-body { padding: 2rem; }
                .flyer-description { font-size: 0.9rem; color: rgba(255,255,255,0.6); line-height: 1.6; margin-bottom: 2rem; }
                
                .flyer-itinerary h3 { font-size: 0.8rem; font-weight: 900; color: #8b5cf6; letter-spacing: 0.2em; margin-bottom: 1.5rem; }
                .flyer-items { display: flex; flex-direction: column; gap: 1rem; margin-bottom: 2.5rem; }
                .flyer-item-row { display: flex; align-items: center; gap: 1rem; }
                .item-number { font-size: 0.7rem; font-weight: 900; color: rgba(255,255,255,0.2); }
                .item-icon-wrap { color: #8b5cf6; }
                .item-info { display: flex; flex-direction: column; }
                .item-name { font-size: 0.95rem; font-weight: 700; color: white; }
                .item-type { font-size: 0.65rem; text-transform: uppercase; color: rgba(255,255,255,0.3); font-weight: 700; }
                
                .flyer-footer {
                    border-top: 1px solid rgba(255,255,255,0.05);
                    padding-top: 2rem;
                    display: flex;
                    justify-content: space-between;
                    align-items: flex-end;
                }
                .price-box { display: flex; flex-direction: column; }
                .price-box .label { font-size: 0.7rem; font-weight: 800; color: rgba(255,255,255,0.3); }
                .price-box .value { font-size: 1.8rem; font-weight: 900; color: white; }
                .price-box .value small { font-size: 0.8rem; opacity: 0.5; }
                
                .contact-info { text-align: right; }
                .contact-info p { font-size: 0.75rem; color: rgba(255,255,255,0.5); margin: 0 0 0.5rem 0; font-weight: 600; }
                .brand-logo { font-size: 1.2rem; font-weight: 900; background: linear-gradient(to right, #8b5cf6, #d946ef); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
                
                .flyer-driver-section { margin-bottom: 2.5rem; background: rgba(255,255,255,0.03); padding: 1.25rem; border-radius: 1.25rem; border: 1px solid rgba(255,255,255,0.05); }
                .driver-label { font-size: 0.65rem; font-weight: 900; color: rgba(255,255,255,0.3); letter-spacing: 0.15em; margin-bottom: 1rem; }
                .driver-flyer-card { display: flex; align-items: center; gap: 1rem; }
                .driver-flyer-card img { width: 45px; height: 45px; border-radius: 50%; border: 2px solid #8b5cf6; }
                .driver-flyer-name { font-size: 1rem; font-weight: 700; color: white; }
                .driver-flyer-role { font-size: 0.75rem; color: #8b5cf6; font-weight: 600; }
            `}</style>
        </div>
    );
};
const PackageItemCard = ({ 
    item, 
    index, 
    onRemove, 
    onUpdatePrice,
    onReorder,
    onUpdateMetadata
}: { 
    item: PackageItem, 
    index: number,
    onRemove: (id: string) => void,
    onUpdatePrice: (id: string, price: number) => void,
    onReorder: (dragIndex: number, hoverIndex: number) => void,
    onUpdateMetadata: (id: string, metadata: any) => void
}) => {
    const [isDragging, setIsDragging] = useState(false);

    const handleDragStart = (e: React.DragEvent) => {
        e.dataTransfer.setData('text/plain', index.toString());
        setIsDragging(true);
    };

    const handleDragEnd = () => setIsDragging(false);
    const handleDragOver = (e: React.DragEvent) => e.preventDefault();
    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        const dragIndex = parseInt(e.dataTransfer.getData('text/plain'));
        if (dragIndex !== index) onReorder(dragIndex, index);
    };

    return (
        <div 
            draggable 
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
            onDragOver={handleDragOver}
            onDrop={handleDrop}
            className={`package-card glass-panel ${isDragging ? 'dragging' : ''}`}
        >
            <div className="drag-handle"><GripVertical size={20} /></div>

            <div className="icon-box large">
                <TypeIcon type={item.type} size={22} />
            </div>

            <div className="card-content">
                <div className="name">{item.name}</div>
                <div className="type">{item.type}</div>
            </div>

            <div className="card-actions">
                <div className="price-input">
                    <span className="currency">$</span>
                    <input 
                        type="number" 
                        value={item.price}
                        onChange={(e) => onUpdatePrice(item.id, parseFloat(e.target.value) || 0)}
                    />
                </div>
                <button onClick={() => onRemove(item.id)} className="delete-btn">
                    <Trash2 size={18} />
                </button>
            </div>
        </div>
    );
};

const ImageUploader = ({ value, onChange }: { value: string | null, onChange: (v: string | null) => void }) => {
    const fileInputRef = React.useRef<HTMLInputElement>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                onChange(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    return (
        <div className="uploader-container">
            <label className="field-label">Imagen de Portada</label>
            <input 
                type="file" 
                ref={fileInputRef} 
                className="hidden-input" 
                accept="image/*"
                onChange={handleFileChange}
            />
            <div 
                className="drop-zone"
                onClick={() => fileInputRef.current?.click()}
            >
                {value ? (
                    <div className="preview-wrap">
                        <img src={value} alt="Preview" />
                        <div className="overlay"><Upload size={24} /></div>
                    </div>
                ) : (
                    <div className="empty-zone">
                        <ImageIcon size={32} />
                    </div>
                )}
            </div>
        </div>
    );
};

// --- MAIN PAGE COMPONENT ---

export default function PackageBuilderPage() {
    const [pkg, setPkg] = useState<Package>({
        name: '',
        description: '',
        image: null,
        items: [],
        total: 0,
        driverId: undefined
    });

    const [isSaving, setIsSaving] = useState(false);
    const [mounted, setMounted] = useState(false);
    const [isDriverModalOpen, setIsDriverModalOpen] = useState(false);
    const [activeCatalogType, setActiveCatalogType] = useState<ItemType | null>(null);
    const [isPreviewOpen, setIsPreviewOpen] = useState(false);
    const router = useRouter();

    const [dbTaxis, setDbTaxis] = useState<any[]>([]);

    useEffect(() => {
        setMounted(true);
        const fetchTaxis = async () => {
            const res = await getTaxis();
            if (res.success && res.data) setDbTaxis(res.data);
        };
        fetchTaxis();
    }, []);

    const selectedTaxi = useMemo(() => 
        dbTaxis.find(t => t.driver?.id === pkg.driverId)
    , [dbTaxis, pkg.driverId]);

    useEffect(() => {
        const total = pkg.items.reduce((sum, item) => sum + item.price, 0);
        setPkg(prev => ({ ...prev, total }));
    }, [pkg.items]);

    const handleAddItem = useCallback((catalogItem: CatalogItem) => {
        const newItem: PackageItem = {
            id: Math.random().toString(36).substr(2, 9),
            itemId: catalogItem.id,
            type: catalogItem.type,
            name: catalogItem.name,
            price: catalogItem.defaultPrice,
            order: pkg.items.length
        };
        setPkg(prev => ({ ...prev, items: [...prev.items, newItem] }));
    }, [pkg.items.length]);

    const handleRemoveItem = useCallback((id: string) => {
        setPkg(prev => ({ ...prev, items: prev.items.filter(i => i.id !== id) }));
    }, []);

    const handleUpdatePrice = useCallback((id: string, price: number) => {
        setPkg(prev => ({
            ...prev,
            items: prev.items.map(i => i.id === id ? { ...i, price } : i)
        }));
    }, []);

    const handleUpdateMetadata = useCallback((id: string, metadata: any) => {
        setPkg(prev => ({
            ...prev,
            items: prev.items.map(i => i.id === id ? { ...i, metadata } : i)
        }));
    }, []);

    const handleReorder = useCallback((dragIndex: number, hoverIndex: number) => {
        const newItems = [...pkg.items];
        const dragItem = newItems[dragIndex];
        newItems.splice(dragIndex, 1);
        newItems.splice(hoverIndex, 0, dragItem);
        setPkg(prev => ({ ...prev, items: newItems }));
    }, [pkg.items]);

    const handleSave = async () => {
        if (!pkg.name) return alert('Asigna un nombre al paquete');
        setIsSaving(true);
        try {
            const result = await createPackage(pkg);
            if (result.success) {
                // Success feedback
                const notification = document.createElement('div');
                notification.className = 'save-badge';
                notification.innerHTML = '✨ ¡Paquete Guardado!';
                notification.style.position = 'fixed';
                notification.style.top = '2rem';
                notification.style.right = '2rem';
                document.body.appendChild(notification);
                
                setTimeout(() => {
                    router.push('/admin/package');
                }, 1500);
            } else {
                alert(result.error);
                setIsSaving(false);
            }
        } catch (error) {
            console.error(error);
            alert('Error crítico al guardar');
            setIsSaving(false);
        }
    };

    if (!mounted) return <div className="loader">Cargando...</div>;

    return (
        <div className="builder-wrapper">
            <div className="builder-container">
                {/* Header */}
                <header className="builder-header">
                    <div className="header-left">
                        <Link href="/admin/package" className="back-btn">
                            <ArrowLeft size={24} />
                        </Link>
                        <div>
                            <h1 className="text-gradient">Package Builder</h1>
                            <p>Diseña experiencias únicas compuestas por múltiples servicios</p>
                        </div>
                    </div>
                    {isSaving && <div className="save-badge"><Loader2 size={16} className="animate-spin" /> Guardando...</div>}
                </header>

                <div className="builder-layout">
                    {/* Catalog Removed from aside */}

                    {/* Main Workspace */}
                    <main className="workspace-side">
                        <div className="glass-panel main-info-card">
                            <div className="info-grid">
                                <div className="fields">
                                    <div className="field-group">
                                        <label className="field-label">Nombre del Paquete</label>
                                        <input 
                                            type="text" 
                                            placeholder="Ej: Luxury Cancun Experience" 
                                            value={pkg.name}
                                            onChange={(e) => setPkg(prev => ({ ...prev, name: e.target.value }))}
                                        />
                                    </div>
                                    <div className="field-group">
                                        <label className="field-label">Descripción</label>
                                        <textarea 
                                            placeholder="Detalla qué incluye este paquete..." 
                                            rows={3}
                                            value={pkg.description}
                                            onChange={(e) => setPkg(prev => ({ ...prev, description: e.target.value }))}
                                        />
                                    </div>
                                    <div className="field-group">
                                        <label className="field-label">Asignar Chofer (Taxi)</label>
                                        <div className="driver-selector-trigger" onClick={() => setIsDriverModalOpen(true)}>
                                            {selectedTaxi ? (
                                                <div className="selected-driver-mini">
                                                    <img src={selectedTaxi.driver?.photo} alt={selectedTaxi.driver?.name} />
                                                    <div className="mini-info">
                                                        <div className="mini-name">{selectedTaxi.driver?.name}</div>
                                                        <div className="mini-role">{selectedTaxi.driver?.role} • <span style={{ color: 'white' }}>{selectedTaxi.model}</span></div>
                                                        <div className="mini-plate" style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.3)' }}>Placas: {selectedTaxi.plate}</div>
                                                    </div>
                                                </div>
                                            ) : (
                                                <div className="empty-trigger">
                                                    <span>Seleccionar Chofer / Taxi</span>
                                                    <Plus size={16} />
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                                <div className="image-field">
                                    <ImageUploader value={pkg.image} onChange={(v) => setPkg(prev => ({ ...prev, image: v }))} />
                                </div>
                            </div>
                        </div>

                        <div className="itinerary-section">
                            <div className="section-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                                <div>
                                    <h3 style={{ margin: 0 }}>Itinerario del Paquete</h3>
                                    <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', margin: 0 }}>Gestiona la secuencia de servicios</p>
                                </div>
                                <span className="counter" style={{ background: 'rgba(139, 92, 246, 0.1)', color: '#8b5cf6', padding: '0.4rem 1rem', borderRadius: '10px', fontWeight: 800 }}>{pkg.items.length} Servicios</span>
                            </div>

                            {/* Category Quick Triggers */}
                            <div className="category-triggers-bar">
                                {CATEGORIES.map(cat => (
                                    <button 
                                        key={cat.type} 
                                        className="cat-trigger-btn"
                                        onClick={() => setActiveCatalogType(cat.type)}
                                    >
                                        <div className="cat-icon">{cat.icon}</div>
                                        <span className="cat-label">{cat.label.split('/')[0]}</span>
                                    </button>
                                ))}
                            </div>
                            
                            <div className="items-list">
                                {pkg.items.length === 0 ? (
                                    <div className="empty-state" style={{ minHeight: '300px', border: '2px dashed rgba(255,255,255,0.05)', borderRadius: '2rem', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: 'rgba(255,255,255,0.01)' }}>
                                        <div style={{ padding: '2rem', borderRadius: '50%', background: 'rgba(255,255,255,0.02)', color: 'rgba(255,255,255,0.1)', marginBottom: '1rem' }}>
                                            <Plus size={48} />
                                        </div>
                                        <p style={{ color: 'var(--text-muted)', fontWeight: 500 }}>Selecciona una categoría arriba para empezar a construir</p>
                                    </div>
                                ) : (
                                    pkg.items.map((item, index) => (
                                        <PackageItemCard 
                                            key={item.id} 
                                            item={item} 
                                            index={index}
                                            onRemove={handleRemoveItem}
                                            onUpdatePrice={handleUpdatePrice}
                                            onReorder={handleReorder}
                                            onUpdateMetadata={handleUpdateMetadata}
                                        />
                                    ))
                                )}
                            </div>
                        </div>

                        <div className="summary-section">
                            <div className="glass-panel summary-card">
                                <div className="summary-info">
                                    <div className="total-label">Precio Total</div>
                                    <div className="total-value">
                                        <span className="currency">$</span>
                                        {pkg.total.toFixed(2)}
                                    </div>
                                </div>
                                <div className="summary-actions" style={{ display: 'flex', gap: '1rem' }}>
                                    <button onClick={() => setIsPreviewOpen(true)} className="btn-glass-nav" style={{ padding: '0.8rem 1.5rem', borderRadius: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 700 }}>
                                        <Camera size={18} /> Vista Previa
                                    </button>
                                    <button 
                                        onClick={handleSave} 
                                        className="btn-premium save-btn" 
                                        disabled={isSaving}
                                        style={{ padding: '0.8rem 1.5rem', borderRadius: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem', opacity: isSaving ? 0.7 : 1 }}
                                    >
                                        {isSaving ? <Loader2 size={20} className="animate-spin" /> : <CheckCircle2 size={20} />}
                                        {isSaving ? 'Guardando...' : 'Guardar Paquete'}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </main>
                </div>
            </div>

            {/* Global Style for Custom Scrollbar */}
            <style dangerouslySetInnerHTML={{ __html: `
                .builder-wrapper {
                    min-height: 100vh;
                    padding-bottom: 3rem;
                }
                .builder-container {
                    max-width: 1400px;
                    margin: 0 auto;
                    padding: 2rem;
                }
                .builder-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: 3rem;
                }
                .header-left {
                    display: flex;
                    align-items: center;
                    gap: 1.5rem;
                }
                .header-left h1 {
                    font-size: 2.5rem;
                    font-weight: 800;
                    margin: 0;
                    line-height: 1;
                }
                .header-left p {
                    color: rgba(255,255,255,0.4);
                    margin: 0.5rem 0 0 0;
                }
                .back-btn {
                    padding: 0.75rem;
                    background: rgba(255,255,255,0.05);
                    border: 1px solid rgba(255,255,255,0.1);
                    border-radius: 1rem;
                    color: white;
                    display: flex;
                    transition: all 0.2s;
                }
                .back-btn:hover {
                    background: rgba(255,255,255,0.1);
                    transform: translateX(-3px);
                }
                .save-badge {
                    display: flex;
                    align-items: center;
                    gap: 0.5rem;
                    padding: 0.5rem 1rem;
                    background: rgba(16, 185, 129, 0.1);
                    color: #10b981;
                    border-radius: 999px;
                    font-weight: 700;
                    font-size: 0.85rem;
                    animation: bounce 1s infinite;
                }
                @keyframes bounce {
                    0%, 100% { transform: translateY(0); }
                    50% { transform: translateY(-5px); }
                }

                .builder-layout {
                    display: grid;
                    grid-template-columns: 1fr;
                    gap: 2rem;
                    align-items: start;
                }

                /* Catalog Panel */
                .catalog-side {
                    position: sticky;
                    top: 2rem;
                    height: calc(100vh - 150px);
                }
                .catalog-container {
                    height: 100%;
                    display: flex;
                    flex-direction: column;
                    padding: 0;
                    border-radius: 1.5rem;
                    overflow: hidden;
                    background: rgba(255, 255, 255, 0.02);
                    border: 1px solid rgba(255, 255, 255, 0.05);
                }
                .catalog-header {
                    padding: 1.5rem 1.5rem 1rem;
                }
                .title-row {
                    display: flex;
                    align-items: center;
                    gap: 0.75rem;
                    margin-bottom: 0.25rem;
                }
                .pulse-icon {
                    width: 8px;
                    height: 8px;
                    background: #8b5cf6;
                    border-radius: 50%;
                    box-shadow: 0 0 10px #8b5cf6;
                    animation: pulse-dot 2s infinite;
                }
                @keyframes pulse-dot {
                    0% { transform: scale(1); opacity: 1; }
                    50% { transform: scale(1.5); opacity: 0.5; }
                    100% { transform: scale(1); opacity: 1; }
                }
                .catalog-header h2 {
                    font-size: 1.25rem;
                    font-weight: 800;
                    margin: 0;
                    letter-spacing: -0.02em;
                    color: white;
                }
                .subtitle {
                    font-size: 0.75rem;
                    color: rgba(255,255,255,0.3);
                    margin: 0;
                }
                .search-section {
                    padding: 0 1.5rem 1rem;
                }
                .input-with-icon {
                    position: relative;
                    margin-bottom: 1rem;
                }
                .input-icon {
                    position: absolute;
                    left: 1rem;
                    top: 50%;
                    transform: translateY(-50%);
                    color: rgba(255,255,255,0.2);
                }
                .input-with-icon input {
                    width: 100%;
                    background: rgba(0,0,0,0.2);
                    border: 1px solid rgba(255,255,255,0.05);
                    border-radius: 0.75rem;
                    padding: 0.65rem 1rem 0.65rem 2.75rem;
                    color: white !important;
                    font-size: 0.85rem;
                    outline: none;
                    transition: all 0.2s;
                }
                .input-with-icon input:focus {
                    border-color: #8b5cf6;
                    background: rgba(0,0,0,0.4);
                    box-shadow: 0 0 20px rgba(139, 92, 246, 0.1);
                }
                .category-triggers-bar {
                    display: grid;
                    grid-template-columns: repeat(6, 1fr);
                    gap: 1rem;
                    margin-bottom: 2rem;
                }
                .cat-trigger-btn {
                    background: rgba(255,255,255,0.03);
                    border: 1px solid rgba(255,255,255,0.05);
                    border-radius: 1.25rem;
                    padding: 1.2rem;
                    color: white;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    gap: 0.75rem;
                    cursor: pointer;
                    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                }
                .cat-trigger-btn:hover {
                    background: rgba(139, 92, 246, 0.1);
                    border-color: #8b5cf6;
                    transform: translateY(-5px);
                    box-shadow: 0 10px 20px rgba(139, 92, 246, 0.1);
                }
                .cat-trigger-btn:hover .cat-icon {
                    color: #8b5cf6;
                    transform: scale(1.1);
                }
                .cat-icon {
                    transition: all 0.3s;
                    color: rgba(255,255,255,0.4);
                }
                .cat-label {
                    font-size: 0.75rem;
                    font-weight: 700;
                    text-transform: uppercase;
                    letter-spacing: 0.05em;
                }
                @media (max-width: 900px) {
                    .category-triggers-bar { grid-template-columns: repeat(3, 1fr); }
                }
                @media (max-width: 600px) {
                    .category-triggers-bar { grid-template-columns: repeat(2, 1fr); }
                    .cat-trigger-btn { padding: 1rem; }
                }
                .catalog-list {
                    flex: 1;
                    overflow-y: auto;
                    padding: 0 1.25rem 1.5rem;
                    display: flex;
                    flex-direction: column;
                    gap: 0.65rem;
                }
                .catalog-item-card {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    padding: 0.75rem 1rem;
                    background: rgba(255,255,255,0.02);
                    border: 1px solid rgba(255,255,255,0.03);
                    border-radius: 1rem;
                    cursor: pointer;
                    transition: all 0.2s;
                }
                .catalog-item-card:hover {
                    background: rgba(255,255,255,0.06);
                    border-color: rgba(255,255,255,0.1);
                    transform: translateY(-2px);
                }
                .item-main {
                    display: flex;
                    align-items: center;
                    gap: 0.85rem;
                }
                .icon-wrapper {
                    width: 40px;
                    height: 40px;
                    border-radius: 0.75rem;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    background: rgba(255,255,255,0.03);
                    color: rgba(255,255,255,0.6);
                }
                .details .name {
                    font-size: 0.85rem;
                    font-weight: 700;
                    color: white;
                }
                .details .category {
                    font-size: 0.65rem;
                    color: rgba(255,255,255,0.3);
                    text-transform: uppercase;
                }
                .item-price-tag {
                    display: flex;
                    flex-direction: column;
                    align-items: flex-end;
                    gap: 0.25rem;
                }
                .item-price-tag span {
                    font-size: 0.9rem;
                    font-weight: 800;
                    color: #8b5cf6;
                }
                .add-plus {
                    width: 20px;
                    height: 20px;
                    border-radius: 50%;
                    background: rgba(255,255,255,0.05);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    color: rgba(255,255,255,0.2);
                }

                /* Workspace Side */
                .workspace-side {
                    display: flex;
                    flex-direction: column;
                    gap: 2rem;
                }
                .main-info-card {
                    padding: 2rem;
                    border-radius: 1.5rem;
                }
                .info-grid {
                    display: grid;
                    grid-template-columns: 1fr 200px;
                    gap: 2rem;
                }
                .field-group {
                    display: flex;
                    flex-direction: column;
                    gap: 0.5rem;
                    margin-bottom: 1.5rem;
                }
                .field-label {
                    font-size: 0.75rem;
                    font-weight: 700;
                    color: rgba(255,255,255,0.3);
                    text-transform: uppercase;
                }
                .hidden-input {
                    display: none;
                }
                .field-group input, .field-group textarea, .driver-selector-trigger {
                    background: rgba(255,255,255,0.05);
                    border: 1px solid rgba(255,255,255,0.1);
                    border-radius: 1rem;
                    padding: 1rem;
                    color: white;
                    outline: none;
                }
                .driver-selector-trigger {
                    cursor: pointer;
                    min-height: 56px;
                    display: flex;
                    align-items: center;
                    transition: all 0.2s;
                }
                .driver-selector-trigger:hover {
                    background: rgba(255,255,255,0.08);
                    border-color: #8b5cf6;
                }
                .empty-trigger {
                    width: 100%;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    color: rgba(255,255,255,0.4);
                    font-weight: 600;
                }
                .selected-driver-mini {
                    display: flex;
                    align-items: center;
                    gap: 1rem;
                }
                .selected-driver-mini img {
                    width: 32px;
                    height: 32px;
                    border-radius: 50%;
                    border: 2px solid #8b5cf6;
                }
                .mini-name { font-size: 0.9rem; font-weight: 700; }
                .mini-role { font-size: 0.7rem; color: #8b5cf6; font-weight: 600; }

                /* Modal Styles */
                .modal-overlay {
                    position: fixed;
                    inset: 0;
                    background: rgba(0,0,0,0.8);
                    backdrop-filter: blur(10px);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    z-index: 1000;
                    padding: 1rem;
                }
                .modal-content {
                    width: 100%;
                    max-width: 500px;
                    padding: 2rem;
                    border-radius: 2rem;
                    border: 1px solid rgba(255,255,255,0.1);
                    position: relative;
                }
                .modal-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: 2rem;
                }
                .modal-title { font-size: 1.5rem; font-weight: 800; margin: 0; }
                .close-btn { background: none; border: none; color: white; cursor: pointer; padding: 0.5rem; }
                
                .drivers-list {
                    display: flex;
                    flex-direction: column;
                    gap: 1rem;
                    max-height: 400px;
                    overflow-y: auto;
                    padding-right: 0.5rem;
                }
                .driver-card-select {
                    display: flex;
                    align-items: center;
                    gap: 1.25rem;
                    padding: 1rem;
                    background: rgba(255,255,255,0.03);
                    border: 1px solid rgba(255,255,255,0.05);
                    border-radius: 1.25rem;
                    cursor: pointer;
                    transition: all 0.2s;
                }
                .driver-card-select:hover {
                    background: rgba(255,255,255,0.08);
                    border-color: #8b5cf6;
                }
                .driver-card-select.active {
                    background: rgba(139, 92, 246, 0.1);
                    border-color: #8b5cf6;
                }
                .driver-photo {
                    width: 56px;
                    height: 56px;
                    border-radius: 50%;
                    object-fit: cover;
                    border: 2px solid #8b5cf6;
                }
                .driver-info-main { flex: 1; }
                .driver-name-row { display: flex; align-items: center; gap: 0.5rem; }
                .driver-name { font-weight: 700; font-size: 1.1rem; }
                .active-dot { width: 8px; height: 8px; background: #10b981; border-radius: 50%; box-shadow: 0 0 10px #10b981; }
                .driver-role { color: #8b5cf6; font-size: 0.85rem; font-weight: 600; margin-bottom: 0.25rem; }
                .driver-phone { font-size: 0.8rem; color: rgba(255,255,255,0.4); display: flex; align-items: center; gap: 0.4rem; }
                
                .driver-rating-col { text-align: right; }
                .stars-row { display: flex; gap: 2px; justify-content: flex-end; margin-bottom: 0.25rem; }
                .rating-text { font-size: 0.8rem; color: rgba(255,255,255,0.4); }
                .modal-close-action { width: 100%; margin-top: 2rem; padding: 1rem; }
                .field-group input { font-size: 1.25rem; font-weight: 700; }
                
                .drop-zone {
                    height: 100%;
                    border: 2px dashed rgba(255,255,255,0.1);
                    border-radius: 1.5rem;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    cursor: pointer;
                    overflow: hidden;
                }
                .preview-wrap img {
                    width: 100%;
                    height: 100%;
                    object-fit: cover;
                    opacity: 0.6;
                }

                /* Package Card */
                .package-card {
                    padding: 1rem 1.5rem;
                    display: flex;
                    align-items: center;
                    gap: 1rem;
                    border-radius: 1rem;
                    background: rgba(255,255,255,0.03);
                    border: 1px solid rgba(255,255,255,0.05);
                }
                .card-content .name { font-weight: 700; font-size: 1rem; color: white; }
                .card-content .type { font-size: 0.65rem; color: rgba(255,255,255,0.3); text-transform: uppercase; }

                .price-input input {
                    width: 100px;
                    background: rgba(0,0,0,0.2);
                    border: 1px solid rgba(255,255,255,0.1);
                    border-radius: 0.75rem;
                    padding: 0.5rem 0.5rem 0.5rem 1.5rem;
                    color: white;
                    text-align: right;
                    font-weight: 700;
                }

                .total-value { font-size: 2.5rem; font-weight: 900; color: white; }
                .total-value .currency { color: #8b5cf6; }

                .items-list {
                    display: flex;
                    flex-direction: column;
                    gap: 1.5rem;
                    margin-top: 1rem;
                }

                .delete-btn {
                    background: rgba(244, 63, 94, 0.1);
                    border: 1px solid rgba(244, 63, 94, 0.2);
                    color: #f43f5e;
                    cursor: pointer;
                    padding: 0.6rem;
                    border-radius: 0.75rem;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    transition: all 0.2s;
                }
                .delete-btn:hover { 
                    background: #f43f5e;
                    color: white;
                    transform: scale(1.05);
                }

                .card-actions {
                    display: flex;
                    align-items: center;
                    gap: 1.5rem;
                    margin-left: auto;
                }

                .summary-card {
                    padding: 2rem;
                    border-radius: 1.5rem;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    background: rgba(255, 255, 255, 0.02);
                    border: 1px solid rgba(255, 255, 255, 0.05);
                    margin-top: 2rem;
                }

                .custom-scrollbar::-webkit-scrollbar { width: 4px; height: 4px; }
                .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 10px; }
            ` }} />

            {/* Driver Selection Modal */}
            {isDriverModalOpen && (
                <div className="modal-overlay" onClick={() => setIsDriverModalOpen(false)}>
                    <div className="modal-content glass-panel" onClick={e => e.stopPropagation()}>
                        <div className="modal-header">
                            <h2 className="modal-title">🚖 Seleccionar Chofer</h2>
                            <button className="close-btn" onClick={() => setIsDriverModalOpen(false)}>
                                <X size={24} />
                            </button>
                        </div>
                        
                        <div className="drivers-list custom-scrollbar">
                            {dbTaxis.length === 0 ? (
                                <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)' }}>No hay taxis/choferes disponibles en la base de datos</div>
                            ) : dbTaxis.map((taxi) => (
                                <div 
                                    key={taxi.id} 
                                    className={`driver-card-select ${pkg.driverId === taxi.driver?.id ? 'active' : ''}`}
                                    onClick={() => {
                                        setPkg(prev => ({ ...prev, driverId: taxi.driver?.id }));
                                        setIsDriverModalOpen(false);
                                    }}
                                >
                                    <img src={taxi.driver?.photo} alt={taxi.driver?.name} className="driver-photo" />
                                    <div className="driver-info-main">
                                        <div className="driver-name-row">
                                            <span className="driver-name">{taxi.driver?.name}</span>
                                            {pkg.driverId === taxi.driver?.id && <div className="active-dot"></div>}
                                        </div>
                                        <div className="driver-role">{taxi.driver?.role}</div>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
                                            <Car size={12} color="#8b5cf6" />
                                            <span style={{ fontSize: '0.8rem', fontWeight: 600 }}>{taxi.model}</span>
                                            <span style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.3)' }}>• {taxi.plate}</span>
                                        </div>
                                        <div className="driver-phone">
                                            <Phone size={12} /> {taxi.driver?.phone}
                                        </div>
                                    </div>
                                    <div className="driver-rating-col">
                                        <div className="stars-row">
                                            {Array(5).fill(0).map((_, i) => (
                                                <Star 
                                                    key={i} 
                                                    size={12} 
                                                    fill={i < Math.floor(taxi.driver?.rating || 0) ? '#f59e0b' : 'none'} 
                                                    color={i < Math.floor(taxi.driver?.rating || 0) ? '#f59e0b' : 'rgba(255,255,255,0.2)'} 
                                                />
                                            ))}
                                        </div>
                                        <div className="rating-text">{taxi.driver?.rating || 0} Rating</div>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <button className="btn-premium modal-close-action" onClick={() => setIsDriverModalOpen(false)}>
                            Confirmar Selección
                        </button>
                    </div>
                </div>
            )}

            {/* Catalog Modal */}
            {activeCatalogType && (
                <CatalogModal 
                    type={activeCatalogType} 
                    onClose={() => setActiveCatalogType(null)} 
                    onAddItem={handleAddItem}
                />
            )}

            {/* Preview Flyer Modal */}
            {isPreviewOpen && (
                <PreviewFlyerModal 
                    pkg={pkg} 
                    onClose={() => setIsPreviewOpen(null as any)} 
                />
            )}
        </div>
    );
}
