'use client';

import dynamic from 'next/dynamic';
import { Loader2 } from 'lucide-react';

const ExploreMapComponent = dynamic(
  () => import('./ExploreMapComponent'),
  { 
    ssr: false,
    loading: () => (
      <div style={{ height: '600px', width: '100%', borderRadius: '32px', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: '1rem' }}>
        <Loader2 className="animate-spin" size={40} color="#8b5cf6" />
        <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.9rem' }}>Cargando mapa interactivo...</p>
      </div>
    )
  }
);

import { MapLocation } from './ExploreMapComponent';

export default function ExploreMap({ locations = [] }: { locations?: MapLocation[] }) {
  return <ExploreMapComponent locations={locations} />;
}
