const path = require('path');

const defaultDecorator = a => a;

module.exports = {
  entry: {
    client: 'src/client.js',
    render: 'src/render.js',
    server: 'src/server.js'
  },
  routes: [{ name: 'main', route: '/' }],
  sites: ['au'],
  environments: ['production'],
  transformPath: ({ environment, site, route }) =>
    path.join(environment, site, route),
  devTransformPath: ({ route }) => route,
  srcPaths: ['./src'],
  env: {},
  compilePackages: [],
  hosts: ['localhost'],
  port: 8080,
  serverPort: 8181,
  target: 'dist',
  storybookPort: 8081,
  initialPath: '/',
  public: 'public',
  publicPath: '/',
  polyfills: [],
  dangerouslySetWebpackConfig: defaultDecorator,
  dangerouslySetJestConfig: defaultDecorator,
  dangerouslySetESLintConfig: defaultDecorator
};
