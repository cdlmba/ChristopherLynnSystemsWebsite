import { generateText } from 'ai';
import { createGoogleGenerativeAI } from '@ai-sdk/google';
import { createOpenAI } from '@ai-sdk/openai';

// @ts-ignore
const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
// @ts-ignore
const OPENAI_API_KEY = import.meta.env.VITE_OPENAI_API_KEY;

const google = createGoogleGenerativeAI({
    apiKey: GEMINI_API_KEY,
});

const openai = createOpenAI({
    apiKey: OPENAI_API_KEY,
});

export type AnalysisType = 'Full Analysis' | 'Analyze Skills' | 'ATS Score' | 'Cover Letter';
export type AIProvider = 'gemini' | 'openai';

export const analyzeResume = async (
    resumeText: string,
    jobDescription: string,
    type: AnalysisType,
    provider: AIProvider = 'gemini'
) => {
    const prompt = getPrompt(resumeText, jobDescription, type);

    try {
        if (provider === 'openai') {
            if (!OPENAI_API_KEY) throw new Error("OpenAI API Key is missing. Please add VITE_OPENAI_API_KEY.");

            const { text } = await generateText({
                model: openai('gpt-4o-mini'),
                system: "You are an expert HR and Career Coach.",
                prompt: prompt,
            });
            return text;
        } else {
            if (!GEMINI_API_KEY) throw new Error("Gemini API Key is missing. Please add VITE_GEMINI_API_KEY.");

            const { text } = await generateText({
                model: google('gemini-flash-latest'),
                prompt: prompt,
            });
            return text;
        }
    } catch (error: any) {
        console.error("AI API Error:", error);
        throw error;
    }
};

const getPrompt = (resumeText: string, jobDescription: string, type: AnalysisType) => {
    switch (type) {
        case 'Full Analysis':
            return `Analyze the following resume against the job description. Provide a Match Score (0-100), Strengths, Weaknesses, and specific Gap analysis.\n\nResume: ${resumeText}\n\nJob Description: ${jobDescription}`;
        case 'Analyze Skills':
            return `Compare the skills in this resume with the skills required in the job description. Categorize into "Matched Skills", "Missing Skills", and "Bonus Skills".\n\nResume: ${resumeText}\n\nJob Description: ${jobDescription}`;
        case 'ATS Score':
            return `Evaluate this resume for ATS (Applicant Tracking System) friendliness against this job. Check for keywords match, formatting issues, and provide an ATS optimization score.\n\nResume: ${resumeText}\n\nJob Description: ${jobDescription}`;
        case 'Cover Letter':
            return `Write a professional and highly tailored cover letter based on this resume and job description.\n\nResume: ${resumeText}\n\nJob Description: ${jobDescription}`;
        default:
            return "";
    }
};
