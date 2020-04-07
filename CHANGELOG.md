# sku

## 10.0.2

### Patch Changes

- Fix template formatting ([#484](https://github.com/seek-oss/sku/pull/484))

  This updates the template files to be in line with new linting rules

- Fix memory leak in sku start ([#486](https://github.com/seek-oss/sku/pull/486))

## 10.0.1

### Patch Changes

- Run eslint fix on init template ([#482](https://github.com/seek-oss/sku/pull/482))

  This ensures correct import ordering in the template.

## 10.0.0

### Major Changes

- Remove deprecated react-treat re-exports from `sku/treat` ([#471](https://github.com/seek-oss/sku/pull/471))

  **BREAKING CHANGES**

  `react-treat` APIs (`useStyles`, `TreatProvider` & `useClassName`) can no longer be imported from `sku/treat`

  **MIGRATION GUIDE**

  Update all imports of `useStyles`, `TreatProvider` & `useClassName` to `sku/react-treat`.

  e.g.

  ```diff
  -import { useStyles } from 'sku/treat';
  +import { useStyles } from 'sku/react-treat';
  ```

- Remove SSR react-hot-loader support ([#472](https://github.com/seek-oss/sku/pull/472))

  **BREAKING CHANGE**

  Previously, sku featured partial setup for `react-hot-loader` v3 in SSR apps. It was not complete and still required tricky wiring code from the consumer app. The `react-hot-loader` dependency and `react-hot-loader/patch` client entry has now been removed from sku.

  If you want to continue using `react-hot-loader` with sku, you'll need to use `dangerouslySetWebpackConfig` to set the required `react-hot-loader` config. This approach is not recommended and will be very difficult to maintain.

  **Note**: We plan on looking into proper hot reload support (for static and SSR app) once the [react fast-refresh](https://github.com/facebook/react/issues/16604) project has a stable implementation for webpack.

- Update minimum required node version to >=10.13.0 ([#463](https://github.com/seek-oss/sku/pull/463))

  **BREAKING CHANGE**

  Node versions < 10.13.0 no longer supported.

- Remove support for `.css.js` files ([#470](https://github.com/seek-oss/sku/pull/470))

  **BREAKING CHANGE**

  `.css.js` ([css-in-js-loader](https://github.com/naistran/css-in-js-loader)) files are no longer supported.

  **MIGRATION GUIDE**

  Any existing `.css.js` files will need to be removed. Ideally, replace these styles with Braid components. If that's not possible you can re-create the styles using [css-modules](https://seek-oss.github.io/sku/#/./docs/styling?id=locally-scoped-css) or [treat files](https://seek-oss.github.io/sku/#/./docs/styling?id=treat).

  **Note**: It is our understanding that there is very limited use of this feature. If you have many `.css.js` files in your project please contact #sku-support for help.

### Minor Changes

- Update Prettier to v2 ([#463](https://github.com/seek-oss/sku/pull/463))

  **MIGRATION GUIDE**

  Prettier update will require running `sku format`.

  The `arrowParens` option is now set to `always`.

  See [Prettier 2.0.0](https://prettier.io/blog/2020/03/21/2.0.0.html) for more info on the changes.

- Add import order linting ([#477](https://github.com/seek-oss/sku/pull/477))

  You can now optionally enable linting of import order by adding `orderImports: true` to your sku config. This rule supports auto-fix.

  **WARNING**

  Changing import order can affect the behaviour of your application. After enabling `orderImports`, please ensure your app still works and looks as expected.

  Also, any existing comments (e.g. `@ts-ignore`) above imports will **not** be moved as part of the autofix. If your app has a lot of `@ts-ignore` comments then please be very wary when applying this rule.

- Update to [Jest 25](https://jestjs.io/blog/2020/01/21/jest-25) ([#468](https://github.com/seek-oss/sku/pull/468))

### Patch Changes

- Update dependencies ([#440](https://github.com/seek-oss/sku/pull/440))

  See PR for more info.

- Update all babel deps to 7.9+ ([#471](https://github.com/seek-oss/sku/pull/471))

- Update min typescript version to 3.8.3 ([#471](https://github.com/seek-oss/sku/pull/471))

- Update eslint-config-seek to v6 ([#440](https://github.com/seek-oss/sku/pull/440))

  **MIGRATION GUIDE**

  Run `sku lint` to check if any new rules are breaking. Running `sku format` first will fix any auto-fixable rules. See the [eslint-config-seek release notes](https://github.com/seek-oss/eslint-config-seek/releases) for more info on changes.

- Improve error messages for incorrect client entries ([#467](https://github.com/seek-oss/sku/pull/467))

- Update `html-render-webpack-plugin` to v2 ([#474](https://github.com/seek-oss/sku/pull/474))
