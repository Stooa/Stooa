/*!
 * This file is part of the Stooa codebase.
 *
 * (c) 2020 - present Runroom SL
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

const DEFAULT_LOCALE = 'en';

module.exports = {
  "locales": ["en", "ca", "es"],
  "defaultLocale": DEFAULT_LOCALE,
  "pages": {
    "*": ["common"],
    "/": ["home"],
    "/_error": ["_error", "home"],
    "/404": ["_error", "home"],
    "/cookies-policy": ["legals"],
    "/privacy-policy": ["legals"],
    "/change-password": ["change-password", "password", "form"],
    "/reset-password/[token]": ["form", "password"],
    "/edit-profile": ["form", "edit-profile", "register", "password"],
    "/log-in": ["form", "login"],
    "/recover-password": ["form", "recover"],
    "/register": ["form", "register"],
    "/fb/[fid]": ["fishbowl", "app", "form", "on-boarding"],
    "/fishbowl/create": ["fishbowl", "form"],
    "/fishbowl/detail/[fid]": ["fishbowl", "form"],
    "/fishbowl/thankyou/[fid]": ["fishbowl", "form", "home"]
  },
  "loadLocaleFrom": async (lang, ns) => {
    const locales = await import(`./locales/${lang}/${ns}.json`).then((m) => m.default);
    const defaultLocales = await import(`./locales/${DEFAULT_LOCALE}/${ns}.json`).then((m) => m.default);
    return { ...defaultLocales, ...locales };
  }
};
