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
  const [isAnalyzing, setIsAnalyzing] = useState<AnalysisType | null>(null);
  const [analysisResult, setAnalysisResult] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [provider, setProvider] = useState<AIProvider>('gemini'); // Set default to Gemini
  const [copied, setCopied] = useState(false);

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
    setIsAnalyzing(type);
    setAnalysisResult(null);

    try {
      const result = await analyzeResume(resumeText, jobText, type, provider);
      setAnalysisResult(result);
    } catch (err: any) {
      setError(err.message || "An error occurred during analysis.");
    } finally {
      setIsAnalyzing(null);
    }
  };

  const handleCopy = async () => {
    if (!analysisResult) return;
    try {
      await navigator.clipboard.writeText(analysisResult);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  if (!isUnlocked) {
    return (
      <div className="app-container">
        <div className="landing-hero">
          <div className="hero-content glass-panel">
            <h1 className="hero-title">Resume Analyzer</h1>
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
          <h1 className="hero-title">Resume Analyzer</h1>
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
          <button
            className="btn-primary"
            onClick={() => handleAnalysis('Full Analysis')}
            disabled={!!isAnalyzing}
            style={{ background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)' }}
          >
            {isAnalyzing === 'Full Analysis' ? 'Analyzing...' : '🔍 Full Analysis'}
          </button>
          <button
            className="btn-primary"
            onClick={() => handleAnalysis('Analyze Skills')}
            disabled={!!isAnalyzing}
            style={{ background: 'linear-gradient(135deg, #8b5cf6, #6d28d9)' }}
          >
            {isAnalyzing === 'Analyze Skills' ? 'Analyzing...' : '🎯 Analyze Skills'}
          </button>
          <button
            className="btn-primary"
            onClick={() => handleAnalysis('ATS Score')}
            disabled={!!isAnalyzing}
            style={{ background: 'linear-gradient(135deg, #10b981, #059669)' }}
          >
            {isAnalyzing === 'ATS Score' ? 'Analyzing...' : '📊 ATS Friendliness'}
          </button>
          <button
            className="btn-primary"
            onClick={() => handleAnalysis('Cover Letter')}
            disabled={!!isAnalyzing}
            style={{ background: 'linear-gradient(135deg, #f59e0b, #d97706)' }}
          >
            {isAnalyzing === 'Cover Letter' ? 'Analyzing...' : '✉️ Cover Letter'}
          </button>
        </div>

        {error && (
          <div style={{ color: '#ef4444', marginBottom: '20px', textAlign: 'center', padding: '12px', background: 'rgba(239, 68, 68, 0.1)', borderRadius: '8px', border: '1px solid rgba(239, 68, 68, 0.2)' }}>
            {error}
          </div>
        )}

        {analysisResult && (
          <div className="results-area glass-panel shadow-lg">
            <div className="results-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h3 className="card-title" style={{ margin: 0 }}>Analysis Results</h3>
              <button
                onClick={handleCopy}
                className="btn-secondary"
                style={{
                  padding: '6px 12px',
                  fontSize: '0.875rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px'
                }}
              >
                {copied ? (
                  <>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                    Copied!
                  </>
                ) : (
                  <>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>
                    Copy to Clipboard
                  </>
                )}
              </button>
            </div>
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
