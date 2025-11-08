import { Tool, CallToolResult } from '@modelcontextprotocol/sdk/types.js';
import { DailyImprovementClient } from '../client.js';
import { GetProgrammingTipArgs } from '../types.js';

/**
 * Tool definition for getProgrammingTip
 */
export const getProgrammingTipToolDefinition: Tool = {
    name: "dailyImprovement_getProgrammingTip",
    description: "Gets a daily programming tip or problem to help the user get 1% better. Can specify a topic like 'Python', 'React', or 'General'.",
    inputSchema: {
        type: "object",
        properties: {
            topic: {
                type: "string",
                description: "The programming topic for the tip (e.g., 'Python', 'React', 'Data Structures', 'General')."
            }
        },
        required: ["topic"],
    },
};

/**
 * Type guard for getProgrammingTip arguments
 */
function isGetProgrammingTipArgs(args: unknown): args is GetProgrammingTipArgs {
    return (
        typeof args === "object" &&
        args !== null &&
        "topic" in args &&
        typeof (args as { topic: unknown }).topic === "string"
    );
}

/**
 * Handles getProgrammingTip tool calls
 */
export async function handleGetProgrammingTipTool(
    client: DailyImprovementClient, 
    args: unknown
): Promise<CallToolResult> {
    try {
        if (!isGetProgrammingTipArgs(args)) {
            throw new Error("Invalid arguments: 'topic' (string) is required.");
        }

        const result = await client.getTip(args);
        
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