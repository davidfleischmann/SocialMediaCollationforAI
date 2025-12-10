import axios from 'axios';
import { config } from './config';
import dotenv from 'dotenv';
dotenv.config();

async function listModels() {
    const key = config.GEMINI_API_KEY;
    if (!key) {
        console.error('❌ No GEMINI_API_KEY found in .env');
        return;
    }

    console.log(`🔑 Using API Key: ${key.substring(0, 4)}...${key.substring(key.length - 4)}`);
    console.log('🔍 Listing available models via REST API...');

    try {
        const response = await axios.get(
            `https://generativelanguage.googleapis.com/v1beta/models?key=${key}`
        );

        const models = response.data.models;
        if (models && models.length > 0) {
            console.log('✅ Connected! Available Models:');
            models.forEach((m: any) => {
                if (m.supportedGenerationMethods?.includes('generateContent')) {
                    console.log(`   - ${m.name.replace('models/', '')} (${m.displayName})`);
                }
            });
            console.log('\n✅ Your API Key works. Please update src/processor.ts with one of the models above if needed.');
        } else {
            console.log('⚠️ API connected but returned no models.');
        }

    } catch (error: any) {
        console.error('❌ Error listing models:', error.message);
        if (axios.isAxiosError(error)) {
            console.error('   Status:', error.response?.status);
            console.error('   Data:', JSON.stringify(error.response?.data, null, 2));

            if (error.response?.status === 400 && error.response.data?.error?.message?.includes('API_KEY_INVALID')) {
                console.error('\n👉 Cause: The API Key is invalid.');
            }
            else if (error.response?.status === 403) {
                console.error('\n👉 Cause: The API Key is valid but lacks permission. Ensure "Generative Language API" is enabled in Google Cloud Console.');
            }
        }
    }
}

listModels();
