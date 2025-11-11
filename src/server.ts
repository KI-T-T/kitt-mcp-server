import {
  McpServer,
  ResourceTemplate,
} from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";

import { CreateMessageResultSchema } from "@modelcontextprotocol/sdk/types.js";
import { anonymizeObject } from "./anonymizer";
import { initAnonymizeTextTool } from "./tool.anonymize.text";
import { initAnonymizeFileTool } from "./tool.anonymize.file";

const server = new McpServer({
  name: "kitt-mcp-server",
  version: "1.0.0",
  capabilities: {
    resources: {},
    tools: {},
    prompts: {},
  },
});

initAnonymizeTextTool(server);
initAnonymizeFileTool(server);

async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
}

main();
