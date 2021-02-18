const rmfr = require('rmfr');
const fs = require('fs');
const path = require('path');
const spawnSkuScriptInDir = require('../../utils/spawnSkuScriptInDir');

describe('sku init', () => {
  it('should pass with no configuration', async () => {
    const projectName = 'new-project';
    await rmfr(path.join(__dirname, projectName));

    const childPromise = spawnSkuScriptInDir('init', __dirname, [projectName], {
      pipeToParent: false,
    });
    const childProcess = childPromise.childProcess;

    childProcess.stdout.on('data', async (data) => {
      if (data.includes('Which Braid themes would you like? ')) {
        // Select first theme
        childProcess.stdin.write(' ');
        // Wait for selection to be handled
        await new Promise((r) => setTimeout(r, 200));
        // Accept selection
        childProcess.stdin.write('\n');
      }
    });

    // Should exit with exit code 0
    await expect(childPromise).resolves.toEqual(
      expect.objectContaining({ code: 0 }),
    );

    const skuConfig = require(path.join(
      __dirname,
      projectName,
      'sku.config.js',
    ));

    // sku.config.js should be created with project name in name
    expect(skuConfig).toMatchInlineSnapshot(`
      Object {
        "clientEntry": "src/client.tsx",
        "orderImports": true,
        "publicPath": "/path/to/public/assets/",
        "renderEntry": "src/render.tsx",
        "sites": Array [
          Object {
            "host": "dev.apac.com",
            "name": "apac",
          },
        ],
      }
    `);
  });
});
