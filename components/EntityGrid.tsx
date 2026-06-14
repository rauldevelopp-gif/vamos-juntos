'use client';

import { useState } from 'react';
import EntityCard from './EntityCard';
import Link from 'next/link';
import { useLanguage } from '../context/LanguageContext';
import { useCurrency } from '../context/CurrencyContext';
import { getTranslatedValue } from '../lib/i18n-utils';
import EntityModal from './EntityModal';

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
    items: GridItem[];
    viewMoreLink?: string;
    viewMoreText?: string;
    accentColor?: string;
}

export default function EntityGrid({ title, subtitle, items, viewMoreLink, viewMoreText, accentColor }: EntityGridProps) {
    const { language } = useLanguage();
    const { formatPrice } = useCurrency();
    const isEn = language === 'en';
    const [selectedItem, setSelectedItem] = useState<GridItem | null>(null);

    if (!items || items.length === 0) return null;

    const defaultViewMoreText = viewMoreText || (isEn ? "View all" : "Ver todos");

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
                        const priceLabelText = isEn ? "From" : "Desde";
                        const priceLabel = price ? `${priceLabelText} ${formatPrice(price)}` : undefined;
                        
                        let cardSubtitle = '';
                        const localizedDescription = getTranslatedValue(item.description_long || item.description, language);
                        const localizedType = getTranslatedValue(item.type, language);

                        if (item.capacity) {
                            cardSubtitle = isEn 
                                ? `Comfortable capacity: ${item.capacity} people` 
                                : `Capacidad cómoda: ${item.capacity} personas`;
                        } else if (localizedType) {
                            cardSubtitle = localizedType;
                        } else if (localizedDescription) {
                            cardSubtitle = localizedDescription.substring(0, 50) + '...';
                        }

                        let badge = item.popularity || item.status || (item.brand ? 'POPULAR' : undefined);
                        if (badge === 'Activo' || badge === 'Abierta' || badge === 'DISPONIBLE') {
                            badge = isEn ? 'AVAILABLE' : 'DISPONIBLE';
                        } else if (badge) {
                            badge = getTranslatedValue(badge, language);
                        }

                        const cardTitle = item.brand ? `${item.brand} ${getTranslatedValue(item.name, language)}` : getTranslatedValue(item.name, language);

                        return (
                            <div key={item.id} style={{ display: 'flex', justifyContent: 'center' }}>
                                <EntityCard 
                                    title={cardTitle}
                                    subtitle={cardSubtitle}
                                    priceLabel={priceLabel}
                                    gallery={item.gallery && item.gallery.length > 0 ? item.gallery : (item.image ? [item.image] : undefined)}
                                    badge={badge?.toUpperCase()}
                                    accentColor={accentColor}
                                    onClick={() => setSelectedItem(item)}
                                />
                            </div>
                        );
                    })}
                </div>

                {viewMoreLink && (
                    <div style={{ textAlign: 'center', marginTop: '3rem' }}>
                        <Link href={viewMoreLink} className="btn-premium" style={{ padding: '1rem 2.5rem', fontSize: '1.1rem', display: 'inline-block', borderRadius: '50px' }}>
                            {defaultViewMoreText}
                        </Link>
                    </div>
                )}
            </div>

            {selectedItem && (
                <EntityModal 
                    item={selectedItem} 
                    onClose={() => setSelectedItem(null)} 
                    accentColor={accentColor} 
                />
            )}

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
