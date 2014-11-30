var gulp = require('gulp'),
    shell = require('gulp-shell'),
    sass = require('gulp-sass'),
    plumber = require('gulp-plumber'),
    prefix = require('gulp-autoprefixer'),
    notify = require('gulp-notify');

// Growl error messages
function onError(err) {
  notify.onError(err.message)(err); // for growl
  this.emit('end');
}

// Compile sass to css and auto prefix
gulp.task('sass', function(){
  return gulp.src('app/client/styles/styles.scss')
    .pipe(plumber(onError)) // error handler
    .pipe(sass()) // compile
    .pipe(prefix()) // autoprefix
    .pipe(gulp.dest('app/client/styles'));
});

// Watch files for changes
gulp.task('watch', function() {
  // If *.scss file change call 'sass' task
  gulp.watch('app/client/styles/**/*.scss', ['sass']);
});

gulp.task('meteor', shell.task([
  // Set enviorment variables then start meteor
  'cd app && source config/env.sh && meteor'
]))

// Default task
gulp.task('default', ['meteor', 'watch']);