const { getAppSnapshot } = require('../../utils/appSnapshot');
const startAssetServer = require('../../utils/assetServer');
const runSkuScriptInDir = require('../../utils/runSkuScriptInDir');
const targetDirectory = `${__dirname}/dist`;

describe('public path', () => {
  describe('build', () => {
    let closeAssetServer;

    beforeAll(async () => {
      await runSkuScriptInDir('build', __dirname);
      closeAssetServer = await startAssetServer(4001, targetDirectory);
    });

    afterAll(() => {
      closeAssetServer();
    });

    it('should create valid app with no unresolved resources', async () => {
      const app = await getAppSnapshot('http://localhost:4001/static');
      expect(app).toMatchSnapshot();
    });
  });
});
