import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Metadata } from 'next';
import { 
  Award, ShieldCheck, Heart, Calendar, Users, 
  Settings, Star, Globe, Layers, ArrowRight, Play, CheckCircle2, 
  MapPin, MessageSquare, Briefcase, Smile, Sparkles, BookOpen
} from 'lucide-react';
import { getLocalDB } from '@/lib/db-fallback';

// Dynamic SEO Metadata from fallback database
export async function generateMetadata(): Promise<Metadata> {
  const db = getLocalDB();
  const content = db.aboutUs;
  return {
    title: content.seoTitle || 'Quiénes Somos | VamosJuntos',
    description: content.seoDescription || 'Conoce la historia, misión, visión y equipo de VamosJuntos.',
    keywords: content.seoKeywords || 'quienes somos, agencia de viajes, riviera maya',
    openGraph: {
      title: content.seoTitle || 'Quiénes Somos | VamosJuntos',
      description: content.seoDescription || 'Conoce la historia, misión, visión y equipo de VamosJuntos.',
      images: [{ url: content.seoOgImage || 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80' }]
    }
  };
}

// Icon mapper for Values & Stats
const getLucideIcon = (iconName: string) => {
  const icons: { [key: string]: React.ComponentType<any> } = {
    Award,
    ShieldCheck,
    Heart,
    Calendar,
    Users,
    Settings,
    Star,
    Globe,
    Layers,
    Smile,
    BookOpen
  };
  const IconComponent = icons[iconName] || Star;
  return <IconComponent size={24} className="text-gradient-icon" />;
};

export default async function QuienesSomosPage() {
  const db = getLocalDB();
  const content = db.aboutUs;

  // Render warning if not published (safety fallback)
  if (content.status !== 'PUBLISHED') {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '70vh', padding: '2rem' }}>
        <div className="glass-panel" style={{ padding: '3rem', maxWidth: '500px', textAlign: 'center', borderRadius: '20px' }}>
          <h2 style={{ color: 'white', marginBottom: '1rem' }}>Sección No Disponible</h2>
          <p style={{ color: 'var(--text-muted)' }}>El contenido de esta sección aún se encuentra en mantenimiento. Por favor, vuelve más tarde.</p>
          <Link href="/" className="btn-premium" style={{ marginTop: '1.5rem', display: 'inline-block' }}>Volver al Inicio</Link>
        </div>
      </div>
    );
  }

  return (
    <div style={{ background: '#05070a', color: 'white', minHeight: '100vh', paddingBottom: '4rem' }}>
      
      {/* A. HERO BANNER WITH DYNAMIC MEDIA */}
      <section style={{ position: 'relative', height: '80vh', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        
        {/* Background Overlay */}
        <div style={{ 
          position: 'absolute', 
          inset: 0, 
          background: `linear-gradient(to bottom, rgba(5,7,10,0.3) 0%, rgba(5,7,10,0.85) 100%)`, 
          zIndex: 2 
        }} />

        {/* Video Loop Background */}
        {content.heroVideoBg ? (
          <video 
            src={content.heroVideoBg} 
            autoPlay 
            loop 
            muted 
            playsInline 
            style={{ 
              position: 'absolute', 
              width: '100%', 
              height: '100%', 
              objectFit: 'cover', 
              zIndex: 1, 
              opacity: (100 - content.heroOpacity) / 100 
            }} 
          />
        ) : (
          <div style={{ position: 'absolute', inset: 0, zIndex: 1 }}>
            {/* Desktop Image */}
            <div className="desktop-only-bg" style={{ position: 'relative', width: '100%', height: '100%' }}>
              <Image 
                src={content.heroDesktopImage || 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1920&q=80'} 
                alt="VamosJuntos Hero" 
                fill 
                style={{ objectFit: 'cover', opacity: (100 - content.heroOpacity) / 100 }}
                unoptimized
              />
            </div>
          </div>
        )}

        {/* Hero Text */}
        <div className="container" style={{ position: 'relative', zIndex: 10, textAlign: 'center', padding: '0 2rem' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem 1.25rem', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '50px', color: 'var(--primary)', fontWeight: 800, fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '1.5px', marginBottom: '2rem' }}>
            <Sparkles size={14} /> {content.title}
          </div>
          <h1 className="float-animation" style={{ 
            fontSize: '4rem', 
            fontWeight: 900, 
            lineHeight: '1.1', 
            margin: '0 0 1.5rem 0',
            textShadow: '0 15px 45px rgba(0,0,0,0.6)'
          }}>
            <span className="text-gradient">{content.heroTitle || content.subtitle}</span>
          </h1>
          <p style={{ 
            fontSize: '1.3rem', 
            color: 'rgba(255,255,255,0.9)', 
            maxWidth: '800px', 
            margin: '0 auto 3rem auto',
            lineHeight: '1.6',
            textShadow: '0 2px 15px rgba(0,0,0,0.5)'
          }}>
            {content.description}
          </p>
          {content.heroCtaText && (
            <Link 
              href={content.heroCtaLink || '/packages'} 
              className="btn-premium" 
              style={{ 
                padding: '1.1rem 3rem', 
                fontSize: '1.1rem', 
                fontWeight: 700, 
                borderRadius: '50px',
                boxShadow: '0 20px 40px -10px rgba(139, 92, 246, 0.4)',
                textDecoration: 'none',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.6rem'
              }}
            >
              <span>{content.heroCtaText}</span>
              <ArrowRight size={20} />
            </Link>
          )}
        </div>
      </section>

      {/* B. MISSION, VISION & VALUES */}
      <section style={{ padding: '6rem 0', position: 'relative' }}>
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '3rem', marginBottom: '4rem' }} className="mision-vision-grid">
            
            {/* Mission Card */}
            <div className="glass-panel" style={{ 
              padding: '3rem', 
              borderRadius: '24px', 
              border: '1px solid rgba(139, 92, 246, 0.15)',
              background: 'linear-gradient(135deg, rgba(255,255,255,0.01) 0%, rgba(139, 92, 246, 0.03) 100%)',
              boxShadow: '0 10px 40px rgba(139, 92, 246, 0.05)'
            }}>
              <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'rgba(139, 92, 246, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.5rem', border: '1px solid rgba(139, 92, 246, 0.2)' }}>
                <ShieldCheck size={24} color="var(--primary)" />
              </div>
              <h3 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'white', margin: '0 0 1rem 0' }}>Nuestra Misión</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '1.05rem', lineHeight: '1.7', margin: 0 }}>
                {content.mission}
              </p>
            </div>

            {/* Vision Card */}
            <div className="glass-panel" style={{ 
              padding: '3rem', 
              borderRadius: '24px', 
              border: '1px solid rgba(6, 182, 212, 0.15)',
              background: 'linear-gradient(135deg, rgba(255,255,255,0.01) 0%, rgba(6, 182, 212, 0.03) 100%)',
              boxShadow: '0 10px 40px rgba(6, 182, 212, 0.05)'
            }}>
              <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'rgba(6, 182, 212, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.5rem', border: '1px solid rgba(6, 182, 212, 0.2)' }}>
                <Globe size={24} color="#06b6d4" />
              </div>
              <h3 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'white', margin: '0 0 1rem 0' }}>Nuestra Visión</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '1.05rem', lineHeight: '1.7', margin: 0 }}>
                {content.vision}
              </p>
            </div>
          </div>

          {/* Values Grid */}
          <div>
            <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
              <h3 style={{ fontSize: '2rem', fontWeight: 800, margin: 0 }} className="text-gradient">Nuestros Valores Corporativos</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', marginTop: '0.4rem' }}>Los pilares éticos y de servicio que guían cada uno de nuestros itinerarios.</p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '2rem' }}>
              {content.values?.map((val) => (
                <div key={val.id} className="glass-card" style={{ padding: '2rem', borderRadius: '16px', border: '1px solid var(--border-glass)', transition: 'transform 0.2s' }}>
                  <div style={{ marginBottom: '1rem' }}>
                    {getLucideIcon(val.icon)}
                  </div>
                  <h4 style={{ fontSize: '1.2rem', fontWeight: 700, color: 'white', margin: '0 0 0.5rem 0' }}>{val.name}</h4>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: '1.6', margin: 0 }}>{val.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* C. STATS BLOCK (ANIMATED NUMBERS) */}
      {content.stats && content.stats.length > 0 && (
        <section style={{ padding: '4rem 0', background: 'rgba(139, 92, 246, 0.02)', borderTop: '1px solid var(--border-glass)', borderBottom: '1px solid var(--border-glass)' }}>
          <div className="container">
            <div style={{ display: 'grid', gridTemplateColumns: `repeat(${content.stats.length}, 1fr)`, gap: '2rem', textAlign: 'center' }} className="stats-grid">
              {content.stats.map((stat) => (
                <div key={stat.id} style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                  <span style={{ fontSize: '3.5rem', fontWeight: 900 }} className="text-gradient">
                    {stat.value}{stat.suffix}
                  </span>
                  <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px' }}>{stat.label}</span>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* D. INTERACTIVE TIMELINE / HISTORIA */}
      {content.history && content.history.length > 0 && (
        <section style={{ padding: '6rem 0' }}>
          <div className="container">
            <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
              <span style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--primary)', textTransform: 'uppercase', letterSpacing: '2px' }}>Trayectoria y Crecimiento</span>
              <h2 style={{ fontSize: '2.5rem', fontWeight: 800, color: 'white', margin: '0.25rem 0 0 0' }}>Nuestra Línea de Tiempo</h2>
            </div>

            <div style={{ position: 'relative', maxWidth: '1000px', margin: '0 auto' }} className="timeline-container">
              {/* Timeline Center Line */}
              <div className="timeline-line" style={{ 
                position: 'absolute', 
                left: '50%', 
                top: 0, 
                bottom: 0, 
                width: '2px', 
                background: 'linear-gradient(to bottom, var(--primary), #06b6d4, transparent)', 
                transform: 'translateX(-50%)',
                zIndex: 1
              }} />

              <div style={{ display: 'flex', flexDirection: 'column', gap: '4rem' }}>
                {content.history.map((hito, index) => {
                  const isEven = index % 2 === 0;
                  return (
                    <div 
                      key={hito.id} 
                      style={{ 
                        display: 'flex', 
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        position: 'relative',
                        zIndex: 2
                      }} 
                      className={`timeline-item ${isEven ? 'even' : 'odd'}`}
                    >
                      {/* Left Block */}
                      <div style={{ width: '45%', textAlign: isEven ? 'right' : 'left' }} className="timeline-content-block">
                        {isEven ? (
                          <div className="glass-card" style={{ padding: '2rem', borderRadius: '16px', display: 'inline-block', textAlign: 'left', width: '100%' }}>
                            <span style={{ fontSize: '1.5rem', fontWeight: 900, color: 'var(--primary)', display: 'block', marginBottom: '0.4rem' }}>{hito.year}</span>
                            <h4 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'white', margin: '0 0 0.5rem 0' }}>{hito.title}</h4>
                            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: '1.6', margin: 0 }}>{hito.description}</p>
                            {hito.image && (
                              <div style={{ position: 'relative', height: '180px', borderRadius: '10px', overflow: 'hidden', marginTop: '1.25rem', border: '1px solid var(--border-glass)' }}>
                                <Image src={hito.image} alt={hito.title} fill style={{ objectFit: 'cover' }} unoptimized />
                              </div>
                            )}
                          </div>
                        ) : null}
                      </div>

                      {/* Timeline Center Dot */}
                      <div style={{ 
                        width: '36px', 
                        height: '36px', 
                        borderRadius: '50%', 
                        background: '#05070a', 
                        border: '4px solid var(--primary)', 
                        display: 'flex', 
                        alignItems: 'center', 
                        justifyContent: 'center',
                        zIndex: 10
                      }} className="timeline-dot">
                        <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#06b6d4' }} />
                      </div>

                      {/* Right Block */}
                      <div style={{ width: '45%', textAlign: isEven ? 'left' : 'right' }} className="timeline-content-block">
                        {!isEven ? (
                          <div className="glass-card" style={{ padding: '2rem', borderRadius: '16px', display: 'inline-block', textAlign: 'left', width: '100%' }}>
                            <span style={{ fontSize: '1.5rem', fontWeight: 900, color: '#06b6d4', display: 'block', marginBottom: '0.4rem' }}>{hito.year}</span>
                            <h4 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'white', margin: '0 0 0.5rem 0' }}>{hito.title}</h4>
                            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: '1.6', margin: 0 }}>{hito.description}</p>
                            {hito.image && (
                              <div style={{ position: 'relative', height: '180px', borderRadius: '10px', overflow: 'hidden', marginTop: '1.25rem', border: '1px solid var(--border-glass)' }}>
                                <Image src={hito.image} alt={hito.title} fill style={{ objectFit: 'cover' }} unoptimized />
                              </div>
                            )}
                          </div>
                        ) : null}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* E. EQUIPO CORPORATIVO / DE DIRECTIVOS */}
      {content.team && content.team.length > 0 && (
        <section style={{ padding: '6rem 0', background: 'rgba(255,255,255,0.01)', borderTop: '1px solid var(--border-glass)', borderBottom: '1px solid var(--border-glass)' }}>
          <div className="container">
            <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
              <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#06b6d4', textTransform: 'uppercase', letterSpacing: '2px' }}>Talento y Liderazgo</span>
              <h2 style={{ fontSize: '2.5rem', fontWeight: 800, color: 'white', margin: '0.25rem 0 0 0' }}>Nuestro Equipo Directivo</h2>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '2rem' }}>
              {content.team.map((member) => (
                <div key={member.id} className="glass-card" style={{ padding: '2rem', borderRadius: '20px', border: '1px solid var(--border-glass)', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
                  
                  {/* Accent Line for Featured Members */}
                  {member.isFeatured && (
                    <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '4px', background: 'linear-gradient(90deg, var(--primary), #06b6d4)' }} />
                  )}

                  <div style={{ 
                    position: 'relative', 
                    width: '120px', 
                    height: '120px', 
                    borderRadius: '50%', 
                    overflow: 'hidden', 
                    marginBottom: '1.5rem',
                    border: `3px solid ${member.isFeatured ? 'var(--primary)' : 'var(--border-glass)'}`
                  }} className="profile-img-zoom">
                    <Image 
                      src={member.photo || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=250&q=80'} 
                      alt={member.name} 
                      fill 
                      style={{ objectFit: 'cover' }}
                      unoptimized
                    />
                  </div>

                  <h3 style={{ fontSize: '1.3rem', fontWeight: 800, color: 'white', margin: '0 0 0.25rem 0' }}>{member.name}</h3>
                  <span style={{ fontSize: '0.8rem', color: 'var(--primary)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '1rem', display: 'block' }}>{member.role}</span>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', lineHeight: '1.6', margin: '0 0 1.5rem 0', flex: 1 }}>{member.bio}</p>

                  {/* LinkedIn / Social Integration */}
                  {member.linkedin && (
                    <a 
                      href={member.linkedin} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="linkedin-link-btn"
                      style={{ 
                        display: 'inline-flex', 
                        alignItems: 'center', 
                        gap: '0.4rem', 
                        padding: '0.4rem 1.1rem', 
                        borderRadius: '30px', 
                        background: 'rgba(10, 102, 194, 0.1)', 
                        border: '1px solid rgba(10, 102, 194, 0.3)', 
                        color: '#0a66c2', 
                        fontSize: '0.8rem', 
                        fontWeight: 700,
                        textDecoration: 'none'
                      }}
                    >
                      <LinkedinIcon size={14} />
                      <span>Conectar</span>
                    </a>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* F. DYNAMIC MEDIA GALLERY */}
      {content.gallery && content.gallery.length > 0 && (
        <section style={{ padding: '6rem 0' }}>
          <div className="container">
            <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
              <span style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--primary)', textTransform: 'uppercase', letterSpacing: '2px' }}>Experiencias de Ensueño</span>
              <h2 style={{ fontSize: '2.5rem', fontWeight: 800, color: 'white', margin: '0.25rem 0 0 0' }}>Galería de Momentos</h2>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1.5rem' }}>
              {content.gallery.filter(item => item.active).map((item) => (
                <div key={item.id} className="glass-card" style={{ padding: '0.5rem', borderRadius: '16px', border: '1px solid var(--border-glass)', overflow: 'hidden', position: 'relative' }}>
                  <div style={{ position: 'relative', height: '220px', borderRadius: '10px', overflow: 'hidden' }}>
                    <Image src={item.url} alt="VamosJuntos Gallery" fill style={{ objectFit: 'cover' }} unoptimized />
                    <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.5) 0%, transparent 100%)' }} />
                    <span style={{ position: 'absolute', bottom: '0.75rem', left: '0.75rem', fontSize: '0.72rem', background: 'rgba(139,92,246,0.2)', border: '1px solid rgba(139,92,246,0.3)', color: '#c4b5fd', padding: '0.15rem 0.5rem', borderRadius: '4px', fontWeight: 700, textTransform: 'uppercase' }}>
                      {item.category || 'General'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* G. TESTIMONIALS SLIDER */}
      {content.testimonials && content.testimonials.filter(t => t.approved).length > 0 && (
        <section style={{ padding: '6rem 0', background: 'rgba(5, 7, 10, 0.4)', borderTop: '1px solid var(--border-glass)', borderBottom: '1px solid var(--border-glass)' }}>
          <div className="container">
            <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
              <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#06b6d4', textTransform: 'uppercase', letterSpacing: '2px' }}>Opiniones Reales</span>
              <h2 style={{ fontSize: '2.5rem', fontWeight: 800, color: 'white', margin: '0.25rem 0 0 0' }}>Lo Que Dicen Nuestros Clientes</h2>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2rem' }}>
              {content.testimonials.filter(t => t.approved).map((test) => (
                <div key={test.id} className="glass-card" style={{ padding: '2rem', borderRadius: '20px', border: '1px solid var(--border-glass)', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                  <div style={{ display: 'flex', gap: '0.1rem' }}>
                    {Array(5).fill(0).map((_, i) => (
                      <Star key={i} size={15} fill={i < test.rating ? '#f59e0b' : 'none'} color="#f59e0b" />
                    ))}
                  </div>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', lineHeight: '1.7', margin: 0, fontStyle: 'italic', flex: 1 }}>
                    "{test.comment}"
                  </p>
                  <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '1rem' }}>
                    <div style={{ position: 'relative', width: '48px', height: '48px', borderRadius: '50%', overflow: 'hidden' }}>
                      <Image src={test.clientPhoto} alt={test.clientName} fill style={{ objectFit: 'cover' }} unoptimized />
                    </div>
                    <div>
                      <strong style={{ color: 'white', fontSize: '0.9rem', display: 'block' }}>{test.clientName}</strong>
                      <span style={{ color: 'var(--text-muted)', fontSize: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                        <MapPin size={12} color="var(--primary)" /> {test.country}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* H. CALL TO ACTION FINAL */}
      <section style={{ padding: '6rem 0' }}>
        <div className="container">
          <div className="glass-panel" style={{ 
            borderRadius: '30px', 
            padding: '4.5rem 3rem', 
            border: '1px solid rgba(139, 92, 246, 0.25)', 
            background: 'linear-gradient(135deg, rgba(5,7,10,0.98) 0%, rgba(139, 92, 246, 0.05) 100%)',
            textAlign: 'center',
            boxShadow: '0 25px 65px -10px rgba(139, 92, 246, 0.15)',
            position: 'relative',
            overflow: 'hidden'
          }}>
            <h2 style={{ fontSize: '3rem', fontWeight: 900, color: 'white', margin: '0 0 1rem 0', lineHeight: '1.1' }}>
              ¿Listo Para Crear Tu Próximo <br />
              <span className="text-gradient">Recuerdo Inolvidable?</span>
            </h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '1.15rem', maxWidth: '600px', margin: '0 auto 2.5rem auto', lineHeight: '1.6' }}>
              Nuestros planificadores de viajes están listos para diseñar un itinerario premium completamente a tu medida.
            </p>
            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
              <Link href="/packages" className="btn-premium" style={{ padding: '1rem 2.5rem', fontSize: '1rem', fontWeight: 700, borderRadius: '50px', textDecoration: 'none' }}>
                Explorar Destinos
              </Link>
              <Link href="/build" className="btn-glass-nav" style={{ padding: '1rem 2.5rem', fontSize: '1rem', fontWeight: 700, borderRadius: '50px', border: '1px solid rgba(255,255,255,0.2)', textDecoration: 'none' }}>
                Diseñar Mi Viaje
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* CUSTOM STYLE INJECTIONS FOR MEDIA AND TIMELINE RESPONSIVENESS */}
      <style dangerouslySetInnerHTML={{ __html: `
        @media (max-width: 768px) {
          .desktop-only-bg { display: none !important; }
          .mision-vision-grid {
            grid-template-columns: 1fr !important;
            gap: 2rem !important;
          }
          .stats-grid {
            grid-template-columns: 1fr !important;
            gap: 2rem !important;
          }
          .timeline-line {
            left: 20px !important;
          }
          .timeline-item {
            flex-direction: column !important;
            align-items: flex-start !important;
            gap: 1.5rem !important;
          }
          .timeline-content-block {
            width: 100% !important;
            text-align: left !important;
            padding-left: 45px !important;
          }
          .timeline-dot {
            position: absolute !important;
            left: 20px !important;
            top: 24px !important;
            transform: translateX(-50%) !important;
          }
        }
        .profile-img-zoom:hover img {
          transform: scale(1.08);
          transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }
        .profile-img-zoom img {
          transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }
        .linkedin-link-btn:hover {
          background: rgba(10, 102, 194, 0.18) !important;
          transform: translateY(-2px);
          transition: all 0.2s;
        }
        .linkedin-link-btn {
          transition: all 0.2s;
        }
      `}} />

    </div>
  );
}

// Inline LinkedIn Icon component
function LinkedinIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      width={props.size || 24}
      height={props.size || 24}
      {...props}
    >
      <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
      <rect x="2" y="9" width="4" height="12" />
      <circle cx="4" cy="4" r="2" />
    </svg>
  );
}
