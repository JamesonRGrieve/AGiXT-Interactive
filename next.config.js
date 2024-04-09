const ChatDefault = require('./types/ChatDefault');
// console.log('Chat Default at Env Initialization: ', ChatDefault);
// TODO: Add validation.
const nextConfig = {
  env: {
    // App Options
    NEXT_PUBLIC_APP_NAME: process.env.APP_NAME || 'AGiXT',
    NEXT_PUBLIC_APP_DESCRIPTION: process.env.APP_DESCRIPTION || 'An AGiXT application.',
    NEXT_PUBLIC_APP_URI: process.env.APP_URI ?? 'http://localhost:3100',
    NEXT_PUBLIC_THEME_DEFAULT_MODE: process.env.DEFAULT_THEME_MODE || 'dark',
    NEXT_PUBLIC_TZ: process.env.TZ || 'TZ-America/New_York', // Server timezone
    NEXT_PUBLIC_AUTH_WEB: process.env.AUTH_WEB || undefined, // undefined to disable auth.

    // Monetization Options
    NEXT_PUBLIC_ADSENSE_ACCOUNT: process.env.ADSENSE_ACCOUNT || '',

    // Common Options
    NEXT_PUBLIC_AGIXT_CONVERSATION_NAME: process.env.AGIXT_CONVERSATION || 'Default',
    NEXT_PUBLIC_AGIXT_CONVERSATION_MODE: process.env.AGIXT_CONVERSATION_MODE || 'static', // static, select or uuid
    NEXT_PUBLIC_AGIXT_CONVERSATION_NAME: process.env.AGIXT_CONVERSATION_NAME || 'Default',
    NEXT_PUBLIC_AGIXT_ENABLE_SEARCHPARAM_CONFIG: process.env.AGIXT_ENABLE_SEARCHPARAM_CONFIG || 'true',
    NEXT_PUBLIC_AGIXT_MODE: process.env.AGIXT_MODE || 'prompt',
    NEXT_PUBLIC_AGIXT_REQUIRE_API_KEY: process.env.AGIXT_REQUIRE_API_KEY || 'true',
    NEXT_PUBLIC_AGIXT_API_KEY: process.env.AGIXT_API_KEY || '',
    NEXT_PUBLIC_AGIXT_SERVER: process.env.AGIXT_SERVER || 'http://localhost:7437',
    NEXT_PUBLIC_INTERACTIVE_MODE: process.env.INTERACTIVE_MODE || 'chat',
    // UI Options
    NEXT_PUBLIC_INTERACTIVE_UI: process.env.INTERACTIVE_MODE || 'chat',
    NEXT_PUBLIC_AGIXT_SHOW_APP_BAR: process.env.AGIXT_SHOW_APP_BAR || 'true',
    NEXT_PUBLIC_AGIXT_SHOW_SELECTION: process.env.AGIXT_SHOW_SELECTION_BAR || '', // empty, 'agent', 'conversation' or 'prompt'
    NEXT_PUBLIC_AGIXT_FOOTER_MESSAGE: process.env.AGIXT_FOOTER_MESSAGE || 'Powered by AGiXT',
    NEXT_PUBLIC_AGIXT_RLHF: process.env.AGIXT_RLHF || 'false',
    NEXT_PUBLIC_AGIXT_SHOW_APP_BAR: process.env.AGIXT_SHOW_APP_BAR || 'true',
    NEXT_PUBLIC_AGIXT_SHOW_CHAT_THEME_TOGGLES: process.env.AGIXT_SHOW_CHAT_THEME_TOGGLES || 'false',
    NEXT_PUBLIC_AGIXT_SHOW_SELECTION_BAR: process.env.AGIXT_SHOW_SELECTION_BAR || '', // empty, 'agent', 'conversation' or 'prompt'
    NEXT_PUBLIC_TZ: process.env.TZ || 'TZ-America/New_York',
    // State Options, Defined in ./types/ChatDefault.js
    NEXT_PUBLIC_AGIXT_AGENT: process.env.AGIXT_AGENT || ChatDefault.chatSettings.selectedAgent,
    NEXT_PUBLIC_AGIXT_INSIGHT_AGENT: process.env.AGIXT_INSIGHT_AGENT || ChatDefault.chatSettings.insightAgentName,
    NEXT_PUBLIC_AGIXT_USE_SELECTED_AGENT:
      process.env.AGIXT_USE_SELECTED_AGENT || String(ChatDefault.chatSettings.chainRunConfig.useSelectedAgent),
    // Prompt Mode Options, Defined in ./types/ChatDefault.js
    NEXT_PUBLIC_AGIXT_PROMPT_NAME: process.env.AGIXT_PROMPT_NAME || ChatDefault.prompt,
    NEXT_PUBLIC_AGIXT_PROMPT_CATEGORY: process.env.AGIXT_PROMPT_CATEGORY || ChatDefault.promptCategory,
    // Command Mode Options, Defined in ./types/ChatDefault.js
    NEXT_PUBLIC_AGIXT_COMMAND: process.env.AGIXT_COMMAND || ChatDefault.command,
    NEXT_PUBLIC_AGIXT_COMMAND_MESSAGE_ARG: process.env.AGIXT_COMMAND_MESSAGE_ARG || ChatDefault.commandMessageArg,
    NEXT_PUBLIC_APP_AUTHENTICATION_ENABLED: process.env.APP_AUTHENTICATION_ENABLED || 'true',
    NEXT_PUBLIC_AUTH_WEB: process.env.AUTH_WEB || 'http://localhost:3001',

    NEXT_PUBLIC_AGIXT_USE_SELECTED_AGENT:
      process.env.AGIXT_USE_SELECTED_AGENT || String(ChatDefault.chatSettings.chainRunConfig.useSelectedAgent),
    NEXT_PUBLIC_AGIXT_CHAIN_ARGS:
      process.env.AGIXT_CHAIN_ARGS || JSON.stringify(ChatDefault.chatSettings.chainRunConfig.chainArgs),

    // Derived Options
    NEXT_PUBLIC_COOKIE_DOMAIN: `.${((process.env.APP_URI ?? 'http://localhost:3100').split('://')[1] ?? '')
      .split(':')[0]
      .split('.')
      .reverse()
      .slice(0, 2)
      .reverse()
      .join('.')}`,
  },
  eslint: {
    // Warning: This allows production builds to successfully complete even if
    // your project has ESLint errors.
    ignoreDuringBuilds: (process.env.MODE ?? 'production').toLowerCase() !== 'development',
  },
  typescript: {
    // Warning: Dangerously allow production builds to successfully complete even if your project has type errors.
    ignoreBuildErrors: (process.env.MODE ?? 'production').toLowerCase() !== 'development',
  },
};
// eslint-disable-next-line @typescript-eslint/no-var-requires
const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: true,
});
module.exports = process.env.NEXT_ANALYZE === 'true' ? withBundleAnalyzer(nextConfig) : nextConfig;
