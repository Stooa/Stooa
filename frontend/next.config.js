/*!
 * This file is part of the Stooa codebase.
 *
 * (c) 2020 - present Runroom SL
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

// eslint-disable-next-line @typescript-eslint/no-var-requires
const nextTranslate = require('next-translate');

let redirectConfig = [];

if (process.env.NEXT_PUBLIC_WORLD_CAFE === 'false') {
  redirectConfig.push({
    source: '/world-cafe/:path*',
    destination: '/',
    permanent: false
  });
}

module.exports = nextTranslate({
  compress: false,
  poweredByHeader: false,
  webpack: config => {
    config.module.rules.push({
      test: /\.svg$/i,
      issuer: /\.[jt]sx?$/,
      use: {
        loader: '@svgr/webpack',
        options: {
          svgoConfig: {
            plugins: [
              {
                name: 'removeViewBox',
                active: false
              }
            ]
          }
        }
      }
    });
    config.module.rules.push({
      test: /\.(mp3|wav)$/i,
      use: [
        {
          loader: 'file-loader'
        }
      ]
    });
    return config;
  },
  async rewrites() {
    return [
      {
        source: '/robots.txt',
        destination: '/api/robots'
      }
    ];
  },
  async redirects() {
    return redirectConfig;
  },
  compiler: {
    reactRemoveProperties: process.env.NODE_ENV === 'production',
    styledComponents: true
  },
  swcMinify: true
});
