import React, { useState } from 'react';
import { analyzeResume } from './services/aiService';
import { extractTextFromPDF } from './services/pdfService';
import { verifySubscription, verifyMembershipId } from './services/whopService';
import { AnalysisType, AIProvider, SavedAnalysis, ResumeVersion, JobApplication, ApplicationStatus } from './types';
import ProfileDashboard from './components/ProfileDashboard';
import JobTracker from './components/JobTracker';
import StrengthMeter from './components/StrengthMeter';
import ChangelogModal from './components/ChangelogModal';
import LandingPage from './components/LandingPage';
import './index.css';

function App() {
  // View state
  const [activeView, setActiveView] = useState<'analyzer' | 'profile' | 'tracker' | 'landing'>('analyzer');

  // Initialize state from local storage or defaults
  const [isUnlocked, setIsUnlocked] = useState(false);
  console.log("App initialization: isUnlocked =", false);
  const [email, setEmail] = useState(() => localStorage.getItem('resume_ai_email') || '');
  const [resumeText, setResumeText] = useState(() => localStorage.getItem('resume_ai_resume') || '');
  const [resumeVersions, setResumeVersions] = useState<ResumeVersion[]>(() => {
    const saved = localStorage.getItem('resume_ai_versions');
    return saved ? JSON.parse(saved) : [];
  });
  const [activeVersionId, setActiveVersionId] = useState<string | null>(localStorage.getItem('resume_ai_active_version'));

  const [jobText, setJobText] = useState(() => localStorage.getItem('resume_ai_job') || '');
  const [history, setHistory] = useState<SavedAnalysis[]>(() => {
    const saved = localStorage.getItem('resume_ai_history');
    return saved ? JSON.parse(saved) : [];
  });
  const [applications, setApplications] = useState<JobApplication[]>(() => {
    const saved = localStorage.getItem('resume_ai_history_apps');
    return saved ? JSON.parse(saved) : [];
  });

  const [jobUrl, setJobUrl] = useState('');
  const [activeResumeTab, setActiveResumeTab] = useState<'paste' | 'upload'>('paste');
  const [activeJobTab, setActiveJobTab] = useState<'paste' | 'link' | 'upload'>('paste');
  const [isAnalyzing, setIsAnalyzing] = useState<AnalysisType | null>(null);
  const [analysisResult, setAnalysisResult] = useState<string | null>(() => localStorage.getItem('resume_ai_last_analysis'));
  const [error, setError] = useState<string | null>(null);
  const [provider, setProvider] = useState<AIProvider>('gemini');
  const [copied, setCopied] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    return (localStorage.getItem('resume_ai_theme') as 'light' | 'dark') || 'dark';
  });
  const [isVerifying, setIsVerifying] = useState(false);

  // Theme effect
  React.useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('resume_ai_theme', theme);
  }, [theme]);

  // Persistence Effects
  React.useEffect(() => {
    localStorage.setItem('resume_ai_unlocked', String(isUnlocked));
    localStorage.setItem('resume_ai_email', email);
  }, [isUnlocked, email]);

  React.useEffect(() => {
    localStorage.setItem('resume_ai_resume', resumeText);
  }, [resumeText]);

  React.useEffect(() => {
    localStorage.setItem('resume_ai_job', jobText);
  }, [jobText]);

  React.useEffect(() => {
    if (analysisResult) {
      localStorage.setItem('resume_ai_last_analysis', analysisResult);
    }
  }, [analysisResult]);

  React.useEffect(() => {
    localStorage.setItem('resume_ai_history', JSON.stringify(history));
  }, [history]);

  React.useEffect(() => {
    localStorage.setItem('resume_ai_history_apps', JSON.stringify(applications));
  }, [applications]);

  React.useEffect(() => {
    localStorage.setItem('resume_ai_versions', JSON.stringify(resumeVersions));
  }, [resumeVersions]);

  React.useEffect(() => {
    if (activeVersionId) {
      localStorage.setItem('resume_ai_active_version', activeVersionId);
    } else {
      localStorage.removeItem('resume_ai_active_version');
    }
  }, [activeVersionId]);

  // Whop Auto-check & URL Params
  React.useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const membershipId = params.get('membership_id');
    const urlEmail = params.get('email');

    if (urlEmail && urlEmail !== email) {
      setEmail(urlEmail);
    }

    if (membershipId) {
      const checkMembership = async () => {
        setIsVerifying(true);
        try {
          const isValid = await verifyMembershipId(membershipId);
          if (isValid) {
            setIsUnlocked(true);
            window.history.replaceState({}, document.title, window.location.pathname);
          }
        } catch (err) {
          console.error("Auto-verification failed", err);
        } finally {
          setIsVerifying(false);
        }
      };
      checkMembership();
    }
  }, [email]);

  const handleUnlock = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setIsVerifying(true);
    setError(null);

    try {
      const isSubscribed = await verifySubscription(email);
      if (isSubscribed) {
        setIsUnlocked(true);
      } else {
        setError("No active subscription found for this email. Please ensure you've joined on Whop.");
      }
    } catch (err: any) {
      setError("Unable to verify subscription at this time. Please try again.");
    } finally {
      setIsVerifying(false);
    }
  };

  const handleReset = () => {
    if (window.confirm("Are you sure you want to sign out? This will clear your local history.")) {
      localStorage.clear();
      window.location.reload();
    }
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

      // Save to history
      const newAnalysis: SavedAnalysis = {
        id: Date.now().toString(),
        type: type,
        date: new Date().toISOString(),
        result: result,
        resumeText: resumeText,
        jobText: jobText
      };
      setHistory(prev => [...prev, newAnalysis]);

    } catch (err: any) {
      setError(err.message || "An error occurred during analysis.");
    } finally {
      setIsAnalyzing(null);
    }
  };

  const viewHistoricalAnalysis = (analysis: SavedAnalysis) => {
    setAnalysisResult(analysis.result);
    setResumeText(analysis.resumeText || '');
    setJobText(analysis.jobText || '');
    setActiveView('analyzer');
    window.scrollTo({ top: 0, behavior: 'smooth' });
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

  const saveCurrentAsNewVersion = () => {
    const roleName = window.prompt("Enter a name for this resume version (e.g., 'Senior Product Manager' or 'Backend Engineer'):");
    if (!roleName) return;

    const newVersion: ResumeVersion = {
      id: Date.now().toString(),
      name: roleName,
      content: resumeText,
      lastModified: new Date().toISOString()
    };

    setResumeVersions(prev => [...prev, newVersion]);
    setActiveVersionId(newVersion.id);
  };

  const updateCurrentVersion = () => {
    if (!activeVersionId) return;
    setResumeVersions(prev => prev.map(v =>
      v.id === activeVersionId
        ? { ...v, content: resumeText, lastModified: new Date().toISOString() }
        : v
    ));
    alert("Version updated successfully!");
  };

  const selectVersion = (id: string) => {
    const version = resumeVersions.find(v => v.id === id);
    if (version) {
      setResumeText(version.content);
      setActiveVersionId(id);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, target: 'resume' | 'job') => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.type !== 'application/pdf') {
      setError("Please upload a PDF file.");
      return;
    }

    setIsUploading(true);
    setError(null);

    try {
      const text = await extractTextFromPDF(file);
      if (target === 'resume') {
        setResumeText(text);
        setActiveResumeTab('paste');
      } else {
        setJobText(text);
        setActiveJobTab('paste');
      }
    } catch (err: any) {
      console.error("PDF extraction error:", err);
      setError("Could not read PDF. It might be an image-based PDF or encrypted.");
    } finally {
      setIsUploading(false);
    }
  };

  const saveToTracker = () => {
    const jobTitle = window.prompt("Job Title:", "Software Engineer");
    const company = window.prompt("Company:");

    if (!jobTitle || !company) return;

    const newApp: JobApplication = {
      id: Date.now().toString(),
      jobTitle,
      company,
      date: new Date().toISOString(),
      status: 'Applied'
    };

    setApplications(prev => [...prev, newApp]);
    setActiveView('tracker');
  };

  const updateAppStatus = (id: string, status: ApplicationStatus) => {
    setApplications(prev => prev.map(app => app.id === id ? { ...app, status } : app));
  };

  const deleteApp = (id: string) => {
    if (window.confirm("Are you sure you want to remove this application from your tracker?")) {
      setApplications(prev => prev.filter(app => app.id !== id));
    }
  };

  return (
    <div className="app-container">
      <ChangelogModal />

      {!isUnlocked ? (
        <>
          <nav style={{
            padding: '12px 24px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            background: 'var(--nav-bg)',
            backdropFilter: 'blur(12px)',
            WebkitBackdropFilter: 'blur(12px)',
            position: 'sticky',
            top: 0,
            zIndex: 100,
            borderBottom: '1px solid var(--glass-border)',
            boxShadow: '0 4px 20px rgba(0,0,0,0.1)'
          }}>
            <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
              <img src="/logo.png" alt="Career Catalyst Pro Logo" style={{ width: '32px', height: '32px', borderRadius: '8px' }} />
              <span style={{ fontWeight: '700', fontSize: '1.2rem', background: 'linear-gradient(to right, var(--text-primary), var(--text-secondary))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Career Catalyst Pro</span>
            </div>
            <button
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              className="btn-secondary"
              style={{ width: '40px', height: '40px', padding: 0, borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem' }}
            >
              {theme === 'dark' ? '☀️' : '🌙'}
            </button>
          </nav>
          <LandingPage
            email={email}
            setEmail={setEmail}
            isVerifying={isVerifying}
            onUnlock={handleUnlock}
            error={error}
          />
        </>
      ) : (
        <>
          <nav style={{
            padding: '12px 24px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            background: 'var(--nav-bg)',
            backdropFilter: 'blur(12px)',
            WebkitBackdropFilter: 'blur(12px)',
            position: 'sticky',
            top: 0,
            zIndex: 100,
            borderBottom: '1px solid var(--glass-border)',
            boxShadow: '0 4px 20px rgba(0,0,0,0.1)'
          }}>
            <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
              <img src="/logo.png" alt="Career Catalyst Pro Logo" style={{ width: '32px', height: '32px', borderRadius: '8px' }} />
              <span style={{ fontWeight: '700', fontSize: '1.2rem', background: 'linear-gradient(to right, var(--text-primary), var(--text-secondary))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Career Catalyst Pro</span>
            </div>

            <div style={{ display: 'flex', gap: '8px', background: 'rgba(255,255,255,0.05)', padding: '4px', borderRadius: '12px', border: '1px solid var(--glass-border)' }}>
              <button
                className={`tab ${activeView === 'analyzer' ? 'active' : ''}`}
                onClick={() => setActiveView('analyzer')}
                style={{ fontSize: '0.9rem', padding: '8px 16px' }}
              >
                🔍 Analyzer
              </button>
              <button
                className={`tab ${activeView === 'profile' ? 'active' : ''}`}
                onClick={() => setActiveView('profile')}
                style={{ fontSize: '0.9rem', padding: '8px 16px' }}
              >
                👤 Profile
              </button>
              <button
                className={`tab ${activeView === 'tracker' ? 'active' : ''}`}
                onClick={() => setActiveView('tracker')}
                style={{ fontSize: '0.9rem', padding: '8px 16px' }}
              >
                🎯 Tracker
              </button>
            </div>

            <button
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              className="btn-secondary"
              style={{ width: '40px', height: '40px', padding: 0, borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem' }}
              title="Toggle Theme"
            >
              {theme === 'dark' ? '☀️' : '🌙'}
            </button>
          </nav>

          {activeView === 'profile' ? (
            <ProfileDashboard
              email={email}
              analyses={history}
              resumeVersions={resumeVersions}
              onViewAnalysis={viewHistoricalAnalysis}
              onViewVersion={(v) => {
                selectVersion(v.id);
                setActiveView('analyzer');
              }}
              onReset={handleReset}
            />
          ) : activeView === 'tracker' ? (
            <JobTracker
              applications={applications}
              onUpdateStatus={updateAppStatus}
              onDelete={deleteApp}
            />
          ) : (
            <div className="dashboard">
              <header className="dashboard-header">
                <h1 className="hero-title">Career Catalyst Pro</h1>
                <p className="hero-subtitle">Optimize your career path and manage your search pipeline.</p>
              </header>

              <div className="input-grid">
                {/* Resume Section */}
                <div className="input-card glass-panel">
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                    <h2 className="card-title" style={{ margin: 0 }}>1. Your Resume</h2>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      {activeVersionId ? (
                        <button onClick={updateCurrentVersion} className="btn-secondary" style={{ fontSize: '0.7rem', padding: '4px 8px' }}>💾 Update v</button>
                      ) : null}
                      <button onClick={saveCurrentAsNewVersion} className="btn-secondary" style={{ fontSize: '0.7rem', padding: '4px 8px' }}>✨ Save New v</button>
                    </div>
                  </div>

                  {resumeVersions.length > 0 && (
                    <div style={{ marginBottom: '12px' }}>
                      <select
                        className="input-field"
                        style={{ fontSize: '0.8rem', padding: '8px' }}
                        value={activeVersionId || ''}
                        onChange={(e) => selectVersion(e.target.value)}
                      >
                        <option value="" disabled>Select a saved version...</option>
                        {resumeVersions.map(v => (
                          <option key={v.id} value={v.id}>{v.name}</option>
                        ))}
                      </select>
                    </div>
                  )}

                  <StrengthMeter content={resumeText} />

                  <div className="tabs" style={{ marginTop: '16px' }}>
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
                    <div
                      style={{
                        padding: '60px 20px',
                        textAlign: 'center',
                        border: '2px dashed var(--glass-border)',
                        borderRadius: '16px',
                        background: 'rgba(255,255,255,0.02)',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        gap: '16px'
                      }}
                    >
                      <div style={{ fontSize: '3rem' }}>📄</div>
                      {isUploading ? (
                        <p style={{ color: 'var(--accent-primary)', fontWeight: '600' }}>Extracting text...</p>
                      ) : (
                        <>
                          <p style={{ color: 'var(--text-secondary)' }}>Upload your PDF resume to extract content</p>
                          <label
                            className="btn-primary"
                            style={{ cursor: 'pointer', display: 'inline-flex', background: 'var(--accent-primary)' }}
                          >
                            📂 Select PDF
                            <input
                              type="file"
                              accept=".pdf"
                              onChange={(e) => handleFileUpload(e, 'resume')}
                              style={{ display: 'none' }}
                            />
                          </label>
                        </>
                      )}
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
                    <button
                      className={`tab ${activeJobTab === 'upload' ? 'active' : ''}`}
                      onClick={() => setActiveJobTab('upload')}
                    >
                      Upload PDF
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
                  ) : activeJobTab === 'link' ? (
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
                  ) : (
                    <div
                      style={{
                        padding: '60px 20px',
                        textAlign: 'center',
                        border: '2px dashed var(--glass-border)',
                        borderRadius: '16px',
                        background: 'rgba(255,255,255,0.02)',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        gap: '16px'
                      }}
                    >
                      <div style={{ fontSize: '3rem' }}>📄</div>
                      {isUploading ? (
                        <p style={{ color: 'var(--accent-primary)', fontWeight: '600' }}>Extracting text...</p>
                      ) : (
                        <>
                          <p style={{ color: 'var(--text-secondary)' }}>Upload a PDF of the job description</p>
                          <label
                            className="btn-primary"
                            style={{ cursor: 'pointer', display: 'inline-flex', background: 'var(--accent-primary)' }}
                          >
                            📂 Select PDF
                            <input
                              type="file"
                              accept=".pdf"
                              onChange={(e) => handleFileUpload(e, 'job')}
                              style={{ display: 'none' }}
                            />
                          </label>
                        </>
                      )}
                    </div>
                  )}
                </div>
              </div>

              <div className="action-bar" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px' }}>
                {/* Full Analysis */}
                <div className="glass-panel" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '12px', alignItems: 'flex-start' }}>
                  <button
                    className="btn-primary"
                    onClick={() => handleAnalysis('Full Analysis')}
                    disabled={!!isAnalyzing}
                    style={{ background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)', width: '100%' }}
                  >
                    {isAnalyzing === 'Full Analysis' ? 'Analyzing...' : '🔍 Full Analysis'}
                  </button>
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: '1.4' }}>
                    Get a comprehensive review including match score, key strengths, and specific gap analysis.
                  </p>
                </div>

                {/* Analyze Skills */}
                <div className="glass-panel" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '12px', alignItems: 'flex-start' }}>
                  <button
                    className="btn-primary"
                    onClick={() => handleAnalysis('Analyze Skills')}
                    disabled={!!isAnalyzing}
                    style={{ background: 'linear-gradient(135deg, #8b5cf6, #6d28d9)', width: '100%' }}
                  >
                    {isAnalyzing === 'Analyze Skills' ? 'Analyzing...' : '🎯 Analyze Skills'}
                  </button>
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: '1.4' }}>
                    Perform a side-by-side comparison of required skills vs. your actual experience.
                  </p>
                </div>

                {/* ATS Score */}
                <div className="glass-panel" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '12px', alignItems: 'flex-start' }}>
                  <button
                    className="btn-primary"
                    onClick={() => handleAnalysis('ATS Score')}
                    disabled={!!isAnalyzing}
                    style={{ background: 'linear-gradient(135deg, #10b981, #059669)', width: '100%' }}
                  >
                    {isAnalyzing === 'ATS Score' ? 'Analyzing...' : '📊 ATS Friendliness'}
                  </button>
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: '1.4' }}>
                    Check for keyword density and formatting issues that might block automated filters.
                  </p>
                </div>

                {/* Cover Letter */}
                <div className="glass-panel" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '12px', alignItems: 'flex-start' }}>
                  <button
                    className="btn-primary"
                    onClick={() => handleAnalysis('Cover Letter')}
                    disabled={!!isAnalyzing}
                    style={{ background: 'linear-gradient(135deg, #f59e0b, #d97706)', width: '100%' }}
                  >
                    {isAnalyzing === 'Cover Letter' ? 'Analyzing...' : '✉️ Cover Letter'}
                  </button>
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: '1.4' }}>
                    Generate a professional, highly-tailored cover letter focused on role-aligned achievements.
                  </p>
                </div>

                {/* Rewrite Resume */}
                <div className="glass-panel" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '12px', alignItems: 'flex-start' }}>
                  <button
                    className="btn-primary"
                    onClick={() => handleAnalysis('Rewrite Resume')}
                    disabled={!!isAnalyzing}
                    style={{ background: 'linear-gradient(135deg, #ec4899, #be185d)', width: '100%' }}
                  >
                    {isAnalyzing === 'Rewrite Resume' ? 'Rewriting...' : '✨ Rewrite Resume'}
                  </button>
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: '1.4' }}>
                    Automatically rewrite your experience bullets to "pitch high" for your target role.
                  </p>
                </div>

                {/* Interview Questions */}
                <div className="glass-panel" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '12px', alignItems: 'flex-start' }}>
                  <button
                    className="btn-primary"
                    onClick={() => handleAnalysis('Interview Questions')}
                    disabled={!!isAnalyzing}
                    style={{ background: 'linear-gradient(135deg, #6366f1, #4338ca)', width: '100%' }}
                  >
                    {isAnalyzing === 'Interview Questions' ? 'Generating...' : '🎙️ Interview Prep'}
                  </button>
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: '1.4' }}>
                    Generate challenging interview questions and pro-tips based on your specific background.
                  </p>
                </div>
              </div>

              <div style={{ textAlign: 'center', marginTop: '12px', marginBottom: '20px' }}>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', fontStyle: 'italic' }}>
                  Note: The "Rewrite" and "Analysis" features may produce longer, detailed content to ensure maximum ATS keyword coverage. You can trim the results to fit your specific needs.
                </p>
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

                  <div style={{ marginTop: '24px', borderTop: '1px solid var(--glass-border)', paddingTop: '20px', textAlign: 'center' }}>
                    <p style={{ color: 'var(--text-secondary)', marginBottom: '12px', fontSize: '0.9rem' }}>Like the result? Track your application to this role.</p>
                    <button className="btn-primary" onClick={saveToTracker} style={{ margin: '0 auto' }}>
                      🎯 Save to Application Tracker
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default App;
