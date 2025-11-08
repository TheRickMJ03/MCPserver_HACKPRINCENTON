import { GetProgrammingTipArgs } from './types.js';

// --- Interfaces for Google Custom Search API Response ---
interface GoogleSearchResult {
    title: string;
    link: string;
    snippet: string;
}

interface GoogleSearchResponse {
    items?: GoogleSearchResult[];
}
// ---

export class DailyImprovementClient {
    private apiKey: string;
    private cx: string;
    private baseUrl: string = 'https://www.googleapis.com/customsearch/v1';

    constructor(apiKey: string, cx: string) {
        this.apiKey = apiKey;
        this.cx = cx;
    }

    /**
     * Gets a programming tip by searching Google.
     */
    async getTip(params: GetProgrammingTipArgs): Promise<string> {
        const { topic } = params;
        
        // Formulate a search query
        const query = `advanced ${topic} programming tip or unique insight`;

        try {
            const searchData = await this.performRequest(query);

            if (!searchData.items || searchData.items.length === 0) {
                return `Sorry, I couldn't find any fresh tips for ${topic} right now.`;
            }

            // Get the first result
            const topResult = searchData.items[0];
            return this.formatResponse(topResult, topic);

        } catch (error) {
            console.error("Error fetching from Google Search:", error);
            return `Error: Could not fetch tip. ${error instanceof Error ? error.message : ''}`;
        }
    }

    /**
     * Performs the fetch request to Google Custom Search API
     */
    private async performRequest(query: string): Promise<GoogleSearchResponse> {
        const url = `${this.baseUrl}?key=${this.apiKey}&cx=${this.cx}&q=${encodeURIComponent(query)}`;

        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
            },
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(
                `Google Search API error: ${response.status} ${response.statusText}\n${errorText}`
            );
        }

        return await response.json() as GoogleSearchResponse;
    }

    /**
     * Formats the Google Search result for the user
     */
    private formatResponse(result: GoogleSearchResult, topic: string): string {
        let content = `**Here's a personalized tip I found for ${topic}:**\n`;
        content += `**${result.title}**\n`;
        content += `${result.snippet}\n\n`;
        content += `*Source:* ${result.link}`;
        return content;
    }
}