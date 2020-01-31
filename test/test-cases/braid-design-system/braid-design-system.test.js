const path = require('path');
const { promisify } = require('util');

const rimrafAsync = promisify(require('rimraf'));
const fs = require('fs-extra');

const { getPathFromCwd } = require('../../../lib/cwd');
const { getAppSnapshot } = require('../../utils/appSnapshot');
const startAssetServer = require('../../utils/assetServer');
const dirContentsToObject = require('../../utils/dirContentsToObject');
const runSkuScriptInDir = require('../../utils/runSkuScriptInDir');
const waitForUrls = require('../../utils/waitForUrls');
const appDir = path.resolve(__dirname, 'app');
const distDir = path.resolve(appDir, 'dist');

const skuConfig = require('./app/sku.config');

async function createPackageLink(name) {
  await fs.mkdirp(`${__dirname}/app/node_modules`);
  await fs.symlink(
    getPathFromCwd(`node_modules/${name}`),
    `${__dirname}/app/node_modules/${name}`,
  );
}

async function createPackageCopy(name) {
  const srcPath = getPathFromCwd(
    /^sku\//.test(name)
      ? `${name.replace('sku/', '')}`
      : `node_modules/${name}`,
  );
  const destPath = `${__dirname}/app/node_modules/${name}`;

  await fs.mkdirp(destPath);
  await fs.copy(srcPath, destPath);
}

async function setUpLocalDependencies() {
  const nodeModules = `${__dirname}/app/node_modules`;
  await rimrafAsync(nodeModules);
  await Promise.all(['react', 'react-dom'].map(createPackageLink));
  await Promise.all(
    [
      'braid-design-system',
      'sku/treat',
      'sku/react-treat',
      'sku/@loadable/component',
    ].map(createPackageCopy),
  );
}

describe('braid-design-system', () => {
  beforeAll(async () => {
    // "Install" React and braid-design-system into this test app so that webpack-node-externals
    // treats them correctly.
    await setUpLocalDependencies();
  });

  describe('start', () => {
    const devServerUrl = `http://localhost:${skuConfig.port}`;
    let server;

    beforeAll(async () => {
      server = await runSkuScriptInDir('start', appDir);
      await waitForUrls(devServerUrl);
    });

    afterAll(async () => {
      await server.kill();
    });

    it('should start a development server', async () => {
      const snapshot = await getAppSnapshot(devServerUrl);
      expect(snapshot).toMatchSnapshot();
    });
  });

  describe('build', () => {
    let closeAssetServer;

    beforeAll(async () => {
      await runSkuScriptInDir('build', appDir);
      closeAssetServer = await startAssetServer(4396, distDir);
    });

    afterAll(() => {
      closeAssetServer();
    });

    it('should create valid app', async () => {
      const app = await getAppSnapshot('http://localhost:4396/jobStreet');
      expect(app).toMatchSnapshot();
    });

    it('should generate the expected files', async () => {
      const files = await dirContentsToObject(distDir);
      expect(files).toMatchSnapshot();
    });
  });

  it('should handle braid-design-system in tests', async () => {
    const { childProcess } = await runSkuScriptInDir('test', appDir);
    expect(childProcess.exitCode).toEqual(0);
  });
});
