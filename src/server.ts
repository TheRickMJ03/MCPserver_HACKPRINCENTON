import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import {
    CallToolRequestSchema,
    ListToolsRequestSchema,
    InitializedNotificationSchema,
} from "@modelcontextprotocol/sdk/types.js";
import { DailyImprovementClient } from './client.js';
import { Config } from './config.js'; 
import {
    getProgrammingTipToolDefinition,
    handleGetProgrammingTipTool,
    generateRoutineToolDefinition,
    handleGenerateRoutineTool,
} from './tools/index.js';

// Pass the full config object
export function createStandaloneServer(config: Config): Server {
    const serverInstance = new Server(
        {
            name: "org/daily-improvement",
            version: "0.2.0", // Upped version for new feature
        },
        {
            capabilities: {
                tools: {},
            },
        }
    );

    serverInstance.setRequestHandler(ListToolsRequestSchema, async () => ({
        tools: [
            getProgrammingTipToolDefinition, // <-- Old tool
            generateRoutineToolDefinition    // <-- New tool
        ],
    }));

    // Pass the specific keys to the client
    const client = new DailyImprovementClient(config.googleApiKey, config.googleCx);

    serverInstance.setNotificationHandler(InitializedNotificationSchema, async () => {
        console.log('DailyImprovement MCP client initialized (Google Search Enabled)');
    });

    serverInstance.setRequestHandler(ListToolsRequestSchema, async () => ({
        tools: [getProgrammingTipToolDefinition],
    }));

    serverInstance.setRequestHandler(CallToolRequestSchema, async (request) => {
        const { name, arguments: args } = request.params;
        
        switch (name) {
            case "dailyImprovement_getProgrammingTip":
                return await handleGetProgrammingTipTool(client, args);
            case "dailyImprovement_generate21DayRoutine": 
                return await handleGenerateRoutineTool(client, args);
            default:
                return {
                    content: [{ type: "text", text: `Unknown tool: ${name}` }],
                    isError: true,
                };
        }
    });

    return serverInstance;
}

// MAKE SURE 'EXPORT' IS HERE
export class DailyImprovementServer {
    private config: Config; // <-- Store the whole config

    constructor(config: Config) { // <-- Accept the whole config
        this.config = config;
    }

    getServer(): Server {
        return createStandaloneServer(this.config); // <-- Pass the whole config
    }
}