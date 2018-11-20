const fs = require('fs-extra');
const { promisify } = require('util');
const rimraf = promisify(require('rimraf'));

const { paths } = require('../context');

const cleanTargetFolder = () => rimraf(`${paths.target}/*`);

const copyPublicFiles = () => {
  if (fs.existsSync(paths.public)) {
    console.log(`Copying ${paths.public} to ${paths.target}`);

    fs.copySync(paths.public, paths.target, {
      dereference: true
    });
  }
};

const ensureTargetDirectory = () => {
  fs.ensureDirSync(paths.target);
};

module.exports = {
  cleanTargetFolder,
  copyPublicFiles,
  ensureTargetDirectory
};
