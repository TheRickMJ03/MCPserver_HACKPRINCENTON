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
    getSmallTipToolDefinition,
    handleGetSmallTipTool 
} from './tools/index.js';

// Pass the full config object
export function createStandaloneServer(config: Config): Server {
    const serverInstance = new Server(
        {
            name: "org/daily-improvement",
            version: "0.3.0", // Upped version for all tools
        },
        {
            capabilities: {
                tools: {},
            },
        }
    );

    // Pass the specific keys to the client
    const client = new DailyImprovementClient(config.googleApiKey, config.googleCx);

    serverInstance.setNotificationHandler(InitializedNotificationSchema, async () => {
        console.log('DailyImprovement MCP client initialized (Google Search Enabled)');
    });


    serverInstance.setRequestHandler(ListToolsRequestSchema, async () => ({
        tools: [
            getProgrammingTipToolDefinition, 
            generateRoutineToolDefinition, 
            getSmallTipToolDefinition     
        ],
    }));

  
    serverInstance.setRequestHandler(CallToolRequestSchema, async (request) => {
        const { name, arguments: args } = request.params;
        
        switch (name) {
            case "dailyImprovement_getProgrammingTip":
                return await handleGetProgrammingTipTool(client, args);
            
            case "dailyImprovement_generate21DayRoutine": 
                return await handleGenerateRoutineTool(client, args);

            case "dailyImprovement_getSmallTip":
                return await handleGetSmallTipTool(client, args);

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
    private config: Config;

    constructor(config: Config) { 
        this.config = config;
    }

    getServer(): Server {
        return createStandaloneServer(this.config);
    }
}