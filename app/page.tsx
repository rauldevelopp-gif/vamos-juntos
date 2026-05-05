"use client";
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Compass, Info, ArrowRight, Settings, Sparkles, X, Image as ImageIcon, Plane, Hotel, Utensils, Palmtree, Camera, Anchor, Loader2 } from 'lucide-react';
import { getPackages } from './admin/package/actions';

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
        <div className="modal-overlay" onClick={onClose} style={{ zIndex: 2000 }}>
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
                        <div className="contact-info">
                            <p>Reserva con tu Concierge</p>
                            <div className="brand-logo">VAMOS JUNTOS</div>
                        </div>
                    </div>
                </div>
            </div>
            <style jsx>{`
                .modal-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.85); backdrop-filter: blur(15px); display: flex; align-items: center; justify-content: center; padding: 2rem; z-index: 10000; }
                .flyer-container { width: 100%; max-width: 450px; background: #0a0a0a; border-radius: 30px; overflow-y: auto; max-height: 90vh; position: relative; border: 1px solid rgba(255,255,255,0.1); animation: flyer-up 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275); }
                @keyframes flyer-up { from { transform: translateY(50px) scale(0.9); opacity: 0; } to { transform: translateY(0) scale(1); opacity: 1; } }
                .flyer-close { position: absolute; top: 1.5rem; right: 1.5rem; z-index: 10; background: rgba(0,0,0,0.5); backdrop-filter: blur(10px); border: 1px solid rgba(255,255,255,0.2); color: white; width: 40px; height: 40px; border-radius: 50%; display: flex; align-items: center; justify-content: center; cursor: pointer; transition: all 0.3s; }
                .flyer-hero { height: 240px; position: relative; overflow: hidden; }
                .hero-img { width: 100%; height: 100%; object-fit: cover; }
                .hero-overlay { position: absolute; inset: 0; background: linear-gradient(to top, #0a0a0a, transparent); display: flex; flex-direction: column; justify-content: flex-end; padding: 1.5rem; }
                .flyer-badge { font-size: 0.6rem; font-weight: 900; background: var(--primary); color: white; padding: 0.3rem 0.8rem; border-radius: 5px; width: fit-content; margin-bottom: 0.5rem; letter-spacing: 0.1em; }
                .flyer-title { font-size: 1.5rem; font-weight: 800; margin: 0; color: white; }
                .flyer-meta { font-size: 0.6rem; color: rgba(255,255,255,0.4); margin-top: 0.3rem; font-weight: 700; }
                .flyer-body { padding: 1.5rem; }
                .flyer-description { font-size: 0.8rem; color: rgba(255,255,255,0.5); line-height: 1.5; margin-bottom: 1.5rem; }
                .flyer-itinerary h3 { font-size: 0.7rem; font-weight: 900; color: var(--primary); letter-spacing: 0.15em; margin-bottom: 1rem; }
                .flyer-items { display: flex; flex-direction: column; gap: 0.7rem; margin-bottom: 1.5rem; }
                .flyer-item-row { display: flex; align-items: center; gap: 0.8rem; }
                .item-number { font-size: 0.6rem; font-weight: 900; color: rgba(255,255,255,0.1); }
                .item-icon-wrap { color: var(--primary); }
                .item-name { font-size: 0.85rem; font-weight: 700; color: white; }
                .item-type { font-size: 0.55rem; text-transform: uppercase; color: rgba(255,255,255,0.3); font-weight: 700; }
                .flyer-driver-section { margin-bottom: 1.5rem; background: rgba(255,255,255,0.03); padding: 1rem; border-radius: 1rem; border: 1px solid rgba(255,255,255,0.05); }
                .driver-label { font-size: 0.55rem; font-weight: 900; color: rgba(255,255,255,0.2); margin-bottom: 0.5rem; }
                .driver-flyer-card { display: flex; align-items: center; gap: 0.8rem; }
                .driver-flyer-card img { width: 35px; height: 35px; border-radius: 50%; border: 2px solid var(--primary); }
                .driver-flyer-name { font-size: 0.8rem; font-weight: 700; color: white; }
                .driver-flyer-role { font-size: 0.65rem; color: var(--primary); font-weight: 600; }
                .flyer-footer { border-top: 1px solid rgba(255,255,255,0.05); padding-top: 1rem; display: flex; justify-content: space-between; align-items: flex-end; }
                .price-box .value { font-size: 1.4rem; font-weight: 900; color: white; }
                .brand-logo { font-size: 1rem; font-weight: 900; background: linear-gradient(to right, #8b5cf6, #d946ef); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
            `}</style>
        </div>
    );
};

export default function Home() {
  const [packages, setPackages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [previewPkg, setPreviewPkg] = useState<any>(null);

  useEffect(() => {
    const fetchPackages = async () => {
      const result = await getPackages();
      if (result.success && result.data) {
        setPackages(result.data.slice(0, 6));
      }
      setLoading(false);
    };
    fetchPackages();
  }, []);
  return (
    <main>
      {/* Hero Section */}
      <section className="hero-banner" style={{ display: 'block', height: 'auto', minHeight: '80vh' }}>
        <div className="hero-overlay"></div>
        <img
          src="https://images.unsplash.com/photo-1544551763-46a013bb70d5?q=80&w=2070&auto=format&fit=crop"
          alt="Luxury Yacht"
          style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', zIndex: 0 }}
        />
        <div className="container" style={{ position: 'relative', zIndex: 10, padding: '4rem 2rem 5rem', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', minHeight: '60vh' }}>
          <div style={{ display: 'flex', gap: '1.5rem', justifyContent: 'center', flexWrap: 'wrap', marginBottom: '3rem' }}>
            <Link href="/packages" className="btn-premium" style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
              <Compass size={20} strokeWidth={2} />
              <span>Explorar Paquetes</span>
              <Sparkles size={16} strokeWidth={2} />
            </Link>
          </div>
          <h1 className="heading-1 float-animation" style={{ fontSize: '3.5rem', marginBottom: '1.5rem', textShadow: '0 10px 30px rgba(0,0,0,0.5)', lineHeight: '1.1' }}>
            Experiencia de <br /><span className="text-gradient">Lujo a la Medida</span>
          </h1>
          <p style={{ fontSize: '1.2rem', color: 'rgba(255,255,255,0.9)', maxWidth: '700px', margin: '0 auto', textShadow: '0 2px 10px rgba(0,0,0,0.5)', lineHeight: '1.6' }}>
            Accede a la selección más exclusiva de yates, transporte VIP y gastronomía premium. Creamos momentos inolvidables diseñados solo para ti.
          </p>
        </div>
      </section>

      {/* Featured Packages */}
      <section style={{ padding: '5rem 0' }}>
        <div className="container">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '3rem' }}>
            <div>
              <h2 className="heading-2">Paquetes Destacados</h2>
              <p style={{ color: 'var(--text-muted)' }}>Selecciones exclusivas para tu próximo viaje</p>
            </div>
            <Link href="/packages" className="link-action" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              Ver todos los destinos <ArrowRight size={16} />
            </Link>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '2rem' }}>
            {loading ? (
              Array(6).fill(0).map((_, i) => (
                <div key={i} className="glass-card" style={{ height: '400px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Loader2 className="animate-spin" color="var(--primary)" size={32} />
                </div>
              ))
            ) : packages.map((pkg) => (
              <div key={pkg.id} className="glass-card" style={{ overflow: 'hidden' }}>
                <div style={{ height: '220px', background: 'rgba(255,255,255,0.05)', position: 'relative' }}>
                  {pkg.image ? (
                    <img src={pkg.image} alt={pkg.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  ) : (
                    <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <ImageIcon size={48} opacity={0.1} />
                    </div>
                  )}
                  <div style={{ position: 'absolute', top: '1rem', right: '1rem', background: 'var(--primary)', padding: '0.25rem 0.75rem', borderRadius: 'var(--radius-full)', fontSize: '0.8rem', fontWeight: 700 }}>
                    Exclusivo
                  </div>
                </div>
                <div style={{ padding: '1.5rem' }}>
                  <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{pkg.name}</h3>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '1.5rem', height: '3rem', overflow: 'hidden' }}>
                    {pkg.description || 'Vive una experiencia inigualable con nuestro servicio de lujo personalizado.'}
                  </p>
                   <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '1.5rem', fontWeight: 800 }}>${pkg.price?.toLocaleString()} <small style={{ fontSize: '0.7rem', opacity: 0.5 }}>USD</small></span>
                    <button 
                      onClick={() => setPreviewPkg(pkg)}
                      className="btn-premium" 
                      style={{ padding: '0.6rem 1.2rem', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}
                    >
                      <Info size={16} />
                      Detalles
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Preview Flyer Modal */}
      {previewPkg && (
        <PreviewFlyerModal 
          pkg={previewPkg} 
          onClose={() => setPreviewPkg(null)} 
        />
      )}

      {/* Admin Quick Access (Floating FAB) */}
      <Link href="/login" className="admin-fab">
        <div className="fab-icon-container">
          <Settings size={22} strokeWidth={2.5} />
        </div>
        <span className="fab-text">Acceso Admin</span>
      </Link>
    </main>
  );
}
