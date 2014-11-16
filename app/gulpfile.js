var gulp = require('gulp'),
    sass = require('gulp-sass'),
    plumber = require('gulp-plumber'),
    prefix = require('gulp-autoprefixer'),
    uglify = require('gulp-uglify'),
    livereload = require('gulp-livereload'),
    nodemon = require('gulp-nodemon'),
    notify = require('gulp-notify');

var paths = {
  sass: 'app/assets/sass/styles.scss',
  img: 'app/assets/img/**/*',
  js: 'app/assets/js/**/*.js',
  views: 'app/views/**/*'
};

function onError(err) {
  notify.onError(err.message)(err);
  this.emit('end');
}

gulp.task('sass', function(){
  return gulp.src(paths.sass)
    .pipe(plumber(onError))
    .pipe(sass())
    .pipe(prefix())
    .pipe(gulp.dest('public/css'));
});

gulp.task('img', function () {
  return gulp.src(paths.img)
    .pipe(gulp.dest('public/img/'));
});

gulp.task('js', function () {
  return gulp.src(paths.js)
    .pipe(gulp.dest('public/js/'));
});

gulp.task('copy', function () {
  // Copy bower components into public/js/libs
  gulp.src([
    'bower_components/jquery/dist/jquery.js'
  ]).pipe(uglify())
    .pipe(gulp.dest('public/js/libs'));
});

gulp.task('watch', function() {
  gulp.watch('app/assets/sass/**/*.scss', ['sass']);
  gulp.watch(paths.img, ['img']);
  gulp.watch(paths.js, ['js']);

  gulp.watch([
    'public/**/*',
    paths.views
  ]).on('change', function(file) {
    livereload.changed(file.path);
  });
});

gulp.task('serve', function() {
  livereload.listen();

  nodemon({
    script: 'app.js',
    ext: 'js',
    ignore: ['app/assets/**', 'public/**']
  }).on('restart', function () {
      console.log('restarted! ' + (new Date()));
    });
});

gulp.task('build', ['sass', 'img', 'js', 'copy']);

gulp.task('default', ['build', 'serve', 'watch']);