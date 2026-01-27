import React from 'react';

interface StrengthMeterProps {
    content: string;
}

const StrengthMeter: React.FC<StrengthMeterProps> = ({ content }) => {
    const calculateScore = (text: string) => {
        if (!text) return 0;
        let score = 0;

        // Length factor
        if (text.length > 500) score += 20;
        if (text.length > 1500) score += 20;

        // Keywords / Structure factors
        const keywords = ['experience', 'education', 'skills', 'achievements', 'managed', 'developed', 'led', 'strategic'];
        keywords.forEach(word => {
            if (text.toLowerCase().includes(word)) score += 5;
        });

        // Bullet points factor
        const bulletCount = (text.match(/[•\-\*]/g) || []).length;
        score += Math.min(bulletCount * 2, 20);

        return Math.min(score, 100);
    };

    const score = calculateScore(content);

    const getStatus = (s: number) => {
        if (s < 40) return { label: 'Weak', color: '#ef4444' };
        if (s < 70) return { label: 'Average', color: '#f59e0b' };
        return { label: 'Strong', color: '#10b981' };
    };

    const status = getStatus(score);

    return (
        <div style={{ marginTop: '16px', background: 'rgba(255,255,255,0.02)', padding: '12px', borderRadius: '10px', border: '1px solid var(--glass-border)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', fontWeight: '600', textTransform: 'uppercase' }}>Resume Strength</span>
                <span style={{ fontSize: '0.85rem', fontWeight: 'bold', color: status.color }}>{status.label} ({score}%)</span>
            </div>
            <div style={{ width: '100%', height: '6px', background: 'rgba(255,255,255,0.1)', borderRadius: '3px', overflow: 'hidden' }}>
                <div
                    style={{
                        width: `${score}%`,
                        height: '100%',
                        background: status.color,
                        transition: 'width 1s ease-in-out',
                        boxShadow: `0 0 10px ${status.color}40`
                    }}
                />
            </div>
        </div>
    );
};

export default StrengthMeter;
