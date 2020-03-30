// First, ensure the build is running in production mode
process.env.NODE_ENV = 'production';

const { green, red } = require('chalk');
const webpack = require('webpack');

const {
  copyPublicFiles,
  cleanTargetDirectory,
  ensureTargetDirectory,
  cleanRenderJs,
} = require('../lib/buildFileUtils');
const { run } = require('../lib/runWebpack');
const createHtmlRenderPlugin = require('../config/webpack/plugins/createHtmlRenderPlugin');
const makeWebpackConfig = require('../config/webpack/webpack.config');
const { isLibrary } = require('../context');

(async () => {
  try {
    await ensureTargetDirectory();
    await cleanTargetDirectory();
    await run(
      webpack(
        makeWebpackConfig({
          htmlRenderPlugin: !isLibrary ? createHtmlRenderPlugin() : undefined,
        }),
      ),
    );
    await cleanRenderJs();
    await copyPublicFiles();
    console.log(green('Sku build complete!'));
  } catch (error) {
    console.error(red(error));
    process.exit(1);
  }
})();
