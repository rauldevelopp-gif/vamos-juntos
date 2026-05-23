// app/admin/page.tsx
"use client";
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
  newClients: <Users size={24} color="#06b6d4" />, // nuevos clientes
  conversion: <TrendingUp size={24} color="#ec4899" />, // tasa conversión
  availableServices: <CheckCircle2 size={24} color="#10b981" />, // servicios disponibles
  occupiedServices: <X size={24} color="#ef4444" />, // servicios ocupados
  cancelations: <X size={24} color="#ef4444" />, // cancelaciones
  ticketPromedio: <TrendingUp size={24} color="#f59e0b" />, // ticket promedio
  topDest: <Plane size={24} color="#3b82f6" />, // destino top
  topDriver: <Car size={24} color="#ec4899" />, // conductor top
  topYacht: <Ship size={24} color="#06b6d4" />, // yate top
  topRestaurant: <Hotel size={24} color="#f59e0b" />, // restaurante top
};

export default function AdminDashboard() {
  const [kpis, setKpis] = useState(null);
  const [loading, setLoading] = useState(true);

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
  }, []);

  const fmt = (value) => (typeof value === 'number' ? value.toLocaleString('es-MX') : value);

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh' }}>
        <p style={{ color: 'var(--text-muted)' }}>Cargando métricas…</p>
      </div>
    );
  }

  return (
    <div className="admin-dashboard" style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap' }}>
      {/* KPI Grid */}
      <section className="dashboard-stats-grid" style={{ flex: 1, display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem' }}>
        {kpis && (
          <>
            <div className="glass-card" style={{ padding: '1.5rem', border: kpis.totalReservations ? '2px solid #8b5cf6' : '' }}>
              {kpiIcons.totalReservations}
              <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>Reservas Totales</p>
              <div style={{ fontSize: '1.8rem', fontWeight: 700, margin: '0.5rem 0' }}>{fmt(kpis.totalReservations)}</div>
            </div>
            <div className="glass-card" style={{ padding: '1.5rem' }}>
              {kpiIcons.totalRevenue}
              <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>Ingresos Generados</p>
              <div style={{ fontSize: '1.8rem', fontWeight: 700, margin: '0.5rem 0' }}>${fmt(kpis.totalRevenue)}</div>
            </div>
            <div className="glass-card" style={{ padding: '1.5rem' }}>
              {kpiIcons.reservationsToday}
              <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>Reservas Hoy</p>
              <div style={{ fontSize: '1.8rem', fontWeight: 700, margin: '0.5rem 0' }}>{fmt(kpis.reservationsToday)}</div>
            </div>
            <div className="glass-card" style={{ padding: '1.5rem' }}>
              {kpiIcons.newClients}
              <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>Nuevos Clientes</p>
              <div style={{ fontSize: '1.8rem', fontWeight: 700, margin: '0.5rem 0' }}>{fmt(kpis.newClients)}</div>
            </div>
            <div className="glass-card" style={{ padding: '1.5rem' }}>
              {kpiIcons.conversion}
              <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>Tasa Conversión</p>
              <div style={{ fontSize: '1.8rem', fontWeight: 700, margin: '0.5rem 0' }}>{kpis.conversion}%</div>
            </div>
            <div className="glass-card" style={{ padding: '1.5rem' }}>
              {kpiIcons.availableServices}
              <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>Servicios Disponibles</p>
              <div style={{ fontSize: '1.8rem', fontWeight: 700, margin: '0.5rem 0' }}>{fmt(kpis.availableServices)}</div>
            </div>
            <div className="glass-card" style={{ padding: '1.5rem' }}>
              {kpiIcons.occupiedServices}
              <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>Servicios Ocupados</p>
              <div style={{ fontSize: '1.8rem', fontWeight: 700, margin: '0.5rem 0' }}>{fmt(kpis.occupiedServices)}</div>
            </div>
            <div className="glass-card" style={{ padding: '1.5rem' }}>
              {kpiIcons.cancelations}
              <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>Cancelaciones</p>
              <div style={{ fontSize: '1.8rem', fontWeight: 700, margin: '0.5rem 0' }}>{fmt(kpis.cancelations)}</div>
            </div>
            <div className="glass-card" style={{ padding: '1.5rem' }}>
              {kpiIcons.ticketPromedio}
              <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>Ticket Promedio</p>
              <div style={{ fontSize: '1.8rem', fontWeight: 700, margin: '0.5rem 0' }}>${fmt(kpis.ticketPromedio)}</div>
            </div>
            <div className="glass-card" style={{ padding: '1.5rem' }}>
              {kpiIcons.topDest}
              <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>Destino Top</p>
              <div style={{ fontSize: '1.8rem', fontWeight: 700, margin: '0.5rem 0', color: '#3b82f6' }}>{kpis.topDest}</div>
            </div>
            <div className="glass-card" style={{ padding: '1.5rem' }}>
              {kpiIcons.topDriver}
              <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>Conductor Top</p>
              <div style={{ fontSize: '1.8rem', fontWeight: 700, margin: '0.5rem 0', color: '#ec4899' }}>{kpis.topDriver}</div>
            </div>
            <div className="glass-card" style={{ padding: '1.5rem' }}>
              {kpiIcons.topYacht}
              <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>Yate Top</p>
              <div style={{ fontSize: '1.8rem', fontWeight: 700, margin: '0.5rem 0', color: '#06b6d4' }}>{kpis.topYacht}</div>
            </div>
            <div className="glass-card" style={{ padding: '1.5rem' }}>
              {kpiIcons.topRestaurant}
              <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>Restaurante Top</p>
              <div style={{ fontSize: '1.8rem', fontWeight: 700, margin: '0.5rem 0', color: '#f59e0b' }}>{kpis.topRestaurant}</div>
            </div>
          </>
        )}
      </section>
    </div>
  );
}
