export interface Person {
  id?: number;
  firstName?: string;
  lastName?: string;
  email?: string;
  phoneNumber?: string;
  address?: Address;
}

export interface Address {
  streetName?: string;
  houseNumber?: string;
  city?: string;
  zip?: string;
  state?: string;
  country?: string;
}

export async function anonymizeObject(data: any, example?: any): Promise<any> {
  const transformed: any = {};
  example = example || (await randomPerson());
  for (const key of Object.keys(data)) {
    if (typeof data[key] === "object" && data[key] !== null) {
      transformed[key] = await anonymizeObject(data[key]);
    } else {
      transformed[key] = anonymizeText(key, data[key], example);
    }
  }
  return transformed;
}

function anonymizeText(key: string, value: any, example?: any): string {
  return (example ? example[key] : undefined) ?? `**${value}**`;
}

async function randomPerson(): Promise<Person> {
  const users = await import("./data/persons.json", {
    with: { type: "json" },
  }).then((m) => m.default);
  const index = Math.floor(Math.random() * users.length);
  return users[index] as Person;
}
