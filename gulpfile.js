var gulp        = require('gulp');
var browserSync = require('browser-sync');
var reload      = browserSync.reload;
var harp        = require('harp');
var deploy      = require('gulp-gh-pages');
var cp          = require('child_process');

/**
 * Serve the Harp Site from the src directory
 */
gulp.task('serve', function () {
  harp.server('.', {
    port: 9000
  }, function () {
    browserSync({
      proxy: "localhost:9000",
      open: false,
      /* Hide the notification. It gets annoying */
      notify: {
        styles: ['opacity: 0', 'position: absolute']
      }
    });
    /**
     * Watch for changes
     */
    gulp.watch("./**/*.{styl,sass,scss,less}", function () {
      reload("style.css", {stream: true});
    });

    gulp.watch("./**/*.{ejs,jade,haml,json}", reload)
  })
});

/**
 * Build the Harp Site
 */
gulp.task('build', function (done) {
  cp.exec('harp compile . www', {stdio: 'inherit'})
    .on('close', done)
});

/**
 * Push build to gh-pages
 */
gulp.task('deploy', ['build'], function () {
  return gulp.src("./www/**/*")
    .pipe(deploy({branch: 'gh-pages'}))
});

/**
 * Default task, running `gulp` will fire up the Harp site,
 * launch BrowserSync & watch files.
 */
gulp.task('default', ['serve']);
