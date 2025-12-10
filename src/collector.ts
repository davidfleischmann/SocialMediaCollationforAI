import axios from 'axios';
import { config } from './config';

export interface LinkedInPost {
    title: string;
    link: string;
    snippet: string;
    source: string;
}

export class Collector {
    async fetchPosts(): Promise<LinkedInPost[]> {
        console.log('Searching for recent AI posts on LinkedIn...');

        // Check if we have API keys. If not, return dummy data for safe testing.
        if (!config.SEARCH_API_KEY || !config.SEARCH_ENGINE_ID) {
            console.warn('⚠️ No SEARCH_API_KEY or SEARCH_ENGINE_ID found. Returning MOCK data.');
            return this.getMockData();
        }

        try {
            const allPosts: LinkedInPost[] = [];
            const keywords = config.LINKEDIN_KEYWORDS;

            // Simple implementation: Search for "site:linkedin.com/posts [Keyword]"
            // We limit to 1-2 keywords to avoid quota exhaustion in this demo.
            const query = `site:linkedin.com/posts ${keywords[0]}`;

            const response = await axios.get('https://www.googleapis.com/customsearch/v1', {
                params: {
                    key: config.SEARCH_API_KEY,
                    cx: config.SEARCH_ENGINE_ID,
                    q: query,
                    dateRestrict: 'd1', // Last 24h
                },
            });

            if (response.data.items) {
                response.data.items.forEach((item: any) => {
                    allPosts.push({
                        title: item.title,
                        link: item.link,
                        snippet: item.snippet,
                        source: 'Google Search',
                    });
                });
            }

            return allPosts;

        } catch (error) {
            console.error('Error fetching posts:', error);
            return [];
        }
    }

    private getMockData(): LinkedInPost[] {
        return [
            {
                title: "Jane Doe on LinkedIn: AI is changing the world...",
                link: "https://www.linkedin.com/posts/janedoe_ai-generativeai-future-activity-123456789",
                snippet: "AI is revolutionizing how we code. #GenerativeAI #FutureOfWork...",
                source: "Mock Data"
            },
            {
                title: "John Smith on LinkedIn: The new LLM benchmark results are out.",
                link: "https://www.linkedin.com/posts/johnsmith_llm-benchmark-tech-activity-987654321",
                snippet: "Incredible performance from the latest open source model. It beats GPT-4 on...",
                source: "Mock Data"
            }
        ];
    }
}
