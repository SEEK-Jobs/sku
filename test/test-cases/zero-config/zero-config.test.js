const dirContentsToObject = require('../../utils/dirContentsToObject');
const runSkuScriptInDir = require('../../utils/runSkuScriptInDir');
const waitForUrls = require('../../utils/waitForUrls');
const getAppSnapshot = require('../../utils/getAppSnapshot');

describe('zero-config', () => {
  beforeAll(async () => {
    await runSkuScriptInDir('configure', __dirname);
  });

  describe('start', () => {
    const devServerUrl = `http://localhost:8080`;
    let server;

    beforeAll(async () => {
      server = await runSkuScriptInDir('start', __dirname);
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

  describe('build', () => {
    beforeAll(async () => {
      await runSkuScriptInDir('build', __dirname);
    });

    it('should generate the expected files', async () => {
      const files = await dirContentsToObject(`${__dirname}/dist`);
      expect(files).toMatchSnapshot();
    });
  });

  describe('format', () => {
    it('should format successfully', async () => {
      const { childProcess } = await runSkuScriptInDir('format', __dirname);
      expect(childProcess.exitCode).toEqual(0);
    });
  });

  describe('lint', () => {
    it('should lint successfully', async () => {
      const { childProcess } = await runSkuScriptInDir('lint', __dirname);
      expect(childProcess.exitCode).toEqual(0);
    });
  });
});
