const webpack = require('webpack');
const builds = require('../builds');
const flatten = require('lodash/flatten');
const find = require('lodash/find');
const webpackMerge = require('webpack-merge');

const srcPaths = flatten(builds.map(build => build.paths.src));

const webpackConfigs = require('../webpack/webpack.config');
const clientWebpackConfig = find(
  webpackConfigs,
  config => config.name === 'client'
);

module.exports = webpackMerge(
  {
    // We don't want to apply the entire webpack config,
    // mainly because it configures entries and outputs,
    // which would break the Storybook build.
    module: clientWebpackConfig.module,
    resolve: clientWebpackConfig.resolve,
    plugins: clientWebpackConfig.plugins
  },
  {
    plugins: [
      new webpack.DefinePlugin({
        // Webpack has to have access to these paths statically
        // at build time, so we need to manually pass each value
        // one by one. If we don't have a srcPath, we fall back
        // to the current directory, which is effectively a no-op
        // since it doesn't contain any files ending in '.stories.js'.
        // We're providing up to 10 source paths for now, which is
        // totally arbitrary, but designed to be more than we'd need.
        // The first path doesn't fall back to __dirname because they
        // need to provide at least one valid srcPath.
        __SKU_SRC_PATHS_0__: JSON.stringify(srcPaths[0]),
        __SKU_SRC_PATHS_1__: JSON.stringify(srcPaths[1] || __dirname),
        __SKU_SRC_PATHS_2__: JSON.stringify(srcPaths[2] || __dirname),
        __SKU_SRC_PATHS_3__: JSON.stringify(srcPaths[3] || __dirname),
        __SKU_SRC_PATHS_4__: JSON.stringify(srcPaths[4] || __dirname),
        __SKU_SRC_PATHS_5__: JSON.stringify(srcPaths[5] || __dirname),
        __SKU_SRC_PATHS_6__: JSON.stringify(srcPaths[6] || __dirname),
        __SKU_SRC_PATHS_7__: JSON.stringify(srcPaths[7] || __dirname),
        __SKU_SRC_PATHS_8__: JSON.stringify(srcPaths[8] || __dirname),
        __SKU_SRC_PATHS_9__: JSON.stringify(srcPaths[9] || __dirname)
      })
    ]
  }
);
