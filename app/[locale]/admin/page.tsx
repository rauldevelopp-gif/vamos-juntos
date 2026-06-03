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

import { getCurrentUserAction } from '@/app/admin/users/actions';

export default function AdminDashboard() {
  const { language } = useLanguage();
  setLanguage(language);
  const [kpis, setKpis] = useState(null);
  const [user, setUser] = useState<any>(null);
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
            <div className="glass-card" style={{ padding: '1.2rem', border: kpis.totalReservations ? '1px solid #8b5cf6' : '' }}>
              {kpiIcons.totalReservations}
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.5rem', marginBottom: '0.2rem' }}>{tr("Reservas Totales")}</p>
              <div style={{ fontSize: '1.5rem', fontWeight: 700 }}>{fmt(kpis.totalReservations)}</div>
            </div>
            <div className="glass-card" style={{ padding: '1.2rem' }}>
              {kpiIcons.totalRevenue}
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.5rem', marginBottom: '0.2rem' }}>{tr("Ingresos Generados")}</p>
              <div style={{ fontSize: '1.5rem', fontWeight: 700 }}>${fmt(kpis.totalRevenue)}</div>
            </div>
            <div className="glass-card" style={{ padding: '1.2rem' }}>
              {kpiIcons.reservationsToday}
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.5rem', marginBottom: '0.2rem' }}>{tr("Reservas Hoy")}</p>
              <div style={{ fontSize: '1.5rem', fontWeight: 700 }}>{fmt(kpis.reservationsToday)}</div>
            </div>
            <div className="glass-card" style={{ padding: '1.2rem' }}>
              {kpiIcons.newClients}
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.5rem', marginBottom: '0.2rem' }}>{tr("Nuevos Clientes")}</p>
              <div style={{ fontSize: '1.5rem', fontWeight: 700 }}>{fmt(kpis.newClients)}</div>
            </div>
            <div className="glass-card" style={{ padding: '1.2rem' }}>
              {kpiIcons.conversion}
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.5rem', marginBottom: '0.2rem' }}>{tr("Tasa Conversión")}</p>
              <div style={{ fontSize: '1.5rem', fontWeight: 700 }}>{kpis.conversion}%</div>
            </div>
            <div className="glass-card" style={{ padding: '1.2rem' }}>
              {kpiIcons.availableServices}
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.5rem', marginBottom: '0.2rem' }}>{tr("Servicios Disp.")}</p>
              <div style={{ fontSize: '1.5rem', fontWeight: 700 }}>{fmt(kpis.availableServices)}</div>
            </div>
            <div className="glass-card" style={{ padding: '1.2rem' }}>
              {kpiIcons.occupiedServices}
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.5rem', marginBottom: '0.2rem' }}>{tr("Serv. Ocupados")}</p>
              <div style={{ fontSize: '1.5rem', fontWeight: 700 }}>{fmt(kpis.occupiedServices)}</div>
            </div>
            <div className="glass-card" style={{ padding: '1.2rem' }}>
              {kpiIcons.cancelations}
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.5rem', marginBottom: '0.2rem' }}>{tr("Cancelaciones")}</p>
              <div style={{ fontSize: '1.5rem', fontWeight: 700 }}>{fmt(kpis.cancelations)}</div>
            </div>
            <div className="glass-card" style={{ padding: '1.2rem' }}>
              {kpiIcons.ticketPromedio}
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.5rem', marginBottom: '0.2rem' }}>{tr("Ticket Promedio")}</p>
              <div style={{ fontSize: '1.5rem', fontWeight: 700 }}>${fmt(kpis.ticketPromedio)}</div>
            </div>
            <div className="glass-card" style={{ padding: '1.2rem' }}>
              {kpiIcons.topDest}
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.5rem', marginBottom: '0.2rem' }}>{tr("Destino Top")}</p>
              <div style={{ fontSize: '1.5rem', fontWeight: 700, color: '#3b82f6' }}>{kpis.topDest}</div>
            </div>
            <div className="glass-card" style={{ padding: '1.2rem' }}>
              {kpiIcons.topDriver}
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.5rem', marginBottom: '0.2rem' }}>{tr("Conductor Top")}</p>
              <div style={{ fontSize: '1.5rem', fontWeight: 700, color: '#ec4899' }}>{kpis.topDriver}</div>
            </div>
            <div className="glass-card" style={{ padding: '1.2rem' }}>
              {kpiIcons.topYacht}
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.5rem', marginBottom: '0.2rem' }}>{tr("Yate Top")}</p>
              <div style={{ fontSize: '1.5rem', fontWeight: 700, color: '#06b6d4' }}>{kpis.topYacht}</div>
            </div>
            <div className="glass-card" style={{ padding: '1.2rem' }}>
              {kpiIcons.topRestaurant}
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.5rem', marginBottom: '0.2rem' }}>{tr("Rte. Top")}</p>
              <div style={{ fontSize: '1.5rem', fontWeight: 700, color: '#f59e0b' }}>{kpis.topRestaurant}</div>
            </div>
          </>
        )}
      </section>
    </div>
  );
}
