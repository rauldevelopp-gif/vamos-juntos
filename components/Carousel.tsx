import Image from 'next/image';
import EntityCard from './EntityCard';

interface CarouselItem {
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

interface CarouselProps {
    title: React.ReactNode;
    subtitle: React.ReactNode;
    items: CarouselItem[];
}

export default function Carousel({ title, subtitle, items }: CarouselProps) {
    if (!items || items.length === 0) return null;

    return (
        <section style={{ padding: '5rem 0' }}>
            <div className="container">
                <div style={{ marginBottom: '3rem', textAlign: 'center' }}>
                    <h2 className="heading-1 float-animation" style={{ fontSize: '2.5rem', marginBottom: '1rem', textShadow: '0 5px 15px rgba(0,0,0,0.3)' }}>{title}</h2>
                    <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem', maxWidth: '600px', margin: '0 auto' }}>{subtitle}</p>
                </div>
                
                <div style={{ 
                    display: 'flex', 
                    gap: '1.5rem', 
                    overflowX: 'auto', 
                    scrollSnapType: 'x mandatory', 
                    paddingBottom: '2.5rem',
                    WebkitOverflowScrolling: 'touch',
                }} className="hide-scrollbar">
                    {items.map((item) => {
                        const price = item.price_day || item.price;
                        const priceLabel = price ? `Desde $${price} USD` : undefined;
                        
                        let subtitle = '';
                        if (item.capacity) subtitle = `Capacidad cómoda: ${item.capacity} personas`;
                        else if (item.type) subtitle = item.type;
                        else if (item.description_long) subtitle = item.description_long.substring(0, 50) + '...';

                        let badge = item.popularity || item.status || (item.brand ? 'POPULAR' : undefined);
                        if (badge === 'Activo' || badge === 'Abierta') badge = 'DISPONIBLE';

                        const title = item.brand ? `${item.brand} ${item.name}` : item.name;

                        return (
                            <EntityCard 
                                key={item.id}
                                title={title}
                                subtitle={subtitle}
                                priceLabel={priceLabel}
                                gallery={item.gallery}
                                badge={badge?.toUpperCase()}
                            />
                        );
                    })}
                </div>
            </div>

            <style jsx global>{`
                .hide-scrollbar::-webkit-scrollbar {
                    display: none;
                }
                .hide-scrollbar {
                    -ms-overflow-style: none;
                    scrollbar-width: none;
                }
            `}</style>
        </section>
    );
}
