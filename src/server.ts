import {
  McpServer,
  ResourceTemplate,
} from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";
import fs from "node:fs/promises";
import { CreateMessageResultSchema } from "@modelcontextprotocol/sdk/types.js";
import { anonymizeObject } from "./anonymizer";

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
  "anonymize-text",
  {
    title: "Anonymize Data",
    description: "Ananoymize some text",
    inputSchema: { data: z.any() },
    outputSchema: { anonymizedData: z.any() },
    annotations: {
      destructiveHint: false,
      requiresUserConsent: false,
      readOnlyHint: true,
      idempotentHint: false,
      openWorldHint: false,
    },
  },
  async ({ data }) => {
    const transformed = await anonymizeObject(data);
    console.log(transformed);
    return {
      content: [
        {
          type: "text",
          text: JSON.stringify({ anonymizedData: transformed }),
          mimeType: "application/json",
        },
      ],
      structuredContent: { anonymizedData: transformed },
    };
  }
);

server.registerTool(
    'anonymize-file',
    {
        title: 'Anonymize File',
        description: 'Ananoymize data in a JSON File',
        inputSchema: { path: z.string() },
        outputSchema: { success: z.boolean(), errorMessage: z.optional(z.string()) }
    },
    async ({ path }) => {
        let content: object;
        try {
            content = await import(path, {
                with: { type: "json" },
            }).then(m => m.default);
        } catch (err: any) {
            const response = {
                success: false,
                errorMessage: err
            }
            return {
                content: [
                    {
                        type: 'text', text: JSON.stringify(response), mimeType: 'application/json',
                    },
                ],
                structuredContent: response,
            }
        }
        const transformed = await anonymizeObject(content);
        try {
            await fs.writeFile(path, JSON.stringify(transformed));
        } catch (err: any) {
            const response = {
                success: false,
                errorMessage: err
            }
            return {
                content: [
                    {
                        type: 'text', text: JSON.stringify(response), mimeType: 'application/json',
                    },
                ],
                structuredContent: response,
            }

        }
        return {
            content: [
                {
                    type: 'text', text: JSON.stringify({ success: true }), mimeType: 'application/json',
                },
            ],
            structuredContent: { success: true },
        }
    }
)

async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
}

main();
