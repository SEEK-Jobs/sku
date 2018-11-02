const path = require('path');
const dirContentsToObject = require('../../utils/dirContentsToObject');
const waitForUrls = require('../../utils/waitForUrls');
const runSkuScriptInDir = require('../../utils/runSkuScriptInDir');
const getAppSnapshot = require('../../utils/getAppSnapshot');
const appDir = path.resolve(__dirname, 'app');
const distDir = path.resolve(appDir, 'dist');
const srcDir = path.resolve(appDir, 'src');

describe('typescript-css-modules', () => {
  beforeAll(async () => {
    await runSkuScriptInDir('configure', appDir);
  });

  describe('build', () => {
    beforeAll(async () => {
      await runSkuScriptInDir('build', appDir);
    });

    it('should generate the expected files', async () => {
      const files = await dirContentsToObject(distDir);
      const srcFiles = await dirContentsToObject(srcDir, ['.ts']);
      expect({
        ...files,
        ...srcFiles
      }).toMatchSnapshot();
    });
  });

  describe('build-ssr', () => {
    beforeAll(async () => {
      await runSkuScriptInDir('build-ssr', appDir);
    });

    it('should generate the expected files', async () => {
      const files = await dirContentsToObject(distDir);
      const srcFiles = await dirContentsToObject(srcDir, ['.ts']);
      expect({
        ...files,
        ...srcFiles
      }).toMatchSnapshot();
    });
  });

  describe('start', () => {
    const devServerUrl = `http://localhost:8080`;
    let server;

    beforeAll(async () => {
      server = await runSkuScriptInDir('start', appDir);
      await waitForUrls(devServerUrl);
    });

    afterAll(() => {
      server.kill();
    });

    it('should start a development server', async () => {
      const snapshot = await getAppSnapshot(devServerUrl);
      expect(snapshot).toMatchSnapshot();
    });
  });

  describe('test', () => {
    let exitCode;

    beforeAll(async () => {
      const { childProcess } = await runSkuScriptInDir('test', appDir);
      exitCode = childProcess.exitCode;
    });

    it('should handle Less and css.js in tests', async () => {
      expect(exitCode).toEqual(0);
    });
  });

  describe('lint', () => {
    let exitCode;

    beforeAll(async () => {
      // run build first to ensure typescript declarations are generated
      await runSkuScriptInDir('build', appDir);
      const { childProcess } = await runSkuScriptInDir('lint', appDir);
      exitCode = childProcess.exitCode;
    });

    it('should handle tsc and tslint', async () => {
      expect(exitCode).toEqual(0);
    });
  });
});
