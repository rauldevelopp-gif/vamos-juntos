'use client';
import { useLanguage } from '@/context/LanguageContext';
import { tr, setLanguage } from '@/lib/tr';
import React, { useState, useEffect } from 'react';
import { Percent, Plus, Trash2, CheckCircle2, XCircle, Loader2, RefreshCw } from 'lucide-react';
import { getDiscountCodes, createDiscountCode, deleteDiscountCode } from './actions';

interface DiscountCode {
    id: number;
    code: string;
    discount: number;
    used: boolean;
    createdAt: string;
}

export default function DiscountsPage() {
  const { language } = useLanguage();
  setLanguage(language);
    const [codes, setCodes] = useState<DiscountCode[]>([]);
    const [loading, setLoading] = useState(true);
    const [newCode, setNewCode] = useState('');
    const [newDiscount, setNewDiscount] = useState('');
    const [creating, setCreating] = useState(false);
    const [error, setError] = useState('');

    const fetchCodes = async () => {
        setLoading(true);
        const res = await getDiscountCodes();
        if (res.success) {
            setCodes(res.data || []);
        }
        setLoading(false);
    };

    const generateRandomCode = () => {
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
        let result = 'VJ-';
        for (let i = 0; i < 5; i++) {
            result += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        setNewCode(result);
    };

    useEffect(() => {
        fetchCodes();
        generateRandomCode();
    }, []);

    const handleCreate = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        
        if (!newCode || !newDiscount) {
            setError(tr('Por favor llena todos los campos'));
            return;
        }

        const discountValue = parseFloat(newDiscount);
        if (isNaN(discountValue) || discountValue <= 0 || discountValue > 100) {
            setError(tr('El descuento debe ser un porcentaje entre 1 y 100'));
            return;
        }

        setCreating(true);
        const res = await createDiscountCode({ code: newCode.toUpperCase(), discount: discountValue });
        if (res.success) {
            generateRandomCode();
            setNewDiscount('');
            fetchCodes();
        } else {
            setError(res.error || tr('Error al crear código'));
        }
        setCreating(false);
    };

    const handleDelete = async (id: number) => {
        if (!confirm(tr('¿Seguro que deseas eliminar este código?'))) return;
        const res = await deleteDiscountCode(id);
        if (res.success) {
            fetchCodes();
        } else {
            alert(res.error || tr('Error al eliminar'));
        }
    };

    return (
        <div className="discounts-container" style={{ padding: '2rem' }}>
            <h1 className="page-title" style={{ fontSize: '2rem', fontWeight: 900, marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '0.75rem', color: 'white' }}>
                <Percent size={32} style={{ color: 'var(--primary)' }} />
                {tr("Gestionar Cupones")}
            </h1>

            <div className="discounts-grid" style={{ display: 'grid', gap: '2rem' }}>
                {/* Form to create */}
                <div style={{ background: '#111', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '24px', padding: '2rem', height: 'fit-content' }}>
                    <h2 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '1.5rem', color: 'white' }}>{tr("Nuevo Código")}</h2>
                    <form onSubmit={handleCreate} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                            <label style={{ fontSize: '0.75rem', fontWeight: 800, color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase' }}>{tr("Código Generado Automáticamente")}</label>
                            <div style={{ display: 'flex', gap: '0.5rem' }}>
                                <div style={{ flex: 1, background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', padding: '1rem', borderRadius: '12px', color: '#8b5cf6', fontWeight: 900, letterSpacing: '0.1em', display: 'flex', alignItems: 'center' }}>
                                    {newCode}
                                </div>
                                <button 
                                    type="button" 
                                    onClick={generateRandomCode}
                                    style={{ background: 'rgba(255,255,255,0.1)', color: 'white', border: 'none', padding: '0 1rem', borderRadius: '12px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.2s' }}
                                    onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.15)'}
                                    onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.1)'}
                                    title={tr("Regenerar Código")}
                                >
                                    <RefreshCw size={18} />
                                </button>
                            </div>
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                            <label style={{ fontSize: '0.75rem', fontWeight: 800, color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase' }}>{tr("Porcentaje de Descuento (%)")}</label>
                            <input 
                                type="number" 
                                value={newDiscount}
                                onChange={e => setNewDiscount(e.target.value)}
                                style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', padding: '1rem', borderRadius: '12px', color: 'white', fontWeight: 700 }}
                                placeholder={tr("Ej. 15")}
                            />
                        </div>
                        
                        {error && <p style={{ color: '#ef4444', fontSize: '0.85rem', fontWeight: 600 }}>{error}</p>}
                        
                        <button 
                            type="submit" 
                            disabled={creating}
                            style={{ background: 'var(--primary)', color: 'white', border: 'none', padding: '1rem', borderRadius: '12px', fontWeight: 900, textTransform: 'uppercase', cursor: creating ? 'not-allowed' : 'pointer', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.5rem', marginTop: '1rem' }}
                        >
                            {creating ? <Loader2 size={18} className="animate-spin" /> : <><Plus size={18} /> {tr("Crear Código")}</>}
                        </button>
                    </form>
                </div>

                {/* List of codes */}
                <div style={{ background: '#111', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '24px', padding: '2rem' }}>
                    <h2 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '1.5rem', color: 'white' }}>{tr("Códigos Creados")}</h2>
                    
                    {loading ? (
                        <div style={{ display: 'flex', justifyContent: 'center', padding: '3rem' }}>
                            <Loader2 size={32} className="animate-spin" style={{ color: 'var(--primary)' }} />
                        </div>
                    ) : codes.length === 0 ? (
                        <p style={{ color: 'rgba(255,255,255,0.4)', textAlign: 'center', padding: '2rem' }}>{tr("No hay códigos creados.")}</p>
                    ) : (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                            {codes.map(c => (
                                <div key={c.id} className="discount-item-row" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(255,255,255,0.03)', padding: '1rem 1.5rem', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.05)' }}>
                                    <div className="discount-item-content" style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                                        <div>
                                            <p style={{ color: 'white', fontWeight: 900, fontSize: '1.1rem', letterSpacing: '0.1em' }}>{c.code}</p>
                                            <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.75rem' }}>{new Date(c.createdAt).toLocaleDateString()}</p>
                                        </div>
                                        <div style={{ background: 'rgba(139, 92, 246, 0.1)', color: '#8b5cf6', padding: '0.25rem 0.75rem', borderRadius: '8px', fontWeight: 900, fontSize: '0.85rem' }}>
                                            -{c.discount}%
                                        </div>
                                        <div>
                                            {c.used ? (
                                                <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', color: '#ef4444', fontSize: '0.75rem', fontWeight: 700, background: 'rgba(239, 68, 68, 0.1)', padding: '0.25rem 0.5rem', borderRadius: '6px' }}>
                                                    <XCircle size={14} /> {tr("Usado")}
                                                </span>
                                            ) : (
                                                <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', color: '#10b981', fontSize: '0.75rem', fontWeight: 700, background: 'rgba(16, 185, 129, 0.1)', padding: '0.25rem 0.5rem', borderRadius: '6px' }}>
                                                    <CheckCircle2 size={14} /> {tr("Disponible")}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                    <button 
                                        onClick={() => handleDelete(c.id)}
                                        style={{ background: 'transparent', border: 'none', color: 'rgba(255,255,255,0.3)', cursor: 'pointer', padding: '0.5rem' }}
                                        onMouseEnter={e => e.currentTarget.style.color = '#ef4444'}
                                        onMouseLeave={e => e.currentTarget.style.color = 'rgba(255,255,255,0.3)'}
                                    >
                                        <Trash2 size={18} />
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            <style jsx>{`
                .discounts-grid {
                    grid-template-columns: 1fr 2fr;
                }
                @media (max-width: 900px) {
                    .discounts-grid {
                        grid-template-columns: 1fr;
                    }
                    .discounts-container {
                        padding: 1rem !important;
                    }
                    .page-title {
                        font-size: 1.5rem !important;
                    }
                    .discount-item-row {
                        flex-direction: column;
                        align-items: flex-start !important;
                        gap: 1rem;
                    }
                    .discount-item-content {
                        flex-direction: column;
                        align-items: flex-start !important;
                        gap: 0.75rem !important;
                    }
                }
            `}</style>
        </div>
    );
}
