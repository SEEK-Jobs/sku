[![Build Status](https://img.shields.io/travis/seek-oss/sku/master.svg?style=flat-square)](http://travis-ci.org/seek-oss/sku) [![npm](https://img.shields.io/npm/v/sku.svg?style=flat-square)](https://www.npmjs.com/package/sku) [![semantic-release](https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg?style=flat-square)](https://github.com/semantic-release/semantic-release) [![Commitizen friendly](https://img.shields.io/badge/commitizen-friendly-brightgreen.svg?style=flat-square)](http://commitizen.github.io/cz-cli/) [![Styled with Prettier](https://img.shields.io/badge/styled%20with-prettier-ff69b4.svg?style=flat-square)](https://github.com/prettier/prettier)

# sku

Front-end development toolkit, powered by [Webpack](https://webpack.js.org/), [Babel](https://babeljs.io/), [CSS Modules](https://github.com/css-modules/css-modules), [Less](http://lesscss.org/), [ESLint](http://eslint.org/) and [Jest](https://facebook.github.io/jest/).

Quickly get up and running with a zero-config development environment, or optionally add minimal config when needed. Designed for usage with [seek-style-guide](https://github.com/seek-oss/seek-style-guide), although this isn't a requirement.

This tool is heavily inspired by other work, most notably:
- [facebookincubator/create-react-app](https://github.com/facebookincubator/create-react-app)
- [insin/nwb](https://github.com/insin/nwb)
- [NYTimes/kyt](https://github.com/NYTimes/kyt)

**WARNING: While this software is open source, its primary purpose is to improve consistency, cross-team collaboration and code quality at SEEK. As a result, it’s likely that we will introduce more breaking API changes to this project than you’ll find in its alternatives.**

## Getting Started

First, in a new directory, create a git repository with an appropriate `.gitignore` file:

```bash
$ git init
$ echo -e 'node_modules\nnpm-debug.log\ndist' >> .gitignore
```

Next, create a new Node.js project via npm:

```bash
$ npm init
```

Install sku into your project as a dev dependency:

```bash
$ npm install --save-dev sku
```

In `package.json`, delete the default test script:

```diff
-"scripts": {
-  "test": "echo \"Error: no test specified\" && exit 1"
-},
```

Replace the deleted test script with a basic set of sku scripts:

```js
"scripts": {
  "start": "sku start",
  "test": "sku test",
  "build": "sku build",
  "lint": "sku lint"
},
```

For sku to work correctly, you'll need some initial source files. First, create a `src` directory:

```bash
$ mkdir src
```

Create a basic `src/render.js`, which is used to generate your `index.html` file:

```bash
$ touch src/render.js
```

Then add the following code to `src/render.js`:

```js
export default () => `
  <!DOCTYPE html>
  <html>
    <head>
      <meta charset="UTF-8">
      <title>My Awesome Project</title>
      <meta name="viewport" content="width=device-width, initial-scale=1">
      <link rel="stylesheet" type="text/css" href="/style.css" />
    </head>
    <body>
      <div id="app"></div>
      <script type="text/javascript" src="/main.js"></script>
    </body>
  </html>
`;
```

Finally, add a basic `src/client.js`:

```bash
$ echo 'document.getElementById("app").innerHTML = "Hello world!"' >> src/client.js
```

To include static assets that aren't handled by Webpack (e.g. `favicon.ico`), you can create a `public` directory:

```bash
$ mkdir public
```

## Getting Started with React

Since sku was designed with static pre-rendering in mind, and provides [JSX](https://facebook.github.io/react/docs/jsx-in-depth.html) compilation out of the box, it's a perfect fit for [React](https://facebook.github.io/react).

If you'd like to start a new React project, first install the required dependencies:

```bash
$ npm install --save-dev react react-dom
```

Next, create a new file called `src/App/App.js`:

```bash
$ mkdir -p src/App
$ touch src/App/App.js
```

Add the following code to `src/App/App.js`:

```js
import React, { Component } from 'react';

export default class App extends Component {
  render() {
    return (
      <div>Hello world!</div>
    );
  }
};
```

Replace the contents of `src/render.js` with the following, which provides static pre-rendering of your React app:

```js
import React from 'react';
import { renderToString } from 'react-dom/server';
import App from './App/App';

export default () => `
  <!DOCTYPE html>
  <html>
    <head>
      <meta charset="UTF-8">
      <title>My Awesome Project</title>
      <meta name="viewport" content="width=device-width, initial-scale=1">
      <link rel="stylesheet" type="text/css" href="/style.css" />
    </head>
    <body>
      <div id="app">${renderToString(<App />)}</div>
      <script type="text/javascript" src="/main.js"></script>
    </body>
  </html>
`;
```

Finally, replace the contents of 'src/client.js' with the following:

```js
import React from 'react';
import { render } from 'react-dom';
import App from './App/App';

render(<App />, document.getElementById("app"));
```

## Development Workflow

To start a local development server and open a new browser tab:

```bash
$ npm start
```

To run tests:

```bash
$ npm test
```

To build assets for production:

```bash
$ npm run build
```

## Testing

Anywhere inside your project, any file ending in `.test.js` will be included in an `npm test` run.

Since sku uses Jest as a testing framework, you can read the [Jest documentation](https://facebook.github.io/jest/) for more information on writing compatible tests.

## Configuration

If you need to configure sku, first create a `sku.config.js` file in your project root:

```bash
$ touch sku.config.js
```

While sku has a zero configuration mode, the equivalent manual configuration would look like this:

```js
module.exports = {
  entry: {
    client: 'src/client.js',
    render: 'src/render.js'
  },
  public: 'src/public',
  target: 'dist'
}
```

### Environment Variables

By default, `process.env.NODE_ENV` is handled correctly for you and provided globally, even to your client code. This is based on the sku script that's currently being executed, so `NODE_ENV` is `'development'` when running `sku start`, but `'production'` when running `sku build`.

Any other environment variables can be configured using the `env` option:

```js
module.exports = {
  ...
  env: {
    MY_ENVIRONMENT_VARIABLE: 'hello',
    ANOTHER_ENVIRONMENT_VARIABLE: 'world'
  }
}
```

Since this config is written in JavaScript, not JSON, you can easily pass through any existing environment variables:

```js
module.exports = {
  ...
  env: {
    BUILD_NUMBER: process.env.BUILD_NUMBER
  }
}
```

Environment variables can also be configured separately for development and production:

```js
module.exports = {
  ...
  env: {
    API_ENDPOINT: {
      development: '/mock/api',
      production: 'https://example.com/real/api'
    }
  }
}
```

### Locales

Often we render multiple versions of our application for different locations, eg. Australia & New Zealand. To render an HTML file for each location you can use the locales option in `sku.config.js`. Locales are preferable to [monorepos](#monorepo-support) when you need to render multiple versions of your HTML file but only need one version of each of the assets (JS, CSS, images, etc). Note: You can use `locales` inside a monorepo project.

The `locales` option accepts an array of strings representing each locale you want to render HTML files for.

```js
module.exports = {
  locales: ['AU', 'NZ']
}
```

For each locale, sku will call your `render.js` function and pass it the locale as a parameter.

```js
const render = ({ locale }) => (
  `<div>Rendered for ${locale}</div>`
)
```

The name of the HTML file that is generated will be suffixed by `-{locale}`.

eg.
```js
module.exports = {
  locales: ['AU', 'NZ']
}
```

will create `index-AU.html` & `index-NZ.html`.

Note: When running the app in dev mode only one HTML file will be created, defaulting to the first listed locale.

### Monorepo Support

If you need to build multiple projects in the same repo, you can provide an array of config objects.

Note that you can only run a development server for a single project at a time, so each configuration must be given a unique name:

```js
module.exports = [
  {
    name: 'hello',
    entry: {
      client: 'src/pages/hello/client.js',
      render: 'src/pages/hello/render.js'
    },
    public: 'src/pages/hello/public',
    target: 'dist/hello'
  },
  {
    name: 'world',
    entry: {
      client: 'src/pages/world/client.js',
      render: 'src/pages/world/render.js'
    },
    public: 'src/pages/world/public',
    target: 'dist/world'
  }
]
```

You will then be prompted to select the project you'd like to work on when starting your development server:

```bash
$ npm start
```

Alternatively, you can start the relevant project directly:

```bash
$ npm start hello
```

### Linting

Running `sku lint` will execute the ESLint rules over the code in your `src` directory. You can see the ESLint rules defined for sku projects in [eslint-config-sku](https://github.com/seek-oss/eslint-config-sku).

#### Atom support

Adding the following to your package.json file will enable the atom ESLint plugin to work with sku.

```js
"eslintConfig": {
  "extends": "sku"
}
```

## Contributing

Refer to [CONTRIBUTING.md](./CONTRIBUTING.md).

## License

MIT License
