/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    // Options
    NEXT_PUBLIC_AGIXT_SERVER: process.env.AGIXT_SERVER || 'http://localhost:7437',
    NEXT_PUBLIC_AGIXT_AGENT: process.env.AGIXT_AGENT || 'gpt4free',
    NEXT_PUBLIC_AGIXT_INSIGHT_AGENT: process.env.AGIXT_INSIGHT_AGENT || 'gpt4free',
    NEXT_PUBLIC_AGIXT_MODE: process.env.AGIXT_MODE || 'prompt',
    // Prompt Mode Options
    NEXT_PUBLIC_AGIXT_PROMPT_NAME: process.env.AGIXT_PROMPT_NAME || 'Chat',
    NEXT_PUBLIC_AGIXT_PROMPT_CATEGORY: process.env.AGIXT_PROMPT_CATEGORY || 'Default',
    // Chain Mode Options
    NEXT_PUBLIC_AGIXT_CHAIN: process.env.AGIXT_CHAIN || 'Postgres Chat',
    NEXT_PUBLIC_AGIXT_USE_SELECTED_AGENT: process.env.AGIXT_USE_SELECTED_AGENT || 'true',
    NEXT_PUBLIC_AGIXT_CHAIN_ARGS: process.env.AGIXT_CHAIN_ARGS || '{}',
    // UI Options
    NEXT_PUBLIC_AGIXT_FILE_UPLOAD_ENABLED: process.env.AGIXT_FILE_UPLOAD_ENABLED || 'false',
    NEXT_PUBLIC_AGIXT_SHOW_CONVERSATION_BAR: process.env.AGIXT_SHOW_CONVERSATION_BAR || 'true',
    NEXT_PUBLIC_AGIXT_SHOW_APP_BAR: process.env.AGIXT_SHOW_APP_BAR || 'true',
    NEXT_PUBLIC_AGIXT_FOOTER_MESSAGE: process.env.AGIXT_FOOTER_MESSAGE || 'prompt',
    NEXT_PUBLIC_AGIXT_CONVERSATION_NAME: process.env.AGIXT_CONVERSATION_NAME || 'AGiXT Conversation',
    NEXT_PUBLIC_APP_URI: process.env.APP_URI ?? 'http://localhost:3100',
    NEXT_PUBLIC_AGIXT_REQUIRE_API_KEY: process.env.AGIXT_REQUIRE_API_KEY || 'true',
    NEXT_PUBLIC_ADSENSE_ACCOUNT: process.env.ADSENSE_ACCOUNT || '',
    NEXT_PUBLIC_AGIXT_RLHF: process.env.AGIXT_RLHF || 'false',
    NEXT_PUBLIC_APP_NAME: process.env.APP_NAME || 'AGiXT',
    NEXT_PUBLIC_APP_DESCRIPTION: process.env.APP_DESCRIPTION || 'An AGiXT application.',
    NEXT_PUBLIC_COOKIE_DOMAIN: `.${((process.env.APP_URI ?? 'http://localhost:3100').split('://')[1] ?? '')
      .split(':')[0]
      .split('.')
      .reverse()
      .slice(0, 2)
      .reverse()
      .join('.')}`
  }
};
// eslint-disable-next-line @typescript-eslint/no-var-requires
const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: true
});
module.exports = process.env.NEXT_ANALYZE === 'true' ? withBundleAnalyzer(nextConfig) : nextConfig;
