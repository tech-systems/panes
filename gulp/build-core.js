/* eslint import/no-extraneous-dependencies: ["error", {"devDependencies": true}] */
/* eslint no-console: "off" */

const fs = require('fs-extra');
const rollup = require('rollup');
const Terser = require('terser');
const typescript = require('rollup-plugin-typescript2');
const replace = require('@rollup/plugin-replace');
const elapsed = require('elapsed-time-logger');
const chalk = require('chalk');

const banner = require('./banner.js');
const env = process.env.NODE_ENV;

async function buildEntry(format) {
  const bundleName = 'CupertinoPane';
  const filename = 'cupertino-pane.esm';
  const outputDir = 'dist/core';

  // Bundle
  return new Promise(async(resolve, reject) => {
    try {
      const cacheRoot = process.cwd() + `/.rpt2_cache/core`;
      await fs.ensureDir(cacheRoot);
      let bundle = await rollup.rollup({
        input: './src/index.ts',
        plugins: [
          replace({
            delimiters: ['', ''],
            preventAssignment: true,
            '//EXPORT': `export { ${bundleName} }`,
            // Remove modules from package, keep only core
            'import * as Modules from \'./modules\'': 'const Modules = {};'
          }),
                  typescript({
          useTsconfigDeclarationDir: true,
          cacheRoot,
          clean: env === 'development',
        })
        ],
      });

      bundle = await bundle.write({
        name: bundleName,
        format: 'esm', 
        banner,
        strict: true,
        exports: 'named',
        file: `./${outputDir}/index.js`,
      });

      const result = bundle.output[0];
      const { code } = await Terser.minify(result.code, {
        output: { preamble: banner },
      }).catch((err) => {
        console.error(`Terser failed on file ${filename}: ${err.toString()}`);
        return reject(err);
      });

      await fs.writeFile(`./${outputDir}/index.js`, code);
      resolve();
    } catch (error) {
      reject(error);
    }
  });
}

async function build(cb) {
  elapsed.start('build-core');
  return Promise.all(
    [
      buildEntry('esm')
    ]
  ).then(() => {
    elapsed.end('build-core', chalk.green('Rollup core build completed!'));
    if (cb) cb();
  }).catch((err) => {
    console.error('Core build failed:', err);
    if (cb) cb(err);
  });
}

module.exports = build;