export type AnalysisType = 'Full Analysis' | 'Analyze Skills' | 'ATS Score' | 'Cover Letter' | 'Rewrite Resume' | 'Interview Questions';
export type AIProvider = 'gemini' | 'openai';

export interface SavedAnalysis {
    id: string;
    type: AnalysisType;
    date: string;
    result: string;
    jobTitle?: string;
    resumeText?: string;
    jobText?: string;
}

export interface ResumeVersion {
    id: string;
    name: string; // e.g. "Software Engineer", "Project Manager"
    content: string;
    lastModified: string;
}

export type ApplicationStatus = 'Applied' | 'Interviewing' | 'Offer' | 'Rejected' | 'Ghosted';

export interface JobApplication {
    id: string;
    jobTitle: string;
    company: string;
    date: string;
    status: ApplicationStatus;
    jobUrl?: string;
    analysisId?: string; // Link to the history item
}
