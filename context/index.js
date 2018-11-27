const fs = require('fs');
const { merge } = require('lodash');
const { getPathFromCwd } = require('../lib/cwd');
const args = require('../config/args');
const defaultSkuConfig = require('./defaultSkuConfig');
const { getClientEntries, defaultClientEntry } = require('./clientEntries');
const validateConfig = require('./validateConfig');

const appSkuConfigPath = getPathFromCwd(args.config);

const appSkuConfig = fs.existsSync(appSkuConfigPath)
  ? require(appSkuConfigPath)
  : {};
const skuConfig = merge(defaultSkuConfig, appSkuConfig);

validateConfig(skuConfig);

const env = {
  ...skuConfig.env,
  SKU_TENANT: args.tenant
};

const isStartScript = args.script === 'start-ssr' || args.script === 'start';
const isBuildScript = args.script === 'build-ssr' || args.script === 'build';

const transformOutputPath = isStartScript
  ? skuConfig.devTransformOutputPath
  : skuConfig.transformOutputPath;

const paths = {
  src: skuConfig.srcPaths.map(getPathFromCwd),
  compilePackages: [
    'seek-style-guide',
    'seek-asia-style-guide',
    'braid-design-system',
    ...skuConfig.compilePackages
  ],
  clientEntries: getClientEntries(skuConfig),
  renderEntry: getPathFromCwd(skuConfig.entry.render),
  libraryEntry: skuConfig.entry.library
    ? getPathFromCwd(skuConfig.entry.library)
    : null,
  serverEntry: getPathFromCwd(skuConfig.entry.server),
  public: getPathFromCwd(skuConfig.public),
  target: getPathFromCwd(skuConfig.target),
  relativeTarget: skuConfig.target,
  publicPath: isStartScript ? '/' : skuConfig.publicPath
};

module.exports = {
  paths,
  env,
  locales: skuConfig.locales,
  hosts: skuConfig.hosts,
  port: {
    client: skuConfig.port,
    server: skuConfig.serverPort
  },
  libraryName: skuConfig.libraryName,
  isLibrary: Boolean(skuConfig.entry.library),
  storybookPort: skuConfig.storybookPort,
  polyfills: skuConfig.polyfills,
  initialPath: skuConfig.initialPath,
  webpackDecorator: skuConfig.dangerouslySetWebpackConfig,
  jestDecorator: skuConfig.dangerouslySetJestConfig,
  eslintDecorator: skuConfig.dangerouslySetESLintConfig,
  sites: skuConfig.sites,
  routes: skuConfig.routes,
  environments: skuConfig.environments,
  transformOutputPath,
  defaultClientEntry,
  isStartScript,
  isBuildScript
};
