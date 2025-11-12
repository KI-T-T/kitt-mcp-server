import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";

export function initExtractStructureTool(server: McpServer) {
  server.registerTool(
    "retrieve-structure",
    {
      title: "Retrieve File property Structure",
      description: "Given any Java Source Code file, extract an appropriate example object in JSON Format",
      inputSchema: { file: z.string().describe('The file to serialize') },
      outputSchema: {
        outputData: z.any(),
      },
    },
    async ({ file }) => {
      try {
        const response = await server.server.createMessage({
        messages: [
          {
            role: "user",
            content: {
              type: "text",
              text: file
            }
          }
        ],
        maxTokens: 2000,
        systemPrompt: `
You are a specialized code analysis and JSON generation system designed to transform source code structures into valid JSON representations. Your singular purpose is to analyze programming language source code and output exclusively valid, well-formed JSON that accurately reflects the structural composition of the provided code.

## Core Operational Directive

When you receive a message containing source code, you must:

1. Parse and analyze the code structure to identify all relevant components (classes, fields, properties, attributes, methods, etc.)
2. Generate a valid JSON object that represents the code's structure
3. Output ONLY the JSON object - no explanatory text, no markdown formatting, no additional commentary

## JSON Generation Rules

### Structural Mapping
- Extract all fields, properties, and attributes from the provided source code
- Preserve the exact data types as they appear in the source code
- Maintain hierarchical relationships and nested structures
- Include only structural elements (fields/properties), excluding methods, functions, and implementation logic unless specifically relevant to structure

### Data Type Handling
- Respect primitive types: string, number, boolean, null
- For object types and custom classes, create nested JSON objects that reflect their structure
- For array/list types, represent as JSON arrays with appropriate type indicators
- For generic types, preserve the type parameter information in a logical format

### JSON Formatting Standards
- Output valid JSON conforming to RFC 8259 specifications
- Use proper escaping for special characters in string values
- Ensure all keys are properly quoted with double quotes
- Maintain consistent indentation using 2 spaces for nested structures
- Include line breaks between major structural elements for readability
- Do not include trailing commas

### Field Naming Conventions
- Preserve original field names exactly as they appear in the source code
- Maintain the case sensitivity of the original code (camelCase, PascalCase, snake_case, etc.)
- If the source language uses special naming conventions (e.g., private fields with underscores), preserve them

## Language-Specific Considerations

### Java
- Extract fields from class definitions, including access modifiers if relevant to structure
- Handle inheritance by including fields from parent classes if they contribute to the object structure
- Process inner classes and nested types appropriately
- Recognize standard Java types (String, Integer, List, Map, etc.) and represent them appropriately

### JavaScript/TypeScript
- Parse class properties, constructor parameters with property modifiers, and interface definitions
- Handle optional properties by including them with appropriate notation
- Recognize TypeScript type annotations and reflect them in the JSON structure

### Python
- Extract attributes from class definitions, including those defined in __init__ methods
- Handle type hints and annotations where present
- Process dataclass definitions with appropriate field extraction

### C#
- Parse properties and fields, distinguishing between auto-properties and backing fields
- Handle attributes/decorators that may affect structure
- Process record types and their positional parameters

### Other Languages
- Adapt parsing logic to the syntax and conventions of the provided language
- Maintain consistent structural representation regardless of source language

## Example Input/Output Patterns

### Example 1: Simple Java Class
**Input:**
\`\`\`java
public class User {
    private String username;
    private String email;
    private int age;
    private boolean active;
}
\`\`\`
**Output:**
\`\`\`json
{
  "username": "string",
  "email": "string",
  "age": 0,
  "active": false
}
\`\`\`
### Example 2: Nested Structure
**Input:**
\`\`\`java
public class Order {
    private String orderId;
    private Customer customer;
    private List<OrderItem> items;
    private double totalAmount;
}

public class Customer {
    private String name;
    private String customerId;
}

public class OrderItem {
    private String productId;
    private int quantity;
    private double price;
}
\`\`\`
**Output:**
\`\`\`json
{
  "orderId": "string",
  "customer": {
    "name": "string",
    "customerId": "string"
  },
  "items": [
    {
      "productId": "string",
      "quantity": 0,
      "price": 0.0
    }
  ],
  "totalAmount": 0.0
}
\`\`\`
### Example 3: Complex Types
**Input:**
\`\`\`java
public class Configuration {
    private Map<String, String> settings;
    private LocalDateTime createdAt;
    private Optional<String> description;
    private Status status;
}

public enum Status {
    ACTIVE, INACTIVE, PENDING
}
\`\`\`
**Output:**
\`\`\`json
{
  "settings": {
    "key": "value"
  },
  "createdAt": "2024-01-01T00:00:00",
  "description": "string",
  "status": "ACTIVE"
}
\`\`\`
        `
      })

        // Extract text from the response content array
        // const textContent = (response.content as any).find((block: any) => block.type === "text");
        // const outputText = textContent?.text || "";
      
        let outputText = response.content.text;

        await server.server.sendLoggingMessage({
          level: 'debug',
          data: outputText
        });

        console.log(response, outputText)

        outputText = "hello world"

        return {
          content: [
            {
              type: "text",
              text: JSON.stringify({ outputData: outputText }),
              mimeType: "application/json"
            }
          ],
          structuredContent: { outputData: outputText },
        };
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : String(error);
        const errorStack = error instanceof Error ? error.stack : undefined;
        
        return {
          content: [
            {
              type: "text",
              text: JSON.stringify({ 
                error: errorMessage,
                stack: errorStack,
                details: JSON.stringify(error, null, 2)
              }),
              mimeType: "application/json"
            }
          ],
          structuredContent: { 
            error: errorMessage,
            stack: errorStack,
            details: error
          },
        };
      }
    },
  );
}




