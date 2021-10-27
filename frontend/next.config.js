/*!
 * This file is part of the Stooa.
 *
 * (c) Stooa Team 2021
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

const nextTranslate = require('next-translate');

module.exports = nextTranslate({
  webpack: (config, { isServer, webpack }) => {
    config.module.rules.push({
      test: /\.svg$/,
      use: ['@svgr/webpack']
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
  }
});
