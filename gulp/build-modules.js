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
const outputDir = 'dist/modules';

async function buildEntry(file) {
  const filename = file.replace('.ts', '');

  // Bundle
  new Promise(async(resolve, reject) => {
    let bundle = await rollup.rollup({
      input: `./src/modules/${file}`,
      plugins: [
        replace({
          delimiters: ['', ''],
          preventAssignment: true
        }),
        typescript({
          useTsconfigDeclarationDir: true,
          cacheRoot: process.cwd() + `/.rpt2_cache/modules.${filename}`,
        })
      ],
    });

    bundle = await bundle.write({
      name: `${filename}Module`,
      format: 'esm', 
      banner,
      strict: true,
      exports: 'named',
      file: `./${outputDir}/${filename}.js`,
    });

    const result = bundle.output[0];
    const { code } = await Terser.minify(result.code, {
      output: { preamble: banner },
    }).catch((err) => {
      console.error(`Terser failed on file ${filename}: ${err.toString()}`);
      return reject();
    });

    await fs.writeFile(`./${outputDir}/${filename}.js`, code);
    return resolve();
  });
}

async function build() {
  elapsed.start('build-modules');
  // Get module files
  let moduleFiles = await fs.readdirSync('./src/modules/', (err, files) => files);
  moduleFiles = moduleFiles.filter((file) => file.endsWith(".ts") && file !== 'index.ts');

  // Copy index.ts
  if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir, { recursive: true });
  fs.copyFileSync('./src/modules/index.ts', `${outputDir}/index.js`);

  return Promise.all(
    moduleFiles.map(file => buildEntry(file)
  )).then(() => {
    elapsed.end('build-modules', chalk.green('Rollup modules build completed!'));
  });
}

module.exports = build;