/** @type {import('next').NextConfig} */

const withPWA = require('next-pwa')({
  dest: 'public',
  register: true,
  skipWaiting: true,
  disable: process.env.NODE_ENV === 'development',
  buildExcludes: [/.*\.map$/],
})

const mergeConfigs = (obj1, obj2) =>
  Object.keys(obj2).reduce(
    (acc, key) => ({
      ...acc,
      [key]:
        typeof obj2[key] === 'object' && obj2[key] !== null && obj1[key] ? mergeConfigs(obj1[key], obj2[key]) : obj2[key],
    }),
    { ...obj1 },
  );

let APP_URI,
  AUTH_WEB,
  AGIXT_SERVER,
  ENV = (process.env.ENV || process.env.NODE_ENV || 'development').toLowerCase();

const useBasicConfig = () => ({
  env: {
    NEXT_PUBLIC_APP_NAME: process.env.APP_NAME || 'AGiXT',
    NEXT_PUBLIC_APP_DESCRIPTION: process.env.APP_DESCRIPTION || 'An AGiXT application.',
    APP_URI: (APP_URI = process.env.APP_URI || 'http://localhost:3051'),
    NEXT_PUBLIC_APP_URI: APP_URI,
    NEXT_PUBLIC_THEME_DEFAULT_MODE: process.env.DEFAULT_THEME_MODE || 'dark',
    NEXT_PUBLIC_TZ: process.env.TZ || 'America/New_York', // Server timezone
    NEXT_PUBLIC_ADSENSE_ACCOUNT: process.env.ADSENSE_ACCOUNT || '',
    NEXT_PUBLIC_ENV: ENV,
  },
});
const useProductionSkipLintingConfig = () => ({
  eslint: {
    // Warning: This allows production builds to successfully complete even if
    // your project has ESLint errors.
    ignoreDuringBuilds: ENV !== 'development',
  },
  typescript: {
    // Warning: Dangerously allow production builds to successfully complete even if your project has type errors.
    ignoreBuildErrors: ENV !== 'development',
  },
});
const useCookiesConfig = () => ({
  env: {
    NEXT_PUBLIC_COOKIE_DOMAIN: (() => {
      const domain = ((APP_URI ?? '').split('://')[1] ?? '').split(':')[0];
      const ipPattern = /^(?:\d{1,3}\.){3}\d{1,3}$/;
      return ipPattern.test(domain) ? domain : domain.split('.').reverse().slice(0, 2).reverse().join('.');
    })(),
  },
});
const useAuthConfig = () => ({
  env: {
    PRIVATE_ROUTES: process.env.PRIVATE_ROUTES || '/chat,/settings/',
    AUTH_WEB: (AUTH_WEB = process.env.AUTH_WEB || `${APP_URI}/user`),
    NEXT_PUBLIC_AUTH_WEB: AUTH_WEB,
    AGIXT_SERVER: (AGIXT_SERVER = process.env.AGIXT_SERVER || 'https://api.app.agixt.chat'),
    NEXT_PUBLIC_AGIXT_SERVER: AGIXT_SERVER,
    NEXT_PUBLIC_ALLOW_EMAIL_SIGN_IN: process.env.ALLOW_EMAIL_SIGN_IN || 'true',
  },
});

const useOAuth2Config = () => ({
  env: {
    NEXT_PUBLIC_AOL_CLIENT_ID: process.env.AOL_CLIENT_ID || '',
    NEXT_PUBLIC_AOL_SCOPES: process.env.AOL_SCOPES || '',
    NEXT_PUBLIC_AMAZON_CLIENT_ID: process.env.AMAZON_CLIENT_ID || '',
    NEXT_PUBLIC_AMAZON_SCOPES: process.env.AMAZON_SCOPES || '',
    NEXT_PUBLIC_APPLE_CLIENT_ID: process.env.APPLE_CLIENT_ID || '',
    NEXT_PUBLIC_APPLE_SCOPES: process.env.APPLE_SCOPES || '',
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
    NEXT_PUBLIC_GITHUB_SCOPES: process.env.GITHUB_SCOPES || 'repo user:email read:user workflow',
    NEXT_PUBLIC_GITLAB_CLIENT_ID: process.env.GITLAB_CLIENT_ID || '',
    NEXT_PUBLIC_GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID || '',
    NEXT_PUBLIC_GOOGLE_SCOPES:
      process.env.GOOGLE_SCOPES ||
      'https://www.googleapis.com/auth/userinfo.profile https://www.googleapis.com/auth/userinfo.email https://www.googleapis.com/auth/calendar.events.owned https://www.googleapis.com/auth/contacts.readonly https://www.googleapis.com/auth/gmail.modify',
    NEXT_PUBLIC_HUDDLE_CLIENT_ID: process.env.HUDDLE_CLIENT_ID || '',
    NEXT_PUBLIC_IMGUR_CLIENT_ID: process.env.IMGUR_CLIENT_ID || '',
    NEXT_PUBLIC_INSTAGRAM_CLIENT_ID: process.env.INSTAGRAM_CLIENT_ID || '',
    NEXT_PUBLIC_INTELCLOUDSERVICES_CLIENT_ID: process.env.INTELCLOUDSERVICES_CLIENT_ID || '',
    NEXT_PUBLIC_KEYCLOAK_CLIENT_ID: process.env.KEYCLOAK_CLIENT_ID || '',
    NEXT_PUBLIC_LINKEDIN_CLIENT_ID: process.env.LINKEDIN_CLIENT_ID || '',
    NEXT_PUBLIC_MICROSOFT_CLIENT_ID: process.env.MICROSOFT_CLIENT_ID || '',
    NEXT_PUBLIC_MICROSOFT_SCOPES:
      process.env.MICROSOFT_SCOPES || 'offline_access User.Read Mail.Send Calendars.ReadWrite Calendars.ReadWrite.Shared',
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
  },
});

const useStripeConfig = () => ({
  env: {
    NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY: process.env.STRIPE_PUBLISHABLE_KEY || '',
    NEXT_PUBLIC_STRIPE_PRICING_TABLE_ID: process.env.STRIPE_PRICING_TABLE_ID || '',
  },
});
const useAGiXTConfig = () => ({
  env: {
    NEXT_PUBLIC_AGIXT_API_KEY: process.env.AGIXT_API_KEY || '',
    NEXT_PUBLIC_AGIXT_CONVERSATION_NAME: process.env.AGIXT_CONVERSATION || '-',
    NEXT_PUBLIC_AGIXT_CONVERSATION_MODE: process.env.AGIXT_CONVERSATION_MODE || 'static', // static, select or uuid
    // UI Options
    NEXT_PUBLIC_INTERACTIVE_UI: process.env.INTERACTIVE_UI || 'chat',
    NEXT_PUBLIC_AGIXT_SHOW_APP_BAR: process.env.AGIXT_SHOW_APP_BAR || 'true',
    NEXT_PUBLIC_AGIXT_SHOW_SELECTION:
      process.env.AGIXT_SHOW_SELECTION || (process.env.AGIXT_CONVERSATION_MODE === 'select' ? 'conversation' : ''), // csv of: 'agent', 'conversation' and/or 'prompt'
    NEXT_PUBLIC_AGIXT_FOOTER_MESSAGE: process.env.AGIXT_FOOTER_MESSAGE || 'Powered by AGiXT',
    NEXT_PUBLIC_AGIXT_RLHF: process.env.AGIXT_RLHF || 'true',
    NEXT_PUBLIC_AGIXT_SHOW_CHAT_THEME_TOGGLES:
      process.env.AGIXT_SHOW_CHAT_THEME_TOGGLES || process.env.AGIXT_SHOW_APP_BAR === 'false' ? 'true' : 'false',
    NEXT_PUBLIC_AGIXT_FILE_UPLOAD_ENABLED: process.env.AGIXT_FILE_UPLOAD_ENABLED || 'true',
    NEXT_PUBLIC_AGIXT_VOICE_INPUT_ENABLED: process.env.AGIXT_VOICE_INPUT_ENABLED || 'true',
    NEXT_PUBLIC_AGIXT_ALLOW_MESSAGE_EDITING: process.env.AGIXT_ALLOW_MESSAGE_EDITING || 'true',
    NEXT_PUBLIC_AGIXT_ALLOW_MESSAGE_DELETION: process.env.AGIXT_ALLOW_MESSAGE_DELETION || 'true',
    NEXT_PUBLIC_AGIXT_SHOW_OVERRIDE_SWITCHES: process.env.AGIXT_SHOW_OVERRIDE_SWITCHES || 'tts,websearch',
    // Override Options
    NEXT_PUBLIC_AGIXT_ENABLE_SEARCHPARAM_CONFIG: process.env.AGIXT_ENABLE_SEARCHPARAM_CONFIG || 'true',
    NEXT_PUBLIC_AGIXT_MODE: process.env.AGIXT_MODE || 'prompt',
    // State Options
    NEXT_PUBLIC_AGIXT_AGENT: process.env.AGIXT_AGENT || 'AGiXT',
    NEXT_PUBLIC_AGIXT_INSIGHT_AGENT: process.env.AGIXT_INSIGHT_AGENT || '',
    NEXT_PUBLIC_AGIXT_USE_SELECTED_AGENT: process.env.AGIXT_USE_SELECTED_AGENT,
    // Prompt Mode Options
    NEXT_PUBLIC_AGIXT_PROMPT_NAME: process.env.AGIXT_PROMPT_NAME || 'Think About It',
    NEXT_PUBLIC_AGIXT_PROMPT_CATEGORY: process.env.AGIXT_PROMPT_CATEGORY || 'Default',
    // Command Mode Options
    NEXT_PUBLIC_AGIXT_COMMAND: process.env.AGIXT_COMMAND || '',
    NEXT_PUBLIC_AGIXT_COMMAND_MESSAGE_ARG: process.env.AGIXT_COMMAND_MESSAGE_ARG || 'message',
    // Chain Mode Options
    NEXT_PUBLIC_AGIXT_CHAIN: process.env.AGIXT_CHAIN || '',
    NEXT_PUBLIC_AGIXT_CHAIN_ARGS: process.env.AGIXT_CHAIN_ARGS || '{}',
  },
  images: AGIXT_SERVER && {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: AGIXT_SERVER.split('://')[1].split(':')[0].split('/')[0],
        port: '',
        pathname: '/outputs/**',
      },
    ],
  },
});
const configs = [
  useBasicConfig,
  useAuthConfig,
  useOAuth2Config,
  useCookiesConfig,
  useAGiXTConfig,
  useStripeConfig,
  useProductionSkipLintingConfig,
];
const nextConfig = configs.reduce((accumulator, config) => mergeConfigs(accumulator, config()), {
  env: {},
  experimental: {
    serverActions: {
      optimizeCss: true,
      allowedOrigins: ['*'],
      allowedForwardedHosts: ['*'],
      retryOnError: false, // or a number to set max retries
    },
  },
});
console.log(nextConfig);
// eslint-disable-next-line @typescript-eslint/no-var-requires
module.exports = withPWA(nextConfig);
