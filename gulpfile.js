var gulp = require('gulp'),
    concat = require('gulp-concat')

function defaultTask(cb) {
    cb();
  }
  
exports.default = defaultTask

gulp.task('concat', function() {
  return gulp.src([
    'globalVariables.js',
    'errorScanner.js',
    'boneOptions.js',
    'plugin.js'
  ])
  // plugin.js *must* always go at the bottom to prevent 'called before declaration' shinanigans
  .pipe(concat('meg.js'))
  .pipe(gulp.dest('composite'))
});