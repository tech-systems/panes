/* eslint import/no-extraneous-dependencies: ["error", {"devDependencies": true}] */
/* eslint no-console: "off" */

const fs = require('fs-extra');
const rollup = require('rollup');
const Terser = require('terser');
const typescript = require('rollup-plugin-typescript2');
const banner = require('./banner.js');
const env = process.env.NODE_ENV || 'development';

function umd(cb) {
  rollup.rollup({
    input: './src/cupertino-pane.ts',
    plugins: [typescript({clean: true})],
  }).then((bundle) => bundle.write({
    format: 'umd',
    name: 'Cupertino Pane',
    strict: true,
    sourcemap: true,
    exports: 'named',
    sourcemapFile: `./dist/cupertino-pane.js.map`,
    banner: `${banner} \n \n if (!exports) var exports = {\"__esModule\": true};`,
    file: `./dist/cupertino-pane.js`,
  })).then(async(bundle) => {
    if (env === 'development') {
      if (cb) cb();
      return;
    }
  
    const result = bundle.output[0];
    const { code, map } = await Terser.minify(result.code, {
      sourceMap: {
        content: env === 'development' ? result.map : undefined,
        filename: env === 'development' ? undefined : 'cupertino-pane.min.js',
        url: 'cupertino-pane.min.js.map',
      },
      output: {
        preamble: banner,
      },
    }).catch((err) => {
      console.error(`Terser failed on file ${filename}: ${err.toString()}`);
    });

    await fs.writeFile(`./dist/cupertino-pane.min.js`, code);
    await fs.writeFile(`./dist/cupertino-pane.min.js.map`, map);

    cb();
  }).catch((err) => {
    if (cb) cb();
    console.error(err.toString());
  });
}

function es(cb) {
  // Bundle
  rollup.rollup({
    input: './src/cupertino-pane.ts',
    plugins: [typescript({clean: true})],
  }).then((bundle) => bundle.write({
    format: 'esm',
    name: 'Cupertino Pane',
    strict: true,
    sourcemap: true,
    sourcemapFile: `./dist/cupertino-pane.esm.bundle.js.map`,
    banner,
    file: `./dist/cupertino-pane.esm.bundle.js`,
  })).then(() => {
    if (cb) cb();
  }).catch((err) => {
    if (cb) cb();
    console.error(err.toString());
  });
}

function build(cb) {
  const expectCbs = env === 'development' ? 1 : 2;
  let cbs = 0;

  if (env !== 'development') {
    umd(() => {
      cbs += 1;
      if (cbs === expectCbs) cb();
    });
  }

  es(() => {
    cbs += 1;
    if (cbs === expectCbs) cb();
  });
}

module.exports = build;