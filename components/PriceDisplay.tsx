'use client';

import React from 'react';
import { useCurrency } from '../context/CurrencyContext';

export default function PriceDisplay({ 
    amount, 
    className, 
    style 
}: { 
    amount: number, 
    className?: string, 
    style?: React.CSSProperties 
}) {
    const { formatPrice } = useCurrency();
    
    return (
        <span className={className} style={style}>
            {formatPrice(amount)}
        </span>
    );
}
