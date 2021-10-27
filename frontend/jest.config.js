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
  moduleNameMapper: {
    '\\.(css|less|scss|sss|styl)$': '<rootDir>/node_modules/jest-css-modules',
    '^@/jitsi(.*)$': '<rootDir>/lib/jitsi-modules$1',
    '^@/lib(.*)$': '<rootDir>/lib$1',
    '^@/graphql(.*)$': '<rootDir>/lib/gql$1',
    '^@/pages(.*)$': '<rootDir>/pages$1',
    '^@/components(.*)$': '<rootDir>/components$1',
  },
  transform: {
    '^.+\\.(js|jsx|ts|tsx)$': ['babel-jest'],
    '\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$':
      '<rootDir>/__setups__/fileTransformer.js',
  },
  testPathIgnorePatterns: ['<rootDir>/node_modules/', '<rootDir>/.next/'],
  // A list of paths to modules that run some code to configure or set up the testing framework before each test
  setupFilesAfterEnv: ['./__setups__/jest.setup.js', './__setups__/canvas.js'],
};
