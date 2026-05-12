"use client";

import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { 
    Search, 
    Filter, 
    Sparkles, 
    Info, 
    X, 
    Image as ImageIcon, 
    Plane, 
    Hotel, 
    Utensils, 
    Palmtree, 
    Camera, 
    Anchor, 
    Loader2,
    ArrowRight,
    MessageCircle
} from 'lucide-react';
import { getPackages } from '../admin/package/actions';
import { TourPackage, Booking } from './types';
import { PackageDetail } from './components/PackageDetail';
import { BookingWizard, SuccessStep } from './components/BookingWizard';

// --- HELPERS ---

const mapApiToFrontend = (apiPkg: any): TourPackage => {
  const items = Array.isArray(apiPkg.items) 
    ? apiPkg.items 
    : (typeof apiPkg.items === 'string' ? JSON.parse(apiPkg.items) : []);

  return {
    id: apiPkg.id,
    name: apiPkg.name || 'Sin nombre',
    description: apiPkg.description || 'Experiencia exclusiva diseñada para ti.',
    image: apiPkg.image || '/mexico_luxury_ruins_hero_1778020263723.png',
    duration: apiPkg.duration || '8 Horas',
    startTime: apiPkg.start_time || '08:00',
    price: apiPkg.price || 0,
    maxPassengers: apiPkg.vehicle?.capacity || 8,
    pickup: {
        id: 1,
        name: apiPkg.pickup || 'Punto de partida',
        type: 'airport'
    },
    dropoff: {
        id: 2,
        name: apiPkg.dropoff || 'Punto de destino',
        type: 'hotel'
    },
    vehicle: {
        id: apiPkg.vehicle?.id || 1,
        name: apiPkg.vehicle?.model || 'Luxury SUV',
        type: 'Premium',
        capacity: apiPkg.vehicle?.capacity || 8
    },
    driver: {
        id: apiPkg.driver?.id || 1,
        name: apiPkg.driver?.name || 'Driver VIP'
    },
    items: items.map((item: any, idx: number) => ({
        id: idx,
        name: item.name || item,
        type: item.type || 'atraccion'
    }))
  };
};

const TypeIcon = ({ type, size = 18 }: { type: any; size?: number }) => {
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

const WhatsAppIcon = ({ size = 20 }: { size?: number }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
    </svg>
);

// --- MAIN PAGE ---

export default function PackagesCatalogPage() {
    const [packages, setPackages] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [activeCategory, setActiveCategory] = useState<string>('todos');
    
    // UI State for New Flow
    const [selectedPkg, setSelectedPkg] = useState<TourPackage | null>(null);
    const [bookingPkg, setBookingPkg] = useState<TourPackage | null>(null);
    const [confirmedBooking, setConfirmedBooking] = useState<Booking | null>(null);

    useEffect(() => {
        const fetchPackages = async () => {
            const result = await getPackages();
            if (result.success && result.data) {
                setPackages(result.data);
            }
            setLoading(false);
        };
        fetchPackages();
    }, []);

    const categories = [
        { id: 'todos', label: 'Todos', icon: <Sparkles size={16} /> },
        { id: 'yate', label: 'Yates', icon: <Anchor size={16} /> },
        { id: 'restaurante', label: 'Gourmet', icon: <Utensils size={16} /> },
        { id: 'playa', label: 'Playas', icon: <Palmtree size={16} /> },
        { id: 'hotel', label: 'Hoteles', icon: <Hotel size={16} /> }
    ];

    const filteredPackages = useMemo(() => {
        return packages.filter(pkg => {
            const matchesSearch = pkg.name.toLowerCase().includes(search.toLowerCase()) || 
                                 pkg.description?.toLowerCase().includes(search.toLowerCase());
            
            const items = Array.isArray(pkg.items) ? pkg.items : (typeof pkg.items === 'string' ? JSON.parse(pkg.items) : []);
            const hasCategory = activeCategory === 'todos' || items.some((item: any) => item.type === activeCategory);
            
            return matchesSearch && hasCategory;
        });
    }, [packages, search, activeCategory]);

    if (confirmedBooking) {
        return <SuccessStep booking={confirmedBooking} onReset={() => setConfirmedBooking(null)} />;
    }

    return (
        <div className="catalog-wrapper">
            {/* Header / Hero */}
            <header className="catalog-hero">
                <div className="hero-bg">
                    <div className="hero-overlay-deep"></div>
                    <img 
                        src="/mexico_luxury_ruins_hero_1778020263723.png" 
                        alt="Luxury Mexico Ruins" 
                        className="hero-img-bg"
                    />
                </div>
                <div className="container hero-content-wrap">
                    <div className="hero-text-center">
                        <h1 className="text-gradient">Explora el Caribe de Lujo</h1>
                        <p>Encuentra experiencias meticulosamente diseñadas para superar tus expectativas.</p>
                    </div>

                    <div className="filters-integrated">
                        <div className="filters-container glass-panel">
                            <div className="search-box">
                                <Search size={20} className="search-icon" />
                                <input 
                                    type="text" 
                                    placeholder="¿A dónde quieres ir?" 
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                />
                            </div>
                            <div className="categories-scroll custom-scrollbar">
                                {categories.map(cat => (
                                    <button 
                                        key={cat.id} 
                                        className={`cat-tab ${activeCategory === cat.id ? 'active' : ''}`}
                                        onClick={() => setActiveCategory(cat.id)}
                                    >
                                        {cat.icon}
                                        <span>{cat.label}</span>
                                    </button>
                                ))}
                            </div>
                        </div>
                        <div className="results-count-mini">
                            Mostrando <strong>{filteredPackages.length}</strong> experiencias de lujo
                        </div>
                    </div>
                </div>
            </header>

            {/* Grid */}
            <main className="container catalog-grid-section">
                {loading ? (
                    <div className="loading-state">
                        <Loader2 className="animate-spin" size={40} color="#8b5cf6" />
                        <p>Sincronizando catálogo de lujo...</p>
                    </div>
                ) : filteredPackages.length === 0 ? (
                    <div className="empty-results glass-panel">
                        <Sparkles size={48} opacity={0.2} />
                        <h3>No encontramos coincidencias</h3>
                        <p>Prueba ajustando tus filtros o buscando algo diferente.</p>
                        <button onClick={() => {setSearch(''); setActiveCategory('todos');}} className="btn-premium">Ver todo el catálogo</button>
                    </div>
                ) : (
                    <div className="catalog-grid">
                        {filteredPackages.map((pkg, idx) => (
                            <div 
                                key={pkg.id} 
                                className="catalog-card glass-panel clickable-card" 
                                style={{ animationDelay: `${idx * 0.1}s` }}
                                onClick={() => setSelectedPkg(mapApiToFrontend(pkg))}
                            >
                                <div className="card-image-wrap">
                                    {pkg.image ? (
                                        <img src={pkg.image} alt={pkg.name} className="card-img" />
                                    ) : (
                                        <div className="card-img-placeholder"><ImageIcon size={40} opacity={0.1} /></div>
                                    )}
                                    <div className="price-tag">${pkg.price?.toLocaleString()} USD</div>
                                </div>
                                <div className="card-body">
                                    <div className="card-category-row">
                                        <span className="card-badge">Exclusivo</span>
                                        <div className="item-icons">
                                            {Array.isArray(pkg.items) && pkg.items.slice(0, 3).map((item: any, i: number) => (
                                                <div key={i} className="mini-type-icon"><TypeIcon type={item.type} size={12} /></div>
                                            ))}
                                        </div>
                                    </div>
                                    <h3 className="card-title">{pkg.name}</h3>
                                    <p className="card-desc">{pkg.description}</p>
                                    <div className="card-footer" onClick={e => e.stopPropagation()}>
                                        <a 
                                            href={`https://wa.me/${pkg.driver?.phone?.replace(/\D/g, '') || '529981234567'}?text=${encodeURIComponent(`Hola, deseo más información sobre: ${pkg.name}`)}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="btn-whatsapp-mini"
                                            title="Contactar por WhatsApp"
                                        >
                                            <WhatsAppIcon size={20} />
                                        </a>
                                        <button 
                                            className="btn-premium reserve-mini-btn" 
                                            onClick={() => setBookingPkg(mapApiToFrontend(pkg))}
                                        >
                                            Reservar
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </main>

            <footer className="catalog-footer">
                <div className="container">
                    <div className="custom-promo glass-panel">
                        <div className="promo-info">
                            <h2>¿Buscas algo totalmente único?</h2>
                            <p>Usa nuestro constructor personalizado para armar el viaje de tus sueños paso a paso.</p>
                        </div>
                        <Link href="/custom" className="btn-premium promo-btn">
                            Armar Tour Personalizado
                        </Link>
                    </div>
                </div>
            </footer>

            {/* Modals & Flow */}
            {selectedPkg && (
                <PackageDetail 
                    pkg={selectedPkg} 
                    onClose={() => setSelectedPkg(null)}
                    onContinue={(pkg) => {
                        setSelectedPkg(null);
                        setBookingPkg(pkg);
                    }}
                />
            )}

            {bookingPkg && (
                <BookingWizard 
                    pkg={bookingPkg}
                    onClose={() => setBookingPkg(null)}
                    onComplete={(booking) => {
                        setBookingPkg(null);
                        setConfirmedBooking(booking);
                    }}
                />
            )}

            <style jsx>{`
                .catalog-wrapper { min-height: 100vh; background: #050505; color: white; padding-bottom: 5rem; }
                .container { max-width: 1200px; margin: 0 auto; padding: 0 2rem; }
                
                .catalog-hero { position: relative; height: 500px; display: flex; align-items: center; justify-content: center; overflow: hidden; margin-bottom: 4rem; }
                .hero-bg { position: absolute; inset: 0; z-index: 0; }
                .hero-img-bg { width: 100%; height: 100%; object-fit: cover; }
                .hero-overlay-deep { position: absolute; inset: 0; background: linear-gradient(to bottom, rgba(0,0,0,0.4), #050505); z-index: 1; }
                
                .hero-content-wrap { position: relative; z-index: 2; width: 100%; }
                .hero-text-center { text-align: center; margin-bottom: 3rem; }
                .hero-text-center h1 { font-size: 4rem; font-weight: 900; margin-bottom: 1rem; text-shadow: 0 10px 30px rgba(0,0,0,0.5); }
                .hero-text-center p { font-size: 1.2rem; color: rgba(255,255,255,0.8); max-width: 600px; margin: 0 auto; text-shadow: 0 2px 10px rgba(0,0,0,0.5); }

                .text-gradient { background: linear-gradient(to right, #fff, #8b5cf6); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }

                .filters-integrated { max-width: 900px; margin: 0 auto; }
                .filters-container { display: flex; align-items: center; gap: 2rem; padding: 1.25rem 2rem; border-radius: 28px; box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5); border: 1px solid rgba(255,255,255,0.1); margin-bottom: 1.5rem; }
                .glass-panel { background: rgba(255,255,255,0.03); backdrop-filter: blur(20px); border: 1px solid rgba(255,255,255,0.05); }
                
                .results-count-mini { text-align: center; font-size: 0.85rem; color: rgba(255,255,255,0.4); letter-spacing: 0.05em; }
                .results-count-mini strong { color: white; }
                .search-box { flex: 1; display: flex; align-items: center; gap: 0.75rem; background: rgba(255,255,255,0.05); padding: 0.75rem 1.25rem; border-radius: 16px; border: 1px solid rgba(255,255,255,0.05); }
                .search-box input { background: transparent; border: none; color: white; outline: none; width: 100%; font-size: 0.95rem; }
                .search-icon { color: rgba(255,255,255,0.2); }
                .categories-scroll { display: flex; gap: 0.5rem; overflow-x: auto; padding-bottom: 0.2rem; }
                .cat-tab { display: flex; align-items: center; gap: 0.5rem; padding: 0.75rem 1.25rem; border-radius: 16px; border: 1px solid transparent; background: transparent; color: rgba(255,255,255,0.4); font-weight: 700; font-size: 0.9rem; cursor: pointer; transition: all 0.3s; white-space: nowrap; }
                .cat-tab:hover { background: rgba(255,255,255,0.03); color: white; }
                .cat-tab.active { background: rgba(139, 92, 246, 0.1); border-color: rgba(139, 92, 246, 0.2); color: #8b5cf6; }

                .catalog-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(340px, 1fr)); gap: 2.5rem; }
                .catalog-card { border-radius: 30px; overflow: hidden; animation: card-fade-in 0.6s ease forwards; opacity: 0; }
                @keyframes card-fade-in { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
                
                .card-image-wrap { height: 240px; position: relative; overflow: hidden; }
                .card-img { width: 100%; height: 100%; object-fit: cover; transition: transform 0.6s cubic-bezier(0.165, 0.84, 0.44, 1); }
                .catalog-card:hover .card-img { transform: scale(1.1); }
                .price-tag { position: absolute; bottom: 1.5rem; right: 1.5rem; background: rgba(0,0,0,0.6); backdrop-filter: blur(10px); color: white; padding: 0.5rem 1rem; border-radius: 12px; font-weight: 900; font-size: 1.1rem; border: 1px solid rgba(255,255,255,0.1); }

                .card-body { padding: 1.75rem; }
                .card-category-row { display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem; }
                .card-badge { font-size: 0.65rem; font-weight: 900; background: rgba(139, 92, 246, 0.1); color: #8b5cf6; padding: 0.3rem 0.7rem; border-radius: 6px; letter-spacing: 0.1em; text-transform: uppercase; }
                .item-icons { display: flex; align-items: center; gap: 0.4rem; }
                .mini-type-icon { width: 24px; height: 24px; border-radius: 50%; background: rgba(255,255,255,0.05); display: flex; align-items: center; justify-content: center; color: rgba(255,255,255,0.4); }

                .card-title { font-size: 1.5rem; font-weight: 800; margin-bottom: 0.75rem; line-height: 1.2; }
                .card-desc { font-size: 0.95rem; color: rgba(255,255,255,0.4); line-height: 1.6; margin-bottom: 2rem; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; height: 3rem; }

                .card-footer { display: flex; gap: 0.75rem; }
                .clickable-card { cursor: pointer; transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1); }
                .clickable-card:hover { transform: translateY(-10px); border-color: rgba(139, 92, 246, 0.4); box-shadow: 0 20px 40px -15px rgba(139, 92, 246, 0.3); }

                .btn-whatsapp-mini { 
                    display: flex; 
                    align-items: center; 
                    justify-content: center; 
                    width: 48px; 
                    height: 48px; 
                    background: #25d366; 
                    color: white; 
                    border-radius: 14px; 
                    transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275); 
                    box-shadow: 0 4px 15px rgba(37, 211, 102, 0.3);
                    text-decoration: none;
                    flex-shrink: 0;
                }
                .btn-whatsapp-mini:hover { transform: scale(1.1) rotate(5deg); background: #128c7e; }

                .btn-premium { background: linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%); color: white; border: none; transition: all 0.3s; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 0.5rem; }
                .btn-premium:hover { transform: translateY(-2px); box-shadow: 0 10px 20px -5px rgba(139, 92, 246, 0.5); }
                .reserve-mini-btn { flex: 1; padding: 0.75rem; border-radius: 14px; font-size: 0.85rem; font-weight: 800; }

                .loading-state { text-align: center; padding: 10rem 0; color: rgba(255,255,255,0.3); font-weight: 700; }
                .empty-results { text-align: center; padding: 6rem 2rem; border-radius: 40px; max-width: 600px; margin: 4rem auto; }

                .custom-promo { margin-top: 8rem; padding: 4rem; border-radius: 40px; display: flex; justify-content: space-between; align-items: center; background: linear-gradient(135deg, rgba(139, 92, 246, 0.1) 0%, transparent 100%); }
                .promo-info h2 { font-size: 2.2rem; font-weight: 800; margin-bottom: 0.5rem; }
                .promo-info p { color: rgba(255,255,255,0.5); font-size: 1.1rem; }
                .promo-btn { padding: 1.2rem 2.5rem; font-size: 1.1rem; border-radius: 20px; text-decoration: none; }

                @media (max-width: 992px) {
                    .custom-promo { flex-direction: column; text-align: center; gap: 2rem; padding: 3rem 2rem; }
                    .catalog-hero h1 { font-size: 2.5rem; }
                    .filters-container { flex-direction: column; gap: 1rem; padding: 1.5rem; }
                }
            `}</style>
        </div>
    );
}
