import React from 'react';

interface LandingPageProps {
    email: string;
    setEmail: (email: string) => void;
    isVerifying: boolean;
    onUnlock: (e: React.FormEvent) => void;
    error: string | null;
}

const LandingPage: React.FC<LandingPageProps> = ({ email, setEmail, isVerifying, onUnlock, error }) => {
    return (
        <div className="landing-hero" style={{ padding: '20px' }}>
            <div className="hero-content glass-panel" style={{ maxWidth: '900px', display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '40px', textAlign: 'left', padding: '60px' }}>
                <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '20px' }}>
                        <img src="/logo.png" alt="Logo" style={{ width: '48px', height: '48px', borderRadius: '12px', boxShadow: '0 8px 16px rgba(59, 130, 246, 0.2)' }} />
                        <div style={{ display: 'inline-block', padding: '6px 14px', background: 'rgba(59, 130, 246, 0.1)', borderRadius: '20px', color: 'var(--accent-primary)', fontSize: '0.8rem', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '1px' }}>
                            CAREER CATALYST PRO
                        </div>
                    </div>
                    <h1 className="hero-title" style={{ fontSize: '3.5rem', marginBottom: '24px' }}>
                        Land Your Next <br />High-Impact Role
                    </h1>
                    <p className="hero-subtitle" style={{ fontSize: '1.2rem', marginBottom: '40px', maxWidth: '100%' }}>
                        Stop applying blindly. Position yourself as the ideal candidate with AI-driven strategy tailored for senior and executive leadership.
                    </p>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', marginBottom: '40px' }}>
                        <div style={{ display: 'flex', gap: '16px' }}>
                            <div style={{ fontSize: '1.5rem' }}>🚀</div>
                            <div>
                                <div style={{ fontWeight: '700', color: 'var(--text-primary)' }}>Strategic Positioning</div>
                                <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Automatically reframes your bullets to "pitch high" for the next level.</div>
                            </div>
                        </div>
                        <div style={{ display: 'flex', gap: '16px' }}>
                            <div style={{ fontSize: '1.5rem' }}>📊</div>
                            <div>
                                <div style={{ fontWeight: '700', color: 'var(--text-primary)' }}>ATS Mastery</div>
                                <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Identify and bridge critical keyword gaps before you hit apply.</div>
                            </div>
                        </div>
                        <div style={{ display: 'flex', gap: '16px' }}>
                            <div style={{ fontSize: '1.5rem' }}>🎙️</div>
                            <div>
                                <div style={{ fontWeight: '700', color: 'var(--text-primary)' }}>Interview Ready</div>
                                <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Get a custom-generated coaching guide based on your specific gaps.</div>
                            </div>
                        </div>
                    </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', background: 'rgba(255,255,255,0.02)', padding: '40px', borderRadius: '24px', border: '1px solid var(--glass-border)' }}>
                    <h2 style={{ fontSize: '1.5rem', fontWeight: '700', marginBottom: '16px' }}>Start Free</h2>
                    <p style={{ color: 'var(--text-secondary)', marginBottom: '32px', fontSize: '0.95rem' }}>
                        Enter your email for instant, private access to the full suite of career tools.
                    </p>
                    <form onSubmit={onUnlock} className="email-box" style={{ maxWidth: '100%' }}>
                        <input
                            type="email"
                            placeholder="name@company.com"
                            className="input-field"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            style={{ background: 'rgba(0,0,0,0.3)', padding: '16px' }}
                            required
                        />
                        <button type="submit" className="btn-primary" style={{ padding: '16px' }} disabled={isVerifying}>
                            {isVerifying ? 'Verifying...' : 'Unlock Expert Tools'}
                        </button>
                    </form>
                    <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '20px', textAlign: 'center' }}>
                        🔒 Secure & Confidential. Your resumes are stored locally.
                    </p>
                    {error && (
                        <div style={{ color: '#ef4444', marginTop: '16px', fontSize: '0.85rem', textAlign: 'center', padding: '10px', background: 'rgba(239, 68, 68, 0.1)', borderRadius: '8px' }}>
                            {error}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default LandingPage;
