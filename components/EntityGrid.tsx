import EntityCard from './EntityCard';
import Link from 'next/link';

interface GridItem {
    id: number;
    name: string;
    description_long?: string;
    description?: string;
    gallery?: string[];
    image?: string;
    price?: number;
    price_day?: number;
    capacity?: number;
    type?: string;
    brand?: string;
    popularity?: string;
    status?: string;
}

interface EntityGridProps {
    title: React.ReactNode;
    subtitle: React.ReactNode;
    viewMoreLink?: string;
    viewMoreText?: string;
    accentColor?: string;
}

export default function EntityGrid({ title, subtitle, items, viewMoreLink, viewMoreText = "Ver todos", accentColor }: EntityGridProps) {
    if (!items || items.length === 0) return null;

    return (
        <section style={{ padding: '5rem 0' }}>
            <div className="container">
                <div style={{ marginBottom: '3rem', textAlign: 'center' }}>
                    <h2 className="heading-1 float-animation" style={{ fontSize: '2.5rem', marginBottom: '1rem', textShadow: '0 5px 15px rgba(0,0,0,0.3)' }}>{title}</h2>
                    <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem', maxWidth: '600px', margin: '0 auto' }}>{subtitle}</p>
                </div>
                
                <div className="entity-grid">
                    {items.map((item) => {
                        const price = item.price_day || item.price;
                        const priceLabel = price ? `Desde $${price} USD` : undefined;
                        
                        let cardSubtitle = '';
                        if (item.capacity) cardSubtitle = `Capacidad cómoda: ${item.capacity} personas`;
                        else if (item.type) cardSubtitle = item.type;
                        else if (item.description_long) cardSubtitle = item.description_long.substring(0, 50) + '...';

                        let badge = item.popularity || item.status || (item.brand ? 'POPULAR' : undefined);
                        if (badge === 'Activo' || badge === 'Abierta') badge = 'DISPONIBLE';

                        const cardTitle = item.brand ? `${item.brand} ${item.name}` : item.name;

                        return (
                            <div key={item.id} style={{ display: 'flex', justifyContent: 'center' }}>
                                <EntityCard 
                                    title={cardTitle}
                                    subtitle={cardSubtitle}
                                    priceLabel={priceLabel}
                                    gallery={item.gallery}
                                    badge={badge?.toUpperCase()}
                                    accentColor={accentColor}
                                />
                            </div>
                        );
                    })}
                </div>

                {viewMoreLink && (
                    <div style={{ textAlign: 'center', marginTop: '3rem' }}>
                        <Link href={viewMoreLink} className="btn-premium" style={{ padding: '1rem 2.5rem', fontSize: '1.1rem', display: 'inline-block', borderRadius: '50px' }}>
                            {viewMoreText}
                        </Link>
                    </div>
                )}
            </div>

            <style jsx>{`
                .entity-grid {
                    display: grid;
                    grid-template-columns: repeat(1, 1fr);
                    gap: 2rem;
                }
                @media (min-width: 768px) {
                    .entity-grid {
                        grid-template-columns: repeat(2, 1fr);
                    }
                }
                @media (min-width: 1100px) {
                    .entity-grid {
                        grid-template-columns: repeat(3, 1fr);
                    }
                }
            `}</style>
        </section>
    );
}
