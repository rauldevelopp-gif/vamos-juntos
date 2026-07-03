'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

export type Currency = 'USD' | 'EUR' | 'MXN';

interface CurrencyContextType {
    currency: Currency;
    setCurrency: (currency: Currency) => void;
    formatPrice: (amountInUSD: number) => string;
}

const CurrencyContext = createContext<CurrencyContextType | undefined>(undefined);

// Tasas de cambio fijas para la Fase 1
const EXCHANGE_RATES: Record<Currency, number> = {
    USD: 1,
    EUR: 0.92,
    MXN: 18.0
};

export const CurrencyProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [currency, setCurrencyState] = useState<Currency>('USD');
    const [mounted, setMounted] = useState(false);
    const [rates, setRates] = useState<Record<Currency, number>>(EXCHANGE_RATES);

    useEffect(() => {
        setMounted(true);
        const savedCurrency = localStorage.getItem('vamosJuntos_currency') as Currency;
        if (savedCurrency && ['USD', 'EUR', 'MXN'].includes(savedCurrency)) {
            setCurrencyState(savedCurrency);
        }

        // Fetch dynamic rates
        fetch('https://open.er-api.com/v6/latest/USD')
            .then(res => res.json())
            .then(data => {
                if (data && data.result === 'success' && data.rates) {
                    setRates({
                        USD: 1,
                        EUR: data.rates.EUR || EXCHANGE_RATES.EUR,
                        MXN: data.rates.MXN || EXCHANGE_RATES.MXN
                    });
                }
            })
            .catch(err => console.error('Error fetching exchange rates:', err));
    }, []);

    const setCurrency = (newCurrency: Currency) => {
        setCurrencyState(newCurrency);
        localStorage.setItem('vamosJuntos_currency', newCurrency);
    };

    const formatPrice = (amountInUSD: number | undefined | null): string => {
        if (amountInUSD === undefined || amountInUSD === null) return '';
        
        // Use default USD formatting if not mounted to prevent hydration mismatch
        const activeCurrency = mounted ? currency : 'USD';
        
        const rate = rates[activeCurrency];
        const converted = amountInUSD * rate;
        
        // Format based on currency
        if (activeCurrency === 'EUR') {
            return `€${converted.toLocaleString('es-ES', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;
        } else if (activeCurrency === 'MXN') {
            return `$${converted.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })} MXN`;
        } else {
            return `$${converted.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })} USD`;
        }
    };

    return (
        <CurrencyContext.Provider value={{ currency, setCurrency, formatPrice }}>
            {children}
        </CurrencyContext.Provider>
    );
};

export const useCurrency = () => {
    const context = useContext(CurrencyContext);
    if (context === undefined) {
        throw new Error('useCurrency must be used within a CurrencyProvider');
    }
    return context;
};
