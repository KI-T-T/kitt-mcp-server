import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { anonymizeObject } from "./anonymizer";
import { z } from "zod";

export function initAnonymizeTextTool(server: McpServer) {
  server.registerTool(
    "anonymize-text",
    {
      title: "Anonymize Data",
      description:
        "Anonymize an object passed as a json structure including nested objects and remove personal information.",
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
}
