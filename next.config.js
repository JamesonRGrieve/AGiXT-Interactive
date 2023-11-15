/** @type {import('next').NextConfig} */
const nextConfig = {
    env: {
        NEXT_PUBLIC_COOKIE_DOMAIN: `.${((process.env.NEXT_PUBLIC_APP_URI??"".split("://")[1])??"".split(":")[0]).split(".").reverse().slice(0, 2).reverse().join(".")}`
    }
}
const withBundleAnalyzer = require('@next/bundle-analyzer')({
    enabled: process.env.ANALYZE === 'true'
  });
module.exports = withBundleAnalyzer(nextConfig);
