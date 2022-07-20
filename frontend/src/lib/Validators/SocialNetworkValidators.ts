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

const getTwitterUsername = (url: string): string | null => {
  twitterValidator.lastIndex = 0;

  if (url.match(twitterValidator)) {
    return twitterValidator.exec(url)[1];
  }

  return null;
};

const getLinkedinUsername = (url: string): string | null => {
  linkedinValidator.lastIndex = 0;

  if (url.match(linkedinValidator)) {
    return linkedinValidator.exec(url)[2];
  }
  return null;
};

export { twitterValidator, linkedinValidator, getTwitterUsername, getLinkedinUsername };
