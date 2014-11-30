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
  // Set MONGO_URL variable
  // Start meteor
  'cd app && ./config/env.sh && meteor'
]));

gulp.task('parser', shell.task([
  // Set NET_INTERFACE variable
  // Start pcap parser
  // Need nodemon installed
  'cd backend/parser && ./env.sh && nodemon pcap_parser.js'
]));

// Default task
gulp.task('default', ['meteor', 'parser', 'watch']);
