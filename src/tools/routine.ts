import { Tool, CallToolResult } from '@modelcontextprotocol/sdk/types.js';
import { DailyImprovementClient } from '../client.js';
import { GenerateRoutineArgs } from '../types.js';

/**
 * Tool definition for generate21DayRoutine
 */
export const generateRoutineToolDefinition: Tool = {
    name: "dailyImprovement_generate21DayRoutine",
    description: "Generates a 21-day '1% better' routine for a user's specified interest or topic (e.g., 'reading', 'fitness', 'coding').",
    inputSchema: {
        type: "object",
        properties: {
            interest: {
                type: "string",
                description: "The interest or topic to build the 21-day routine for."
            }
        },
        required: ["interest"],
    },
};

/**
 * Type guard for GenerateRoutineArgs
 */
function isGenerateRoutineArgs(args: unknown): args is GenerateRoutineArgs {
    return (
        typeof args === "object" &&
        args !== null &&
        "interest" in args &&
        typeof (args as { interest: unknown }).interest === "string"
    );
}

/**
 * Handles generate21DayRoutine tool calls
 */
export async function handleGenerateRoutineTool(
    client: DailyImprovementClient, 
    args: unknown
): Promise<CallToolResult> {
    try {
        if (!isGenerateRoutineArgs(args)) {
            throw new Error("Invalid arguments: 'interest' (string) is required.");
        }

        const result = await client.getRoutine(args);
        
        return {
            content: [{ type: "text", text: result }],
            isError: false,
        };
    } catch (error) {
        return {
            content: [{
                type: "text",
                text: `Error: ${error instanceof Error ? error.message : String(error)}`,
            }],
            isError: true,
        };
    }
}