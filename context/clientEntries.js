const fs = require('fs');
const { fromPairs } = require('lodash');

const { getPathFromCwd } = require('../lib/cwd');
const defaultClientEntry = require('./defaultClientEntry');

// Create a webpack entry object for each route specific entry
// and the default client entry (if it exists)
const getClientEntries = config => {
  const entries = config.routes
    .filter(({ entry }) => Boolean(entry))
    .map(({ name, entry }) => [name, entry]);

  if (fs.existsSync(getPathFromCwd(config.clientEntry))) {
    entries.push([defaultClientEntry, config.clientEntry]);
  }

  return fromPairs(
    entries.map(([name, entry]) => [name, getPathFromCwd(entry)])
  );
};

module.exports = {
  getClientEntries
};
