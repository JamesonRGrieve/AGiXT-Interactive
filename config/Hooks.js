const InteractiveConfigDefault = require('../types/AGiXTConfigContext');

exports.useAGiXTConfig = () => ({
  env: {
    NEXT_PUBLIC_AGIXT_SERVER: process.env.AGIXT_SERVER || process.env.AUTH_SERVER || 'http://localhost:7437',
    NEXT_PUBLIC_AGIXT_API_KEY: process.env.AGIXT_API_KEY || '',
  },
  images: process.env.AGIXT_SERVER && {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: process.env.AGIXT_SERVER.split('://')[1].split(':')[0].split('/')[0],
        port: '',
        pathname: '/outputs/**',
      },
    ],
  },
});
