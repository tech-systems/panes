/* eslint no-console: ["error", { allow: ["log"] }] */
const gulp = require('gulp');
const connect = require('gulp-connect');
const gopen = require('gulp-open');
const fs = require('fs');
const path = require('path');
const env = process.env.NODE_ENV;

const buildBundle = require('./build-bundle.js');
const buildCore = require('./build-core.js');
const buildModules = require('./build-modules.js');

// js bundle
gulp.task('js', (cb) => {
  // In development mode, only build main bundle to save memory
  if (env === 'development') {
    buildBundle(cb);
  } else {
    buildBundle(cb);
    buildCore(cb);
    buildModules(cb);
  }

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

gulp.task('build', gulp.series(['js', 'prod-source-sourcemap-fix-paths']));

// Debounced watch to prevent memory spikes from rapid rebuilds
let watchTimeout;
let reloadTimeout;

gulp.task('watch', () => {
  // Watch TypeScript source files - triggers build + reload
  gulp.watch('./src/**/**/*.ts', function watchTS(cb) {
    clearTimeout(watchTimeout);
    watchTimeout = setTimeout(() => {
      gulp.series('js')(cb);
    }, 300); // 300ms debounce
  });

  // Watch playground files - triggers reload only (no build needed)
  gulp.watch(['./playground/**/*.html', './playground/**/*.css', './playground/**/*.js'], function watchPlayground(cb) {
    clearTimeout(reloadTimeout);
    reloadTimeout = setTimeout(() => {
      gulp.src('./playground/**/*')
        .pipe(connect.reload());
      cb();
    }, 100); // 100ms debounce for faster playground updates
  });
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

// Memory cleanup task
gulp.task('cleanup', (cb) => {
  const rimraf = require('rimraf');
  rimraf('.rpt2_cache', cb);
});

// Force garbage collection if available
gulp.task('gc', (cb) => {
  if (global.gc) {
    global.gc();
    console.log('Garbage collection triggered');
  }
  cb();
});

gulp.task('server', gulp.parallel(['watch', 'connect', 'open']));

gulp.task('default', gulp.series('server'));