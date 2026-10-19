const fs = require('fs');

const exists = path => new Promise(resolve => fs.exists(path, resolve));

describe('ExcelJS', () => {
  describe('dist folder', () => {
    it('should include LICENSE', async () => {
      expect(await exists('./dist/LICENSE')).to.be.true()
    });
    it('should include exceljs.js', async () => {
      expect(await exists('./dist/exceljs.js')).to.be.true()
    });
    it('should include exceljs.min.js', async () => {
      expect(await exists('./dist/exceljs.min.js')).to.be.true()
    });
    it('should include exceljs.bare.js', async () => {
      expect(await exists('./dist/exceljs.bare.js')).to.be.true()
    });
    it('should include exceljs.bare.min.js', async () => {
      expect(await exists('./dist/exceljs.bare.min.js')).to.be.true()
    });
    it('should include es5/index', async () => {
      expect(await exists('./dist/es5/index.js')).to.be.true()
    });
  });

  // Consumers' bundlers (rolldown, esbuild, Rollup) warn on a direct eval and
  // security scanners flag it. The one that used to ship came from
  // vm-browserify, pulled in only because asn1.js calls
  // require('vm').runInThisContext inside a try/catch to name a constructor.
  describe('browser bundles', () => {
    const directEval = /(^|[^.\w$])eval\s*\(/;

    ['exceljs.js', 'exceljs.min.js', 'exceljs.bare.js', 'exceljs.bare.min.js'].forEach(file => {
      it(`${file} should not contain a direct eval`, () => {
        const source = fs.readFileSync(`./dist/${file}`, 'utf8');
        const match = source.match(directEval);
        const context = match && source.slice(Math.max(match.index - 60, 0), match.index + 60);
        expect(context).to.equal(null);
      });
    });
  });
});