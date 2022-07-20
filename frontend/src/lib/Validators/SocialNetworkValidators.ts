/*!
 * This file is part of the Stooa codebase.
 *
 * (c) 2020 - present Runroom SL
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

const twitterValidator = /^https?:\/\/(?:www\.)?twitter\.com\/(?:#!\/)?@?([^/?#]*)(?:[?#].*)?$/gm;

const linkedinValidator =
  /^(?:http(s)?:\/\/)?(?:[\w]+\.)?linkedin\.com\/(?:pub|in|profile|company)?(?:\/*)([\w\-\.]*)/gm;

export { twitterValidator, linkedinValidator };
