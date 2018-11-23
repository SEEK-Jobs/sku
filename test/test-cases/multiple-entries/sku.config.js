module.exports = {
  routes: [
    { name: 'home', entry: 'src/HomePage.js', route: '/' },
    { name: 'details', entry: 'src/DetailsPage.js', route: '/details/:id' }
  ],
  sites: ['au', 'nz'],
  environments: ['production'],
  port: 8202,
  publicPath: 'http://localhost:4001'
};
