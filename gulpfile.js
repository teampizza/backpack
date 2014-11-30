var gulp = require('gulp'),
    sass = require('gulp-sass'),
    plumber = require('gulp-plumber'),
    prefix = require('gulp-autoprefixer'),
    notify = require('gulp-notify');

function onError(err) {
  notify.onError(err.message)(err); // for growl
  this.emit('end');
}

gulp.task('sass', function(){
  return gulp.src('app/client/styles/styles.scss')
    .pipe(plumber(onError))
    .pipe(sass())
    .pipe(prefix())
    .pipe(gulp.dest('app/client/styles'));
});

gulp.task('watch', function() {
  gulp.watch('app/client/styles/**/*.scss', ['sass']);
});

gulp.task('default', ['watch']);