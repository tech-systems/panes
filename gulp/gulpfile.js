/* eslint no-console: ["error", { allow: ["log"] }] */
const gulp = require('gulp');
const fs = require('fs');
const path = require('path');
const del = require('del');

const buildJs = require('./build-js.js');

// Clean 
gulp.task('clean', (cb) => {
  return del('dist/**', {force:true});
});

// js bundle
gulp.task('js', (cb) => {
  buildJs(cb);
});

// in prod builds, adjust sourcemap paths to actual src location
gulp.task('prod-source-sourcemap-fix-paths', (cb) => {
  const env = process.env.NODE_ENV || 'development';
  if (env === 'production') {
    const jsDir = path.resolve(__dirname, '../dist/');
    const mapFiles = fs
      .readdirSync(jsDir)
      .filter((file) => file.toLowerCase().endsWith('.map'));
    mapFiles.forEach((mapFile) => {
      const mapFilePath = path.resolve(jsDir, mapFile);
      let content = fs.readFileSync(mapFilePath, 'utf8');
      content = content
        .replace(/"\.\.\/\.\.\//g, '"../')
        .replace(/"\.\.\/node_modules\//g, '"~/');
      fs.writeFileSync(mapFilePath, content);
    });
  }
  if (cb) cb();
});

gulp.task('build', gulp.series(['clean', 'js', 'prod-source-sourcemap-fix-paths']));