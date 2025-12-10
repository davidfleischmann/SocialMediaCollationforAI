import axios from 'axios';
import { config } from './config';

export interface LinkedInPost {
    title: string;
    link: string;
    snippet: string;
    source: string;
}

export class Collector {
    async fetchPosts(dateRange?: { start: string, end: string }): Promise<LinkedInPost[]> {
        console.log(`Searching for recent AI posts on LinkedIn... ${dateRange ? `(${dateRange.start} - ${dateRange.end})` : '(Last 24h)'} [Max: ${config.MAX_POSTS}]`);

        // Check if we have API keys. If not, return dummy data for safe testing.
        if (!config.SEARCH_API_KEY || !config.SEARCH_ENGINE_ID) {
            console.warn('⚠️ No SEARCH_API_KEY or SEARCH_ENGINE_ID found. Returning MOCK data.');
            return this.getMockData();
        }

        try {
            const allPosts: LinkedInPost[] = [];
            const keywords = config.LINKEDIN_KEYWORDS;

            // Loop until we reach MAX_POSTS or exhaust results
            let startIndex = 1;
            const maxResults = config.MAX_POSTS;

            // We can search for multiple keywords if needed, but keeping it simple for now to 1st keyword
            const query = `site:linkedin.com/posts ${keywords[0]}`;

            while (allPosts.length < maxResults) {
                const params: any = {
                    key: config.SEARCH_API_KEY,
                    cx: config.SEARCH_ENGINE_ID,
                    q: query,
                    start: startIndex,
                    num: 10, // Google API Max per request
                };

                if (dateRange) {
                    const start = dateRange.start.replace(/-/g, '');
                    const end = dateRange.end.replace(/-/g, '');
                    params.sort = `date:r:${start}:${end}`;
                } else {
                    params.dateRestrict = 'd1';
                }

                const response = await axios.get('https://www.googleapis.com/customsearch/v1', { params });

                if (response.data.items) {
                    response.data.items.forEach((item: any) => {
                        if (allPosts.length < maxResults) {
                            allPosts.push({
                                title: item.title,
                                link: item.link,
                                snippet: item.snippet,
                                source: 'Google Search',
                            });
                        }
                    });

                    // Prepare for next page
                    startIndex += 10;

                    // Stop if no next page logic available or fewer than 10 items returned (end of list)
                    if (!response.data.queries?.nextPage || response.data.items.length < 10) {
                        break;
                    }

                    // Safety break to prevent infinite loops or huge costs
                    if (startIndex > 100) break;
                } else {
                    break; // No items found
                }
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
