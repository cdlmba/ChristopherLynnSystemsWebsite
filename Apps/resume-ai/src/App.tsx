import React, { useState } from 'react';
import { analyzeResume, AnalysisType, AIProvider } from './services/aiService';
import './index.css';

function App() {
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [email, setEmail] = useState('');
  const [resumeText, setResumeText] = useState('');
  const [jobText, setJobText] = useState('');
  const [jobUrl, setJobUrl] = useState('');
  const [activeResumeTab, setActiveResumeTab] = useState<'paste' | 'upload'>('paste');
  const [activeJobTab, setActiveJobTab] = useState<'paste' | 'link'>('paste');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [provider, setProvider] = useState<AIProvider>('gemini'); // Set default to Gemini

  const handleUnlock = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) setIsUnlocked(true);
  };

  const handleAnalysis = async (type: AnalysisType) => {
    if (!resumeText || !jobText) {
      setError("Please provide both a resume and a job description.");
      return;
    }
    setError(null);
    setIsAnalyzing(true);
    setAnalysisResult(null);

    try {
      const result = await analyzeResume(resumeText, jobText, type, provider);
      setAnalysisResult(result);
    } catch (err: any) {
      setError(err.message || "An error occurred during analysis.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  if (!isUnlocked) {
    return (
      <div className="app-container">
        <div className="landing-hero">
          <div className="hero-content glass-panel">
            <h1 className="hero-title">Resume AI</h1>
            <p className="hero-subtitle">Optimize your resume against any job description with the power of Google Gemini.</p>
            <form onSubmit={handleUnlock} className="email-box">
              <input
                type="email"
                placeholder="Enter your email to start"
                className="input-field"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <button type="submit" className="btn-primary">
                Unlock Free Analysis
              </button>
            </form>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="app-container">
      <div className="dashboard">
        <header className="dashboard-header">
          <h1 className="hero-title">Resume Dashboard</h1>
          <p className="hero-subtitle">Analyze, improve, and tailor your professional profile.</p>

          {/* OpenAI Toggle - Commented out for now
          <div className="provider-toggle glass-panel" style={{ display: 'inline-flex', padding: '4px', gap: '4px', marginTop: '20px' }}>
            <button
              className={`tab ${provider === 'openai' ? 'active' : ''}`}
              onClick={() => setProvider('openai')}
              style={{ fontSize: '0.9rem' }}
            >
              OpenAI (GPT-4)
            </button>
            <button
              className={`tab ${provider === 'gemini' ? 'active' : ''}`}
              onClick={() => setProvider('gemini')}
              style={{ fontSize: '0.9rem' }}
            >
              Google Gemini
            </button>
          </div>
          */}
        </header>

        <div className="input-grid">
          {/* Resume Section */}
          <div className="input-card glass-panel">
            <h2 className="card-title">1. Your Resume</h2>
            <div className="tabs">
              <button
                className={`tab ${activeResumeTab === 'paste' ? 'active' : ''}`}
                onClick={() => setActiveResumeTab('paste')}
              >
                Paste Text
              </button>
              <button
                className={`tab ${activeResumeTab === 'upload' ? 'active' : ''}`}
                onClick={() => setActiveResumeTab('upload')}
              >
                Upload PDF
              </button>
            </div>
            {activeResumeTab === 'paste' ? (
              <textarea
                className="input-field"
                rows={12}
                placeholder="Paste your resume content here..."
                value={resumeText}
                onChange={(e) => setResumeText(e.target.value)}
              />
            ) : (
              <div style={{ padding: '40px', textAlign: 'center', border: '2px dashed var(--glass-border)', borderRadius: '8px' }}>
                <p style={{ color: 'var(--text-secondary)' }}>PDF Upload Coming Soon</p>
              </div>
            )}
          </div>

          {/* Job Section */}
          <div className="input-card glass-panel">
            <h2 className="card-title">2. Job Description</h2>
            <div className="tabs">
              <button
                className={`tab ${activeJobTab === 'paste' ? 'active' : ''}`}
                onClick={() => setActiveJobTab('paste')}
              >
                Paste Text
              </button>
              <button
                className={`tab ${activeJobTab === 'link' ? 'active' : ''}`}
                onClick={() => setActiveJobTab('link')}
              >
                Use Link
              </button>
            </div>
            {activeJobTab === 'paste' ? (
              <textarea
                className="input-field"
                rows={12}
                placeholder="Paste the target job description here..."
                value={jobText}
                onChange={(e) => setJobText(e.target.value)}
              />
            ) : (
              <div className="email-box">
                <input
                  className="input-field"
                  placeholder="Paste LinkedIn or Job URL..."
                  value={jobUrl}
                  onChange={(e) => setJobUrl(e.target.value)}
                />
                <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                  Note: Scraping might be limited by some websites.
                </p>
              </div>
            )}
          </div>
        </div>

        <div className="action-bar">
          <button className="btn-primary" onClick={() => handleAnalysis('Full Analysis')} disabled={isAnalyzing}>
            {isAnalyzing ? 'Analyzing...' : 'Full Analysis'}
          </button>
          <button className="btn-primary" onClick={() => handleAnalysis('Analyze Skills')} disabled={isAnalyzing}>
            {isAnalyzing ? 'Analyzing...' : 'Analyze Skills'}
          </button>
          <button className="btn-primary" onClick={() => handleAnalysis('ATS Score')} disabled={isAnalyzing}>
            {isAnalyzing ? 'Analyzing...' : 'ATS Friendliness'}
          </button>
          <button className="btn-primary" onClick={() => handleAnalysis('Cover Letter')} disabled={isAnalyzing}>
            {isAnalyzing ? 'Analyzing...' : 'Cover Letter'}
          </button>
        </div>

        {error && (
          <div style={{ color: '#ef4444', marginBottom: '20px', textAlign: 'center', padding: '12px', background: 'rgba(239, 68, 68, 0.1)', borderRadius: '8px', border: '1px solid rgba(239, 68, 68, 0.2)' }}>
            {error}
          </div>
        )}

        {analysisResult && (
          <div className="results-area glass-panel shadow-lg">
            <h3 className="card-title">Analysis Results</h3>
            <div style={{ whiteSpace: 'pre-wrap', lineHeight: '1.6', fontSize: '1rem', color: 'var(--text-primary)' }}>
              {analysisResult}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
