import OpenAI from 'openai';
import { config } from './config';
import { LinkedInPost } from './collector';

export class Processor {
    private openai: OpenAI | null = null;

    constructor() {
        if (config.OPENAI_API_KEY) {
            this.openai = new OpenAI({ apiKey: config.OPENAI_API_KEY });
        }
    }

    async summarize(posts: LinkedInPost[]): Promise<string> {
        if (posts.length === 0) return "No posts found to summarize.";

        if (!this.openai) {
            console.warn('⚠️ No OPENAI_API_KEY found. Returning static summary.');
            return "## AI Update (Mock)\n\nToday saw discussions about **Generative AI** and **LLM Benchmarks**. (Configure OpenAI Key for real summary).";
        }

        const postsText = posts.map(p => `- Title: ${p.title}\n  Snippet: ${p.snippet}\n  Link: ${p.link}`).join('\n\n');

        try {
            const completion = await this.openai.chat.completions.create({
                messages: [
                    { role: "system", content: "You are an expert tech newsletter writer. Summarize the following LinkedIn posts into a concise, engaging daily AI update. Focus on the key trends and interesting points. Output in Markdown." },
                    { role: "user", content: `Here are the top LinkedIn posts from the last 24 hours:\n\n${postsText}` }
                ],
                model: "gpt-4o",
            });

            return completion.choices[0].message.content || "Failed to generate summary.";
        } catch (error: any) {
            if (error?.status === 429 || error?.code === 'insufficient_quota') {
                console.error('\n❌ OpenAI Error: You have exceeded your quota or have no credits.');
                console.error('👉 Fix: Go to https://platform.openai.com/account/billing/overview and add credits to your account.');
                console.error('   Note: ChatGPT Plus subscriptions do NOT cover API usage.\n');
                return "Summary unavailable: OpenAI Quota Exceeded (Check Billing).";
            }
            console.error('Error generating summary:', error);
            return "Error generating summary. Check API keys.";
        }
    }
}
