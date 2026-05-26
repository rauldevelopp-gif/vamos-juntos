'use client';

import { useState, useEffect, useMemo, Suspense } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { Search, MapPin, Star, Hotel as HotelIcon, Loader2, LayoutGrid, Building2, Sparkles, Palmtree, BedDouble, ChevronLeft, ChevronRight } from 'lucide-react';
import { getPublicHotels } from './actions';
import HotelCard from '../../components/HotelCard';

export default function HotelsCatalogPage() {
    return (
        <Suspense fallback={
            <div className="catalog-wrapper" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Loader2 className="animate-spin" size={40} color="#8b5cf6" />
            </div>
        }>
            <CatalogContent />
        </Suspense>
    );
}

function CatalogContent() {
    const [hotels, setHotels] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [activeCategory, setActiveCategory] = useState<string>('todos');

    useEffect(() => {
        const fetchHotels = async () => {
            const result = await getPublicHotels();
            if (result.success && result.data) {
                setHotels(result.data);
            }
            setLoading(false);
        };
        fetchHotels();
    }, []);

    const categories = [
        { id: 'todos', label: 'Todos', icon: LayoutGrid },
        { id: 'Estándar', label: 'Estándar', icon: Building2 },
        { id: 'Boutique', label: 'Boutique', icon: Sparkles },
        { id: 'Resort', label: 'Resorts', icon: Palmtree },
        { id: 'Hostal', label: 'Hostales', icon: BedDouble }
    ];

    const filteredHotels = useMemo(() => {
        return hotels.filter(hotel => {
            const matchesSearch = hotel.name.toLowerCase().includes(search.toLowerCase()) || 
                                 hotel.city.toLowerCase().includes(search.toLowerCase());
            
            const hasCategory = activeCategory === 'todos' || hotel.category === activeCategory;
            return matchesSearch && hasCategory;
        });
    }, [hotels, search, activeCategory]);

    return (
        <div className="catalog-wrapper">
            <header className="catalog-hero">
                <div className="hero-bg">
                    <Image 
                        src="https://images.unsplash.com/photo-1582719508461-905c673771fd?q=80&w=2070&auto=format&fit=crop" 
                        alt="Luxury Hotels" 
                        fill
                        style={{ objectFit: 'cover', zIndex: 0 }}
                        unoptimized
                    />
                    <div className="hero-overlay-deep" style={{ position: 'absolute', inset: 0, zIndex: 1, background: 'linear-gradient(to bottom, rgba(0,0,0,0.4), #050505)' }}></div>
                </div>
                <div className="container hero-content-wrap">
                    <div className="hero-text-center">
                        <h1 className="text-gradient">Estancias Inolvidables</h1>
                        <p>Encuentra los mejores hoteles, resorts y alojamientos boutique para tu próximo viaje.</p>
                    </div>

                    <div className="filters-integrated">
                        <div className="filters-container glass-panel">
                            <div className="search-box">
                                <Search size={20} className="search-icon" />
                                <input 
                                    type="text" 
                                    placeholder="¿En qué ciudad quieres hospedarte?" 
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                />
                            </div>
                            <div className="categories-scroll custom-scrollbar">
                                {categories.map(cat => {
                                    const Icon = cat.icon;
                                    return (
                                        <button 
                                            key={cat.id} 
                                            className={`cat-tab ${activeCategory === cat.id ? 'active' : ''}`}
                                            onClick={() => setActiveCategory(cat.id)}
                                        >
                                            <Icon size={16} />
                                            <span>{cat.label}</span>
                                        </button>
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                </div>
            </header>

            <main className="container catalog-grid-section">
                {loading ? (
                    <div className="loading-state">
                        <Loader2 className="animate-spin" size={40} color="#8b5cf6" />
                        <p>Buscando disponibilidad...</p>
                    </div>
                ) : filteredHotels.length === 0 ? (
                    <div className="empty-results glass-panel">
                        <HotelIcon size={48} opacity={0.2} />
                        <h3>No encontramos hoteles</h3>
                        <p>Prueba ajustando tus filtros o buscando otro destino.</p>
                        <button onClick={() => {setSearch(''); setActiveCategory('todos');}} className="btn-premium">Ver todo</button>
                    </div>
                ) : (
                    <div className="catalog-grid">
                        {filteredHotels.map((hotel) => (
                            <HotelCard key={hotel.id} hotel={hotel} />
                        ))}
                    </div>
                )}
            </main>

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
                
                .search-box { flex: 1; display: flex; align-items: center; gap: 0.75rem; background: rgba(255,255,255,0.05); padding: 0.75rem 1.25rem; border-radius: 16px; border: 1px solid rgba(255,255,255,0.05); }
                .search-box input { background: transparent; border: none; color: white; outline: none; width: 100%; font-size: 0.95rem; }
                .search-icon { color: rgba(255,255,255,0.2); }
                .categories-scroll { display: flex; gap: 0.5rem; overflow-x: auto; padding-bottom: 0.2rem; }
                .cat-tab { display: flex; align-items: center; gap: 0.5rem; padding: 0.75rem 1.25rem; border-radius: 16px; border: 1px solid transparent; background: transparent; color: rgba(255,255,255,0.4); font-weight: 700; font-size: 0.9rem; cursor: pointer; transition: all 0.3s; white-space: nowrap; }
                .cat-tab:hover { background: rgba(255,255,255,0.03); color: white; }
                .cat-tab.active { background: rgba(139, 92, 246, 0.1); border-color: rgba(139, 92, 246, 0.2); color: #8b5cf6; }

                .catalog-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(340px, 1fr)); gap: 2.5rem; }
                .catalog-card { border-radius: 30px; overflow: hidden; animation: card-fade-in 0.6s ease forwards; opacity: 0; color: white; }
                .catalog-card { border-radius: 30px; overflow: hidden; animation: card-fade-in 0.6s ease forwards; opacity: 0; color: white; display: flex; flex-direction: column; }
                @keyframes card-fade-in { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
                
                .card-image-wrap { height: 240px; position: relative; overflow: hidden; }
                .card-img { width: 100%; height: 100%; object-fit: cover; transition: transform 0.6s cubic-bezier(0.165, 0.84, 0.44, 1); }
                .catalog-card:hover .card-img { transform: scale(1.1); }
                .price-tag { position: absolute; bottom: 0; left: 0; right: 0; padding: 1.5rem 1rem 0.8rem; background: linear-gradient(transparent, rgba(0,0,0,0.9)); color: white; font-weight: 800; font-size: 1.1rem; display: flex; align-items: flex-end; gap: 0.3rem; }
                
                .clickable-card:hover .gallery-arrow { opacity: 1; }
                .gallery-arrow { position: absolute; top: 50%; transform: translateY(-50%); background: rgba(255,255,255,0.2); backdrop-filter: blur(4px); color: white; border: 1px solid rgba(255,255,255,0.3); width: 36px; height: 36px; border-radius: 50%; display: flex; align-items: center; justify-content: center; cursor: pointer; opacity: 0; transition: opacity 0.3s, background 0.3s; z-index: 10; }
                .gallery-arrow:hover { background: rgba(255,255,255,0.4); }
                .gallery-arrow.left { left: 0.5rem; }
                .gallery-arrow.right { right: 0.5rem; }

                .card-body { padding: 1.5rem; flex: 1; display: flex; flex-direction: column; }
                .card-category-row { display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem; }
                .card-badge { font-size: 0.65rem; font-weight: 900; background: rgba(139, 92, 246, 0.1); color: #8b5cf6; padding: 0.3rem 0.7rem; border-radius: 6px; letter-spacing: 0.1em; text-transform: uppercase; }
                .item-icons { display: flex; align-items: center; gap: 2px; }

                .card-title { font-size: 1.5rem; font-weight: 800; margin-bottom: 0.4rem; line-height: 1.2; }
                .card-desc { font-size: 0.95rem; color: rgba(255,255,255,0.4); line-height: 1.6; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; height: 3rem; margin: 0; }

                .clickable-card { cursor: pointer; transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1); }
                .clickable-card:hover { transform: translateY(-10px); border-color: rgba(139, 92, 246, 0.4); box-shadow: 0 20px 40px -15px rgba(139, 92, 246, 0.3); }

                .btn-premium { background: linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%); color: white; border: none; padding: 0.8rem 1.5rem; border-radius: 12px; cursor: pointer; }
                .loading-state { text-align: center; padding: 10rem 0; color: rgba(255,255,255,0.3); font-weight: 700; }
                .empty-results { text-align: center; padding: 6rem 2rem; border-radius: 40px; max-width: 600px; margin: 4rem auto; }

                @media (max-width: 992px) {
                    .catalog-hero h1 { font-size: 2.5rem; }
                    .filters-container { flex-direction: column; gap: 1rem; padding: 1.5rem; }
                }
            `}</style>
        </div>
    );
}
