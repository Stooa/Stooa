/*!
 * This file is part of the Stooa codebase.
 *
 * (c) 2020 - present Runroom SL
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

module.exports = {
  arrowParens: 'avoid',
  bracketSpacing: true,
  printWidth: 100,
  proseWrap: 'always',
  quoteProps: 'consistent',
  semi: true,
  singleQuote: true,
  tabWidth: 2,
  trailingComma: 'none',
  useTabs: false,
  overrides: [
    {
      files: ['*.scss', '*.css', '*.yaml', '*.yml', 'composer.json'],
      options: {
        singleQuote: false,
        tabWidth: 4
      }
    }
  ]
};
