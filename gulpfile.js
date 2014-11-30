var gulp = require('gulp'),
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

// Default task
gulp.task('default', ['watch']);