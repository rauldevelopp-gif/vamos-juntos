'use client';

import { useState, useRef } from 'react';
import { Download, Loader2, FileSpreadsheet } from 'lucide-react';
import * as XLSX from 'xlsx';
import { bulkCreateHotels } from './actions';
import { tr, setLanguage } from '@/lib/tr';
import { toast } from 'react-hot-toast';
import { useLanguage } from '@/context/LanguageContext';

export default function HotelExcelUpload({ onSuccess }: { onSuccess: () => void }) {
    const { language } = useLanguage();
    setLanguage(language);
    
    const [loading, setLoading] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const downloadTemplate = () => {
        const templateData = [
            {
                name: 'Hotel Paraíso',
                category: 'Resort',
                stars: 5,
                city: 'Cancún',
                state: 'Quintana Roo',
                address: 'Zona Hotelera Km 10',
                coordinates: '21.1619,-86.8515',
                phone: '+52 998 123 4567',
                email: 'reservas@paraiso.com',
                description: 'Un resort increíble frente al mar con todo incluido.',
                policies: 'No fumar, check-in 15:00',
                checkInTime: '15:00',
                checkOutTime: '12:00',
                status: 'Disponible'
            }
        ];
        
        const ws = XLSX.utils.json_to_sheet(templateData);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "Hoteles");
        XLSX.writeFile(wb, "plantilla_hoteles.xlsx");
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

                const res = await bulkCreateHotels(data);
                if (res.success) {
                    if (res.count === 0) {
                        toast.error(tr('0 importados. Revisa el formato del archivo.'));
                    } else {
                        toast.success(tr('¡Éxito! Se importaron') + ` ${res.count} ` + tr('hoteles.'));
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
