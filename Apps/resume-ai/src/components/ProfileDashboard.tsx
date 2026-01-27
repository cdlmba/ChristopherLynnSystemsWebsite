import React from 'react';
import { SavedAnalysis, ResumeVersion } from '../types';

interface ProfileDashboardProps {
    email: string;
    analyses: SavedAnalysis[];
    resumeVersions: ResumeVersion[];
    onViewAnalysis: (analysis: SavedAnalysis) => void;
    onViewVersion: (version: ResumeVersion) => void;
    onReset: () => void;
}

const ProfileDashboard: React.FC<ProfileDashboardProps> = ({
    email,
    analyses,
    resumeVersions,
    onViewAnalysis,
    onViewVersion,
    onReset
}) => {
    return (
        <div className="dashboard" style={{ animation: 'fadeIn 0.5s ease-out' }}>
            <header className="dashboard-header" style={{ textAlign: 'left', marginBottom: '40px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                    <h1 className="hero-title" style={{ fontSize: '2.5rem', marginBottom: '8px' }}>Your Profile</h1>
                    <p className="hero-subtitle" style={{ marginBottom: 0 }}>
                        Active Account: <span style={{ color: 'var(--accent-primary)', fontWeight: '600' }}>{email}</span>
                    </p>
                </div>
                <button onClick={onReset} className="btn-secondary" style={{ color: '#fb7185', borderColor: 'rgba(251, 113, 133, 0.2)', padding: '10px 20px' }}>
                    Sign Out
                </button>
            </header>

            <div className="input-grid" style={{ marginBottom: '40px' }}>
                {/* Stats Card */}
                <div className="input-card glass-panel" style={{ background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.05), rgba(30, 64, 175, 0.05))' }}>
                    <h2 className="card-title">🚀 Growth Metrics</h2>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginTop: '24px' }}>
                        <div style={{ padding: '20px', background: 'rgba(255,255,255,0.03)', borderRadius: '16px', border: '1px solid var(--glass-border)' }}>
                            <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '8px' }}>Total Analyses</div>
                            <div style={{ fontSize: '2.5rem', fontWeight: '800', color: 'var(--accent-primary)' }}>{analyses.length}</div>
                        </div>
                        <div style={{ padding: '20px', background: 'rgba(255,255,255,0.03)', borderRadius: '16px', border: '1px solid var(--glass-border)' }}>
                            <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '8px' }}>Optimized Versions</div>
                            <div style={{ fontSize: '2.5rem', fontWeight: '800', color: 'var(--success)' }}>{resumeVersions.length}</div>
                        </div>
                    </div>
                </div>

                {/* Info Card */}
                <div className="input-card glass-panel" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                    <h2 className="card-title">💡 Pro Tip</h2>
                    <p style={{ color: 'var(--text-secondary)', lineHeight: '1.6' }}>
                        Create different <strong>Resume Versions</strong> for each role you're targeting (e.g. "Senior Engineer" vs "Tech Lead"). This allows for much faster tailoring when new jobs appear.
                    </p>
                </div>
            </div>

            {/* Resume Versions Section */}
            <h2 className="card-title" style={{ marginBottom: '20px', paddingLeft: '8px' }}>📑 Your Resume Versions</h2>
            <div className="glass-panel" style={{ padding: '8px', marginBottom: '40px', background: 'rgba(255,255,255,0.01)' }}>
                {resumeVersions.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '60px', color: 'var(--text-secondary)' }}>
                        <div style={{ fontSize: '3rem', marginBottom: '16px' }}>📝</div>
                        <p>No role-specific versions saved yet.</p>
                        <p style={{ fontSize: '0.9rem', marginTop: '8px' }}>Save your current resume as a new version in the Analyzer to get started.</p>
                    </div>
                ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        {resumeVersions.map((version) => (
                            <div
                                key={version.id}
                                className="history-item"
                                style={{
                                    padding: '16px 24px',
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'center',
                                    borderRadius: '12px',
                                    cursor: 'pointer',
                                    background: 'rgba(255,255,255,0.03)',
                                    border: '1px solid var(--glass-border)'
                                }}
                                onClick={() => onViewVersion(version)}
                            >
                                <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                                    <div style={{
                                        width: '40px',
                                        height: '40px',
                                        borderRadius: '10px',
                                        background: 'rgba(16, 185, 129, 0.1)',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        fontSize: '1.2rem'
                                    }}>
                                        📄
                                    </div>
                                    <div>
                                        <div style={{ fontWeight: '600', color: 'var(--text-primary)' }}>{version.name}</div>
                                        <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '2px' }}>
                                            Last modified: {new Date(version.lastModified).toLocaleDateString()}
                                        </div>
                                    </div>
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                    <span className="btn-secondary" style={{ fontSize: '0.75rem', padding: '6px 12px' }}>Edit Version</span>
                                    <span style={{ color: 'var(--text-secondary)', fontSize: '1.2rem' }}>→</span>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Analysis History Section */}
            <h2 className="card-title" style={{ marginBottom: '20px', paddingLeft: '8px' }}>📜 Optimization History</h2>
            <div className="glass-panel" style={{ padding: '8px' }}>
                {analyses.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '60px', color: 'var(--text-secondary)' }}>
                        <div style={{ fontSize: '3rem', marginBottom: '16px' }}>📂</div>
                        <p>No optimization history found yet.</p>
                        <p style={{ fontSize: '0.9rem', marginTop: '8px' }}>Run your first analysis to see it appear here!</p>
                    </div>
                ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        {analyses.map((item) => (
                            <div
                                key={item.id}
                                className="history-item"
                                style={{
                                    padding: '16px 24px',
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'center',
                                    borderRadius: '12px',
                                    cursor: 'pointer',
                                    transition: 'all 0.2s ease',
                                    background: 'rgba(255,255,255,0.02)'
                                }}
                                onClick={() => onViewAnalysis(item)}
                            >
                                <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                                    <div style={{
                                        width: '40px',
                                        height: '40px',
                                        borderRadius: '10px',
                                        background: item.type === 'Full Analysis' ? 'rgba(59, 130, 246, 0.1)' : 'rgba(139, 92, 246, 0.1)',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        fontSize: '1.2rem'
                                    }}>
                                        {item.type === 'Full Analysis' ? '🔍' : '✨'}
                                    </div>
                                    <div>
                                        <div style={{ fontWeight: '600', color: 'var(--text-primary)' }}>{item.type}</div>
                                        <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '2px' }}>
                                            {new Date(item.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })} at {new Date(item.date).toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' })}
                                        </div>
                                    </div>
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                    <span className="btn-secondary" style={{ fontSize: '0.75rem', padding: '6px 12px' }}>Reload Session</span>
                                    <span style={{ color: 'var(--text-secondary)', fontSize: '1.2rem' }}>→</span>
                                </div>
                            </div>
                        )).reverse()}
                    </div>
                )}
            </div>
        </div>
    );
};

export default ProfileDashboard;
