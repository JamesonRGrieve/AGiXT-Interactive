export default function log(
  logItem: any,
  clientVerbosity: number | string | undefined,
  verbosity: number | string | undefined = 3,
  heading: string | null = null,
  serverOnly: boolean | null = null,
) {
  // Server
  clientVerbosity = Number(clientVerbosity ?? 3);
  verbosity = Number(verbosity ?? 3);
  if (serverOnly === true || serverOnly === null) {
    if (typeof window === 'undefined' && (process.env.LOG_VERBOSITY_SERVER ?? verbosity <= 0)) {
      if (heading !== null) {
        console.log(`--- ${heading.toUpperCase()} ---`);
      }
      console.log(logItem);
      if (heading !== null) {
        console.log('-'.repeat(heading.length + 8));
      }
    }
  }
  // Client
  if (serverOnly === false || serverOnly === null) {
    if (typeof window !== 'undefined' && clientVerbosity >= verbosity) {
      if (heading !== null) {
        console.log(`--- ${heading.toUpperCase()} ---`);
      }
      console.log(logItem);
      if (heading !== null) {
        console.log('-'.repeat(heading.length + 8));
      }
    }
  }
}
