import {
  McpServer,
  ResourceTemplate,
} from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";
import fs from "node:fs/promises";
import { CreateMessageResultSchema } from "@modelcontextprotocol/sdk/types.js";

const server = new McpServer({
  name: "kitt-mcp-server",
  version: "1.0.0",
  capabilities: {
    resources: {},
    tools: {},
    prompts: {},
  },
});

server.registerTool(
    'anonymize-text',
    {
        title: 'Anonymize Data',
        description: 'Ananoymize some text',
        inputSchema: { data: z.any() },
        outputSchema: { anonymizedData: z.any() }
    },
    async ({ data }) => {
        const transformed: any = {}
        Object.keys(data).forEach(key => {
            transformed[key] = anonymizeText(data[key])
        });
        console.log(transformed);
        return {
            content: [
                {
                    type: 'text', text: JSON.stringify({ anonymizedData: transformed }), mimeType: 'application/json',
                },
            ],
            structuredContent: { anonymizedData: transformed },
        }
    }
)

function anonymizeText(s: any): string {
    return `${s}-copy`;
}

async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
}

main();
