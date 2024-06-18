const { useAGiXTConfig } = require('./config/Hooks.js');
const {
  mergeConfigs,
  useBasicConfig,
  useAuthConfig,
  useOAuth2Config,
  useProductionSkipLintingConfig,
  useCookiesConfig,
} = require('jrgcomponents/Config/Hooks');

// THIS FILE ONLY APPLIES TO RELEASES DONE USING THIS REPOSITORY AS A NEXTJS APP, IT DOES NOT APPLY WHEN THIS REPOSITORY IS USED AS A PACKAGE/COMPONENT.

configs = [useBasicConfig, useAuthConfig, useOAuth2Config, useCookiesConfig, useAGiXTConfig, useProductionSkipLintingConfig];

const nextConfig = configs.reduce((accumulator, config) => mergeConfigs(accumulator, config()), {});

console.log(nextConfig);
// eslint-disable-next-line @typescript-eslint/no-var-requires
const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: true,
});
module.exports = process.env.NEXT_ANALYZE === 'true' ? withBundleAnalyzer(nextConfig) : nextConfig;
