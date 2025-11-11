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

server.resource(
  "persons",
  "persons://all",
  {
    description: "Get all persons data from the database",
    title: "Persons",
    mimeType: "application/json",
  },
  async (uri) => {
    const persons = await import("./data/persons.json", {
      with: { type: "json" },
    }).then((m) => m.default);

    return {
      contents: [
        {
          uri: uri.href,
          text: JSON.stringify(persons),
          mimeType: "application/json",
        },
      ],
    };
  }
);

async function createPerson(user: {
  firstName: string;
  lastName: string;
  email: string;
  address: {
    streetName: string;
    houseNumber: string;
    city: string;
    state: string;
    zip: string;
    country: string;
  };
  phoneNumber: string;
}) {
  const users = await import("./data/persons.json", {
    with: { type: "json" },
  }).then((m) => m.default);

  const id = users.length + 1;

  users.push({ id, ...user });

  await fs.writeFile("./src/data/persons.json", JSON.stringify(users, null, 2));

  return id;
}

async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
}

main();
