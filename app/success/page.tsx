"use client";
import Link from 'next/link';

export default function SuccessPage() {
    return (
        <div className="container" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '60vh', textAlign: 'center' }}>
            <div style={{ background: 'var(--bg-card)', padding: '4rem', borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-lg)', border: '1px solid var(--border-color)', maxWidth: '600px' }}>
                <div style={{ fontSize: '4rem', color: 'var(--secondary-color)', marginBottom: '1.5rem' }}>✓</div>
                <h1 className="heading-1" style={{ fontSize: '2rem', marginBottom: '1rem' }}>Payment Successful!</h1>
                <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem', marginBottom: '2rem' }}>
                    Your dynamic travel package has been secured and confirmed. We've sent a confirmation email with all the details.
                </p>

                <Link href="/">
                    <button className="btn-primary">Return to Home</button>
                </Link>
            </div>
        </div>
    );
}
