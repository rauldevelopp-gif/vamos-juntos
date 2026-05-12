'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';

interface BeforeInstallPromptEvent extends Event {
    prompt: () => Promise<void>;
    userChoice: Promise<{ outcome: 'accepted' | 'dismissed', platform: string }>;
}

export default function PWARegistration() {
    const [installPrompt, setInstallPrompt] = useState<BeforeInstallPromptEvent | null>(null);
    const [showBanner, setShowBanner] = useState(false);

    useEffect(() => {
        if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
            navigator.serviceWorker.register('/sw.js')
                .then((reg) => console.log('SW Registered', reg))
                .catch((err) => console.log('SW Registration Failed', err));
        }

        window.addEventListener('beforeinstallprompt', (e) => {
            e.preventDefault();
            setInstallPrompt(e as BeforeInstallPromptEvent);
            // Show the banner after 3 seconds of browsing
            setTimeout(() => setShowBanner(true), 3000);
        });
    }, []);

    const handleInstall = () => {
        if (!installPrompt) return;
        installPrompt.prompt();
        installPrompt.userChoice.then((choice) => {
            if (choice.outcome === 'accepted') {
                console.log('User accepted the install prompt');
            }
            setShowBanner(false);
        });
    };

    if (!showBanner) return null;

    return (
        <div style={{
            position: 'fixed',
            bottom: '20px',
            left: '20px',
            right: '20px',
            background: 'rgba(5, 7, 10, 0.95)',
            backdropFilter: 'blur(20px)',
            border: '1px solid var(--border-glass)',
            padding: '1rem',
            borderRadius: '20px',
            zIndex: 10000,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            boxShadow: '0 20px 50px rgba(0,0,0,0.5)',
            animation: 'slideUp 0.5s cubic-bezier(0.4, 0, 0.2, 1)'
        }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <div style={{ width: '40px', height: '40px', borderRadius: '10px', overflow: 'hidden', background: 'var(--primary)', position: 'relative' }}>
                    <Image 
                        src="/icons/icon-192x192.png" 
                        alt="App Icon" 
                        fill
                        style={{ objectFit: 'cover' }} 
                    />
                </div>
                <div>
                    <h4 style={{ margin: 0, fontSize: '0.9rem', color: 'white' }}>Instalar VamosJuntos</h4>
                    <p style={{ margin: 0, fontSize: '0.75rem', color: 'var(--text-muted)' }}>Acceso rápido desde tu pantalla</p>
                </div>
            </div>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
                <button onClick={() => setShowBanner(false)} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', fontSize: '0.8rem', padding: '0.5rem' }}>Ahora no</button>
                <button onClick={handleInstall} className="btn-premium" style={{ padding: '0.5rem 1rem', fontSize: '0.8rem', borderRadius: '10px' }}>Instalar</button>
            </div>
            <style jsx>{`
                @keyframes slideUp {
                    from { transform: translateY(100px); opacity: 0; }
                    to { transform: translateY(0); opacity: 1; }
                }
            `}</style>
        </div>
    );
}
