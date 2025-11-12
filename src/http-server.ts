/*
 * Start server: node build/http-server.js
 * example .vscode/mcp.json
 *
 * ```json
 * {
 *  "servers": {
 *    "test-mcp-video-server": {
 *      "type": "http",
 *      "url": "http://localhost:3000/mcp",
 *      "cwd": "${workspaceFolder}"
 *    }
 *  }
 *}
 * ```
 */
import {
  McpServer,
} from "@modelcontextprotocol/sdk/server/mcp.js";

import express from 'express';

import { initAnonymizeTextTool } from "./tool.anonymize.text";
import { initAnonymizeFileTool } from "./tool.anonymize.file";
import { initGenerateTestExamplesFromJavaClass } from "./prompt.anonymize.class.content";
import { initExtractStructureTool } from "./tool.extract-structure";
import { StreamableHTTPServerTransport } from "@modelcontextprotocol/sdk/server/streamableHttp.js";

const server = new McpServer({
  name: "kitt-mcp-server",
  version: "1.0.1",
  capabilities: {
    resources: {},
    tools: {},
    prompts: {},
    logging: {},
    sampling: {},
  },
});

initAnonymizeTextTool(server);
initAnonymizeFileTool(server);
initGenerateTestExamplesFromJavaClass(server);
initExtractStructureTool(server);

const app = express();
app.use(express.json());

app.post('/mcp', async (req: any, res: any) => {
    // Create a new transport for each request to prevent request ID collisions
    const transport = new StreamableHTTPServerTransport({
        sessionIdGenerator: undefined,
        enableJsonResponse: true
    });

    res.on('close', () => {
        transport.close();
    });

    await server.connect(transport);
    await transport.handleRequest(req, res, req.body);
});

const port = parseInt(process.env.PORT || '3000');

app.listen(port, () => {
    console.log(`Demo MCP Server running on http://localhost:${port}/mcp`);
}).on('error', (error: any) => {
    console.error('Server error:', error);
    process.exit(1);
});

