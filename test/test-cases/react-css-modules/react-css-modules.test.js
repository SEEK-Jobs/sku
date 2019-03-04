const path = require('path');
const dirContentsToObject = require('../../utils/dirContentsToObject');
const runSkuScriptInDir = require('../../utils/runSkuScriptInDir');
const waitForUrls = require('../../utils/waitForUrls');
const startAssetServer = require('../../utils/assetServer');
const { getAppSnapshot } = require('../../utils/appSnapshot');
const appDir = path.resolve(__dirname, 'app');
const distDir = path.resolve(appDir, 'dist');
const storybookDistDir = path.resolve(appDir, 'dist-storybook');

describe('react-css-modules', () => {
  let closeAssetServer;

  beforeAll(async () => {
    await runSkuScriptInDir('build', appDir);
    closeAssetServer = await startAssetServer(4293, distDir);
  });

  afterAll(() => {
    closeAssetServer();
  });

  it('should create valid app', async () => {
    const app = await getAppSnapshot('http://localhost:4293');
    expect(app).toMatchSnapshot();
  });

  it('should generate the expected files', async () => {
    const files = await dirContentsToObject(distDir);
    expect(files).toMatchSnapshot();
  });

  it('should handle Less and css.js in tests', async () => {
    const { childProcess } = await runSkuScriptInDir('test', appDir);
    expect(childProcess.exitCode).toEqual(0);
  });

  describe('storybook', () => {
    const storybookUrl = 'http://localhost:8081';
    let server;

    beforeAll(async () => {
      server = await runSkuScriptInDir('storybook', appDir, ['--ci']);
      await waitForUrls(storybookUrl);
    });

    afterAll(() => {
      server.kill();
    });

    it('should start a storybook server', async () => {
      const page = await browser.newPage();
      await page.goto(storybookUrl, { waitUntil: 'networkidle2' });

      const content = await page.evaluate(async () => {
        const element = await window.document
          .querySelector('iframe')
          .contentDocument.querySelector('[data-automation-text]');

        const text = element.innerText;
        const styles = window.getComputedStyle(element);
        const color = styles.getPropertyValue('color');
        const fontSize = styles.getPropertyValue('font-size');

        return { text, color, fontSize };
      });

      expect(content.text).toEqual('Storybook render');
      expect(content.color).toEqual('rgb(255, 0, 0)');
      expect(content.fontSize).toEqual('32px');
    });
  });

  describe('build-storybook', () => {
    let closeStorybookServer;

    beforeAll(async () => {
      await runSkuScriptInDir('build-storybook', appDir);
      closeStorybookServer = await startAssetServer(4297, storybookDistDir);
    });

    afterAll(() => {
      closeStorybookServer();
    });

    it('should create valid storybook', async () => {
      const app = await getAppSnapshot('http://localhost:4297');
      expect(app).toMatchSnapshot();
    });
  });
});
