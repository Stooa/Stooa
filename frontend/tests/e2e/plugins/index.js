/*!
 * This file is part of the Stooa codebase.
 *
 * (c) 2020 - present Runroom SL
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { defaultOptions } from '@cypress/browserify-preprocessor';
import coverage from '@cypress/code-coverage/task';
import cucumber from 'cypress-cucumber-preprocessor';
import { sync } from 'resolve';

export default function handler(on, config) {
  coverage(on, config);

  const options = {
    ...defaultOptions,
    typescript: sync('typescript', { baseDir: config.projectRoot })
  };

  on('file:preprocessor', cucumber(options));

  return config;
};
