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
import { initGenerateTestExamplesFromJavaClass } from "./prompt.anonymize.class.content";
import { initExtractStructureTool } from "./tool.extract-structure";

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

async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.log('MCP server is running...');
}

main();
