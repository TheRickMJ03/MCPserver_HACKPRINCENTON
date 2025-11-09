import { GetProgrammingTipArgs, GenerateRoutineArgs, GetSmallTipArgs } from './types.js';
import { GoogleGenAI } from "@google/genai";

export class DailyImprovementClient {
    private googleAiApiKey: string;
    private genAI: GoogleGenAI;
    private model: string = "gemini-1.5-flash";

    constructor(googleAiApiKey: string) {
        this.googleAiApiKey = googleAiApiKey;
        this.genAI = new GoogleGenAI({ apiKey: this.googleAiApiKey });
    }

    async getRoutine(params: GenerateRoutineArgs): Promise<string> {
        const { interest } = params;
        try {
            const prompt = `Create a 21-day '1 percent better' routine for ${interest}.
            Provide a simple, actionable tip for each day.
            Format it as a markdown list (e.g., "Day 1: ...").`;

            const result = await this.genAI.models.generateContent({
                model: this.model,
                contents: [{ role: "user", parts: [{ text: prompt }] }],
            });

            return result.text ?? "No response from AI.";
        } catch (error) {
            console.error("Error generating routine from Google AI:", error);
            return `Error: Could not generate routine. ${error instanceof Error ? error.message : ''}`;
        }
    }

    async getSmallTipWithAI(params: GetSmallTipArgs): Promise<string> {
        const { interest, difficulty } = params;

        try {
            const prompt = `Give me one short, ${difficulty} tip for getting 1% better at ${interest}. Be concise, like a single sentence or two.`;

            const result = await this.genAI.models.generateContent({
                model: this.model,
                contents: [{ role: "user", parts: [{ text: prompt }] }],
            });
            
            const tip = result.text ?? "No response from AI.";
            return `Here's a ${difficulty} tip for ${interest}: ${tip}`;

        } catch (error) {
            console.error("Error generating content from Google AI:", error);
            return `Error: Could not generate tip. ${error instanceof Error ? error.message : ''}`;
        }
    }

    async getTip(params: GetProgrammingTipArgs): Promise<string> {
        const { topic } = params;
        try {
            const prompt = `Give me one advanced programming tip or unique insight for ${topic}.
            Be specific, provide a short code example if possible, and explain *why* it's a good practice.`;

            const result = await this.genAI.models.generateContent({
                model: this.model,
                contents: [{ role: "user", parts: [{ text: prompt }] }],
            });

            return result.text ?? "No response from AI.";
        } catch (error) {
            console.error("Error generating programming tip from Google AI:", error);
            return `Error: Could not fetch tip. ${error instanceof Error ? error.message : ''}`;
        }
    }
}
