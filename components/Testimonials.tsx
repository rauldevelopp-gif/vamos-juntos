import React from 'react';
import Image from 'next/image';
import { Star } from 'lucide-react';

export default function Testimonials() {
  return (
    <section style={{ padding: '6rem 0', background: 'rgba(255,255,255,0.02)' }}>
      <div className="container">
        <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
          <h2 className="heading-1 float-animation" style={{ fontSize: '2.5rem', marginBottom: '1rem', textShadow: '0 5px 15px rgba(0,0,0,0.3)' }}>Lo que dicen <span className="text-gradient">nuestros clientes</span></h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem', maxWidth: '600px', margin: '0 auto' }}>Descubre por qué miles de viajeros confían en nosotros para sus mejores experiencias.</p>
        </div>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '2rem' }}>
          {/* Testimonio 1 */}
          <div className="glass-card" style={{ padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div style={{ display: 'flex', gap: '0.2rem' }}>
              {[...Array(5)].map((_, i) => <Star key={i} size={18} fill="#f59e0b" color="#f59e0b" />)}
            </div>
            <p style={{ fontStyle: 'italic', color: 'rgba(255,255,255,0.85)', flex: 1, lineHeight: '1.6' }}>
              "La gestión de la app es increíblemente intuitiva y fácil de usar. Pude organizar todo mi viaje en cuestión de minutos sin complicaciones. ¡Totalmente recomendada!"
            </p>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginTop: '1rem' }}>
              <div style={{ position: 'relative', width: '50px', height: '50px', borderRadius: '50%', overflow: 'hidden' }}>
                <Image src="https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop" alt="Ana Martínez" fill style={{ objectFit: 'cover' }} unoptimized />
              </div>
              <div>
                <h4 style={{ margin: 0, fontSize: '1rem' }}>Ana Martínez</h4>
                <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                  México
                </span>
              </div>
            </div>
          </div>

          {/* Testimonio 2 */}
          <div className="glass-card" style={{ padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div style={{ display: 'flex', gap: '0.2rem' }}>
              {[...Array(5)].map((_, i) => <Star key={i} size={18} fill="#f59e0b" color="#f59e0b" />)}
            </div>
            <p style={{ fontStyle: 'italic', color: 'rgba(255,255,255,0.85)', flex: 1, lineHeight: '1.6' }}>
              "Nos lo pasamos genial en las atracciones. La aplicación ofrece opciones espectaculares que no hubiéramos encontrado de otra forma. Una experiencia mágica."
            </p>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginTop: '1rem' }}>
              <div style={{ position: 'relative', width: '50px', height: '50px', borderRadius: '50%', overflow: 'hidden' }}>
                <Image src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop" alt="Carlos Gómez" fill style={{ objectFit: 'cover' }} unoptimized />
              </div>
              <div>
                <h4 style={{ margin: 0, fontSize: '1rem' }}>Carlos Gómez</h4>
                <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                  España
                </span>
              </div>
            </div>
          </div>

          {/* Testimonio 3 */}
          <div className="glass-card" style={{ padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div style={{ display: 'flex', gap: '0.2rem' }}>
              {[...Array(5)].map((_, i) => <Star key={i} size={18} fill="#f59e0b" color="#f59e0b" />)}
            </div>
            <p style={{ fontStyle: 'italic', color: 'rgba(255,255,255,0.85)', flex: 1, lineHeight: '1.6' }}>
              "Me sorprendió la seriedad y profesionalismo de los operadores turísticos que ofrecen sus paquetes aquí. Todo se cumplió tal cual lo prometido, sin contratiempos."
            </p>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginTop: '1rem' }}>
              <div style={{ position: 'relative', width: '50px', height: '50px', borderRadius: '50%', overflow: 'hidden' }}>
                <Image src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=150&fit=crop" alt="Laura Rojas" fill style={{ objectFit: 'cover' }} unoptimized />
              </div>
              <div>
                <h4 style={{ margin: 0, fontSize: '1rem' }}>Laura Rojas</h4>
                <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                  Colombia
                </span>
              </div>
            </div>
          </div>

          {/* Testimonio 4 */}
          <div className="glass-card" style={{ padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div style={{ display: 'flex', gap: '0.2rem' }}>
              {[...Array(5)].map((_, i) => <Star key={i} size={18} fill="#f59e0b" color="#f59e0b" />)}
            </div>
            <p style={{ fontStyle: 'italic', color: 'rgba(255,255,255,0.85)', flex: 1, lineHeight: '1.6' }}>
              "La mejor plataforma para planear vacaciones. La combinación de facilidad de uso, excelentes actividades y agencias confiables la hacen inigualable."
            </p>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginTop: '1rem' }}>
              <div style={{ position: 'relative', width: '50px', height: '50px', borderRadius: '50%', overflow: 'hidden' }}>
                <Image src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop" alt="Javier Pérez" fill style={{ objectFit: 'cover' }} unoptimized />
              </div>
              <div>
                <h4 style={{ margin: 0, fontSize: '1rem' }}>Javier Pérez</h4>
                <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                  Argentina
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
