const fs = require('fs');
const path = require('path');
const { promisify } = require('es6-promisify');
const rimrafAsync = promisify(require('rimraf'));
const dirContentsToObject = require('../../utils/dirContentsToObject');
const runSkuScriptInDir = require('../../utils/runSkuScriptInDir');

const appDir = __dirname;
const distDir = path.resolve(appDir, 'dist');

describe('BabelPlugin', () => {
  beforeAll(async () => {
    await runSkuScriptInDir('build', appDir);
  });

  it('should generate the expected files', async () => {
    const bundle = fs.readFileSync(`${distDir}/main.js`).toString();
    expect(bundle).toContain('BabelPlugin success!');

    const html = fs.readFileSync(`${distDir}/index.html`).toString();
    expect(html).toContain('BabelPlugin success!');
  });
});
