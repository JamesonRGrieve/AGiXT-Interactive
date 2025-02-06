import { z } from 'zod';

declare module 'zod' {
  interface ZodObject<T> {
    toGQL(
      queryType?: 'query' | 'mutation' | 'subscription',
      operationName?: string,
      variables?: Record<string, any>,
    ): string;
    zodToGraphQL(depth?: number, maxDepth?: number): string;
  }
}

z.ZodObject.prototype.zodToGraphQL = function (depth = 0, maxDepth = 10): string {
  if (depth > maxDepth) return '';

  const indent = '  '.repeat(depth);
  let query = '';
  const shape = this._def.shape();

  for (const [key, value] of Object.entries(shape)) {
    if (value instanceof z.ZodObject) {
      query += `${indent}${key} {\n${value.zodToGraphQL(depth + 1, maxDepth)}${indent}}\n`;
    } else if (value instanceof z.ZodArray) {
      const elementType = value._def.type;
      if (elementType instanceof z.ZodObject) {
        query += `${indent}${key} {\n${elementType.zodToGraphQL(depth + 1, maxDepth)}${indent}}\n`;
      } else {
        query += `${indent}${key}\n`;
      }
    } else {
      query += `${indent}${key}\n`;
    }
  }

  return query;
};

z.ZodObject.prototype.toGQL = function (
  queryType: 'query' | 'mutation' | 'subscription' = 'query',
  operationName?: string,
  variables?: Record<string, any>,
): string {
  const operation = operationName ? ` ${operationName}` : '';

  // Format variables declaration
  const varsString = variables
    ? `(${Object.entries(variables)
        .map(([key]) => `$${key}: String!`)
        .join(', ')})`
    : '';

  // Format field arguments
  const fieldArgs = variables
    ? `(${Object.entries(variables)
        .map(([key]) => `${key}: $${key}`)
        .join(', ')})`
    : '';

  // Get operation field name
  const queryField =
    operationName?.replace(/^Get/, '').substring(0, 1).toLowerCase() + operationName?.replace(/^Get/, '').slice(1);
  const fields = this.zodToGraphQL(2);

  return `${queryType}${operation}${varsString} {\n  ${queryField}${fieldArgs} {\n${fields}  }\n}`;
};
