const { promisify } = require('util');
const readFile = promisify(require('fs').readFile);
const path = require('path');
const jsonc = require('jsonc-parser');
const runSkuScriptInDir = require('../../utils/runSkuScriptInDir');
const {
  bundleReportFolder
} = require('../../../config/webpack/plugins/bundleAnalyzer');
const prettierConfig = require('../../../config/prettier/prettierConfig');
const tslintConfig = require('../../../config/typescript/tslint.json');
const defaultTargetDir = 'dist';
const app1 = path.resolve(__dirname, 'app');
const app2 = path.resolve(__dirname, 'typescript-app');
const skuConfig = require('./typescript-app/sku.config');

const readFileContents = async (appDir, fileName) => {
  const contents = await readFile(path.join(appDir, fileName), 'utf-8');
  return contents;
};

const readJsonC = async (appDir, fileName) => {
  const contents = await readFileContents(appDir, fileName);
  return jsonc.parse(contents);
};

const readIgnore = async (appDir, fileName) => {
  const contents = await readFileContents(appDir, fileName);
  return contents
    .split('\n')
    .filter(ignore => ignore && !ignore.startsWith('#')); // remove blanks and comments
};

describe('configure', () => {
  describe('default', () => {
    beforeAll(async () => {
      await runSkuScriptInDir('configure', app1);
    });

    describe('prettier', () => {
      it('should generate a prettier config', async () => {
        const prettierRc = await readJsonC(app1, '.prettierrc');
        expect(prettierRc).toEqual(prettierConfig);
      });
    });

    describe('eslint', () => {
      it('should generate a eslint config', async () => {
        const eslintrc = await readJsonC(app1, '.eslintrc');
        expect(eslintrc.extends).toEqual(require.resolve('eslint-config-seek'));
      });
    });

    describe('typescript', () => {
      it('should not generate tsconfig config', async () => {
        expect(readJsonC(app1, 'tsconfig.json')).rejects.toThrowError(
          /ENOENT: no such file or directory, open \'.*\/tsconfig\.json\'/
        );
      });

      it('should not generate tslint config', async () => {
        expect(readJsonC(app1, 'tslint.json')).rejects.toThrowError(
          /ENOENT: no such file or directory, open \'.*\/tslint\.json\'/
        );
      });
    });

    describe('ignore files', () => {
      it(`should generate \`.gitignore\``, async () => {
        const ignoreContents = await readIgnore(app1, '.gitignore');
        expect(ignoreContents.length).toEqual(4);
        expect(ignoreContents).toContain(`.eslintrc`);
        expect(ignoreContents).toContain(`.prettierrc`);
        expect(ignoreContents).toContain(`${defaultTargetDir}/`);
        expect(ignoreContents).toContain(`${bundleReportFolder}/`);
      });

      ['.eslintignore', '.prettierignore'].forEach(ignore =>
        it(`should generate \`${ignore}\``, async () => {
          const ignoreContents = await readIgnore(app1, ignore);
          expect(ignoreContents.length).toEqual(2);
          expect(ignoreContents).toContain(`${defaultTargetDir}/`);
          expect(ignoreContents).toContain(`${bundleReportFolder}/`);
        })
      );
    });
  });

  describe('custom', () => {
    beforeAll(async () => {
      await runSkuScriptInDir('configure', app2);
    });

    describe('prettier', () => {
      it('should generate a prettier config', async () => {
        const prettierRc = await readJsonC(app2, '.prettierrc');
        expect(prettierRc).toEqual(prettierConfig);
      });
    });

    describe('eslint', () => {
      it('should generate a custom eslint config', async () => {
        const eslintrc = await readJsonC(app2, '.eslintrc');
        expect(eslintrc.extends).toEqual(require.resolve('eslint-config-seek'));
        expect(eslintrc.rules['no-console']).toEqual(0);
      });
    });

    describe('typescript', () => {
      it('should generate tsconfig config', async () => {
        const tsconfigContents = await readJsonC(app2, 'tsconfig.json');
        expect(Object.keys(tsconfigContents).sort()).toEqual([
          'exclude',
          'extends',
          'include'
        ]);
      });

      it('should generate tslint config', async () => {
        const tslintContents = await readJsonC(app2, 'tslint.json');
        expect(tslintContents).toEqual(tslintConfig);
      });
    });

    describe('ignore files', () => {
      it(`should generate \`.gitignore\``, async () => {
        const ignoreContents = await readIgnore(app2, '.gitignore');
        expect(ignoreContents.length).toEqual(6);
        expect(ignoreContents).toContain(`.eslintrc`);
        expect(ignoreContents).toContain(`.prettierrc`);
        expect(ignoreContents).toContain(`tsconfig.json`);
        expect(ignoreContents).toContain(`tslint.json`);
        expect(ignoreContents).toContain(`${skuConfig.target}/`);
        expect(ignoreContents).toContain(`${bundleReportFolder}/`);
      });

      ['.eslintignore', '.prettierignore'].forEach(ignore =>
        it(`should generate \`${ignore}\``, async () => {
          const ignoreContents = await readIgnore(app2, ignore);
          expect(ignoreContents.length).toEqual(2);
          expect(ignoreContents).toContain(`${skuConfig.target}/`);
          expect(ignoreContents).toContain(`${bundleReportFolder}/`);
        })
      );
    });
  });
});
