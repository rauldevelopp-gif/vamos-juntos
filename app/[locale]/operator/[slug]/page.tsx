import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Metadata } from 'next';
import { 
  Award, ShieldCheck, Heart, Calendar, Users, 
  Settings, Star, Globe, Layers, ArrowRight, Play, CheckCircle2, 
  MapPin, MessageSquare, Briefcase, Smile, Sparkles, BookOpen,
  Instagram as InstagramLucide, Facebook as FacebookLucide, Video, FileText, Compass, ExternalLink, ShieldAlert
} from 'lucide-react';
import { getLocalDB } from '@/lib/db-fallback';
import prisma from '@/lib/db';

// Dynamic SEO Metadata from fallback database for Operator
export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const db = getLocalDB();
  const profile = db.operatorProfiles?.find(p => p.slug === params.slug);
  
  if (!profile) {
    return { title: 'Operador VIP | VamosJuntos' };
  }

  return {
    title: profile.seoTitle || `${profile.name} - Operador VIP | VamosJuntos`,
    description: profile.seoDescription || `Conoce a ${profile.name}, especialista en experiencias de lujo en la Riviera Maya.`,
    keywords: profile.seoKeywords || `operador, riviera maya, yates, traslados`,
  };
}

// WhatsApp Icon helper
function WhatsAppIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" width={props.width || 18} height={props.height || 18} {...props}>
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
    </svg>
  );
}

function Facebook(props: any) {
  return <svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path></svg>;
}

function Instagram(props: any) {
  return <svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" {...props}><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>;
}

export default async function OperatorProfilePage({ params }: { params: { slug: string } }) {
  const db = getLocalDB();
  const profile = db.operatorProfiles?.find(p => p.slug === params.slug);

  // If operator profile not found
  if (!profile || profile.status !== 'PUBLISHED') {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '70vh', padding: '2rem' }}>
        <div className="glass-panel" style={{ padding: '3rem', maxWidth: '500px', textAlign: 'center', borderRadius: '20px' }}>
          <ShieldAlert size={48} color="var(--accent)" style={{ marginBottom: '1.5rem', display: 'inline-block' }} />
          <h2 style={{ color: 'white', marginBottom: '1rem' }}>Perfil No Disponible</h2>
          <p style={{ color: 'var(--text-muted)' }}>Este perfil de operador aún no está publicado o se encuentra temporalmente inactivo.</p>
          <Link href="/" className="btn-premium" style={{ marginTop: '1.5rem', display: 'inline-block' }}>Volver al Inicio</Link>
        </div>
      </div>
    );
  }

  // Retrieve tours/packages associated with this operator from Prisma
  let operatorTours: any[] = [];
  try {
    operatorTours = await prisma.package.findMany({
      where: { userId: profile.userId, clientId: null },
      orderBy: { createdAt: 'desc' }
    });
  } catch (error) {
    console.error("Error loading operator tours:", error);
  }

  const sectionsMap: Record<string, React.ReactNode> = {
    hero: (
      <section key="hero" style={{ position: 'relative', height: '65vh', overflow: 'hidden', display: 'flex', alignItems: 'flex-end', paddingBottom: '3rem' }}>
        {/* Background Image / Banner */}
        <div style={{ position: 'absolute', inset: 0, zIndex: 1 }}>
          <Image 
            src={profile.banner || 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=1920&q=80'} 
            alt={`${profile.name} Banner`} 
            fill 
            style={{ objectFit: 'cover' }}
            unoptimized
          />
          {/* Branded Overlay */}
          <div style={{ 
            position: 'absolute', 
            inset: 0, 
            background: 'linear-gradient(to bottom, rgba(5,7,10,0.1) 0%, rgba(5,7,10,0.95) 100%)' 
          }} />
        </div>

        {/* Hero Contents */}
        <div className="container" style={{ position: 'relative', zIndex: 10, display: 'flex', gap: '2.5rem', alignItems: 'flex-end', flexWrap: 'wrap' }} className="hero-content-flex">
          
          {/* Profile Picture with Marco Iluminado */}
          <div style={{ 
            position: 'relative', 
            width: '180px', 
            height: '180px', 
            borderRadius: '50%', 
            overflow: 'hidden',
            border: '4px solid var(--primary)',
            boxShadow: '0 0 25px rgba(139, 92, 246, 0.5)',
            flexShrink: 0
          }} className="profile-frame-glow">
            <Image 
              src={profile.photo || 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=250&q=80'} 
              alt={profile.name} 
              fill 
              style={{ objectFit: 'cover' }}
              unoptimized
            />
          </div>

          {/* Info Details */}
          <div style={{ flex: 1, minWidth: '280px' }}>
            <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', marginBottom: '0.75rem' }}>
              <span className="info-badge" style={{ background: 'rgba(139, 92, 246, 0.15)', color: '#c4b5fd', border: '1px solid rgba(139, 92, 246, 0.3)' }}>
                <Award size={13} /> {profile.yearsExperience || 5} Años de Experiencia
              </span>
              {profile.location && (
                <span className="info-badge" style={{ background: 'rgba(255, 255, 255, 0.04)', color: 'white', border: '1px solid rgba(255, 255, 255, 0.08)' }}>
                  <MapPin size={13} color="var(--primary)" /> {profile.location}
                </span>
              )}
            </div>

            <h1 style={{ fontSize: '3.2rem', fontWeight: 900, color: 'white', margin: '0 0 0.5rem 0', lineHeight: 1.1 }}>
              {profile.name}
            </h1>
            <p style={{ fontSize: '1.2rem', color: '#c4b5fd', margin: '0 0 1.25rem 0', fontWeight: 700 }}>
              {profile.specialty || 'Operador Turístico Autorizado'}
            </p>

            {/* Languages and details */}
            {profile.languages && profile.languages.length > 0 && (
              <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', flexWrap: 'wrap', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                <Globe size={14} color="#06b6d4" />
                <span>Idiomas:</span>
                {profile.languages.map((l: string) => (
                  <span key={l} style={{ background: 'rgba(255,255,255,0.05)', padding: '0.15rem 0.5rem', borderRadius: '4px', color: 'white', fontWeight: 600 }}>{l}</span>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>
    ),
    bio: (
      <section key="bio" style={{ padding: '5rem 0' }}>
        <div className="container" style={{ display: 'grid', gridTemplateColumns: '1.8fr 1fr', gap: '4rem' }} className="details-grid">
          
          {/* Description & Bio */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            <div className="glass-panel" style={{ padding: '3rem', borderRadius: '24px', border: '1px solid var(--border-glass)' }}>
              <h2 style={{ fontSize: '1.8rem', fontWeight: 800, color: 'white', margin: '0 0 1.5rem 0', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Briefcase size={22} color="var(--primary)" /> Perfil Profesional
              </h2>
              <div 
                className="bio-content-html" 
                style={{ color: 'var(--text-muted)', fontSize: '1.05rem', lineHeight: '1.75' }}
                dangerouslySetInnerHTML={{ __html: profile.bio || '' }}
              />
            </div>

            {/* Specialties & Tags */}
            {profile.specialties && profile.specialties.length > 0 && (
              <div className="glass-panel" style={{ padding: '2.5rem', borderRadius: '24px', border: '1px solid var(--border-glass)' }}>
                <h3 style={{ fontSize: '1.4rem', fontWeight: 800, color: 'white', margin: '0 0 1.25rem 0', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Sparkles size={18} color="#06b6d4" /> Especialidades del Operador
                </h3>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem' }}>
                  {profile.specialties.map((s: string) => (
                    <span key={s} style={{ background: 'rgba(6, 182, 212, 0.08)', border: '1px solid rgba(6, 182, 212, 0.2)', color: '#06b6d4', padding: '0.4rem 1rem', borderRadius: '50px', fontSize: '0.85rem', fontWeight: 700 }}>
                      {s}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right Side Stats & Acreditaciones */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            
            {/* Operator Stats */}
            {profile.stats && profile.stats.length > 0 && (
              <div className="glass-panel" style={{ padding: '2.5rem', borderRadius: '24px', border: '1px solid var(--border-glass)', display: 'grid', gridTemplateColumns: '1fr', gap: '1.5rem', textAlign: 'center' }}>
                {profile.stats.map((st: any, i: number) => (
                  <div key={i} style={{ display: 'flex', flexDirection: 'column', borderBottom: i < profile.stats!.length - 1 ? '1px solid rgba(255,255,255,0.05)' : 'none', paddingBottom: i < profile.stats!.length - 1 ? '1.5rem' : '0' }}>
                    <span style={{ fontSize: '2.5rem', fontWeight: 900 }} className="text-gradient">
                      {st.value}{st.suffix}
                    </span>
                    <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px', marginTop: '0.2rem', fontWeight: 700 }}>{st.label}</span>
                  </div>
                ))}
              </div>
            )}

            {/* Certificaciones Badges */}
            {profile.certifications && profile.certifications.length > 0 && (
              <div className="glass-panel" style={{ padding: '2.5rem', borderRadius: '24px', border: '1px solid var(--border-glass)' }}>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'white', margin: '0 0 1.25rem 0', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <ShieldCheck size={18} color="#10b981" /> Certificaciones Oficiales
                </h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  {profile.certifications.map((c: any, i: number) => (
                    <div key={i} style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', background: 'rgba(255,255,255,0.02)', padding: '0.75rem 1rem', borderRadius: '14px', border: '1px solid var(--border-glass)' }}>
                      <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: 'rgba(16,185,129,0.1)', display: 'flex', alignItems: 'center', justifyContext: 'center', color: '#10b981', flexShrink: 0 }}>
                        <Award size={18} style={{ margin: 'auto' }} />
                      </div>
                      <div>
                        <strong style={{ fontSize: '0.85rem', color: 'white', display: 'block' }}>{c.name}</strong>
                        <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>{c.issuer} ({c.year})</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

        </div>
      </section>
    ),
    multimedia: ((profile.gallery && profile.gallery.length > 0) || (profile.youtubeEmbeds && profile.youtubeEmbeds.length > 0)) ? (
        <section key="multimedia" style={{ padding: '5rem 0', background: 'rgba(255,255,255,0.01)', borderTop: '1px solid var(--border-glass)', borderBottom: '1px solid var(--border-glass)' }}>
          <div className="container">
            <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
              <span className="info-badge" style={{ background: 'rgba(139,92,246,0.1)', color: '#c4b5fd', border: '1px solid rgba(139,92,246,0.2)' }}>Multimedia</span>
              <h2 style={{ fontSize: '2.5rem', fontWeight: 800, color: 'white', margin: '0.5rem 0 0 0' }}>Galería de Experiencias</h2>
            </div>

            {/* Photos gallery */}
            {profile.gallery && profile.gallery.length > 0 && (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1.5rem', marginBottom: '3rem' }}>
                {profile.gallery.map((url, i) => (
                  <div key={i} className="glass-card" style={{ padding: '0.4rem', borderRadius: '16px', overflow: 'hidden', border: '1px solid var(--border-glass)' }}>
                    <div style={{ position: 'relative', height: '220px', borderRadius: '10px', overflow: 'hidden' }}>
                      <Image src={url} alt={`${profile.name} Gallery`} fill style={{ objectFit: 'cover' }} unoptimized />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>
    ) : null,
    tours: operatorTours.length > 0 ? (
        <section key="tours" style={{ padding: '6rem 0' }}>
          <div className="container">
            <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
              <span className="info-badge" style={{ background: 'rgba(6, 182, 212, 0.1)', color: '#22d3ee', border: '1px solid rgba(6, 182, 212, 0.2)' }}>Explorar Catálogo</span>
              <h2 style={{ fontSize: '2.5rem', fontWeight: 800, color: 'white', margin: '0.5rem 0 0 0' }}>Tours Destacados de {profile.name}</h2>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '2.5rem' }}>
              {operatorTours.map((pkg) => (
                <div key={pkg.id} className="glass-card" style={{ borderRadius: '30px', overflow: 'hidden', border: '1px solid var(--border-glass)' }}>
                  <div style={{ height: '220px', position: 'relative', overflow: 'hidden' }}>
                    {pkg.image ? (
                      <Image src={pkg.image} alt={pkg.name} fill style={{ objectFit: 'cover' }} unoptimized />
                    ) : (
                      <div style={{ width: '100%', height: '100%', background: 'rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', justifyContext: 'center' }}><Compass size={40} opacity={0.1} /></div>
                    )}
                    <span style={{ position: 'absolute', bottom: '1.25rem', right: '1.25rem', background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(10px)', color: 'white', padding: '0.4rem 0.8rem', borderRadius: '10px', fontWeight: 900, fontSize: '1rem', border: '1px solid var(--border-glass)' }}>
                      ${pkg.price?.toLocaleString()} USD
                    </span>
                  </div>
                  <div style={{ padding: '1.75rem' }}>
                    <span style={{ fontSize: '0.65rem', fontWeight: 900, background: 'rgba(139,92,246,0.1)', color: '#c4b5fd', padding: '0.3rem 0.7rem', borderRadius: '6px', textTransform: 'uppercase', letterSpacing: '1px' }}>Exclusivo</span>
                    <h3 style={{ fontSize: '1.3rem', fontWeight: 800, color: 'white', margin: '0.75rem 0 0.5rem 0', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{pkg.name}</h3>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', lineHeight: '1.6', margin: '0 0 1.5rem 0', height: '3rem', overflow: 'hidden', textOverflow: 'ellipsis', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>{pkg.description}</p>
                    <Link href={`/packages?reserve=${pkg.id}`} className="btn-premium" style={{ padding: '0.75rem', borderRadius: '12px', fontSize: '0.85rem', fontWeight: 800, textDecoration: 'none', justifyContent: 'center' }}>
                      Reservar Ahora
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
    ) : null,
    testimonios: profile.testimonials && profile.testimonials.length > 0 ? (
        <section key="testimonios" style={{ padding: '6rem 0', background: 'rgba(5, 7, 10, 0.4)', borderTop: '1px solid var(--border-glass)', borderBottom: '1px solid var(--border-glass)' }}>
          <div className="container">
            <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
              <span className="info-badge" style={{ background: 'rgba(16,185,129,0.1)', color: '#34d399', border: '1px solid rgba(16,185,129,0.2)' }}>Valoraciones</span>
              <h2 style={{ fontSize: '2.5rem', fontWeight: 800, color: 'white', margin: '0.5rem 0 0 0' }}>Testimonios de Huéspedes</h2>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2rem' }}>
              {profile.testimonials.map((test, i) => (
                <div key={i} className="glass-card" style={{ padding: '2rem', borderRadius: '20px', border: '1px solid var(--border-glass)', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                  <div style={{ display: 'flex', gap: '0.1rem' }}>
                    {Array(5).fill(0).map((_, idx) => (
                      <Star key={idx} size={15} fill={idx < test.rating ? '#f59e0b' : 'none'} color="#f59e0b" />
                    ))}
                  </div>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', lineHeight: '1.7', margin: 0, fontStyle: 'italic', flex: 1 }}>
                    "{test.comment}"
                  </p>
                  <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '1rem' }}>
                    {test.clientPhoto && (
                      <div style={{ position: 'relative', width: '44px', height: '44px', borderRadius: '50%', overflow: 'hidden' }}>
                        <img src={test.clientPhoto} alt={test.clientName} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      </div>
                    )}
                    <div>
                      <strong style={{ color: 'white', fontSize: '0.9rem', display: 'block' }}>{test.clientName}</strong>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
    ) : null,
    social: (
      <section key="social" style={{ padding: '6rem 0' }}>
        <div className="container">
          <div className="glass-panel" style={{ 
            borderRadius: '30px', 
            padding: '5rem 3rem', 
            border: '1px solid rgba(139, 92, 246, 0.25)', 
            background: 'linear-gradient(135deg, rgba(5,7,10,0.98) 0%, rgba(139, 92, 246, 0.05) 100%)',
            textAlign: 'center',
            boxShadow: '0 25px 65px -10px rgba(139, 92, 246, 0.15)',
            position: 'relative'
          }}>
            <h2 style={{ fontSize: '3rem', fontWeight: 900, color: 'white', margin: '0 0 1.5rem 0', lineHeight: 1.1 }}>
              Reserva tu Próximo Tour <br />
              <span className="text-gradient">Directamente con {profile.name}</span>
            </h2>
            
            <p style={{ color: 'var(--text-muted)', fontSize: '1.15rem', maxWidth: '600px', margin: '0 auto 2.5rem auto', lineHeight: 1.6 }}>
              Conéctate a través de canales directos para solicitar itinerarios especiales o coordinar traslados ejecutivos en toda la Riviera Maya.
            </p>

            {/* Social icons row */}
            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap', marginBottom: '3.5rem' }}>
              {profile.instagram && (
                <a href={profile.instagram} target="_blank" rel="noopener noreferrer" className="social-btn instagram" title="Instagram"><Instagram size={20} /></a>
              )}
              {profile.facebook && (
                <a href={profile.facebook} target="_blank" rel="noopener noreferrer" className="social-btn facebook" title="Facebook"><Facebook size={20} /></a>
              )}
              {profile.whatsapp && (
                <a href={profile.whatsapp} target="_blank" rel="noopener noreferrer" className="social-btn whatsapp" title="WhatsApp"><WhatsAppIcon width={20} height={20} /></a>
              )}
            </div>

            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
              {profile.whatsapp && (
                <a href={profile.whatsapp} target="_blank" rel="noopener noreferrer" className="btn-premium" style={{ padding: '1rem 3rem', fontSize: '1rem', fontWeight: 700, borderRadius: '50px', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}>
                  <WhatsAppIcon width={18} height={18} />
                  <span>Contactar Operador</span>
                </a>
              )}
              <Link href="/packages" className="btn-glass-nav" style={{ padding: '1rem 3rem', fontSize: '1rem', fontWeight: 700, borderRadius: '50px', border: '1px solid rgba(255,255,255,0.2)', textDecoration: 'none' }}>
                Ver Más Experiencias
              </Link>
            </div>
          </div>
        </div>
      </section>
    )
  };

  const defaultOrder = ['hero', 'bio', 'multimedia', 'tours', 'testimonios', 'social'];
  const orderToRender = profile.sectionsOrder?.length ? profile.sectionsOrder : defaultOrder;

  return (
    <div style={{ background: '#05070a', color: 'white', minHeight: '100vh', paddingBottom: '5rem' }}>
      
      {orderToRender.map((sectionKey: string) => sectionsMap[sectionKey])}

      {/* CUSTOM STYLE INJECTIONS FOR RESPONSIVENESS */}
      <style dangerouslySetInnerHTML={{ __html: `
        .info-badge {
          display: inline-flex;
          align-items: center;
          gap: 0.35rem;
          padding: 0.35rem 0.8rem;
          border-radius: 50px;
          font-size: 0.72rem;
          font-weight: 800;
          letter-spacing: 0.5px;
          text-transform: uppercase;
        }
        .social-btn {
          width: 52px;
          height: 52px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          background: rgba(255,255,255,0.03);
          border: 1px solid var(--border-glass);
          cursor: pointer;
          transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
          text-decoration: none;
        }
        .social-btn:hover {
          transform: scale(1.15) translateY(-3px);
          color: white;
        }
        .social-btn.instagram:hover {
          background: radial-gradient(circle at 30% 107%, #fdf497 0%, #fdf497 5%, #fd5949 45%,#d6249f 60%,#285aeb 90%);
          border-color: transparent;
          box-shadow: 0 5px 15px rgba(214, 36, 159, 0.4);
        }
        .social-btn.facebook:hover {
          background: #1877f2;
          border-color: #1877f2;
          box-shadow: 0 5px 15px rgba(24, 119, 242, 0.4);
        }
        .social-btn.whatsapp:hover {
          background: #25d366;
          border-color: #25d366;
          box-shadow: 0 5px 15px rgba(37, 211, 102, 0.4);
        }
        @media (max-width: 992px) {
          .hero-content-wrap {
            flex-direction: column !important;
            align-items: center !important;
            text-align: center !important;
          }
          .hero-content-flex {
            flex-direction: column !important;
            align-items: center !important;
            text-align: center !important;
          }
          .details-grid {
            grid-template-columns: 1fr !important;
            gap: 3rem !important;
          }
        }
      `}} />

    </div>
  );
}
