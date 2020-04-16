const os = require('os');

const { getPathFromCwd } = require('../lib/cwd');
const provider = require('./provider');
const skuVersion = require('../package.json').version;

let projectName = 'unknown';
try {
  const packageJson = require(getPathFromCwd('package.json'));

  if (packageJson.name) {
    projectName = packageJson.name;
  }
} catch (e) {}

const isCI = process.env.CI === 'true';

provider.addGlobalTags({
  ci: isCI,
  version: skuVersion,
  project: projectName,
  os: os.platform(),
});

module.exports = provider;
