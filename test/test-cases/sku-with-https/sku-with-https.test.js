const path = require('path');
const { promisify } = require('util');
const rimrafAsync = promisify(require('rimraf'));
const fs = require('fs-extra');
const runSkuScriptInDir = require('../../utils/runSkuScriptInDir');
const { getAppSnapshot } = require('../../utils/appSnapshot');
const waitForUrls = require('../../utils/waitForUrls');
const { getPathFromCwd } = require('../../../lib/cwd');

const { port } = require('./app/sku.config');
const appDir = path.resolve(__dirname, 'app');

async function createPackageLink(name) {
  await fs.mkdirp(`${__dirname}/app/node_modules`);
  await fs.symlink(
    getPathFromCwd(`node_modules/${name}`),
    `${__dirname}/app/node_modules/${name}`,
  );
}

async function setUpLocalDependencies() {
  const nodeModules = `${__dirname}/app/node_modules`;
  await rimrafAsync(nodeModules);
  await Promise.all(['react', 'react-dom'].map(createPackageLink));
}

describe('sku-with-https', () => {
  beforeAll(async () => {
    // "Install" React and braid-design-system into this test app so that webpack-node-externals
    // treats them correctly.
    await setUpLocalDependencies();
  });

  describe('start', () => {
    const url = `https://localhost:${port}`;
    let process;

    beforeAll(async () => {
      process = await runSkuScriptInDir('start', appDir);
      await waitForUrls(url);
    });

    afterAll(async () => {
      await process.kill();
    });

    it('should start a development server', async () => {
      const snapshot = await getAppSnapshot(url);
      expect(snapshot).toMatchSnapshot();
    });
    it('should support the supplied middleware', async () => {
      const snapshot = await getAppSnapshot(`${url}/test-middleware`);
      expect(snapshot).toMatchSnapshot();
    });
  });

  describe('start-ssr', () => {
    const url = `https://localhost:${port}`;
    let process;

    beforeAll(async () => {
      process = await runSkuScriptInDir('start-ssr', appDir);
      await waitForUrls(url);
    });

    afterAll(async () => {
      await process.kill();
    });

    it('should start a development server', async () => {
      const snapshot = await getAppSnapshot(url);
      expect(snapshot).toMatchSnapshot();
    });
    it('should support the supplied middleware', async () => {
      const snapshot = await getAppSnapshot(`${url}/test-middleware`);
      expect(snapshot).toMatchSnapshot();
    });
  });

  describe('serve', () => {
    const url = `https://localhost:${port}`;
    let process;

    beforeAll(async () => {
      await runSkuScriptInDir('build', appDir);
      process = await runSkuScriptInDir('serve', appDir);
      await waitForUrls(url);
    });

    afterAll(async () => {
      await process.kill();
    });

    it('should start a development server', async () => {
      const snapshot = await getAppSnapshot(url);
      expect(snapshot).toMatchSnapshot();
    });

    it('should support the supplied middleware', async () => {
      const snapshot = await getAppSnapshot(`${url}/test-middleware`);
      expect(snapshot).toMatchSnapshot();
    });
  });
});
