import React from 'react';
import { JobApplication, ApplicationStatus } from '../types';

interface JobTrackerProps {
    applications: JobApplication[];
    onUpdateStatus: (id: string, status: ApplicationStatus) => void;
    onDelete: (id: string) => void;
}

const JobTracker: React.FC<JobTrackerProps> = ({ applications, onUpdateStatus, onDelete }) => {
    const statuses: ApplicationStatus[] = ['Applied', 'Interviewing', 'Offer', 'Rejected', 'Ghosted'];

    const getStatusColor = (status: ApplicationStatus) => {
        switch (status) {
            case 'Applied': return '#3b82f6';
            case 'Interviewing': return '#8b5cf6';
            case 'Offer': return '#10b981';
            case 'Rejected': return '#ef4444';
            case 'Ghosted': return '#64748b';
            default: return 'var(--text-secondary)';
        }
    };

    return (
        <div className="dashboard" style={{ animation: 'fadeIn 0.5s ease-out' }}>
            <header className="dashboard-header" style={{ textAlign: 'left', marginBottom: '40px' }}>
                <h1 className="hero-title" style={{ fontSize: '2.5rem', marginBottom: '8px' }}>Application Tracker</h1>
                <p className="hero-subtitle">Manage your pipeline and keep track of your progress.</p>
            </header>

            <div className="glass-panel" style={{ padding: '24px', minHeight: '400px' }}>
                {applications.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '80px', color: 'var(--text-secondary)' }}>
                        <div style={{ fontSize: '4rem', marginBottom: '20px' }}>🎯</div>
                        <h3>Your pipeline is empty</h3>
                        <p style={{ marginTop: '10px' }}>Analyze a job description and click "Save to Tracker" to begin.</p>
                    </div>
                ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                        {/* Header Row */}
                        <div style={{
                            display: 'grid',
                            gridTemplateColumns: '2fr 1.5fr 1fr 1.5fr 0.5fr',
                            padding: '0 16px 12px 16px',
                            borderBottom: '1px solid var(--glass-border)',
                            color: 'var(--text-secondary)',
                            fontSize: '0.8rem',
                            textTransform: 'uppercase',
                            letterSpacing: '1px'
                        }}>
                            <div>Job Title / Company</div>
                            <div>Applied Date</div>
                            <div>Status</div>
                            <div>Actions</div>
                            <div></div>
                        </div>

                        {/* Application Rows */}
                        {applications.map((app) => (
                            <div
                                key={app.id}
                                className="glass-panel"
                                style={{
                                    display: 'grid',
                                    gridTemplateColumns: '2fr 1.5fr 1fr 1.5fr 0.5fr',
                                    padding: '16px',
                                    alignItems: 'center',
                                    background: 'rgba(255,255,255,0.02)',
                                    transition: 'transform 0.2s ease'
                                }}
                            >
                                <div>
                                    <div style={{ fontWeight: '600', color: 'var(--text-primary)' }}>{app.jobTitle}</div>
                                    <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>{app.company}</div>
                                </div>
                                <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                                    {new Date(app.date).toLocaleDateString()}
                                </div>
                                <div>
                                    <span style={{
                                        padding: '4px 10px',
                                        borderRadius: '20px',
                                        fontSize: '0.75rem',
                                        background: `${getStatusColor(app.status)}20`,
                                        color: getStatusColor(app.status),
                                        border: `1px solid ${getStatusColor(app.status)}40`,
                                        fontWeight: '600'
                                    }}>
                                        {app.status}
                                    </span>
                                </div>
                                <div style={{ display: 'flex', gap: '8px' }}>
                                    <select
                                        className="btn-secondary"
                                        style={{ fontSize: '0.75rem', padding: '4px 8px' }}
                                        value={app.status}
                                        onChange={(e) => onUpdateStatus(app.id, e.target.value as ApplicationStatus)}
                                    >
                                        {statuses.map(s => <option key={s} value={s}>{s}</option>)}
                                    </select>
                                </div>
                                <div style={{ textAlign: 'right' }}>
                                    <button
                                        onClick={() => onDelete(app.id)}
                                        style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', fontSize: '1.2rem', opacity: 0.6 }}
                                        title="Remove"
                                    >
                                        ×
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            <div style={{ marginTop: '32px', padding: '24px', background: 'rgba(59, 130, 246, 0.05)', borderRadius: '16px', border: '1px solid rgba(59, 130, 246, 0.1)' }}>
                <h4 style={{ color: 'var(--accent-primary)', marginBottom: '8px' }}>💡 Pro Tracker Tip</h4>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: '1.5' }}>
                    Statistically, following up 5 days after an application increases interview chances by 20%. Mark your status as "Ghosted" after 14 days of no response to focus your energy on fresher leads.
                </p>
            </div>
        </div>
    );
};

export default JobTracker;
