'use client';

import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { useLanguage } from '../context/LanguageContext';

// Custom Map Icons (Golden / Premium Look)
const customIcon = new L.Icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-violet.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
});

export interface MapLocation {
    id: string;
    title: string;
    lat: number;
    lng: number;
    typeEs: string;
    typeEn: string;
    price: string;
    descEs: string;
    descEn: string;
    link: string;
}

export default function ExploreMapComponent({ locations }: { locations: MapLocation[] }) {
    const { language } = useLanguage();
    const isEn = language === 'en';

    // Calculate center dynamically or fallback to Cancun/Riviera Maya
    const centerLat = locations.length > 0 ? locations[0].lat : 20.7;
    const centerLng = locations.length > 0 ? locations[0].lng : -87.3;

    return (
        <div style={{ height: '600px', width: '100%', borderRadius: '32px', overflow: 'hidden', border: '1px solid rgba(255, 255, 255, 0.1)', position: 'relative', boxShadow: '0 20px 50px rgba(0,0,0,0.5)' }}>
            <MapContainer 
                center={[centerLat, centerLng]} 
                zoom={8} 
                scrollWheelZoom={false}
                style={{ height: '100%', width: '100%', background: '#e5e3df' }}
            >
                {/* CartoDB Voyager Tiles for a clean, natural, and premium light look */}
                <TileLayer
                    url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
                    attribution='&copy; <a href="https://carto.com/">CARTO</a>'
                />
                
                {locations.map((loc) => (
                    <Marker key={loc.id} position={[loc.lat, loc.lng]} icon={customIcon}>
                        <Popup className="premium-popup">
                            <div style={{ minWidth: '220px' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                                    <span style={{ fontSize: '0.65rem', background: 'rgba(139, 92, 246, 0.2)', color: '#a78bfa', padding: '0.2rem 0.6rem', borderRadius: '50px', textTransform: 'uppercase', fontWeight: 800, letterSpacing: '0.05em' }}>
                                        {isEn ? loc.typeEn : loc.typeEs}
                                    </span>
                                </div>
                                <h3 style={{ margin: '0 0 0.5rem 0', color: 'white', fontSize: '1.1rem', fontWeight: 800, lineHeight: 1.2 }}>{loc.title}</h3>
                                <p style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.6)', margin: '0 0 1rem 0', lineHeight: 1.5, maxHeight: '60px', overflow: 'hidden', textOverflow: 'ellipsis', display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical' }}>
                                    {isEn ? loc.descEn : loc.descEs}
                                </p>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '1rem', marginTop: '0.5rem' }}>
                                    <div>
                                        {loc.price && <div style={{ fontSize: '0.65rem', color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', fontWeight: 700 }}>{isEn ? "From" : "Desde"}</div>}
                                        <div style={{ fontWeight: 900, color: '#10b981', fontSize: '1rem' }}>{loc.price || '-'}</div>
                                    </div>
                                    <a href={loc.link || "/packages"} style={{ background: 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)', color: 'white', textDecoration: 'none', padding: '0.6rem 1.2rem', borderRadius: '12px', fontSize: '0.8rem', fontWeight: 800, boxShadow: '0 5px 15px rgba(139, 92, 246, 0.4)' }}>
                                        {isEn ? "Book" : "Reservar"}
                                    </a>
                                </div>
                            </div>
                        </Popup>
                    </Marker>
                ))}
            </MapContainer>

            <style jsx global>{`
                /* Leaflet global overrides for glassmorphism */
                .leaflet-popup-content-wrapper {
                    background: rgba(15, 23, 42, 0.85) !important;
                    backdrop-filter: blur(12px) !important;
                    border: 1px solid rgba(139, 92, 246, 0.3) !important;
                    border-radius: 20px !important;
                    color: white !important;
                    box-shadow: 0 20px 40px rgba(0,0,0,0.6) !important;
                    padding: 0 !important;
                }
                .leaflet-popup-content {
                    margin: 16px !important;
                }
                .leaflet-popup-tip {
                    background: rgba(15, 23, 42, 0.9) !important;
                    border-bottom: 1px solid rgba(139, 92, 246, 0.3) !important;
                    border-right: 1px solid rgba(139, 92, 246, 0.3) !important;
                }
                .leaflet-popup-close-button {
                    color: rgba(255,255,255,0.5) !important;
                    font-size: 20px !important;
                    top: 10px !important;
                    right: 10px !important;
                }
                .leaflet-popup-close-button:hover {
                    color: white !important;
                }
                .leaflet-container {
                    font-family: inherit !important;
                }
                /* Hide leaflet watermark for cleaner look */
                .leaflet-control-attribution {
                    background: rgba(0,0,0,0.5) !important;
                    color: rgba(255,255,255,0.5) !important;
                }
                .leaflet-control-attribution a {
                    color: rgba(255,255,255,0.7) !important;
                }
                .leaflet-bar a {
                    background-color: rgba(15, 23, 42, 0.8) !important;
                    border-bottom: 1px solid rgba(255,255,255,0.1) !important;
                    color: white !important;
                    backdrop-filter: blur(10px) !important;
                }
                .leaflet-bar a:hover {
                    background-color: rgba(139, 92, 246, 0.8) !important;
                }
            `}</style>
        </div>
    );
}
