module.exports = {
  routes: ['/', '/details/$id'],
  sites: ['au', 'nz'],
  environments: ['production'],
  port: 8202,
  publicPath: '/static/place',
  cspEnabled: true,
  cspExtraScriptSrcHosts: [
    'https://error-tracking.com',
    'https://fb-tracking.com',
  ],
};
