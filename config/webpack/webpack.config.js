const webpack = require('webpack');
const StaticSiteGeneratorPlugin = require('static-site-generator-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const nodeExternals = require('webpack-node-externals');
const builds = require('../builds');
const lodash = require('lodash');
const flatten = require('lodash/flatten');
const args = require('../args');
const bundleAnalyzerPlugin = require('./plugins/bundleAnalyzer');
const utils = require('./utils');

const webpackMode = utils.isProductionBuild ? 'production' : 'development';

const buildWebpackConfigs = builds.map(
  ({ name, paths, env, locales, webpackDecorator, port, polyfills }) => {
    const envVars = lodash
      .chain(env)
      .mapValues((value, key) => {
        if (typeof value !== 'object') {
          return JSON.stringify(value);
        }

        const valueForEnv = value[args.env];

        if (typeof valueForEnv === 'undefined') {
          console.log(
            `WARNING: Environment variable "${key}" for build "${name}" is missing a value for the "${
              args.env
            }" environment`
          );
          process.exit(1);
        }

        return JSON.stringify(valueForEnv);
      })
      .set('SKU_ENV', JSON.stringify(args.env))
      .set('PORT', JSON.stringify(port))
      .mapKeys((value, key) => `process.env.${key}`)
      .value();

    const resolvedPolyfills = polyfills.map(polyfill => {
      return require.resolve(polyfill, { paths: [process.cwd()] });
    });

    const devServerEntries = [
      `${require.resolve(
        'webpack-dev-server/client'
      )}?http://localhost:${port}/`
    ];

    const entry =
      args.script === 'start'
        ? [...resolvedPolyfills, ...devServerEntries, paths.clientEntry]
        : [...resolvedPolyfills, paths.clientEntry];

    const internalJs = [
      ...paths.src,
      ...paths.compilePackages.map(utils.resolvePackage)
    ];
    const publicPath = args.script === 'start' ? '/' : paths.publicPath;

    return [
      {
        name: 'client',
        mode: webpackMode,
        entry,
        output: {
          path: paths.dist,
          publicPath,
          filename: '[name].js'
        },
        optimization: {
          nodeEnv: process.env.NODE_ENV,
          minimize: utils.isProductionBuild,
          concatenateModules: utils.isProductionBuild
        },
        module: {
          rules: [
            {
              test: /(?!\.css)\.js$/,
              include: internalJs,
              use: utils.makeJsLoaders({ target: 'browser' })
            },
            {
              test: /(?!\.css)\.js$/,
              exclude: internalJs,
              use: [
                {
                  loader: require.resolve('babel-loader'),
                  options: {
                    babelrc: false,
                    presets: [require.resolve('babel-preset-env')]
                  }
                }
              ]
            },
            {
              test: /\.css\.js$/,
              use: [MiniCssExtractPlugin.loader].concat(
                utils.makeCssLoaders({ js: true })
              )
            },
            {
              test: /\.mjs$/,
              include: /node_modules/,
              type: 'javascript/auto'
            },
            {
              test: /\.less$/,
              oneOf: [
                ...paths.compilePackages.map(packageName => ({
                  include: utils.resolvePackage(packageName),
                  use: [MiniCssExtractPlugin.loader].concat(
                    utils.makeCssLoaders({ packageName })
                  )
                })),
                {
                  exclude: /node_modules/,
                  use: [MiniCssExtractPlugin.loader].concat(
                    utils.makeCssLoaders()
                  )
                }
              ]
            },
            {
              test: [/\.bmp$/, /\.gif$/, /\.jpe?g$/, /\.png$/],
              use: utils.makeImageLoaders()
            },
            {
              test: /\.svg$/,
              use: utils.makeSvgLoaders()
            }
          ]
        },
        plugins: [
          new webpack.DefinePlugin(envVars),
          bundleAnalyzerPlugin({ name: 'client' }),
          new MiniCssExtractPlugin({
            filename: 'style.css'
          })
        ]
      },
      {
        name: 'render',
        mode: 'development',
        entry: {
          render: paths.renderEntry
        },
        target: 'node',
        // Don't bundle or transpile non-compiled packages
        externals: [
          nodeExternals({
            whitelist: paths.compilePackages
          })
        ],
        output: {
          path: paths.dist,
          publicPath,
          filename: 'render.js',
          libraryTarget: 'umd'
        },
        module: {
          rules: [
            {
              test: /(?!\.css)\.js$/,
              include: internalJs,
              use: utils.makeJsLoaders({ target: 'node' })
            },
            {
              test: /\.css\.js$/,
              use: utils.makeCssLoaders({ server: true, js: true })
            },
            {
              test: /\.mjs$/,
              include: /node_modules/,
              type: 'javascript/auto'
            },
            {
              test: /\.less$/,
              oneOf: [
                ...paths.compilePackages.map(packageName => ({
                  include: utils.resolvePackage(packageName),
                  use: utils.makeCssLoaders({ server: true, packageName })
                })),
                {
                  exclude: /node_modules/,
                  use: utils.makeCssLoaders({ server: true })
                }
              ]
            },

            {
              test: [/\.bmp$/, /\.gif$/, /\.jpe?g$/, /\.png$/],
              use: utils.makeImageLoaders({ server: true })
            },
            {
              test: /\.svg$/,
              use: utils.makeSvgLoaders()
            }
          ]
        },
        plugins: [
          new webpack.DefinePlugin(envVars),
          bundleAnalyzerPlugin({ name: 'render' }),
          ...locales.slice(0, utils.isProductionBuild ? locales.length : 1).map(
            locale =>
              new StaticSiteGeneratorPlugin({
                locals: {
                  publicPath,
                  locale
                },
                paths: `index${
                  utils.isProductionBuild && locale ? `-${locale}` : ''
                }.html`
              })
          )
        ]
      }
    ].map(webpackDecorator);
  }
);

module.exports = flatten(buildWebpackConfigs);
