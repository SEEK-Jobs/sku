const path = require('path');
const { promisify } = require('es6-promisify');
const rimrafAsync = promisify(require('rimraf'));
const fs = require('fs-extra');
const dirContentsToObject = require('../../utils/dirContentsToObject');
const runSkuScriptInDir = require('../../utils/runSkuScriptInDir');
const appDir = path.resolve(__dirname, 'app');
const distDir = path.resolve(appDir, 'dist');
const { cwd } = require('../../../lib/cwd');

describe('seek-asia-style-guide', () => {
  beforeAll(async () => {
    // "Install" React and seek-asia-style-guide into this test app so that webpack-node-externals
    // treats them correctly.
    await linkLocalDependencies();
    await runSkuScriptInDir('build', appDir);
  });

  it('should generate the expected files', async () => {
    const files = await dirContentsToObject(distDir);
    expect(files).toMatchSnapshot();
  });

  it('should handle seek-asia-style-guide in tests', async () => {
    const { childProcess } = await runSkuScriptInDir('test', appDir);
    expect(childProcess.exitCode).toEqual(0);
  });

  async function linkLocalDependencies() {
    const nodeModules = `${__dirname}/app/node_modules`;
    await rimrafAsync(nodeModules);
    await fs.mkdir(nodeModules);
    await Promise.all(
      ['react', 'react-dom', 'seek-asia-style-guide'].map(createPackageLink)
    );
  }

  function createPackageLink(name) {
    return fs.symlink(
      `${cwd}/node_modules/${name}`,
      `${__dirname}/app/node_modules/${name}`
    );
  }
});
