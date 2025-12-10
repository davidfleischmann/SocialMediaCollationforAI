import { GoogleGenerativeAI } from '@google/generative-ai';
import { config } from './config';
import { LinkedInPost } from './collector';

export class Processor {
    private genAI: GoogleGenerativeAI | null = null;

    constructor() {
        if (config.GEMINI_API_KEY) {
            this.genAI = new GoogleGenerativeAI(config.GEMINI_API_KEY);
        }
    }

    async summarize(posts: LinkedInPost[]): Promise<string> {
        if (posts.length === 0) return "No posts found to summarize.";

        if (!this.genAI) {
            console.warn('⚠️ No GEMINI_API_KEY found. Returning static summary.');
            return "## AI Update (Mock)\n\nToday saw discussions about **Generative AI** and **LLM Benchmarks**. (Configure Gemini Key for real summary).";
        }

        const postsText = posts.map(p => `- Title: ${p.title}\n  Snippet: ${p.snippet}\n  Link: ${p.link}`).join('\n\n');

        try {
            const model = this.genAI.getGenerativeModel({ model: "gemini-3-pro-preview" });

            const prompt = `You are an expert tech newsletter writer. Summarize the following LinkedIn posts into a concise, engaging daily AI update. Focus on the key trends and interesting points. Output in Markdown.\n\nHere are the top LinkedIn posts from the last 24 hours:\n${postsText}`;

            const result = await model.generateContent(prompt);
            const response = await result.response;
            return response.text();
        } catch (error: any) {
            console.error('Error generating summary:', error);
            return "Error generating summary. Check API keys.";
        }
    }
}
