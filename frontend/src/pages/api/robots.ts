/*!
 * This file is part of the Stooa codebase.
 *
 * (c) 2020 - present Runroom SL
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

export default function handler(req, res) {
  console.log('SAURAAA', process.env.ROBOTS_INDEXING);
  if (process.env.ROBOTS_INDEXING === 'true') {
    res.send('User-agent: *\nAllow: /');
  } else {
    res.send('User-agent: *\nDisallow: /');
  }
}
