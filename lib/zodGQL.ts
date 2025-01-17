import { z } from 'zod';

// Extend the ZodObject type to include our new methods
declare module 'zod' {
  interface ZodObject<T> {
    toGQL(queryType?: 'query' | 'mutation' | 'subscription', operationName?: string): string;
    zodToGraphQL(depth?: number, maxDepth?: number): string;
  }
}

// Add the methods to ZodObject's prototype
z.ZodObject.prototype.zodToGraphQL = function (depth = 0, maxDepth = 10): string {
  if (depth > maxDepth) {
    return '';
  }

  const indent = '  '.repeat(depth);
  let query = '';
  const shape = this.shape;

  for (const [key, value] of Object.entries(shape)) {
    if (value instanceof z.ZodObject) {
      query += `${indent}${key} {\n`;
      query += value.zodToGraphQL(depth + 1, maxDepth);
      query += `${indent}}\n`;
    } else if (value instanceof z.ZodArray) {
      query += `${indent}${key} {\n`;
      const elementType = value._def.type;
      if (elementType instanceof z.ZodObject) {
        query += elementType.zodToGraphQL(depth + 1, maxDepth);
      }
      query += `${indent}}\n`;
    } else if (value instanceof z.ZodString || value instanceof z.ZodNumber || value instanceof z.ZodBoolean) {
      query += `${indent}${key}\n`;
    }
  }

  return query;
};

z.ZodObject.prototype.toGQL = function (
  queryType: 'query' | 'mutation' | 'subscription' = 'query',
  operationName?: string,
): string {
  const fields = this.zodToGraphQL(1);
  const operation = operationName ? ` ${operationName}` : '';

  return `${queryType}${operation} {\n${fields}}`;
};
