import { Tool, CallToolResult } from '@modelcontextprotocol/sdk/types.js';
import { DailyImprovementClient } from '../client.js';
import { GetSmallTipArgs } from '../types.js';

/**
 * Tool definition for getSmallTip
 */
export const getSmallTipToolDefinition: Tool = {
    name: "dailyImprovement_getSmallTip",
    description: "Gets a short, single-sentence tip for a user's interest, based on a specified difficulty.",
    inputSchema: {
        type: "object",
        properties: {
            interest: {
                type: "string",
                description: "The interest or topic for the tip (e.g., 'swimming', 'coding')."
            },
            difficulty: {
                type: "string",
                description: "The desired difficulty level for the tip.",
                enum: ["beginner", "intermediate", "advanced"]
            }
        },
        required: ["interest", "difficulty"],
    },
};

/**
 * Type guard for GetSmallTipArgs
 */
function isGetSmallTipArgs(args: unknown): args is GetSmallTipArgs {
    return (
        typeof args === "object" &&
        args !== null &&
        "interest" in args &&
        "difficulty" in args &&
        typeof (args as { interest: unknown }).interest === "string" &&
        ["beginner", "intermediate", "advanced"].includes((args as { difficulty: unknown }).difficulty as string)
    );
}

/**
 * Handles getSmallTip tool calls
 */
export async function handleGetSmallTipTool(
    client: DailyImprovementClient, 
    args: unknown
): Promise<CallToolResult> {
    try {
        if (!isGetSmallTipArgs(args)) {
            throw new Error("Invalid arguments: 'interest' (string) and 'difficulty' (beginner/intermediate/advanced) are required.");
        }

        const result = await client.getSmallTip(args);
        
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