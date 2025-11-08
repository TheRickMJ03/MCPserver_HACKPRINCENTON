import { GetProgrammingTipArgs, ProgrammingTipResponse } from './types.js';

export class DailyImprovementClient {
    private apiKey: string;

    constructor(apiKey: string) {
        // We accept the apiKey to match the template, but won't use it here.
        this.apiKey = apiKey;
    }

    /**
     * "Simulates" an API request to get a programming tip.
     * In a real app, this could fetch from a database or call another AI.
     */
    async getTip(params: GetProgrammingTipArgs): Promise<string> {
        const { topic } = params;
        
        let response: ProgrammingTipResponse;

        // Simple logic to generate a tip
        switch (topic.toLowerCase()) {
            case 'python':
                response = {
                    topic: 'Python',
                    tip: "Use list comprehensions for concise and readable list creation.",
                    example: "`squares = [x*x for x in range(10)]`"
                };
                break;
            case 'react':
                response = {
                    topic: 'React',
                    tip: "Use the `memo` HOC (Higher-Order Component) to prevent re-renders of components whose props haven't changed.",
                    example: "`export default React.memo(MyComponent);`"
                };
                break;
            case 'general':
            default:
                response = {
                    topic: 'General Programming',
                    tip: "Follow the 'Don't Repeat Yourself' (DRY) principle. If you copy-paste code, consider refactoring it into a function.",
                };
        }
        
        return this.formatResponse(response);
    }

    private formatResponse(data: ProgrammingTipResponse): string {
        // Format the response for the model
        let content = `**Tip for ${data.topic}:**\n${data.tip}`;
        if (data.example) {
            content += `\n**Example:**\n\`\`\`\n${data.example}\n\`\`\``;
        }
        return content;
    }
}