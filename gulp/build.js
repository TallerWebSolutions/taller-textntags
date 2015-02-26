/**
 * Build related tasks.
 */

var fs          = require('fs')
  , gulp        = require('gulp')
  , browserify  = require('browserify')
  , uglify      = require('gulp-uglify')
  , transform   = require('vinyl-transform')
  , concat      = require('gulp-concat')
  , uglify      = require('gulp-uglify')
  , header      = require('gulp-header')
  , shim        = require('browserify-global-shim')
  , pkg         = require('../package.json')
  , signature   = fs.readFileSync('./signature')
  , globalShim  = shim.configure({
      'jquery': '$'
    , 'underscore': '_'
    });

/**
 * Get signature header.
 */
function signatureHeader() {
  return header(signature, {
    pkg: pkg
  });
}

/**
 * Unit test: uses Mocha to test TokenParser.
 */
gulp.task('build', function () {
  var browserified = transform(function(filename) {
    var b = browserify(filename, {
      standalone: 'TokenParser'
    });

    // Add global references.
    b.transform(globalShim);

    return b.bundle();
  });

  return gulp.src(['./index.js'])
    .pipe(browserified)
    .pipe(concat(pkg.name + '.js'))
    .pipe(signatureHeader())
    .pipe(gulp.dest('./dist/js'))
    .pipe(uglify({
      mangle: false
    }))
    .pipe(signatureHeader())
    .pipe(concat(pkg.name + '.min.js'))
    .pipe(gulp.dest('./dist/js'));
});

gulp.task('watch:build', function () {
  gulp.watch(['index.js'], ['build']);
});
