import dotenv from 'dotenv';
dotenv.config();

export interface Config {
    googleAiApiKey: string; 
    port: number;
    isProduction: boolean;
}

export function loadConfig(): Config {
    const googleAiApiKey = process.env['GOOGLE_AI_API_KEY'];
    if (!googleAiApiKey) {
        throw new Error('GOOGLE_AI_API_KEY environment variable (Gemini API Key) is required');
    }

    
    const port = parseInt(process.env.PORT || '8080', 10);
    const isProduction = process.env.NODE_ENV === 'production';

    return { googleAiApiKey, port, isProduction };
}