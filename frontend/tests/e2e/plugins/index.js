const browserify = require('@cypress/browserify-preprocessor');
const coverage = require('@cypress/code-coverage/task');
const cucumber = require('cypress-cucumber-preprocessor').default;
const resolve = require('resolve');

module.exports = (on, config) => {
  coverage(on, config);

  const options = {
    ...browserify.defaultOptions,
    typescript: resolve.sync('typescript', { baseDir: config.projectRoot }),
  };

  on('file:preprocessor', cucumber(options));

  return config;
};
