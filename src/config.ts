import dotenv from 'dotenv';
dotenv.config();

export interface Config {
    apiKey: string;
    port: number;
    isProduction: boolean;
}

export function loadConfig(): Config {
    // In a real app, this might be a key for a database or another AI service.
    // We provide a default 'dummy-key' so it runs out of the box.
    const apiKey = process.env['DAILY_IMPROVEMENT_API_KEY'] || 'dummy-key';
    
    const port = parseInt(process.env.PORT || '8080', 10);
    const isProduction = process.env.NODE_ENV === 'production';

    return { apiKey, port, isProduction };
}