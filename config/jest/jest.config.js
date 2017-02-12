module.exports = {
  testPathIgnorePatterns: [
    '<rootDir>[/\\\\](dist|node_modules)[/\\\\]'
  ],
  'moduleNameMapper': {
    '\\.(css|less)$': 'identity-obj-proxy'
  },
  transform: {
    '^.+\\.js$': require.resolve('./babelTransform.js')
  },
  transformIgnorePatterns: [
    '[/\\\\]node_modules[/\\\\](?!(seek-style-guide)[/\\\\]).+\\.js$'
  ]
};
