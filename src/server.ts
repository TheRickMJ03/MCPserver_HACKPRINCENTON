import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import {
    CallToolRequestSchema,
    ListToolsRequestSchema,
    InitializedNotificationSchema,
} from "@modelcontextprotocol/sdk/types.js";
import { DailyImprovementClient } from './client.js';
import {
    getProgrammingTipToolDefinition,
    handleGetProgrammingTipTool,
} from './tools/index.js';

export function createStandaloneServer(apiKey: string): Server {
    const serverInstance = new Server(
        {
            name: "org/daily-improvement",
            version: "0.1.0",
        },
        {
            capabilities: {
                tools: {},
            },
        }
    );

    const client = new DailyImprovementClient(apiKey);

    serverInstance.setNotificationHandler(InitializedNotificationSchema, async () => {
        console.log('DailyImprovement MCP client initialized');
    });

    serverInstance.setRequestHandler(ListToolsRequestSchema, async () => ({
        tools: [getProgrammingTipToolDefinition], // Register your tool here
    }));

    serverInstance.setRequestHandler(CallToolRequestSchema, async (request) => {
        const { name, arguments: args } = request.params;
        
        switch (name) {
            case "dailyImprovement_getProgrammingTip": // Match your tool name
                return await handleGetProgrammingTipTool(client, args);
            default:
                return {
                    content: [{ type: "text", text: `Unknown tool: ${name}` }],
                    isError: true,
                };
        }
    });

    return serverInstance;
}

export class DailyImprovementServer {
    private apiKey: string;

    constructor(apiKey: string) {
        this.apiKey = apiKey;
    }

    getServer(): Server {
        return createStandaloneServer(this.apiKey);
    }
}