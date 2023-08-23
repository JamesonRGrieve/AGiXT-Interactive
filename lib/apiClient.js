import AGiXTSDK from "agixt";

export const sdk = new AGiXTSDK({
  baseUri: process.env.NEXT_PUBLIC_API_URL || "http://localhost:7437",
  apiKey: process.env.NEXT_PUBLIC_API_KEY || "",
});
