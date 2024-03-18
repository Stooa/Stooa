/*!
 * This file is part of the Stooa codebase.
 *
 * (c) 2020 - present Runroom SL
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

export default function handler(req, res) {
  let robotsString = 'User-agent: ';
  if (process.env.NEXT_PUBLIC_ENVIRONMENT === 'prod') {
    robotsString += '*\nAllow: /';
  } else {
    robotsString += '*\nDisallow: /';
  }

  if (process.env.NEXT_PUBLIC_WORLD_CAFE === 'false') {
    robotsString += '\nDisallow: /world-cafe/*';
  }

  res.send(robotsString);
}
