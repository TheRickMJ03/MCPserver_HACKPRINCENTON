import dotenv from 'dotenv';
dotenv.config();

export interface Config {
    googleApiKey: string;
    googleCx: string; 
    port: number;
    isProduction: boolean;
}

export function loadConfig(): Config {
    const googleApiKey = process.env['GOOGLE_API_KEY'];
    if (!googleApiKey) {
        throw new Error('GOOGLE_API_KEY environment variable is required');
    }

    const googleCx = process.env['GOOGLE_CX'];
    if (!googleCx) {
        throw new Error('GOOGLE_CX environment variable (Search Engine ID) is required');
    }
    
    const port = parseInt(process.env.PORT || '8080', 10);
    const isProduction = process.env.NODE_ENV === 'production';

    return { googleApiKey, googleCx, port, isProduction };
}