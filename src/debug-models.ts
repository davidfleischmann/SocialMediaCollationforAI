import { GoogleGenerativeAI } from '@google/generative-ai';
import { config } from './config';
import dotenv from 'dotenv';
dotenv.config();

async function listModels() {
    if (!config.GEMINI_API_KEY) {
        console.error('❌ No GEMINI_API_KEY found in .env');
        return;
    }

    const genAI = new GoogleGenerativeAI(config.GEMINI_API_KEY);

    try {
        // This is the correct way to get the model list if supported by SDK. 
        // Note: older SDKs might not expose listModels directly on the main class 
        // but usually it's accessible via the API.
        // However, @google/generative-ai simplifies this. 
        // If listModels isn't on the client, we try making a raw request or just testing known models.

        // Actually, looking at the SDK docs, there isn't a direct `listModels` on `GoogleGenerativeAI`.
        // We have to assume standard models.
        // Let's test connectivity to a few known models instead.

        const modelsToTest = ['gemini-1.5-flash', 'gemini-1.5-flash-001', 'gemini-pro', 'gemini-1.0-pro'];

        console.log('🔍 Testing connectivity for Gemini models...');

        for (const modelName of modelsToTest) {
            process.stdout.write(`Testing ${modelName}... `);
            try {
                const model = genAI.getGenerativeModel({ model: modelName });
                const result = await model.generateContent("Hello, are you there?");
                const response = await result.response;
                console.log(`✅ OK (Response length: ${response.text().length})`);
            } catch (error: any) {
                if (error.message.includes('404')) {
                    console.log(`❌ 404 Not Found`);
                } else {
                    console.log(`❌ Error: ${error.message}`);
                }
            }
        }

    } catch (error) {
        console.error('Error listing models:', error);
    }
}

listModels();
