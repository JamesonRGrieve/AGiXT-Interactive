const InteractiveConfigDefault = require('./types/InteractiveConfigDefault');
// THIS FILE ONLY APPLIES TO RELEASES DONE USING THIS REPOSITORY AS A NEXTJS APP, IT DOES NOT APPLY WHEN THIS REPOSITORY IS USED AS A PACKAGE/COMPONENT.
// TODO: Add validation.
console.log('In Next Config', InteractiveConfigDefault);
const nextConfig = {
  env: {
    // App Options
    NEXT_PUBLIC_APP_NAME: process.env.APP_NAME || 'AGiXT',
    NEXT_PUBLIC_APP_DESCRIPTION: process.env.APP_DESCRIPTION || 'An AGiXT application.',
    NEXT_PUBLIC_APP_URI: process.env.APP_URI ?? 'http://localhost:3100',
    NEXT_PUBLIC_THEME_DEFAULT_MODE: process.env.DEFAULT_THEME_MODE || 'dark',
    NEXT_PUBLIC_TZ: process.env.TZ || 'TZ-Etc/GMT', // Server timezone
    NEXT_PUBLIC_AUTH_WEB: process.env.AUTH_WEB || '',
    NEXT_PUBLIC_AUTH_SERVER: process.env.AUTH_SERVER || process.env.AGIXT_SERVER || '',
    // Monetization Options
    NEXT_PUBLIC_ADSENSE_ACCOUNT: process.env.ADSENSE_ACCOUNT || '',

    // Common Options
    NEXT_PUBLIC_AGIXT_CONVERSATION_NAME: process.env.AGIXT_CONVERSATION || 'Default',
    NEXT_PUBLIC_AGIXT_CONVERSATION_MODE: process.env.AGIXT_CONVERSATION_MODE || 'static', // static, select or uuid
    NEXT_PUBLIC_AGIXT_API_KEY: process.env.AGIXT_API_KEY || '',
    NEXT_PUBLIC_AGIXT_SERVER: process.env.AGIXT_SERVER || 'http://localhost:7437',

    // UI Options
    NEXT_PUBLIC_INTERACTIVE_UI: process.env.INTERACTIVE_UI || 'chat',
    NEXT_PUBLIC_AGIXT_SHOW_APP_BAR: process.env.AGIXT_SHOW_APP_BAR || 'true',
    NEXT_PUBLIC_AGIXT_SHOW_SELECTION:
      process.env.AGIXT_SHOW_SELECTION || (process.env.AGIXT_CONVERSATION_MODE === 'select' ? 'conversation' : ''), // csv of: 'agent', 'conversation' and/or 'prompt'
    NEXT_PUBLIC_AGIXT_FOOTER_MESSAGE: process.env.AGIXT_FOOTER_MESSAGE || 'Powered by AGiXT',
    NEXT_PUBLIC_AGIXT_RLHF: process.env.AGIXT_RLHF || 'false',
    NEXT_PUBLIC_AGIXT_SHOW_CHAT_THEME_TOGGLES:
      process.env.AGIXT_SHOW_CHAT_THEME_TOGGLES || process.env.AGIXT_SHOW_APP_BAR === 'false' ? 'true' : 'false',
    NEXT_PUBLIC_AGIXT_FILE_UPLOAD_ENABLED:
      process.env.AGIXT_FILE_UPLOAD_ENABLED || String(InteractiveConfigDefault.overrides.enableFileUpload),
    NEXT_PUBLIC_AGIXT_VOICE_INPUT_ENABLED:
      process.env.AGIXT_VOICE_INPUT_ENABLED || String(InteractiveConfigDefault.overrides.enableVoiceInput),

    // Override Options
    NEXT_PUBLIC_AGIXT_ENABLE_SEARCHPARAM_CONFIG: process.env.AGIXT_ENABLE_SEARCHPARAM_CONFIG || 'true',
    NEXT_PUBLIC_AGIXT_MODE: process.env.AGIXT_MODE || InteractiveConfigDefault.overrides.mode,
    // State Options, Defined in ./types/InteractiveConfigDefault.js
    NEXT_PUBLIC_AGIXT_AGENT: process.env.AGIXT_AGENT || InteractiveConfigDefault.agent,
    NEXT_PUBLIC_AGIXT_INSIGHT_AGENT: process.env.AGIXT_INSIGHT_AGENT || InteractiveConfigDefault.overrides.insightAgentName,
    NEXT_PUBLIC_AGIXT_USE_SELECTED_AGENT:
      process.env.AGIXT_USE_SELECTED_AGENT || String(InteractiveConfigDefault.overrides.chainRunConfig.useSelectedAgent),
    // Prompt Mode Options, Defined in ./types/InteractiveConfigDefault.js
    NEXT_PUBLIC_AGIXT_PROMPT_NAME: process.env.AGIXT_PROMPT_NAME || InteractiveConfigDefault.overrides.prompt,
    NEXT_PUBLIC_AGIXT_PROMPT_CATEGORY:
      process.env.AGIXT_PROMPT_CATEGORY || InteractiveConfigDefault.overrides.promptCategory,
    // Command Mode Options, Defined in ./types/InteractiveConfigDefault.js
    NEXT_PUBLIC_AGIXT_COMMAND: process.env.AGIXT_COMMAND || InteractiveConfigDefault.overrides.command,
    NEXT_PUBLIC_AGIXT_COMMAND_MESSAGE_ARG:
      process.env.AGIXT_COMMAND_MESSAGE_ARG || InteractiveConfigDefault.overrides.commandMessageArg,
    // Chain Mode Options, Defined in ./types/InteractiveConfigDefault.js
    NEXT_PUBLIC_AGIXT_CHAIN: process.env.AGIXT_CHAIN || InteractiveConfigDefault.overrides.chain,
    NEXT_PUBLIC_AGIXT_CHAIN_ARGS:
      process.env.AGIXT_CHAIN_ARGS || JSON.stringify(InteractiveConfigDefault.overrides.chainRunConfig.chainArgs),
    NEXT_PUBLIC_ENV: process.env.ENV || process.env.NODE_ENV || 'development',

    NEXT_PUBLIC_ALLOW_EMAIL_SIGN_IN: process.env.ALLOW_EMAIL_SIGN_IN || 'true',

    NEXT_PUBLIC_AOL_CLIENT_ID: process.env.AOL_CLIENT_ID || '',
    NEXT_PUBLIC_AMAZON_CLIENT_ID: process.env.AMAZON_CLIENT_ID || '',
    NEXT_PUBLIC_APPLE_CLIENT_ID: process.env.APPLE_CLIENT_ID || '',
    NEXT_PUBLIC_BASECAMP_CLIENT_ID: process.env.BASECAMP_CLIENT_ID || '',
    NEXT_PUBLIC_BATTLE_NET_CLIENT_ID: process.env.BATTLE_NET_CLIENT_ID || '',
    NEXT_PUBLIC_BITLY_CLIENT_ID: process.env.BITLY_CLIENT_ID || '',
    NEXT_PUBLIC_BOX_CLIENT_ID: process.env.BOX_CLIENT_ID || '',
    NEXT_PUBLIC_CLEARSCORE_CLIENT_ID: process.env.CLEARSCORE_CLIENT_ID || '',
    NEXT_PUBLIC_CLOUDFOUNDRY_CLIENT_ID: process.env.CLOUDFOUNDRY_CLIENT_ID || '',
    NEXT_PUBLIC_DAILYMOTION_CLIENT_ID: process.env.DAILYMOTION_CLIENT_ID || '',
    NEXT_PUBLIC_DEUTSCHETELEKOM_CLIENT_ID: process.env.DEUTSCHETELEKOM_CLIENT_ID || '',
    NEXT_PUBLIC_DEVIANTART_CLIENT_ID: process.env.DEVIANTART_CLIENT_ID || '',
    NEXT_PUBLIC_DISCORD_CLIENT_ID: process.env.DISCORD_CLIENT_ID || '',
    NEXT_PUBLIC_FACEBOOK_CLIENT_ID: process.env.FACEBOOK_CLIENT_ID || '',
    NEXT_PUBLIC_FITBIT_CLIENT_ID: process.env.FITBIT_CLIENT_ID || '',
    NEXT_PUBLIC_FORMSTACK_CLIENT_ID: process.env.FORMSTACK_CLIENT_ID || '',
    NEXT_PUBLIC_FOURSQUARE_CLIENT_ID: process.env.FOURSQUARE_CLIENT_ID || '',
    NEXT_PUBLIC_GITHUB_CLIENT_ID: process.env.GITHUB_CLIENT_ID || '',
    NEXT_PUBLIC_GITLAB_CLIENT_ID: process.env.GITLAB_CLIENT_ID || '',
    NEXT_PUBLIC_GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID || '',
    NEXT_PUBLIC_HUDDLE_CLIENT_ID: process.env.HUDDLE_CLIENT_ID || '',
    NEXT_PUBLIC_IMGUR_CLIENT_ID: process.env.IMGUR_CLIENT_ID || '',
    NEXT_PUBLIC_INSTAGRAM_CLIENT_ID: process.env.INSTAGRAM_CLIENT_ID || '',
    NEXT_PUBLIC_INTELCLOUDSERVICES_CLIENT_ID: process.env.INTELCLOUDSERVICES_CLIENT_ID || '',
    NEXT_PUBLIC_KEYCLOAK_CLIENT_ID: process.env.KEYCLOAK_CLIENT_ID || '',
    NEXT_PUBLIC_LINKEDIN_CLIENT_ID: process.env.LINKEDIN_CLIENT_ID || '',
    NEXT_PUBLIC_MICROSOFT_CLIENT_ID: process.env.MICROSOFT_CLIENT_ID || '',
    NEXT_PUBLIC_OPENAM_CLIENT_ID: process.env.OPENAM_CLIENT_ID || '',
    NEXT_PUBLIC_ORCID_CLIENT_ID: process.env.ORCID_CLIENT_ID || '',
    NEXT_PUBLIC_PAYPAL_CLIENT_ID: process.env.PAYPAL_CLIENT_ID || '',
    NEXT_PUBLIC_PINGIDENTITY_CLIENT_ID: process.env.PINGIDENTITY_CLIENT_ID || '',
    NEXT_PUBLIC_PIXIV_CLIENT_ID: process.env.PIXIV_CLIENT_ID || '',
    NEXT_PUBLIC_REDDIT_CLIENT_ID: process.env.REDDIT_CLIENT_ID || '',
    NEXT_PUBLIC_SINAWEIBO_CLIENT_ID: process.env.SINAWEIBO_CLIENT_ID || '',
    NEXT_PUBLIC_SLACK_CLIENT_ID: process.env.SLACK_CLIENT_ID || '',
    NEXT_PUBLIC_SPOTIFY_CLIENT_ID: process.env.SPOTIFY_CLIENT_ID || '',
    NEXT_PUBLIC_STACKEXCHANGE_CLIENT_ID: process.env.STACKEXCHANGE_CLIENT_ID || '',
    NEXT_PUBLIC_STEAM_CLIENT_ID: process.env.STEAM_CLIENT_ID || '',
    NEXT_PUBLIC_STRAVA_CLIENT_ID: process.env.STRAVA_CLIENT_ID || '',
    NEXT_PUBLIC_STRIPE_CLIENT_ID: process.env.STRIPE_CLIENT_ID || '',
    NEXT_PUBLIC_TWITCH_CLIENT_ID: process.env.TWITCH_CLIENT_ID || '',
    NEXT_PUBLIC_VIADEO_CLIENT_ID: process.env.VIADEO_CLIENT_ID || '',
    NEXT_PUBLIC_VIMEO_CLIENT_ID: process.env.VIMEO_CLIENT_ID || '',
    NEXT_PUBLIC_VK_CLIENT_ID: process.env.VK_CLIENT_ID || '',
    NEXT_PUBLIC_WECHAT_CLIENT_ID: process.env.WECHAT_CLIENT_ID || '',
    NEXT_PUBLIC_YELP_CLIENT_ID: process.env.YELP_CLIENT_ID || '',
    NEXT_PUBLIC_ZENDESK_CLIENT_ID: process.env.ZENDESK_CLIENT_ID || '',
    NEXT_PUBLIC_WITHINGS_CLIENT_ID: process.env.WITHINGS_CLIENT_ID || '',
    NEXT_PUBLIC_X_CLIENT_ID: process.env.X_CLIENT_ID || '',
    NEXT_PUBLIC_XING_CLIENT_ID: process.env.XING_CLIENT_ID || '',
    NEXT_PUBLIC_YAMMER_CLIENT_ID: process.env.YAMMER_CLIENT_ID || '',
    NEXT_PUBLIC_YANDEX_CLIENT_ID: process.env.YANDEX_CLIENT_ID || '',

    // Derived Options
    NEXT_PUBLIC_COOKIE_DOMAIN: (() => {
      const domain = ((process.env.APP_URI ?? process.env.NEXT_PUBLIC_APP_URI ?? '').split('://')[1] ?? '').split(':')[0];
      const ipPattern = /^(?:[0-9]{1,3}\.){3}[0-9]{1,3}$/;
      return ipPattern.test(domain) ? domain : domain.split('.').reverse().slice(0, 2).reverse().join('.');
    })(),
  },
  eslint: {
    // Warning: This allows production builds to successfully complete even if
    // your project has ESLint errors.
    ignoreDuringBuilds: (process.env.ENV || process.env.NODE_ENV || 'production').toLowerCase() !== 'development',
  },
  typescript: {
    // Warning: Dangerously allow production builds to successfully complete even if your project has type errors.
    ignoreBuildErrors: (process.env.ENV || process.env.NODE_ENV || 'production').toLowerCase() !== 'development',
  },
};
// eslint-disable-next-line @typescript-eslint/no-var-requires
const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: true,
});
module.exports = process.env.NEXT_ANALYZE === 'true' ? withBundleAnalyzer(nextConfig) : nextConfig;
