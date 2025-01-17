import { z } from 'zod';

export function zodToGraphQL(schema: z.ZodObject<any>, depth = 0, maxDepth = 10): string {
  if (depth > maxDepth) {
    return ''; // Prevent infinite recursion
  }

  const indent = '  '.repeat(depth);
  let query = '';

  const shape = schema.shape;

  for (const [key, value] of Object.entries(shape)) {
    // Handle different Zod types
    if (value instanceof z.ZodObject) {
      query += `${indent}${key} {\n`;
      query += zodToGraphQL(value, depth + 1, maxDepth);
      query += `${indent}}\n`;
    } else if (value instanceof z.ZodArray) {
      query += `${indent}${key} {\n`;
      const elementType = value._def.type;
      if (elementType instanceof z.ZodObject) {
        query += zodToGraphQL(elementType, depth + 1, maxDepth);
      }
      query += `${indent}}\n`;
    } else if (value instanceof z.ZodString || value instanceof z.ZodNumber || value instanceof z.ZodBoolean) {
      query += `${indent}${key}\n`;
    }
  }

  return query;
}

export function createGraphQLQuery(
  schema: z.ZodObject<any>,
  queryType: 'query' | 'mutation' | 'subscription' = 'query',
  operationName?: string,
): string {
  const fields = zodToGraphQL(schema, 1);
  const operation = operationName ? ` ${operationName}` : '';

  return `${queryType}${operation} {\n${fields}}`;
}
