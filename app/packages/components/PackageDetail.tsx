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
  Star
} from 'lucide-react';
import Image from 'next/image';

export const RouteTimeline: React.FC<{ pkg: TourPackage }> = ({ pkg }) => {
  return (
    <div className="timeline-container">
      <div className="line" />
      
      {/* Pickup */}
      <div className="step pickup">
        <div className="dot" />
        <div className="info">
          <p className="label">Punto de Recogida</p>
          <p className="val">{pkg.pickup.name}</p>
        </div>
      </div>

      {/* Places */}
      {pkg.items.map((item, idx) => (
        <div key={item.id} className="step parada">
          <div className="dot" />
          <div className="info">
            <p className="label">Parada {idx + 1}</p>
            <p className="val">{item.name}</p>
          </div>
        </div>
      ))}

      {/* Dropoff */}
      <div className="step dropoff">
        <div className="dot" />
        <div className="info">
          <p className="label">Destino Final</p>
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
              <span>Experiencia 5 Estrellas</span>
            </div>
            <h2 className="pkg-title">{pkg.name}</h2>
            <p className="pkg-subtitle">
              Explora lo mejor de {pkg.pickup.name} con un servicio boutique personalizado.
            </p>
          </div>
        </div>

        {/* Right: Content */}
        <div className="content-side custom-scrollbar">
          <div className="content-grid">
            {/* Main Info */}
            <div className="info-section">
              <section>
                <h3 className="section-label">Detalles del Paquete</h3>
                <p className="description">{pkg.description}</p>
                <div className="meta-pills">
                  <div className="pill">
                    <Clock size={20} />
                    <div>
                      <p className="pill-label">Duración</p>
                      <p className="pill-value">{pkg.duration}</p>
                    </div>
                  </div>
                  <div className="pill">
                    <Users size={20} />
                    <div>
                      <p className="pill-label">Capacidad</p>
                      <p className="pill-value">{pkg.maxPassengers} Personas</p>
                    </div>
                  </div>
                </div>
              </section>

              <section style={{ marginTop: '3rem' }}>
                <h3 className="section-label">Transporte Premium Incluido</h3>
                <div className="vehicle-card">
                  <div className="vehicle-icon">
                    <Car size={32} />
                  </div>
                  <div>
                    <h4 className="vehicle-name">{pkg.vehicle.name}</h4>
                    <p className="vehicle-meta">{pkg.vehicle.type} • {pkg.vehicle.capacity} Asientos</p>
                    <div className="driver-info">
                      <User size={14} />
                      <span>Driver: {pkg.driver.name}</span>
                    </div>
                  </div>
                </div>
              </section>
            </div>

            {/* Route & Pricing */}
            <div className="action-section">
              <section>
                <h3 className="section-label">Itinerario Sugerido</h3>
                <div className="timeline-box">
                  <RouteTimeline pkg={pkg} />
                </div>
              </section>

              <section className="pricing-card">
                <div className="pricing-header">
                  <div>
                    <p className="pricing-label">Inversión Total</p>
                    <h3 className="price-value">${pkg.price} <small>USD</small></h3>
                  </div>
                  <ShieldCheck size={40} className="shield-icon" />
                </div>
                <button 
                  onClick={() => onContinue(pkg)}
                  className="continue-btn"
                >
                  Continuar Reserva <ChevronRight size={18} />
                </button>
              </section>
            </div>
          </div>
        </div>
      </div>

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
        .pkg-subtitle { font-size: 0.95rem; color: rgba(255,255,255,0.4); font-weight: 500; }

        .content-side { flex: 1; overflow-y: auto; padding: 3.5rem; }
        .content-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 4rem; }

        .section-label { font-size: 0.7rem; font-weight: 900; color: #8b5cf6; text-transform: uppercase; letter-spacing: 0.2em; margin-bottom: 1.5rem; }
        .description { font-size: 1rem; color: rgba(255,255,255,0.7); line-height: 1.7; margin-bottom: 2rem; }
        
        .meta-pills { display: flex; flex-wrap: wrap; gap: 1rem; }
        .pill { background: #151515; border: 1px solid rgba(255,255,255,0.05); padding: 1.25rem 1.5rem; border-radius: 20px; display: flex; align-items: center; gap: 1rem; }
        .pill-label { font-size: 0.6rem; font-weight: 900; color: rgba(255,255,255,0.4); text-transform: uppercase; }
        .pill-value { font-size: 0.9rem; font-weight: 900; color: white; }

        .vehicle-card { background: rgba(255,255,255,0.02); border: 1px solid rgba(255,255,255,0.05); padding: 1.5rem; border-radius: 28px; display: flex; align-items: center; gap: 1.5rem; }
        .vehicle-icon { width: 4rem; height: 4rem; background: #1a1a1a; border-radius: 20px; display: flex; align-items: center; justify-content: center; color: #8b5cf6; }
        .vehicle-name { font-size: 1.1rem; font-weight: 800; color: white; }
        .vehicle-meta { font-size: 0.7rem; font-weight: 800; color: rgba(255,255,255,0.3); text-transform: uppercase; letter-spacing: 0.1em; }
        .driver-info { display: flex; align-items: center; gap: 0.5rem; margin-top: 0.5rem; color: #10b981; font-size: 0.75rem; font-weight: 700; }

        .timeline-box { background: rgba(255,255,255,0.02); border: 1px solid rgba(255,255,255,0.05); padding: 2.5rem; border-radius: 32px; }

        .pricing-card { background: #8b5cf6; padding: 2.5rem; border-radius: 32px; color: white; box-shadow: 0 20px 40px rgba(139, 92, 246, 0.3); }
        .pricing-header { display: flex; justify-content: space-between; align-items: flex-end; margin-bottom: 2rem; }
        .pricing-label { font-size: 0.7rem; font-weight: 900; color: rgba(255,255,255,0.6); text-transform: uppercase; letter-spacing: 0.1em; }
        .price-value { font-size: 2.5rem; font-weight: 900; }
        .price-value small { font-size: 0.9rem; font-weight: 700; opacity: 0.6; text-transform: uppercase; }
        
        .continue-btn { width: 100%; background: white; color: #8b5cf6; border: none; padding: 1.5rem; border-radius: 20px; font-weight: 900; text-transform: uppercase; letter-spacing: 0.1em; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 0.75rem; transition: all 0.3s; }
        .continue-btn:hover { transform: scale(1.02); box-shadow: 0 10px 20px rgba(0,0,0,0.2); }

        .custom-scrollbar::-webkit-scrollbar { width: 6px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 10px; }

        @media (max-width: 992px) {
            .modal-container { flex-direction: column; height: auto; max-height: 95vh; }
            .visuals-side { width: 100%; height: 280px; }
            .content-grid { grid-template-columns: 1fr; gap: 2.5rem; }
            .content-side { padding: 2rem; }
        }
      `}</style>
    </div>
  );
};
