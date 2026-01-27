import { generateText } from 'ai';
import { createGoogleGenerativeAI } from '@ai-sdk/google';
import { AnalysisType, AIProvider } from '../types';

// @ts-ignore
const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

const google = createGoogleGenerativeAI({
    apiKey: GEMINI_API_KEY,
});
// import { createOpenAI } from '@ai-sdk/openai';

export const analyzeResume = async (
    resumeText: string,
    jobDescription: string,
    type: AnalysisType,
    provider: AIProvider = 'gemini'
) => {
    const prompt = getPrompt(resumeText, jobDescription, type);

    try {
        // if (provider === 'openai') {
        //     if (!OPENAI_API_KEY) throw new Error("OpenAI API Key is missing. Please add VITE_OPENAI_API_KEY.");
        //
        //     const { text } = await generateText({
        //         model: openai('gpt-4o-mini'),
        //         system: "You are an expert HR and Career Coach.",
        //         prompt: prompt,
        //     });
        //     return text;
        // } else {
        if (!GEMINI_API_KEY) throw new Error("Gemini API Key is missing. Please add VITE_GEMINI_API_KEY.");

        const { text } = await generateText({
            model: google('gemini-flash-latest'),
            system: "You are an expert Executive Career Coach. Your goal is to position candidates for growth and management roles, not just their current level. Focus on leadership, strategy, and ownership. When evaluating skills, if a candidate has used a tool (like SQL) but isn't an expert, frame it as 'Applied Knowledge' or 'Practical Experience' rather than 'Basic'.",
            prompt: prompt,
        });
        return text;
        // }
    } catch (error: any) {
        console.error("AI API Error:", error);
        throw error;
    }
};

const getPrompt = (resumeText: string, jobDescription: string, type: AnalysisType) => {
    switch (type) {
        case 'Full Analysis':
            return `Analyze the following resume against the job description.
            
            IMPORTANT: Start your response with a "Verdict" based on the Match Score.
            - If Match Score > 85: "Veridct: Nice work! Send it!"
            - If Match Score 70-85: "Verdict: Solid contender, minor tweaks needed."
            - If Match Score < 70: "Verdict: Could use some more work!"

            Then provide:
            1. Match Score (0-100)
            2. Strengths (Highlight leadership/management potential)
            3. Weaknesses
            4. Specific Gap Analysis (Be constructive)

            Resume: ${resumeText}
            
            Job Description: ${jobDescription}`;

        case 'Analyze Skills':
            return `Compare the skills in this resume with the skills required in the job description. 
            
            Categorize into:
            1. "Matched Skills" 
            2. "Missing Skills" 
            3. "Bonus Skills"
            
            Constraint: If they have exposure to a technical skill (e.g., SQL, Python) but it's not a primary strengh, label it as "Practical Experience" or "Familiarity" instead of "Basic".

            Resume: ${resumeText}
            
            Job Description: ${jobDescription}`;

        case 'ATS Score':
            return `Evaluate this resume for ATS (Applicant Tracking System) friendliness against this job. Check for keywords match, formatting issues, and provide an ATS optimization score.
            
            Resume: ${resumeText}
            
            Job Description: ${jobDescription}`;

        case 'Cover Letter':
            return `Write a professional, highly tailored cover letter based on this resume and job description.
            
            Constraints:
            - Keep it concise (under 350 words).
            - Focus on the top 3 aligned achievements.
            - Use a direct, confident tone (Executive/Managerial voice).
            - Do not summarize the entire history, just the relevant highlights.

            Resume: ${resumeText}
            
            Job Description: ${jobDescription}`;

        case 'Rewrite Resume':
            return `Rewrite the professional summary and experience bullets of the provided resume to target the provided job description.
            
            Guidelines:
            - "Pitch High": Frame experience for the next level up (Management/Senior).
            - Use strong action verbs.
            - Ensure high keyword density for ATS optimization.
            - Note: It is okay if this version is slightly longer ensure all keywords are covered; the user can trim it later.

            Resume: ${resumeText}
            
            Job Description: ${jobDescription}`;

        case 'Interview Questions':
            return `Based on the following resume and job description, generate 5-7 challenging interview questions that this specific candidate is likely to face.
            
            For each question:
            1. Provide the Question.
            2. Explain "Why they are asking this" (the intent).
            3. Provide a "Pro-Tip for the Answer" based on the candidate's specific background.
            
            Focus on leadership, problem-solving, and specific gaps between the resume and the job requirements.

            Resume: ${resumeText}
            
            Job Description: ${jobDescription}`;

        default:
            return "";
    }
};
