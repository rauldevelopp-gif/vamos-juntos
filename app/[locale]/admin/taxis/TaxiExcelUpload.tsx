'use client';

import { useState, useRef } from 'react';
import { Download, Loader2, FileSpreadsheet } from 'lucide-react';
import * as XLSX from 'xlsx';
import { bulkCreateTaxis } from './actions';
import { tr, setLanguage } from '@/lib/tr';
import { toast } from 'react-hot-toast';
import { useLanguage } from '@/context/LanguageContext';

export default function TaxiExcelUpload({ onSuccess }: { onSuccess: () => void }) {
    const { language } = useLanguage();
    setLanguage(language);
    
    const [loading, setLoading] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const downloadTemplate = () => {
        const templateData = [
            {
                plate: 'ABC-1234',
                brand: 'Toyota',
                model: 'Camry',
                year: 2023,
                color: 'Blanco',
                type: 'Sedan VIP',
                passengers: 4,
                luggage: 2,
                status: 'Disponible',
                amenities: 'A/C, WiFi, Bebidas',
                driver_name: 'Juan Perez',
                driver_license: 'LIC-98765',
                driver_phone: '+52 998 123 4567'
            }
        ];
        
        const ws = XLSX.utils.json_to_sheet(templateData);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "Taxis");
        XLSX.writeFile(wb, "plantilla_taxis.xlsx");
    };

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setLoading(true);
        try {
            const reader = new FileReader();
            reader.onload = async (evt) => {
                const bstr = evt.target?.result;
                const wb = XLSX.read(bstr, { type: 'binary' });
                const wsname = wb.SheetNames[0];
                const ws = wb.Sheets[wsname];
                const data = XLSX.utils.sheet_to_json(ws);
                
                if (data.length === 0) {
                    toast.error(tr('El archivo está vacío'));
                    setLoading(false);
                    return;
                }

                const res = await bulkCreateTaxis(data);
                if (res.success) {
                    if (res.count === 0) {
                        toast.error(tr('0 importados. Revisa el formato del archivo.'));
                    } else {
                        toast.success(tr('¡Éxito! Se importaron') + ` ${res.count} ` + tr('taxis.'));
                        onSuccess();
                    }
                } else {
                    toast.error(tr('Error:') + ` ${res.error}`);
                }
                setLoading(false);
                if (fileInputRef.current) fileInputRef.current.value = '';
            };
            reader.readAsBinaryString(file);
        } catch (error) {
            console.error(error);
            toast.error(tr('Error al leer el archivo. Verifica el formato.'));
            setLoading(false);
        }
    };

    return (
        <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button 
                onClick={downloadTemplate} 
                className="btn-glass-nav" 
                style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.8rem 1.2rem', borderRadius: '12px' }}
                title={tr("Descargar Plantilla Excel")}
            >
                <Download size={18} />
                <span className="btn-text-mobile-hide">{tr('Plantilla')}</span>
            </button>

            <button 
                onClick={() => fileInputRef.current?.click()} 
                className="btn-secondary" 
                style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.8rem 1.2rem', borderRadius: '12px', position: 'relative' }}
                disabled={loading}
            >
                {loading ? <Loader2 size={18} className="animate-spin" /> : <FileSpreadsheet size={18} />}
                <span className="btn-text-mobile-hide">{loading ? tr('Cargando...') : tr('Importar')}</span>
            </button>
            <input 
                type="file" 
                accept=".xlsx, .xls, .csv" 
                ref={fileInputRef} 
                style={{ display: 'none' }} 
                onChange={handleFileUpload} 
            />
        </div>
    );
}
