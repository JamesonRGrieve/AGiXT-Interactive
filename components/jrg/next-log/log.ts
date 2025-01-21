export default function log(
  logItem: string | object,
  clientVerbosity: number | undefined = 3,
  serverVerbosity: number | undefined = 3,
  heading: string | null = null,
) {
  // Server
  if (typeof window === 'undefined') {
    if (!isNaN(Number(process.env.LOG_VERBOSITY_SERVER)) && serverVerbosity !== undefined) {
      // If we are on server, the env var for server output is defined and there is a server verbosity level for this log.
      if (heading) console.log(`--- ${heading.toUpperCase()} ---`);
      console.log(logItem);
      if (heading) console.log('-'.repeat(heading.length + 8));
    }
  } else {
    // If we are on client, the env var for client output is defined and there is a client verbosity level for this log.
    if (!isNaN(Number(process.env.LOG_VERBOSITY_CLIENT)) && clientVerbosity !== undefined) {
      if (heading) console.log(`--- ${heading.toUpperCase()} ---`);
      console.log(logItem);
      if (heading) console.log('-'.repeat(heading.length + 8));
    }
  }
}
