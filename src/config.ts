import dotenv from 'dotenv';
dotenv.config();

export const config = {
    SEARCH_API_KEY: process.env.SEARCH_API_KEY || '',
    SEARCH_ENGINE_ID: process.env.SEARCH_ENGINE_ID || '', // for Google Custom Search
    OPENAI_API_KEY: process.env.OPENAI_API_KEY || '',
    LINKEDIN_KEYWORDS: (process.env.LINKEDIN_KEYWORDS || 'Artificial Intelligence, LLM, Generative AI').split(',').map(k => k.trim()),
};
