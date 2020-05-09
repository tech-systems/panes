/* eslint no-console: ["error", { allow: ["log"] }] */
const gulp = require('gulp');
const connect = require('gulp-connect');
const gopen = require('gulp-open');
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
  return gulp
    .src('./src/**/*.ts')
    .pipe(connect.reload());
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

gulp.task('watch', () => {
  gulp.watch('./src/**/**/*.ts', gulp.series('js'));
});

gulp.task('connect', () => {
  connect.server({
    root: ['./'],
    livereload: true,
    host: '0.0.0.0',
    port: '3000',
  });
});

gulp.task('open', () => {
  gulp.src('./playground/index.html').pipe(gopen({ uri: 'http://localhost:3000/playground/' }));
});

gulp.task('server', gulp.parallel(['watch', 'connect', 'open']));

gulp.task('default', gulp.series('server'));