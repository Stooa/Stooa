/*!
 * This file is part of the Stooa codebase.
 *
 * (c) 2020 - present Runroom SL
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

const nextJest = require('next/jest');

const createJestConfig = nextJest({ dir: './' });

const customJestConfig = {
  setupFilesAfterEnv: ['<rootDir>/tests/unit/setup/jest.setup.js'],
  moduleNameMapper: {
    '^@/jitsi/(.*)$': '<rootDir>/src/lib/jitsi-modules/$1',
    '^@/graphql/(.*)$': '<rootDir>/src/lib/gql/$1',
    '^@/i18n': '<rootDir>/i18n.js',
    '^@/locales/(.*)$': '<rootDir>/locales/$1',
    '^@/(.*)': '<rootDir>/src/$1',
    '^.+\\.(svg)$': '<rootDir>/tests/unit/setup/svgMock.tsx'
  },
  moduleDirectories: ['node_modules', '<rootDir>/'],
  testEnvironment: 'jest-environment-jsdom'
};

module.exports = createJestConfig(customJestConfig);
