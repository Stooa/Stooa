/*!
 * This file is part of the Stooa codebase.
 *
 * (c) 2020 - present Runroom SL
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { defineConfig } from 'cypress';
import coverage from '@cypress/code-coverage/task';
import { addCucumberPreprocessorPlugin } from '@badeball/cypress-cucumber-preprocessor';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import browserify from '@badeball/cypress-cucumber-preprocessor/browserify';

export default defineConfig({
  e2e: {
    baseUrl: 'http://localhost:3000/',
    specPattern: 'tests/e2e/features/*.feature',
    fixturesFolder: 'tests/e2e/fixtures',
    screenshotsFolder: 'tests/e2e/screenshots',
    supportFile: 'tests/e2e/support/index.ts',
    video: false,
    videosFolder: 'tests/e2e/videos',
    async setupNodeEvents(on, config) {
      coverage(on, config);

      await addCucumberPreprocessorPlugin(on, config);

      on(
        'file:preprocessor',
        browserify(config, {
          typescript: require.resolve('typescript')
        })
      );

      return config;
    }
  }
});
