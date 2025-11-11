import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { anonymizeObject } from "./anonymizer";
import { z } from "zod";
import fs from "node:fs/promises";
export function initAnonymizeFileTool(server: McpServer) {
  server.registerTool(
    "anonymize-file",
    {
      title: "Anonymize File",
      description: "Ananoymize data in a JSON File",
      inputSchema: { path: z.string() },
      outputSchema: {
        success: z.boolean(),
        errorMessage: z.optional(z.string()),
      },
    },
    async ({ path }) => {
      let content: object;
      try {
        content = await import(path, {
          with: { type: "json" },
        }).then((m) => m.default);
      } catch (err: any) {
        const response = {
          success: false,
          errorMessage: err,
        };
        return {
          content: [
            {
              type: "text",
              text: JSON.stringify(response),
              mimeType: "application/json",
            },
          ],
          structuredContent: response,
        };
      }
      const transformed = await anonymizeObject(content);
      try {
        await fs.writeFile(path, JSON.stringify(transformed));
      } catch (err: any) {
        const response = {
          success: false,
          errorMessage: err,
        };
        return {
          content: [
            {
              type: "text",
              text: JSON.stringify(response),
              mimeType: "application/json",
            },
          ],
          structuredContent: response,
        };
      }
      return {
        content: [
          {
            type: "text",
            text: JSON.stringify({ success: true }),
            mimeType: "application/json",
          },
        ],
        structuredContent: { success: true },
      };
    }
  );
}
