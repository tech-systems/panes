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
  const isUMD = format === 'umd';
  const isESM = format === 'esm';
  const isProd = env === 'production';
  const isDev = env === 'development';
  const sourcemap = isProd && isUMD;
  let filename = 'cupertino-pane';
  const outputDir = 'dist';
  if (isESM) filename += `.esm`;

  // Bundle
  rollup.rollup({
    input: './src/index.ts',
    plugins: [
      replace({
        delimiters: ['', ''],
        preventAssignment: true,
        '//EXPORT': isUMD ? `export default ${bundleName};` : `export { ${bundleName} }`
      }),
      typescript({
        cacheRoot: process.cwd() + `/.rpt2_cache/${filename}`,
      })
    ],
  }).then((bundle) => bundle.write({
    name: bundleName,
    format, banner, sourcemap, 
    strict: true,
    exports: isUMD ? 'default' : 'named',
    sourcemapFile: `./${outputDir}/${filename}.js.map`,
    file: `./${outputDir}/${filename}.js`,
  })).then(async(bundle) => {
    if (!isProd || !isUMD) {
      return;
    };

    const result = bundle.output[0];
    const { code, map } = await Terser.minify(result.code, {
      sourceMap: {
        content: sourcemap ? result.map : undefined,
        filename: sourcemap ? `${filename}.min.js` : undefined,
        url: `${filename}.min.js.map`,
      },
      output: {
        preamble: banner,
      },
    }).catch((err) => {
      console.error(`Terser failed on file ${filename}: ${err.toString()}`);
    });

    await fs.writeFile(`./${outputDir}/${filename}.min.js`, code);
    await fs.writeFile(`./${outputDir}/${filename}.min.js.map`, map);
  }).catch((err) => {
    console.error('Rollup error:', err.stack);
  });
}

async function build() {
  elapsed.start('bundles');
  return Promise.all(
    [
      buildEntry('umd'), 
      buildEntry('esm')
    ]
  ).then(() => {
    elapsed.end('bundles', chalk.green('\nRollup bundles build completed!'));
  });
}

module.exports = build;