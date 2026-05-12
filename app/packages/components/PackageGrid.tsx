import React from 'react';
import { TourPackage } from '../types';
import { Clock, Users, MapPin, ArrowRight, Sparkles } from 'lucide-react';

interface PackageCardProps {
  pkg: TourPackage;
  onSelect: (pkg: TourPackage) => void;
  onBook: (pkg: TourPackage) => void;
}

export const PackageCard: React.FC<PackageCardProps> = ({ pkg, onSelect, onBook }) => {
  return (
    <div className="group relative bg-zinc-900/50 backdrop-blur-xl border border-white/10 rounded-[32px] overflow-hidden hover:border-violet-500/50 transition-all duration-500 hover:shadow-2xl hover:shadow-violet-500/10">
      {/* Image Section */}
      <div className="relative h-64 overflow-hidden">
        <img 
          src={pkg.image} 
          alt={pkg.name}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/20 to-transparent" />
        
        <div className="absolute top-4 left-4">
          <span className="px-3 py-1 bg-violet-600 text-white text-[10px] font-black tracking-widest uppercase rounded-lg shadow-lg">
            EXCLUSIVO
          </span>
        </div>

        <div className="absolute bottom-4 right-4 bg-black/60 backdrop-blur-md px-4 py-2 rounded-2xl border border-white/10">
          <span className="text-xl font-black text-white">${pkg.price}</span>
          <span className="text-[10px] text-white/60 ml-1 font-bold uppercase">USD</span>
        </div>
      </div>

      {/* Content Section */}
      <div className="p-6">
        <div className="flex items-center gap-2 mb-3">
          <div className="flex -space-x-2">
            {pkg.items.slice(0, 3).map((item, idx) => (
              <div key={idx} className="w-6 h-6 rounded-full bg-zinc-800 border border-zinc-700 flex items-center justify-center">
                <Sparkles size={10} className="text-violet-400" />
              </div>
            ))}
          </div>
          <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider">
            {pkg.items.length} Experiencias incluidas
          </span>
        </div>

        <h3 className="text-xl font-bold text-white mb-2 line-clamp-1 group-hover:text-violet-400 transition-colors">
          {pkg.name}
        </h3>
        
        <p className="text-sm text-zinc-400 line-clamp-2 mb-6 font-medium leading-relaxed">
          {pkg.description}
        </p>

        <div className="grid grid-cols-2 gap-4 mb-8">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-zinc-800 flex items-center justify-center text-zinc-400">
              <Clock size={14} />
            </div>
            <div>
              <p className="text-[10px] text-zinc-500 font-bold uppercase">Duración</p>
              <p className="text-xs text-white font-bold">{pkg.duration}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-zinc-800 flex items-center justify-center text-zinc-400">
              <Users size={14} />
            </div>
            <div>
              <p className="text-[10px] text-zinc-500 font-bold uppercase">Capacidad</p>
              <p className="text-xs text-white font-bold">{pkg.maxPassengers} pax</p>
            </div>
          </div>
        </div>

        <div className="space-y-3 mb-8">
          <div className="flex items-center gap-3 text-xs">
            <MapPin size={14} className="text-emerald-500" />
            <span className="text-zinc-400">Origen:</span>
            <span className="text-white font-bold">{pkg.pickup.name}</span>
          </div>
          <div className="flex items-center gap-3 text-xs">
            <MapPin size={14} className="text-rose-500" />
            <span className="text-zinc-400">Destino:</span>
            <span className="text-white font-bold">{pkg.dropoff.name}</span>
          </div>
        </div>

        <div className="flex gap-3">
          <button 
            onClick={() => onSelect(pkg)}
            className="flex-1 px-4 py-3 bg-zinc-800 hover:bg-zinc-700 text-white text-xs font-bold rounded-2xl transition-all flex items-center justify-center gap-2"
          >
            Detalles
          </button>
          <button 
            onClick={() => onBook(pkg)}
            className="flex-1 px-4 py-3 bg-violet-600 hover:bg-violet-500 text-white text-xs font-bold rounded-2xl transition-all shadow-lg shadow-violet-600/20 flex items-center justify-center gap-2"
          >
            Reservar <ArrowRight size={14} />
          </button>
        </div>
      </div>
    </div>
  );
};

export const PackageGrid: React.FC<{ 
  packages: TourPackage[]; 
  onSelect: (pkg: TourPackage) => void;
  onBook: (pkg: TourPackage) => void;
}> = ({ packages, onSelect, onBook }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {packages.map((pkg) => (
        <PackageCard 
          key={pkg.id} 
          pkg={pkg} 
          onSelect={onSelect} 
          onBook={onBook} 
        />
      ))}
    </div>
  );
};
