import dotenv from 'dotenv';
dotenv.config();

export const config = {
    SEARCH_API_KEY: process.env.SEARCH_API_KEY || '',
    SEARCH_ENGINE_ID: process.env.SEARCH_ENGINE_ID || '', // for Google Custom Search
    GEMINI_API_KEY: process.env.GEMINI_API_KEY || '',
    LINKEDIN_KEYWORDS: (process.env.LINKEDIN_KEYWORDS || 'Artificial Intelligence, LLM, Generative AI').split(',').map(k => k.trim()),
    SCHEDULE_CRON: process.env.SCHEDULE_CRON || '0 8 * * *', // Default: 8:00 AM daily
    OUTPUT_FORMAT: (process.env.OUTPUT_FORMAT || 'markdown').toLowerCase() as 'markdown' | 'html',
};
