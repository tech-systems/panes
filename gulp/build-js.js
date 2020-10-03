/* eslint import/no-extraneous-dependencies: ["error", {"devDependencies": true}] */
/* eslint no-console: "off" */

const fs = require('fs');
const rollup = require('rollup');
const Terser = require('terser');
const typescript = require('rollup-plugin-typescript2');
const banner = require('./banner.js');

function umd(cb) {
  const env = process.env.NODE_ENV || 'prod';

  rollup.rollup({
    input: './src/cupertino-pane.ts',
    plugins: [
      typescript({clean:true})
    ],
  }).then((bundle) => bundle.write({
    format: 'cjs',
    name: 'Cupertino Pane',
    strict: true,
    sourcemap: true,
    exports: 'named',
    sourcemapFile: `./${env === 'development' ? 'build' : 'dist'}/cupertino-pane.js.map`,
    banner: `${banner} \n \n if (!exports) var exports = {\"__esModule\": true};`,
    file: `./${env === 'development' ? 'build' : 'dist'}/cupertino-pane.js`,
  })).then((bundle) => {
    if (env === 'development') {
      if (cb) cb();
      return;
    }
    const result = bundle.output[0];
    const minified = Terser.minify(result.code, {
      sourceMap: {
        content: env === 'development' ? result.map : undefined,
        filename: env === 'development' ? undefined : 'cupertino-pane.min.js',
        url: 'cupertino-pane.min.js.map',
      },
      output: {
        preamble: banner,
      },
    });

    fs.writeFileSync('./dist/cupertino-pane.min.js', minified.code);
    fs.writeFileSync('./dist/cupertino-pane.min.js.map', minified.map);

    cb();
  }).catch((err) => {
    if (cb) cb();
    console.error(err.toString());
  });
}

function es(cb) {
  const env = process.env.NODE_ENV || 'prod';

  // Bundle
  rollup.rollup({
    input: './src/cupertino-pane.ts',
    plugins: [
      typescript()
    ],
  }).then((bundle) => bundle.write({
    format: 'es',
    name: 'Cupertino Pane',
    strict: true,
    sourcemap: true,
    sourcemapFile: `./${env === 'development' ? 'build' : 'dist'}/cupertino-pane.esm.bundle.js.map`,
    banner,
    file: `./${env === 'development' ? 'build' : 'dist'}/cupertino-pane.esm.bundle.js`,
  })).then(() => {
    if (cb) cb();
  }).catch((err) => {
    if (cb) cb();
    console.error(err.toString());
  });
}

function build(cb) {
  const expectCbs = 2;
  let cbs = 0;

  umd(() => {
    cbs += 1;
    if (cbs === expectCbs) cb();
  });

  es(() => {
    cbs += 1;
    if (cbs === expectCbs) cb();
  });
}

module.exports = build;