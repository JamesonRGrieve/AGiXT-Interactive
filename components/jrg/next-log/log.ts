export default function log(
  logItems: any[],
  verbosity: {
    client?: number | undefined;
    server?: number | undefined;
  } = {
    client: 3,
    server: 3,
  },
  heading: string | null = null,
) {
  if (!verbosity) {
    throw new Error('Verbosity must be defined as at least an empty object or left to default, logItem: ' + logItem);
  }
  // Server
  if (typeof window === 'undefined') {
    if (!isNaN(Number(process.env.LOG_VERBOSITY_SERVER)) && verbosity.server !== undefined) {
      // If we are on server, the env var for server output is defined and there is a server verbosity level for this log.
      if (heading) console.log(`--- ${heading.toUpperCase()} ---`);
      console.log(...logItems);
      if (heading) console.log('-'.repeat(heading.length + 8));
    }
  } else {
    // If we are on client, the env var for client output is defined and there is a client verbosity level for this log.
    if (!isNaN(Number(process.env.NEXT_PUBLIC_LOG_VERBOSITY_CLIENT)) && verbosity.client !== undefined) {
      if (heading) console.log(`--- ${heading.toUpperCase()} ---`);
      console.log(...logItems);
      if (heading) console.log('-'.repeat(heading.length + 8));
    }
  }
}
