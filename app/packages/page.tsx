"use client";

import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { 
    Search, 
    Filter, 
    ArrowLeft, 
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
    SlidersHorizontal,
    ChevronDown,
    Calendar,
    ArrowRight
} from 'lucide-react';
import { getPackages } from '../admin/package/actions';

// --- SHARED COMPONENTS ---

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

const PreviewFlyerModal = ({ pkg, onClose }: { pkg: any, onClose: () => void }) => {
    const displayPkg = {
        ...pkg,
        total: pkg.price || pkg.total || 0,
        items: Array.isArray(pkg.items) ? pkg.items : (typeof pkg.items === 'string' ? JSON.parse(pkg.items) : [])
    };

    return (
        <div className="modal-overlay" onClick={onClose} style={{ zIndex: 10000 }}>
            <div className="flyer-container" onClick={e => e.stopPropagation()}>
                <button className="flyer-close" onClick={onClose}><X size={24} /></button>
                <div className="flyer-hero">
                    {displayPkg.image ? (
                        <img src={displayPkg.image} alt={displayPkg.name} className="hero-img" />
                    ) : (
                        <div className="hero-placeholder"><ImageIcon size={64} opacity={0.2} /></div>
                    )}
                    <div className="hero-overlay">
                        <div className="flyer-badge">EXPERIENCIA EXCLUSIVA</div>
                        <h1 className="flyer-title">{displayPkg.name || 'Sin nombre'}</h1>
                        <div className="flyer-meta"><span>VAMOS JUNTOS • LUXURY TRAVEL</span></div>
                    </div>
                </div>
                <div className="flyer-body">
                    <div className="flyer-description">
                        <p>{displayPkg.description || 'Este paquete ha sido diseñado meticulosamente para ofrecer una experiencia inolvidable.'}</p>
                    </div>
                    <div className="flyer-itinerary">
                        <h3>ITINERARIO SELECTO</h3>
                        <div className="flyer-items">
                            {displayPkg.items.length === 0 ? (
                                <p className="empty-msg">Paquete promocional directo.</p>
                            ) : (
                                displayPkg.items.map((item: any, idx: number) => (
                                    <div key={item.id || idx} className="flyer-item-row">
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

                    {displayPkg.driver && (
                        <div className="flyer-driver-section">
                            <div className="driver-label">CHOFER ASIGNADO</div>
                            <div className="driver-flyer-card">
                                <img src={displayPkg.driver.photo || 'https://i.pravatar.cc/150?u=' + displayPkg.driver.id} alt="Driver" />
                                <div className="driver-flyer-info">
                                    <div className="driver-flyer-name">{displayPkg.driver.name}</div>
                                    <div className="driver-flyer-role">Driver VIP • {displayPkg.driver.taxis?.[0]?.model || 'Luxury Van'}</div>
                                </div>
                            </div>
                        </div>
                    )}

                    <div className="flyer-footer">
                        <div className="price-box">
                            <span className="label">INVERSIÓN TOTAL</span>
                            <span className="value">${displayPkg.total.toLocaleString()} <small>USD</small></span>
                        </div>
                        <button className="btn-premium reserve-btn" onClick={() => alert('Próximamente: Sistema de Reservas')}>
                            Reservar Ahora
                        </button>
                    </div>
                </div>
            </div>
            <style jsx>{`
                .modal-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.9); backdrop-filter: blur(20px); display: flex; align-items: center; justify-content: center; padding: 2rem; }
                .flyer-container { width: 100%; max-width: 480px; background: #0a0a0a; border-radius: 40px; overflow-y: auto; max-height: 90vh; position: relative; border: 1px solid rgba(255,255,255,0.1); animation: flyer-up 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275); }
                @keyframes flyer-up { from { transform: translateY(80px) scale(0.9); opacity: 0; } to { transform: translateY(0) scale(1); opacity: 1; } }
                .flyer-close { position: absolute; top: 1.5rem; right: 1.5rem; z-index: 10; background: rgba(0,0,0,0.5); backdrop-filter: blur(10px); border: 1px solid rgba(255,255,255,0.2); color: white; width: 44px; height: 44px; border-radius: 50%; display: flex; align-items: center; justify-content: center; cursor: pointer; }
                .flyer-hero { height: 280px; position: relative; overflow: hidden; }
                .hero-img { width: 100%; height: 100%; object-fit: cover; }
                .hero-overlay { position: absolute; inset: 0; background: linear-gradient(to top, #0a0a0a, transparent); display: flex; flex-direction: column; justify-content: flex-end; padding: 2rem; }
                .flyer-badge { font-size: 0.65rem; font-weight: 900; background: #8b5cf6; color: white; padding: 0.4rem 1rem; border-radius: 8px; width: fit-content; margin-bottom: 0.75rem; letter-spacing: 0.15em; }
                .flyer-title { font-size: 1.8rem; font-weight: 800; margin: 0; color: white; line-height: 1.1; }
                .flyer-meta { font-size: 0.65rem; color: rgba(255,255,255,0.4); margin-top: 0.5rem; font-weight: 700; letter-spacing: 0.1em; }
                .flyer-body { padding: 2rem; }
                .flyer-description { font-size: 0.9rem; color: rgba(255,255,255,0.5); line-height: 1.6; margin-bottom: 2rem; }
                .flyer-itinerary h3 { font-size: 0.75rem; font-weight: 900; color: #8b5cf6; letter-spacing: 0.2em; margin-bottom: 1.25rem; }
                .flyer-items { display: flex; flex-direction: column; gap: 0.8rem; margin-bottom: 2rem; }
                .flyer-item-row { display: flex; align-items: center; gap: 1rem; }
                .item-number { font-size: 0.65rem; font-weight: 900; color: rgba(255,255,255,0.1); }
                .item-icon-wrap { color: #8b5cf6; }
                .item-name { font-size: 0.95rem; font-weight: 700; color: white; }
                .item-type { font-size: 0.6rem; text-transform: uppercase; color: rgba(255,255,255,0.3); font-weight: 700; }
                .flyer-driver-section { margin-bottom: 2rem; background: rgba(255,255,255,0.03); padding: 1.25rem; border-radius: 1.25rem; border: 1px solid rgba(255,255,255,0.05); }
                .driver-label { font-size: 0.6rem; font-weight: 900; color: rgba(255,255,255,0.2); margin-bottom: 0.75rem; }
                .driver-flyer-card { display: flex; align-items: center; gap: 1rem; }
                .driver-flyer-card img { width: 40px; height: 40px; border-radius: 50%; border: 2px solid #8b5cf6; }
                .driver-flyer-name { font-size: 1rem; font-weight: 700; color: white; }
                .driver-flyer-role { font-size: 0.7rem; color: #8b5cf6; font-weight: 600; }
                .flyer-footer { border-top: 1px solid rgba(255,255,255,0.05); padding-top: 1.5rem; display: flex; justify-content: space-between; align-items: center; }
                .price-box .value { font-size: 1.8rem; font-weight: 900; color: white; }
                .reserve-btn { padding: 1rem 2rem; border-radius: 15px; font-weight: 800; font-size: 0.9rem; }
            `}</style>
        </div>
    );
};

// --- MAIN PAGE ---

export default function PackagesCatalogPage() {
    const [packages, setPackages] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [activeCategory, setActiveCategory] = useState<string>('todos');
    const [previewPkg, setPreviewPkg] = useState<any>(null);

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

                    {/* Filters Bar Integrated */}
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
                            <div key={pkg.id} className="catalog-card glass-panel" style={{ animationDelay: `${idx * 0.1}s` }}>
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
                                            {Array.isArray(pkg.items) && pkg.items.length > 3 && <span className="more-count">+{pkg.items.length - 3}</span>}
                                        </div>
                                    </div>
                                    <h3 className="card-title">{pkg.name}</h3>
                                    <p className="card-desc">{pkg.description}</p>
                                    <div className="card-footer">
                                        <button onClick={() => setPreviewPkg(pkg)} className="btn-secondary">
                                            <Info size={16} /> Detalles
                                        </button>
                                        <button className="btn-premium reserve-mini-btn" onClick={() => setPreviewPkg(pkg)}>
                                            Ver Itinerario <ArrowRight size={16} />
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

            {/* Flyer Modal */}
            {previewPkg && (
                <PreviewFlyerModal 
                    pkg={previewPkg} 
                    onClose={() => setPreviewPkg(null)} 
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

                .filters-integrated { max-width: 900px; margin: 0 auto; }
                .filters-container { display: flex; align-items: center; gap: 2rem; padding: 1.25rem 2rem; border-radius: 28px; box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5); border: 1px solid rgba(255,255,255,0.1); margin-bottom: 1.5rem; }
                .results-count-mini { text-align: center; font-size: 0.85rem; color: rgba(255,255,255,0.4); letter-spacing: 0.05em; }
                .results-count-mini strong { color: white; }
                .search-box { flex: 1; display: flex; align-items: center; gap: 0.75rem; background: rgba(255,255,255,0.05); padding: 0.75rem 1.25rem; border-radius: 16px; border: 1px solid rgba(255,255,255,0.05); }
                .search-box input { background: transparent; border: none; color: white; outline: none; width: 100%; font-size: 0.95rem; }
                .search-icon { color: rgba(255,255,255,0.2); }
                .categories-scroll { display: flex; gap: 0.5rem; overflow-x: auto; padding-bottom: 0.2rem; }
                .cat-tab { display: flex; align-items: center; gap: 0.5rem; padding: 0.75rem 1.25rem; border-radius: 16px; border: 1px solid transparent; background: transparent; color: rgba(255,255,255,0.4); font-weight: 700; font-size: 0.9rem; cursor: pointer; transition: all 0.3s; white-space: nowrap; }
                .cat-tab:hover { background: rgba(255,255,255,0.03); color: white; }
                .cat-tab.active { background: rgba(139, 92, 246, 0.1); border-color: rgba(139, 92, 246, 0.2); color: #8b5cf6; }

                .results-info { margin-bottom: 2rem; color: rgba(255,255,255,0.3); font-size: 0.9rem; }
                .results-info strong { color: white; }

                .catalog-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(340px, 1fr)); gap: 2.5rem; }
                .catalog-card { border-radius: 30px; overflow: hidden; animation: card-fade-in 0.6s ease forwards; opacity: 0; }
                @keyframes card-fade-in { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
                
                .card-image-wrap { height: 240px; position: relative; overflow: hidden; }
                .card-img { width: 100%; height: 100%; object-fit: cover; transition: transform 0.6s cubic-bezier(0.165, 0.84, 0.44, 1); }
                .catalog-card:hover .card-img { transform: scale(1.1); }
                .price-tag { position: absolute; bottom: 1.5rem; right: 1.5rem; background: rgba(0,0,0,0.6); backdrop-filter: blur(10px); color: white; padding: 0.5rem 1rem; border-radius: 12px; font-weight: 900; font-size: 1.1rem; border: 1px solid rgba(255,255,255,0.1); }
                .card-img-placeholder { height: 100%; width: 100%; background: #111; display: flex; align-items: center; justify-content: center; }

                .card-body { padding: 1.75rem; }
                .card-category-row { display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem; }
                .card-badge { font-size: 0.65rem; font-weight: 900; background: rgba(139, 92, 246, 0.1); color: #8b5cf6; padding: 0.3rem 0.7rem; border-radius: 6px; letter-spacing: 0.1em; text-transform: uppercase; }
                .item-icons { display: flex; align-items: center; gap: 0.4rem; }
                .mini-type-icon { width: 24px; height: 24px; border-radius: 50%; background: rgba(255,255,255,0.05); display: flex; align-items: center; justify-content: center; color: rgba(255,255,255,0.4); }
                .more-count { font-size: 0.7rem; color: rgba(255,255,255,0.2); font-weight: 700; }

                .card-title { font-size: 1.5rem; font-weight: 800; margin-bottom: 0.75rem; line-height: 1.2; }
                .card-desc { font-size: 0.95rem; color: rgba(255,255,255,0.4); line-height: 1.6; margin-bottom: 2rem; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; height: 3rem; }

                .card-footer { display: flex; gap: 0.75rem; }
                .btn-secondary { flex: 1; background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.05); color: white; padding: 0.75rem; border-radius: 14px; font-weight: 700; font-size: 0.85rem; display: flex; align-items: center; justify-content: center; gap: 0.5rem; transition: all 0.3s; }
                .btn-secondary:hover { background: rgba(255,255,255,0.1); }
                .reserve-mini-btn { flex: 1.5; padding: 0.75rem; border-radius: 14px; font-size: 0.85rem; }

                .loading-state { text-align: center; padding: 10rem 0; color: rgba(255,255,255,0.3); font-weight: 700; }
                .loading-state p { margin-top: 1rem; }

                .empty-results { text-align: center; padding: 6rem 2rem; border-radius: 40px; max-width: 600px; margin: 4rem auto; }
                .empty-results h3 { font-size: 1.5rem; margin: 1.5rem 0 0.5rem; }
                .empty-results p { color: rgba(255,255,255,0.4); margin-bottom: 2rem; }

                .custom-promo { margin-top: 8rem; padding: 4rem; border-radius: 40px; display: flex; justify-content: space-between; align-items: center; background: linear-gradient(135deg, rgba(139, 92, 246, 0.1) 0%, transparent 100%); }
                .promo-info h2 { font-size: 2.2rem; font-weight: 800; margin-bottom: 0.5rem; }
                .promo-info p { color: rgba(255,255,255,0.5); font-size: 1.1rem; }
                .promo-btn { padding: 1.2rem 2.5rem; font-size: 1.1rem; border-radius: 20px; }

                @media (max-width: 992px) {
                    .custom-promo { flex-direction: column; text-align: center; gap: 2rem; padding: 3rem 2rem; }
                    .catalog-hero h1 { font-size: 2.5rem; }
                    .filters-container { flex-direction: column; gap: 1rem; padding: 1.5rem; }
                    .search-box { width: 100%; }
                }
            `}</style>
        </div>
    );
}
