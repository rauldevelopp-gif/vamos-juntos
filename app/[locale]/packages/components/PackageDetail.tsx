import React from 'react';
import { TourPackage } from '../types';
import { 
  X, 
  Clock, 
  Users, 
  ShieldCheck, 
  ChevronRight, 
  Car, 
  User,
  Star,
  Play
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useLanguage } from '../../../../context/LanguageContext';
import { useCurrency } from '../../../../context/CurrencyContext';
import { getYoutubeId, getVimeoId, getEmbedUrl, isYoutubeOrVimeo } from '@/components/PromotionVideosComponent';

export const RouteTimeline: React.FC<{ pkg: TourPackage }> = ({ pkg }) => {
  const { language } = useLanguage();
  const isEn = language === 'en';

  return (
    <div className="timeline-container">
      <div className="line" />
      
      {/* Pickup */}
      <div className="step pickup">
        <div className="dot" />
        <div className="info">
          <p className="label">{isEn ? "Pickup Point" : "Punto de Recogida"}</p>
          <p className="val">{pkg.pickup.name}</p>
        </div>
      </div>

      {/* Places */}
      {pkg.items.map((item, idx) => (
        <div key={item.id} className="step parada">
          <div className="dot" />
          <div className="info">
            <p className="label">{isEn ? `Stop ${idx + 1}` : `Parada ${idx + 1}`}</p>
            <p className="val">{item.name}</p>
          </div>
        </div>
      ))}

      {/* Dropoff */}
      <div className="step dropoff">
        <div className="dot" />
        <div className="info">
          <p className="label">{isEn ? "Final Destination" : "Destino Final"}</p>
          <p className="val">{pkg.dropoff.name}</p>
        </div>
      </div>

      <style jsx>{`
        .timeline-container { position: relative; padding-left: 2rem; }
        .line { position: absolute; left: 0.35rem; top: 0.5rem; bottom: 0.5rem; width: 2px; background: linear-gradient(to bottom, #10b981, #8b5cf6, #f43f5e); }
        .step { position: relative; margin-bottom: 2rem; }
        .step:last-child { margin-bottom: 0; }
        .dot { position: absolute; left: -2rem; top: 0.25rem; width: 0.8rem; height: 0.8rem; border-radius: 50%; background: #151515; border: 2px solid white; z-index: 2; }
        .pickup .dot { background: #10b981; border-color: #10b981; box-shadow: 0 0 10px rgba(16, 185, 129, 0.5); }
        .parada .dot { border-color: #8b5cf6; }
        .dropoff .dot { background: #f43f5e; border-color: #f43f5e; box-shadow: 0 0 10px rgba(244, 63, 94, 0.5); }
        .info .label { font-size: 0.6rem; font-weight: 900; text-transform: uppercase; letter-spacing: 0.1em; color: rgba(255,255,255,0.4); margin-bottom: 0.25rem; }
        .info .val { font-size: 0.85rem; font-weight: 700; color: white; }
      `}</style>
    </div>
  );
};

interface PackageDetailProps {
  pkg: TourPackage;
  onClose: () => void;
  onContinue: (pkg: TourPackage) => void;
}

export const PackageDetail: React.FC<PackageDetailProps> = ({ pkg, onClose, onContinue }) => {
  const { language } = useLanguage();
  const { formatPrice } = useCurrency();
  const isEn = language === 'en';
  const [showOwnerInfo, setShowOwnerInfo] = React.useState(false);
  const [playingVideo, setPlayingVideo] = React.useState<any | null>(null);

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-container" onClick={e => e.stopPropagation()}>
        <button 
          onClick={onClose}
          className="close-btn"
        >
          <X size={20} />
        </button>

        {/* Left: Visuals */}
        <div className="visuals-side">
          <Image 
            src={pkg.image} 
            alt={pkg.name}
            fill
            className="hero-img"
            style={{ objectFit: 'cover' }}
            unoptimized
          />
          <div className="visuals-overlay" />
          
          <div className="visuals-content">
            <div className="rating-row">
              <div className="stars">
                {[...Array(5)].map((_, i) => <Star key={i} size={14} fill="currentColor" />)}
              </div>
              <span>{isEn ? "5-Star Experience" : "Experiencia 5 Estrellas"}</span>
            </div>
            <h2 className="pkg-title">{pkg.name}</h2>
            <p className="pkg-subtitle">
              {isEn 
                ? `Explore the best of ${pkg.pickup.name} with custom boutique service.`
                : `Explora lo mejor de ${pkg.pickup.name} con un servicio boutique personalizado.`}
            </p>
            
            <Link 
              href={`/operator/${pkg.owner?.slug || 'vamosjuntos-vip'}`}
              className="owner-badge-link"
              onClick={e => e.stopPropagation()}
            >
              <ShieldCheck size={16} />
              <span>{isEn ? "Operated by: " : "Operado por: "}{pkg.owner?.name || 'VamosJuntos VIP'}</span>
            </Link>
          </div>
        </div>

        {/* Right: Content */}
        <div className="content-side custom-scrollbar">
          <div className="content-grid">
            {/* Main Info */}
            <div className="info-section">
              <section>
                <h3 className="section-label">{isEn ? "Package Details" : "Detalles del Paquete"}</h3>
                <p className="description">{pkg.description}</p>
                <div className="meta-pills">
                  <div className="pill">
                    <Clock size={20} />
                    <div>
                      <p className="pill-label">{isEn ? "Duration" : "Duración"}</p>
                      <p className="pill-value">{pkg.duration}</p>
                    </div>
                  </div>
                  <div className="pill">
                    <Users size={20} />
                    <div>
                      <p className="pill-label">{isEn ? "Capacity" : "Capacidad"}</p>
                      <p className="pill-value">{pkg.maxPassengers} {isEn ? "People" : "Personas"}</p>
                    </div>
                  </div>
                </div>
              </section>

              <section style={{ marginTop: '3rem' }}>
                <h3 className="section-label">{isEn ? "Premium Transport Included" : "Transporte Premium Incluido"}</h3>
                <div className="vehicle-card">
                  <div className="vehicle-icon">
                    <Car size={32} />
                  </div>
                  <div>
                    <h4 className="vehicle-name">{pkg.vehicle.name}</h4>
                    <p className="vehicle-meta">{pkg.vehicle.type} • {pkg.vehicle.capacity} {isEn ? "Seats" : "Asientos"}</p>
                    <div className="driver-info">
                      <User size={14} />
                      <span>{isEn ? "Driver" : "Driver"}: {pkg.driver.name}</span>
                    </div>
                  </div>
                </div>
              </section>
            </div>

            {/* Route & Pricing */}
            <div className="action-section">
              <section>
                <h3 className="section-label">{isEn ? "Suggested Itinerary" : "Itinerario Sugerido"}</h3>
                <div className="timeline-box">
                  <RouteTimeline pkg={pkg} />
                </div>
              </section>

            </div>
          </div>

          {/* Promotional Videos */}
          {pkg.videos && pkg.videos.length > 0 && (
            <section style={{ marginTop: '3rem', borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '2.5rem' }}>
              <h3 className="section-label">{isEn ? "Promotional Videos" : "Videos Promocionales"}</h3>
              <div className="videos-carousel hide-scrollbar" style={{ display: 'flex', gap: '1.25rem', overflowX: 'auto', paddingBottom: '1.5rem', scrollSnapType: 'x mandatory' }}>
                {pkg.videos.map((video, idx) => {
                  const isYt = getYoutubeId(video.videoUrl) !== null;
                  const isVim = getVimeoId(video.videoUrl) !== null;
                  return (
                    <div 
                      key={video.id || idx} 
                      className="video-carousel-card" 
                      onClick={() => setPlayingVideo(video)}
                    >
                      <div className="video-card-thumb-wrap">
                        {video.thumbnailUrl ? (
                          <img src={video.thumbnailUrl} alt={video.title} className="video-card-img" />
                        ) : (
                          <div className="video-card-placeholder">
                            <Play size={24} color="#8b5cf6" />
                          </div>
                        )}
                        <div className="video-card-overlay">
                          <div className="play-button-glow">
                            <Play size={18} fill="currentColor" />
                          </div>
                        </div>
                      </div>
                      <div className="video-card-title">{video.title}</div>
                    </div>
                  );
                })}
              </div>
            </section>
          )}

          <div className="pricing-bar">
            <div className="pricing-info">
              <p className="pricing-label">{isEn ? "Total" : "Total"}</p>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <h3 className="price-value" style={{ fontSize: '2rem' }}>{formatPrice(pkg.price)}</h3>
              </div>
            </div>
            <button 
              onClick={() => onContinue(pkg)}
              className="continue-btn-inline"
            >
              {isEn ? "Reserve" : "Reserva"} <ChevronRight size={18} />
            </button>
          </div>
        </div>
      </div>

      {showOwnerInfo && (
        <div className="modal-overlay" style={{ zIndex: 10001, background: 'rgba(0,0,0,0.8)' }} onClick={() => setShowOwnerInfo(false)}>
          <div className="owner-modal-container" onClick={e => e.stopPropagation()}>
            <button className="close-btn" style={{ top: '1rem', right: '1rem', width: '2rem', height: '2rem' }} onClick={() => setShowOwnerInfo(false)}>
              <X size={16} />
            </button>
            <div style={{ textAlign: 'center', margin: '2rem 0' }}>
              <div style={{ width: '5rem', height: '5rem', background: '#8b5cf6', borderRadius: '50%', margin: '0 auto 1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 10px 30px rgba(139, 92, 246, 0.4)' }}>
                <User size={40} color="white" />
              </div>
              <h3 style={{ fontSize: '1.5rem', color: 'white', margin: '0 0 0.5rem 0', fontWeight: 900 }}>{pkg.owner?.name || 'VamosJuntos VIP'}</h3>
              <p style={{ margin: '0', color: 'var(--text-muted)', fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '0.1em', fontWeight: 800 }}>{isEn ? "Authorized Agent" : "Agente Autorizado"}</p>
            </div>
            
            <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', padding: '1.5rem', borderRadius: '20px', fontSize: '0.95rem', color: 'rgba(255,255,255,0.8)', marginBottom: '1.5rem', lineHeight: 1.6 }}>
              {isEn 
                ? `This package is operated and guaranteed directly by ${pkg.owner?.name || 'our VIP team'}. All services include first class custom care.`
                : `Este paquete es operado y garantizado directamente por ${pkg.owner?.name || 'nuestro equipo VIP'}. Todos los servicios incluyen atención personalizada de primera clase.`}
            </div>

            {pkg.owner?.email && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '0.85rem', color: 'var(--text-muted)', background: 'rgba(16, 185, 129, 0.05)', padding: '1rem', borderRadius: '16px', border: '1px solid rgba(16, 185, 129, 0.1)' }}>
                <ShieldCheck size={18} color="#10b981" />
                <span>{isEn ? "Support Contact" : "Contacto de soporte"}: <strong style={{ color: 'white' }}>{pkg.owner.email}</strong></span>
              </div>
            )}
          </div>
        </div>
      )}

      <style jsx>{`
        .modal-overlay { 
            position: fixed; 
            inset: 0; 
            background: rgba(0,0,0,0.9); 
            backdrop-filter: blur(20px); 
            z-index: 10000; 
            display: flex; 
            align-items: center; 
            justify-content: center; 
            padding: 2rem; 
        }
        .modal-container { 
            position: relative; 
            width: 100%; 
            max-width: 1100px; 
            height: 90vh; 
            background: #0a0a0a; 
            border-radius: 40px; 
            overflow: hidden; 
            display: flex; 
            box-shadow: 0 50px 100px -20px rgba(0,0,0,0.5);
            border: 1px solid rgba(255,255,255,0.1);
        }
        .close-btn { 
            position: absolute; 
            top: 1.5rem; 
            right: 1.5rem; 
            z-index: 100; 
            width: 3rem; 
            height: 3rem; 
            background: rgba(0,0,0,0.5); 
            backdrop-filter: blur(10px); 
            border: 1px solid rgba(255,255,255,0.1); 
            border-radius: 50%; 
            color: white; 
            display: flex; 
            align-items: center; 
            justify-content: center; 
            cursor: pointer; 
            transition: all 0.3s;
        }
        .close-btn:hover { background: white; color: black; }

        .visuals-side { width: 42%; position: relative; overflow: hidden; }
        .hero-img { width: 100%; height: 100%; object-fit: cover; }
        .visuals-overlay { position: absolute; inset: 0; background: linear-gradient(to top, #0a0a0a, transparent); }
        .visuals-content { position: absolute; bottom: 3rem; left: 3rem; right: 3rem; }

        .rating-row { display: flex; align-items: center; gap: 0.5rem; margin-bottom: 1rem; }
        .stars { color: #facc15; display: flex; }
        .rating-row span { font-size: 0.75rem; font-weight: 700; color: rgba(255,255,255,0.5); }
        
        .pkg-title { font-size: 2.5rem; font-weight: 900; color: white; line-height: 1.1; margin-bottom: 0.5rem; }
        .pkg-subtitle { font-size: 0.95rem; color: rgba(255,255,255,0.4); font-weight: 500; margin-bottom: 1rem; }

        :global(.owner-badge-link) { 
            display: inline-flex !important; 
            align-items: center !important; 
            gap: 0.6rem !important; 
            padding: 0.5rem 1.5rem !important; 
            background: rgba(139, 92, 246, 0.1) !important; 
            border: 1px solid rgba(139, 92, 246, 0.3) !important; 
            color: #c4b5fd !important; 
            border-radius: 100px !important; 
            font-size: 0.85rem !important; 
            font-weight: 700 !important; 
            cursor: pointer !important; 
            text-decoration: none !important; 
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1) !important;
            box-shadow: 0 4px 15px rgba(0,0,0,0.2) !important;
        }
        :global(.owner-badge-link span) {
            color: #c4b5fd !important;
            text-decoration: none !important;
            font-weight: 700 !important;
        }
        :global(.owner-badge-link svg) {
            color: #8b5cf6 !important;
            flex-shrink: 0;
        }
        :global(.owner-badge-link:hover) { 
            background: rgba(139, 92, 246, 0.2) !important; 
            border-color: #a78bfa !important; 
            transform: translateY(-2px) !important; 
            box-shadow: 0 8px 20px rgba(139, 92, 246, 0.25) !important; 
        }
        :global(.owner-badge-link:hover span) {
            color: white !important;
        }
        :global(.owner-badge-link:hover svg) {
            color: #a78bfa !important;
        }

        .owner-modal-container { width: 90%; max-width: 400px; background: #151515; border-radius: 24px; padding: 2rem; position: relative; border: 1px solid rgba(255,255,255,0.1); box-shadow: 0 20px 40px rgba(0,0,0,0.5); }

        .content-side { flex: 1; overflow-y: auto; padding: 3.5rem; }
        .content-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 4rem; }

        .section-label { font-size: 0.7rem; font-weight: 900; color: #8b5cf6; text-transform: uppercase; letter-spacing: 0.2em; margin-bottom: 1.5rem; }
        .description { font-size: 1rem; color: rgba(255,255,255,0.7); line-height: 1.7; margin-bottom: 2rem; }
        
        .meta-pills { display: flex; flex-wrap: wrap; gap: 2rem; }
        .pill { background: transparent; border: none; padding: 0; display: flex; align-items: center; gap: 0.75rem; color: #8b5cf6; }
        .pill-label { font-size: 0.65rem; font-weight: 800; color: rgba(255,255,255,0.4); text-transform: uppercase; margin-bottom: 0.1rem; }
        .pill-value { font-size: 0.95rem; font-weight: 800; color: white; }

        .vehicle-card { background: rgba(255,255,255,0.02); border: 1px solid rgba(255,255,255,0.05); padding: 1.5rem; border-radius: 28px; display: flex; align-items: center; gap: 1.5rem; }
        .vehicle-icon { width: 4rem; height: 4rem; background: #1a1a1a; border-radius: 20px; display: flex; align-items: center; justify-content: center; color: #8b5cf6; }
        .vehicle-name { font-size: 1.1rem; font-weight: 800; color: white; }
        .vehicle-meta { font-size: 0.7rem; font-weight: 800; color: rgba(255,255,255,0.3); text-transform: uppercase; letter-spacing: 0.1em; }
        .driver-info { display: flex; align-items: center; gap: 0.5rem; margin-top: 0.5rem; color: #10b981; font-size: 0.75rem; font-weight: 700; }

        .timeline-box { background: rgba(255,255,255,0.02); border: 1px solid rgba(255,255,255,0.05); padding: 2.5rem; border-radius: 32px; }

        .pricing-bar { display: flex; align-items: center; justify-content: space-between; background: #8b5cf6; padding: 1.5rem 2.5rem; border-radius: 24px; color: white; box-shadow: 0 20px 40px rgba(139, 92, 246, 0.3); margin-top: 3rem; }
        .pricing-label { font-size: 0.7rem; font-weight: 900; color: rgba(255,255,255,0.6); text-transform: uppercase; letter-spacing: 0.1em; margin-bottom: 0.2rem; }
        .price-value { font-size: 2rem; font-weight: 900; margin: 0; display: flex; align-items: baseline; gap: 0.2rem; }
        
        .continue-btn-inline { background: white; color: #8b5cf6; border: none; padding: 1rem 2rem; border-radius: 16px; font-weight: 900; text-transform: uppercase; letter-spacing: 0.1em; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 0.75rem; transition: all 0.3s; }
        .continue-btn-inline:hover { transform: scale(1.05); box-shadow: 0 10px 20px rgba(0,0,0,0.2); }

        .custom-scrollbar::-webkit-scrollbar { width: 6px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 10px; }

        @media (max-width: 992px) {
            .modal-container { flex-direction: column; height: auto; max-height: 95vh; }
            .visuals-side { width: 100%; height: 280px; }
            .content-grid { grid-template-columns: 1fr; gap: 2.5rem; }
            .content-side { padding: 2rem; }
            .pricing-bar { flex-direction: column; align-items: stretch; gap: 1.5rem; padding: 1.5rem; }
            .pricing-info { display: flex; justify-content: space-between; align-items: center; }
        }

        .videos-carousel::-webkit-scrollbar { display: none; }
        .video-carousel-card { 
            flex-shrink: 0; 
            width: 220px; 
            cursor: pointer; 
            scroll-snap-align: start; 
            transition: all 0.3s; 
        }
        .video-carousel-card:hover { transform: translateY(-4px); }
        .video-card-thumb-wrap { 
            position: relative; 
            height: 124px; 
            border-radius: 16px; 
            overflow: hidden; 
            background: #111; 
            border: 1px solid rgba(255,255,255,0.06); 
        }
        .video-card-img { width: 100%; height: 100%; object-fit: cover; }
        .video-card-placeholder { 
            width: 100%; 
            height: 100%; 
            display: flex; 
            align-items: center; 
            justify-content: center; 
            background: linear-gradient(135deg, #151515 0%, #222 100%); 
        }
        .video-card-overlay { 
            position: absolute; 
            inset: 0; 
            background: rgba(0,0,0,0.3); 
            display: flex; 
            align-items: center; 
            justify-content: center; 
            opacity: 0.8; 
            transition: opacity 0.3s; 
        }
        .video-carousel-card:hover .video-card-overlay { opacity: 1; background: rgba(0,0,0,0.4); }
        .play-button-glow { 
            width: 44px; 
            height: 44px; 
            border-radius: 50%; 
            background: #8b5cf6; 
            color: white; 
            display: flex; 
            align-items: center; 
            justify-content: center; 
            box-shadow: 0 0 20px rgba(139, 92, 246, 0.6); 
            transition: all 0.3s; 
            transform: scale(0.9);
        }
        .video-carousel-card:hover .play-button-glow { 
            transform: scale(1.05); 
            background: #7c3aed; 
            box-shadow: 0 0 25px rgba(139, 92, 246, 0.8); 
        }
        .video-card-title { 
            font-size: 0.85rem; 
            font-weight: 700; 
            color: rgba(255,255,255,0.85); 
            margin-top: 0.75rem; 
            white-space: nowrap; 
            overflow: hidden; 
            text-overflow: ellipsis; 
            transition: color 0.3s;
        }
        .video-carousel-card:hover .video-card-title { color: white; }
        
        .video-lightbox-container { 
            width: 90%; 
            max-width: 900px; 
            background: #080808; 
            border: 1px solid rgba(255,255,255,0.1); 
            border-radius: 28px; 
            padding: 2rem; 
            box-shadow: 0 40px 80px rgba(0,0,0,0.8); 
        }
        .video-lightbox-aspect { 
            position: relative; 
            padding-top: 56.25%; 
            background: #000; 
            border-radius: 16px; 
            overflow: hidden; 
        }
      `}</style>
      {playingVideo && (
        <div className="modal-overlay" onClick={() => setPlayingVideo(null)} style={{ zIndex: 10002, background: 'rgba(0,0,0,0.95)', backdropFilter: 'blur(25px)' }}>
          <div className="video-lightbox-container" onClick={e => e.stopPropagation()}>
            <button 
              className="close-btn" 
              onClick={() => setPlayingVideo(null)}
              style={{ top: '1.5rem', right: '1.5rem' }}
            >
              <X size={20} />
            </button>
            <div className="video-lightbox-aspect">
              {isYoutubeOrVimeo(playingVideo.videoUrl) ? (
                <iframe 
                  src={getEmbedUrl(playingVideo.videoUrl)}
                  title={playingVideo.title}
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                  style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', borderRadius: '16px' }}
                />
              ) : (
                <video 
                  src={playingVideo.videoUrl} 
                  controls 
                  autoPlay 
                  style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'contain', borderRadius: '16px' }}
                />
              )}
            </div>
            <h4 style={{ color: 'white', marginTop: '1.5rem', fontSize: '1.2rem', fontWeight: 800 }}>{playingVideo.title}</h4>
          </div>
        </div>
      )}
    </div>
  );
};
