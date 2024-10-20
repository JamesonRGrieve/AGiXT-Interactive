/** @type {import('next').NextConfig} */
const { useAGiXTConfig } = require('@agixt/interactive/Config/Hooks');
const {
	mergeConfigs,
	useBasicConfig,
	useAuthConfig,
	useProductionSkipLintingConfig,
	useCookiesConfig,
} = require('jrgcomponents/Config/Hooks');
const configs = [useBasicConfig, useAuthConfig, useCookiesConfig, useAGiXTConfig, useProductionSkipLintingConfig];

const nextConfig = configs.reduce((accumulator, config) => mergeConfigs(accumulator, config()), {
	env: {},
	experimental: {
		serverActions: {
			allowedOrigins: ['*'],
			allowedForwardedHosts: ['*'],
			retryOnError: false, // or a number to set max retries
		},
	},
});

// eslint-disable-next-line @typescript-eslint/no-var-requires
const withBundleAnalyzer = require('@next/bundle-analyzer')({
	enabled: true,
});
module.exports = process.env.NEXT_ANALYZE === 'true' ? withBundleAnalyzer(nextConfig) : nextConfig;
