/*!
 * This file is part of the Stooa codebase.
 *
 * (c) 2020 - present Runroom SL
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

module.exports = {
  roots: ['<rootDir>'],
  moduleDirectories: ['node_modules', '<rootDir>'],
  // Automatically clear mock calls and instances between every test
  clearMocks: true,
  // The directory where Jest should output its coverage files
  coverageDirectory: '.coverage',
  collectCoverageFrom: [
    '**/*.{js,jsx,ts,tsx}',
    '!**/.coverage/**',
    '!**/.next/**',
    '!**/coverage/**',
    '!**/node_modules/**',
    '!**/public/vendor/**',
    '!**/tests/**',
    '!**/{jest,next,prettier}.config.js'
  ],
  moduleNameMapper: {
    '\\.(css|less|scss|sss|styl)$': '<rootDir>/node_modules/jest-css-modules',
    '^@/jitsi/(.*)$': '<rootDir>/src/lib/jitsi-modules/$1',
    '^@/graphql/(.*)$': '<rootDir>/src/lib/gql/$1',
    '^@/i18n': '<rootDir>/i18n.js',
    '^@/(.*)': '<rootDir>/src/$1'
  },
  transform: {
    '^.+\\.(js|jsx|ts|tsx)$': ['babel-jest'],
    '\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$':
      '<rootDir>/tests/unit/setup/fileTransformer.js'
  },
  testPathIgnorePatterns: ['<rootDir>/node_modules/', '<rootDir>/.next/'],
  // A list of paths to modules that run some code to configure or set up the testing framework before each test
  setupFilesAfterEnv: ['./tests/unit/setup/jest.setup.js', './tests/unit/setup/canvas.js']
};
