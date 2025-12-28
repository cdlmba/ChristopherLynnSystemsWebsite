import { GoogleGenerativeAI } from "@google/generative-ai";

// @ts-ignore
const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(API_KEY || "");
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

export type AnalysisType = 'Full Analysis' | 'Analyze Skills' | 'ATS Score' | 'Cover Letter';

export const analyzeResume = async (resumeText: string, jobDescription: string, type: AnalysisType) => {
    if (!API_KEY) {
        throw new Error("Gemini API Key is missing. Please add VITE_GEMINI_API_KEY to your .env file or Vercel settings.");
    }

    let prompt = "";

    switch (type) {
        case 'Full Analysis':
            prompt = `
        Analyze the following resume against the job description. 
        Provide a Match Score (0-100), Strengths, Weaknesses, and specific Gap analysis.
        
        Resume: ${resumeText}
        Job Description: ${jobDescription}
      `;
            break;
        case 'Analyze Skills':
            prompt = `
        Compare the skills in this resume with the skills required in the job description.
        Categorize into "Matched Skills", "Missing Skills", and "Bonus Skills" (skills you have that aren't required but are relevant).
        
        Resume: ${resumeText}
        Job Description: ${jobDescription}
      `;
            break;
        case 'ATS Score':
            prompt = `
        Evaluate this resume for ATS (Applicant Tracking System) friendliness against this job.
        Check for keywords match, formatting issues, and provide an ATS optimization score.
        
        Resume: ${resumeText}
        Job Description: ${jobDescription}
      `;
            break;
        case 'Cover Letter':
            prompt = `
        Write a professional and highly tailored cover letter based on this resume and job description.
        Focus on how the candidate's specific experiences solve the problems outlined in the job description.
        
        Resume: ${resumeText}
        Job Description: ${jobDescription}
      `;
            break;
    }

    try {
        const result = await model.generateContent(prompt);
        const response = await result.response;
        return response.text();
    } catch (error) {
        console.error("Gemini API Error:", error);
        throw error;
    }
};
