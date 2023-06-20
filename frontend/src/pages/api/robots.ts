/*!
 * This file is part of the Stooa codebase.
 *
 * (c) 2020 - present Runroom SL
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

export default function handler(req, res) {
  if (process.env.NEXT_PUBLIC_ENVIRONMENT === 'prod') {
    res.send('User-agent: *\nAllow: /\n Disallor: /world-cafe/*');
  } else {
    res.send('User-agent: *\nDisallow: /');
  }
}
