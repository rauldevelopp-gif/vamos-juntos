'use client';

import { tr, setLanguage } from '@/lib/tr';
import { useState, useRef } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { Download, Loader2, FileSpreadsheet } from 'lucide-react';
import * as XLSX from 'xlsx';
import { bulkCreateBeaches } from './actions';
import { toast } from 'react-hot-toast';

export default function BeachExcelUpload({ onSuccess }: { onSuccess: () => void }) {
    const { language } = useLanguage();
    setLanguage(language);
    const [loading, setLoading] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const downloadTemplate = () => {
        const templateData = [
            {
                name: 'Ejemplo: Playa Delfines',
                type: 'Pública',
                city: 'Cancún',
                state: 'Quintana Roo',
                status: 'Abierta',
                popularity: 'Alta',
                coordinates: '21.0583,-86.7779',
                description_long: 'Una de las playas más hermosas y famosas de Cancún, ideal para fotos en el mirador.'
            }
        ];
        
        const ws = XLSX.utils.json_to_sheet(templateData);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "Playas");
        XLSX.writeFile(wb, "plantilla_playas.xlsx");
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
                    toast.error('El archivo está vacío');
                    setLoading(false);
                    return;
                }

                const res = await bulkCreateBeaches(data);
                if (res.success) {
                    if (res.count === 0) {
                        toast.error('0 importados. Revisa el formato del archivo.');
                    } else {
                        toast.success(tr("¡Éxito! Se importaron") + ` ${res.count} ` + tr("playas."));;
                        onSuccess();
                    }
                } else {
                    toast.error(`Error: ${res.error}`);
                }
                setLoading(false);
                if (fileInputRef.current) fileInputRef.current.value = '';
            };
            reader.readAsBinaryString(file);
        } catch (error) {
            console.error(error);
            toast.error('Error al leer el archivo. Verifica el formato.');
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
                <span className="btn-text-mobile-hide">{tr("Plantilla")}</span>
            </button>

            <button 
                onClick={() => fileInputRef.current?.click()} 
                className="btn-secondary" 
                style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.8rem 1.2rem', borderRadius: '12px', position: 'relative' }}
                disabled={loading}
            >
                {loading ? <Loader2 size={18} className="animate-spin" /> : <FileSpreadsheet size={18} />}
                <span className="btn-text-mobile-hide">{loading ? tr("Cargando...") : tr("Importar")}</span>
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
