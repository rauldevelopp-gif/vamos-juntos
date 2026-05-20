'use client';

import React from 'react';
import { LayoutDashboard, Calendar, Car, Ship, Hotel, Plane, MapPin, CheckCircle2, Server } from 'lucide-react';
import Link from 'next/link';

export default function AdminDashboard() {
    return (
        <div>
            <header style={{ marginBottom: '3rem' }}>
                <h1 className="heading-1">Dashboard de Administración</h1>
                <p style={{ color: 'var(--text-muted)' }}>Bienvenido al centro de control principal de VamosJuntos.</p>
            </header>

            {/* General Info Banner */}
            <div className="glass-panel" style={{ padding: '2rem', marginBottom: '2rem', display: 'flex', gap: '2rem', alignItems: 'center', flexWrap: 'wrap' }}>
                <div style={{ flex: '1 1 300px' }}>
                    <h2 style={{ fontSize: '1.8rem', color: 'var(--primary)', marginBottom: '1rem' }}>Estado del Sistema</h2>
                    <p style={{ color: 'var(--text-muted)', lineHeight: 1.6 }}>
                        La plataforma VamosJuntos está operando con normalidad. Desde aquí puedes gestionar todos los módulos del sistema, revisar las solicitudes de los usuarios y supervisar las métricas de rendimiento en la sección de reportes.
                    </p>
                </div>
                <div style={{ display: 'flex', gap: '2rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <CheckCircle2 color="#10b981" size={24} />
                        <span style={{ color: 'white', fontWeight: 600 }}>Servicios Online</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <Server color="#3b82f6" size={24} />
                        <span style={{ color: 'white', fontWeight: 600 }}>Base de Datos Activa</span>
                    </div>
                </div>
            </div>

            <h3 style={{ marginBottom: '1.5rem', color: 'white', fontSize: '1.4rem' }}>Módulos Principales</h3>
            
            <div className="dashboard-stats-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))' }}>
                {/* Module Cards */}
                <Link href="/admin/reservations" style={{ textDecoration: 'none' }}>
                    <div className="glass-card" style={{ padding: '1.5rem', cursor: 'pointer', transition: 'transform 0.2s', height: '100%' }}
                        onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-5px)' }}
                        onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)' }}
                    >
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                            <h4 style={{ fontSize: '1.2rem', color: 'white', margin: 0 }}>Reservas</h4>
                            <Calendar size={24} color="#8b5cf6" />
                        </div>
                        <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>
                            Gestiona todas las reservas de servicios, aprueba solicitudes y revisa el historial completo de clientes.
                        </p>
                    </div>
                </Link>

                <Link href="/admin/taxis" style={{ textDecoration: 'none' }}>
                    <div className="glass-card" style={{ padding: '1.5rem', cursor: 'pointer', transition: 'transform 0.2s', height: '100%' }}
                        onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-5px)' }}
                        onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)' }}
                    >
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                            <h4 style={{ fontSize: '1.2rem', color: 'white', margin: 0 }}>Flota de Taxis</h4>
                            <Car size={24} color="#ec4899" />
                        </div>
                        <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>
                            Controla los vehículos, conductores disponibles, estados de servicio y calificaciones.
                        </p>
                    </div>
                </Link>

                <Link href="/admin/yachts" style={{ textDecoration: 'none' }}>
                    <div className="glass-card" style={{ padding: '1.5rem', cursor: 'pointer', transition: 'transform 0.2s', height: '100%' }}
                        onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-5px)' }}
                        onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)' }}
                    >
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                            <h4 style={{ fontSize: '1.2rem', color: 'white', margin: 0 }}>Yates</h4>
                            <Ship size={24} color="#06b6d4" />
                        </div>
                        <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>
                            Administra la disponibilidad de yates, establece capacidades, precios por hora y características.
                        </p>
                    </div>
                </Link>

                <Link href="/admin/hotels" style={{ textDecoration: 'none' }}>
                    <div className="glass-card" style={{ padding: '1.5rem', cursor: 'pointer', transition: 'transform 0.2s', height: '100%' }}
                        onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-5px)' }}
                        onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)' }}
                    >
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                            <h4 style={{ fontSize: '1.2rem', color: 'white', margin: 0 }}>Alojamiento</h4>
                            <Hotel size={24} color="#f59e0b" />
                        </div>
                        <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>
                            Configura los hoteles asociados, disponibilidad de habitaciones, precios y fotos.
                        </p>
                    </div>
                </Link>
                
                <Link href="/admin/airports" style={{ textDecoration: 'none' }}>
                    <div className="glass-card" style={{ padding: '1.5rem', cursor: 'pointer', transition: 'transform 0.2s', height: '100%' }}
                        onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-5px)' }}
                        onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)' }}
                    >
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                            <h4 style={{ fontSize: '1.2rem', color: 'white', margin: 0 }}>Aeropuertos</h4>
                            <Plane size={24} color="#10b981" />
                        </div>
                        <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>
                            Administra los puntos de partida y llegada para las transferencias y vuelos.
                        </p>
                    </div>
                </Link>
                
                <Link href="/admin/reports" style={{ textDecoration: 'none' }}>
                    <div className="glass-card" style={{ padding: '1.5rem', cursor: 'pointer', transition: 'transform 0.2s', height: '100%' }}
                        onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-5px)' }}
                        onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)' }}
                    >
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                            <h4 style={{ fontSize: '1.2rem', color: 'white', margin: 0 }}>Reportes</h4>
                            <LayoutDashboard size={24} color="#3b82f6" />
                        </div>
                        <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>
                            Analiza el rendimiento del negocio con gráficos detallados e interactivos.
                        </p>
                    </div>
                </Link>
            </div>
        </div>
    );
}
