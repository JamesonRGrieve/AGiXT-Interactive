/** @type {import('next').NextConfig} */
const nextConfig = {
    env: {
        NEXT_PUBLIC_COOKIE_DOMAIN: `.${(process.env.NEXT_PUBLIC_APP_URI??"".split("://")[1])??"".split(":")[0]}`
    }
}

module.exports = nextConfig
