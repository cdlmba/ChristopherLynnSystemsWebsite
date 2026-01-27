import React, { useState, useEffect } from 'react';

const ChangelogModal: React.FC = () => {
    const [isOpen, setIsOpen] = useState(false);
    const LATEST_VERSION = '1.2.0'; // Increment this to trigger the modal again

    useEffect(() => {
        const lastSeenVersion = localStorage.getItem('resume_ai_last_version');
        if (lastSeenVersion !== LATEST_VERSION) {
            setIsOpen(true);
        }
    }, []);

    const closePortal = () => {
        localStorage.setItem('resume_ai_last_version', LATEST_VERSION);
        setIsOpen(false);
    };

    if (!isOpen) return null;

    return (
        <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.85)',
            backdropFilter: 'blur(8px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 2000,
            padding: '20px',
            animation: 'fadeIn 0.3s ease-out'
        }}>
            <div className="glass-panel" style={{
                maxWidth: '500px',
                width: '100%',
                padding: '40px',
                position: 'relative',
                background: 'linear-gradient(135deg, var(--card-bg), rgba(59, 130, 246, 0.05))',
                textAlign: 'left'
            }}>
                <div style={{
                    display: 'inline-block',
                    padding: '4px 10px',
                    background: 'var(--accent-primary)',
                    borderRadius: '6px',
                    fontSize: '0.7rem',
                    fontWeight: '800',
                    color: 'white',
                    marginBottom: '16px'
                }}>
                    WHATS NEW
                </div>

                <h2 className="card-title" style={{ fontSize: '2rem', marginBottom: '8px' }}>Welcome to v{LATEST_VERSION}</h2>
                <p style={{ color: 'var(--text-secondary)', marginBottom: '32px', fontSize: '0.9rem' }}>
                    We've majorly upgraded Career Catalyst Pro. Here is what's new:
                </p>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', marginBottom: '40px' }}>
                    <div style={{ display: 'flex', gap: '16px' }}>
                        <div style={{ fontSize: '1.5rem' }}>📄</div>
                        <div>
                            <div style={{ fontWeight: '700', color: 'var(--text-primary)' }}>Full PDF Support</div>
                            <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>You can now upload PDF files for both your resume and the job description.</div>
                        </div>
                    </div>
                    <div style={{ display: 'flex', gap: '16px' }}>
                        <div style={{ fontSize: '1.5rem' }}>🎙️</div>
                        <div>
                            <div style={{ fontWeight: '700', color: 'var(--text-primary)' }}>Interview Readiness</div>
                            <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Generate custom coaching guides based on your unique gaps for a specific role.</div>
                        </div>
                    </div>
                    <div style={{ display: 'flex', gap: '16px' }}>
                        <div style={{ fontSize: '1.5rem' }}>📊</div>
                        <div>
                            <div style={{ fontWeight: '700', color: 'var(--text-primary)' }}>Resume Strength Meter</div>
                            <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Real-time feedback on your resume content quality as you edit.</div>
                        </div>
                    </div>
                </div>

                <button
                    onClick={closePortal}
                    className="btn-primary"
                    style={{ width: '100%', padding: '16px' }}
                >
                    Get Started
                </button>
            </div>
        </div>
    );
};

export default ChangelogModal;
