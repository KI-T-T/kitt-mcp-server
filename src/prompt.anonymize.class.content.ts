import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { anonymizeObject } from "./anonymizer";
import { z } from "zod";
import {
  GetPromptRequest,
  GetPromptResult,
} from "@modelcontextprotocol/sdk/types.js";
import { count } from "console";

export function initGenerateTestExamplesFromJavaClass(server: McpServer) {
  server.registerPrompt(
    "generate-test-examples-from-java-class",
    {
      title: "Generate Test Examples from Java Class",
      description:
        "Generate 5 test examples in JSON format for a given Java class. The string classAsString contains the Java class definition and use only fields, keep the data type and substructure.",
      argsSchema: {
        classAsString: z.string(),
        extraNote: z.string().optional(),
      },
    },
    async ({ classAsString, extraNote }): Promise<GetPromptResult> => {
      extraNote = extraNote
        ? extraNote
        : "Use realistic data with Switzerland as expected country";
      return {
        messages: [
          {
            role: "user",
            content: {
              type: "text",
              text: `Generate 5 test examples in JSON array format for a given Java class. The tag classAsString contains the Java class definition and use only fields, keep the data type and substructure: 
              <classAsString>
              ${classAsString}
              </classAsString>
              
             <rules> 
              - ${extraNote}
              - Each example should be a valid JSON object matching the structure of the Java class.
              - Ensure that the data types in the JSON objects correspond to those defined in the Java class.
              - The output should be a JSON array containing 5 such objects.
              - Do not include any additional text or explanation, only the JSON array.
            </rules>
              `,
              mimeType: "application/json",
            },
          },
        ],
      };
    }
  );
}
