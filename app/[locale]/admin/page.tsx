'use client';
import { useLanguage } from '@/context/LanguageContext';
import { tr, setLanguage } from '@/lib/tr';
// app/admin/page.tsx
import React, { useEffect, useState } from 'react';
import {
  LayoutDashboard,
  Calendar,
  Car,
  Ship,
  Hotel,
  Plane,
  CheckCircle2,
  Server,
  TrendingUp,
  DollarSign,
  Users,
  X,
} from 'lucide-react';

// Icon map for KPIs
const kpiIcons = {
  totalReservations: <Calendar size={24} color="#8b5cf6" />, // reservas
  totalRevenue: <DollarSign size={24} color="#10b981" />, // ingresos
  reservationsToday: <TrendingUp size={24} color="#f59e0b" />, // reservas hoy
  conversion: <TrendingUp size={24} color="#ec4899" />, // tasa conversión
  availableServices: <CheckCircle2 size={24} color="#10b981" />, // servicios disponibles
  occupiedServices: <X size={24} color="#ef4444" />, // servicios ocupados
  cancelations: <X size={24} color="#ef4444" />, // cancelaciones
  topDest: <Plane size={24} color="#3b82f6" />, // destino top
  topDriver: <Car size={24} color="#ec4899" />, // conductor top
  topYacht: <Ship size={24} color="#06b6d4" />, // yate top
};

import { getCurrentUserAction } from '@/app/admin/users/actions';
import { TimelineAreaChart } from './reports/reports-charts';

// Metadata map for KPIs
const KPI_METADATA: Record<string, { key: string; label: string; color: string; isCurrency: boolean; suffix?: string }> = {
  totalReservations: { key: 'totalReservations', label: 'Reservas Totales', color: '#8b5cf6', isCurrency: false },
  totalRevenue: { key: 'totalRevenue', label: 'Ingresos Generados', color: '#10b981', isCurrency: true },
  reservationsToday: { key: 'reservationsToday', label: 'Reservas Hoy', color: '#f59e0b', isCurrency: false },
  conversion: { key: 'conversion', label: 'Tasa Conversión', color: '#ec4899', isCurrency: false, suffix: '%' },
  availableServices: { key: 'availableServices', label: 'Servicios Disp.', color: '#10b981', isCurrency: false },
  occupiedServices: { key: 'occupiedServices', label: 'Serv. Ocupados', color: '#ef4444', isCurrency: false },
  cancelations: { key: 'cancelations', label: 'Cancelaciones', color: '#ef4444', isCurrency: false },
  topDest: { key: 'topDestBookings', label: 'Reservas Destino Top', color: '#3b82f6', isCurrency: false },
  topDriver: { key: 'topDriverBookings', label: 'Reservas Conductor Top', color: '#ec4899', isCurrency: false },
  topYacht: { key: 'topYachtBookings', label: 'Reservas Yate Top', color: '#06b6d4', isCurrency: false },
};

export default function AdminDashboard() {
  const { language } = useLanguage();
  setLanguage(language);
  const [kpis, setKpis] = useState<any>(null);
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [selectedKpi, setSelectedKpi] = useState<string>('availableServices');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [visibleServicesCount, setVisibleServicesCount] = useState(2);

  // Reset infinite scroll count when selected KPI or modal open state changes
  useEffect(() => {
    setVisibleServicesCount(2);
  }, [selectedKpi, isModalOpen]);

  const handleCardClick = (key: string) => {
    setSelectedKpi(key);
    setIsModalOpen(true);
  };

  const handleServicesScroll = (e: React.UIEvent<HTMLDivElement>, totalLength: number) => {
    const target = e.currentTarget;
    // Check if user scrolled near the bottom of the container
    if (target.scrollHeight - target.scrollTop <= target.clientHeight + 8) {
      if (visibleServicesCount < totalLength) {
        // Load 2 more items
        setVisibleServicesCount(prev => Math.min(prev + 2, totalLength));
      }
    }
  };

  useEffect(() => {
    async function fetchKPIs() {
      try {
        const res = await fetch('/api/admin/kpis');
        const data = await res.json();
        if (data.success) {
          setKpis(data.data);
        }
      } catch (e) {
        console.error('Error loading KPIs', e);
      } finally {
        setLoading(false);
      }
    }
    fetchKPIs();

    getCurrentUserAction()
      .then(res => {
        if (res.success && res.user) {
          setUser(res.user);
        }
      })
      .catch(e => console.error(e));
  }, []);

  const fmt = (value) => (typeof value === 'number' ? value.toLocaleString('es-MX') : value);

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh' }}>
        <p style={{ color: 'var(--text-muted)' }}>{tr("Cargando métricas…")}</p>
      </div>
    );
  }

  // Get active styling details for KPI cards based on selection state
  const getCardStyle = (key: string, themeColor: string) => {
    const isSelected = selectedKpi === key;
    const isInteractive = key === 'availableServices' || key === 'occupiedServices';
    return {
      padding: '1.2rem',
      cursor: isInteractive ? 'pointer' : 'default',
      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
      border: isSelected && isInteractive ? `1.5px solid ${themeColor}` : '1px solid rgba(255, 255, 255, 0.06)',
      boxShadow: isSelected && isInteractive ? `0 0 20px rgba(${hexToRgb(themeColor)}, 0.25)` : 'none',
      transform: isSelected && isInteractive ? 'translateY(-3px)' : 'none',
      background: isSelected && isInteractive ? 'rgba(255, 255, 255, 0.03)' : '',
    };
  };

  // Helper to convert hex to rgb for glow shadows
  function hexToRgb(hex: string) {
    const shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
    const fullHex = hex.replace(shorthandRegex, (_, r, g, b) => r + r + g + g + b + b);
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(fullHex);
    return result ? `${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(result[3], 16)}` : '139, 92, 246';
  }

  return (
    <div className="admin-dashboard" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', padding: '1rem 0' }}>
      
      {/* Dashboard Header */}
      <div style={{ width: '100%', marginBottom: '0.5rem' }}>
        <h1 style={{ fontSize: '2.2rem', fontWeight: 800, margin: '0 0 0.5rem 0' }} className="text-gradient">
          {tr("Panel de Administración")}
        </h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '1rem', margin: 0 }}>
          {tr("Bienvenido")}{' '}
          <strong style={{ color: 'white' }}>{user?.name || user?.username || tr('Administrador')}</strong>{' '}
          {tr("a su panel de control y estadísticas.")}
        </p>
      </div>

      {/* KPI Grid */}
      <section className="dashboard-stats-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1rem' }}>
        {kpis && (
          <>
            <div 
              className="glass-card" 
              style={getCardStyle('totalReservations', '#8b5cf6')}
            >
              {kpiIcons.totalReservations}
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.5rem', marginBottom: '0.2rem' }}>{tr("Reservas Totales")}</p>
              <div style={{ fontSize: '1.5rem', fontWeight: 700 }}>{fmt(kpis.totalReservations)}</div>
            </div>

            <div 
              className="glass-card" 
              style={getCardStyle('totalRevenue', '#10b981')}
            >
              {kpiIcons.totalRevenue}
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.5rem', marginBottom: '0.2rem' }}>{tr("Ingresos Generados")}</p>
              <div style={{ fontSize: '1.5rem', fontWeight: 700 }}>${fmt(kpis.totalRevenue)}</div>
            </div>

            <div 
              className="glass-card" 
              style={getCardStyle('reservationsToday', '#f59e0b')}
            >
              {kpiIcons.reservationsToday}
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.5rem', marginBottom: '0.2rem' }}>{tr("Reservas Hoy")}</p>
              <div style={{ fontSize: '1.5rem', fontWeight: 700 }}>{fmt(kpis.reservationsToday)}</div>
            </div>



            <div 
              className="glass-card" 
              style={getCardStyle('conversion', '#ec4899')}
            >
              {kpiIcons.conversion}
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.5rem', marginBottom: '0.2rem' }}>{tr("Tasa Conversión")}</p>
              <div style={{ fontSize: '1.5rem', fontWeight: 700 }}>{kpis.conversion}%</div>
            </div>

            <div 
              className="glass-card" 
              onClick={() => handleCardClick('availableServices')}
              style={getCardStyle('availableServices', '#10b981')}
            >
              {kpiIcons.availableServices}
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.5rem', marginBottom: '0.2rem' }}>{tr("Servicios Disp.")}</p>
              <div style={{ fontSize: '1.5rem', fontWeight: 700 }}>{fmt(kpis.availableServices)}</div>
            </div>

            <div 
              className="glass-card" 
              onClick={() => handleCardClick('occupiedServices')}
              style={getCardStyle('occupiedServices', '#ef4444')}
            >
              {kpiIcons.occupiedServices}
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.5rem', marginBottom: '0.2rem' }}>{tr("Serv. Ocupados")}</p>
              <div style={{ fontSize: '1.5rem', fontWeight: 700 }}>{fmt(kpis.occupiedServices)}</div>
            </div>

            <div 
              className="glass-card" 
              style={getCardStyle('cancelations', '#ef4444')}
            >
              {kpiIcons.cancelations}
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.5rem', marginBottom: '0.2rem' }}>{tr("Cancelaciones")}</p>
              <div style={{ fontSize: '1.5rem', fontWeight: 700 }}>{fmt(kpis.cancelations)}</div>
            </div>



            <div 
              className="glass-card" 
              style={getCardStyle('topDest', '#3b82f6')}
            >
              {kpiIcons.topDest}
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.5rem', marginBottom: '0.2rem' }}>{tr("Destino Top")}</p>
              <div style={{ fontSize: '1.5rem', fontWeight: 700, color: '#3b82f6' }}>{kpis.topDest}</div>
            </div>

            <div 
              className="glass-card" 
              style={getCardStyle('topDriver', '#ec4899')}
            >
              {kpiIcons.topDriver}
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.5rem', marginBottom: '0.2rem' }}>{tr("Conductor Top")}</p>
              <div style={{ fontSize: '1.5rem', fontWeight: 700, color: '#ec4899' }}>{kpis.topDriver}</div>
            </div>

            <div 
              className="glass-card" 
              style={getCardStyle('topYacht', '#06b6d4')}
            >
              {kpiIcons.topYacht}
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.5rem', marginBottom: '0.2rem' }}>{tr("Yate Top")}</p>
              <div style={{ fontSize: '1.5rem', fontWeight: 700, color: '#06b6d4' }}>{kpis.topYacht}</div>
            </div>
          </>
        )}
      </section>

      {/* Floating Detail Chart Modal */}
      {isModalOpen && kpis && (selectedKpi === 'availableServices' || selectedKpi === 'occupiedServices') && (
        <div 
          className="modal-overlay-video"
          style={{ 
            position: 'fixed',
            inset: 0,
            zIndex: 2000,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'rgba(0, 0, 0, 0.75)',
            backdropFilter: 'blur(15px)',
            padding: '1.5rem'
          }}
          onClick={() => setIsModalOpen(false)}
        >
          <div 
            className="glass-panel" 
            style={{ 
              width: '90%', 
              maxWidth: '550px', 
              padding: '2rem', 
              background: 'rgba(5, 7, 10, 0.95)', 
              boxShadow: '0 20px 50px rgba(0,0,0,0.6)', 
              position: 'relative',
              display: 'flex',
              flexDirection: 'column',
              gap: '1rem',
              borderRadius: '24px',
              border: '1px solid var(--border-glass)'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <h3 style={{ margin: 0, fontSize: '1.35rem', fontWeight: 700, color: 'white', display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                  <span style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: KPI_METADATA[selectedKpi]?.color || '#8b5cf6' }} />
                  {tr(KPI_METADATA[selectedKpi]?.label || '')}
                </h3>
                <p style={{ margin: '0.3rem 0 0 0', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                  {tr("Desglose detallado del estado de servicios en tiempo real.")}
                </p>
              </div>
              
              <button 
                onClick={() => setIsModalOpen(false)}
                style={{ 
                  background: 'rgba(255,255,255,0.05)', 
                  border: '1px solid rgba(255,255,255,0.1)', 
                  borderRadius: '50%', 
                  width: '32px', 
                  height: '32px', 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center', 
                  color: 'white', 
                  cursor: 'pointer',
                  transition: 'all 0.2s'
                }}
              >
                <X size={18} />
              </button>
            </div>

            {/* Quick Stat */}
            <div style={{ background: 'rgba(255,255,255,0.02)', padding: '1rem', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.04)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>{tr("Valor Actual")}</span>
              <span style={{ fontSize: '1.6rem', fontWeight: 800, color: KPI_METADATA[selectedKpi]?.color || 'white' }}>
                {fmt(kpis[selectedKpi])}
              </span>
            </div>

            {/* Details List for Available/Occupied Services */}
            {(selectedKpi === 'availableServices' || selectedKpi === 'occupiedServices') && (() => {
              const fullList = (selectedKpi === 'availableServices' ? kpis.availableServicesList : kpis.occupiedServicesList) || [];
              const visibleList = fullList.slice(0, visibleServicesCount);
              
              return (
                <div style={{ marginTop: '1rem', display: 'flex', flexDirection: 'column', gap: '0.75rem', borderTop: '1px solid rgba(255, 255, 255, 0.08)', paddingTop: '1rem' }}>
                  <h4 style={{ margin: 0, fontSize: '0.9rem', fontWeight: 600, color: 'white', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span>{selectedKpi === 'availableServices' ? tr("Servicios Disponibles en Detalle") : tr("Servicios Ocupados en Detalle")}</span>
                    <span style={{ fontSize: '0.75rem', padding: '0.1rem 0.4rem', borderRadius: '4px', background: 'rgba(255,255,255,0.05)', color: 'var(--text-muted)' }}>
                      {visibleList.length} / {fullList.length} {tr("ítems")}
                    </span>
                  </h4>
                  
                  {fullList.length === 0 ? (
                    <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--text-muted)' }}>{tr("No hay servicios en este estado.")}</p>
                  ) : (
                    <div 
                      onScroll={(e) => handleServicesScroll(e, fullList.length)}
                      style={{ 
                        display: 'flex', 
                        flexDirection: 'column', 
                        gap: '0.5rem', 
                        maxHeight: '115px', 
                        overflowY: 'auto', 
                        paddingRight: '0.5rem' 
                      }}
                    >
                      {visibleList.map((srv: any) => (
                        <div 
                          key={srv.id} 
                          style={{ 
                            display: 'flex', 
                            justifyContent: 'space-between', 
                            alignItems: 'center', 
                            padding: '0.5rem 0.75rem', 
                            borderRadius: '8px', 
                            background: 'rgba(255, 255, 255, 0.015)', 
                            border: '1px solid rgba(255, 255, 255, 0.04)',
                            fontSize: '0.8rem'
                          }}
                        >
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <span style={{ 
                              fontSize: '0.65rem', 
                              padding: '0.1rem 0.35rem', 
                              borderRadius: '4px', 
                              fontWeight: 600,
                              background: srv.type === 'Taxi' ? 'rgba(236, 72, 153, 0.15)' : 'rgba(6, 182, 212, 0.15)',
                              color: srv.type === 'Taxi' ? '#ec4899' : '#06b6d4'
                            }}>
                              {tr(srv.type)}
                            </span>
                            <span style={{ fontWeight: 500, color: 'white' }}>{srv.name}</span>
                          </div>
                          <span style={{ color: 'var(--text-muted)', fontFamily: 'monospace' }}>{srv.detail}</span>
                        </div>
                      ))}
                      
                      {/* Loading indicator if more items are available */}
                      {visibleServicesCount < fullList.length && (
                        <div style={{ display: 'flex', justifyContent: 'center', padding: '0.4rem', color: 'var(--text-muted)', fontSize: '0.75rem', gap: '0.4rem', alignItems: 'center' }}>
                          <span className="float-animation" style={{ width: '4px', height: '4px', borderRadius: '50%', background: 'var(--primary)' }} />
                          <span className="float-animation" style={{ width: '4px', height: '4px', borderRadius: '50%', background: 'var(--primary)', animationDelay: '0.2s' }} />
                          <span className="float-animation" style={{ width: '4px', height: '4px', borderRadius: '50%', background: 'var(--primary)', animationDelay: '0.4s' }} />
                          <span>{tr("Desliza para cargar más...")}</span>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })()}
          </div>
        </div>
      )}
    </div>
  );
}
