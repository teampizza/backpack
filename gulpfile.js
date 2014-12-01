var gulp = require('gulp'),
    shell = require('gulp-shell'),
    sass = require('gulp-sass'),
    plumber = require('gulp-plumber'),
    prefix = require('gulp-autoprefixer'),
    nodemon = require('gulp-nodemon'),
    notify = require('gulp-notify');

// Environment variables
process.env.MONGO_URL = "mongodb://localhost:27017/backpack"
process.env.NET_INTERFACE = "wlan0"

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
  // Start meteor
  'cd app && meteor'
]));

gulp.task('parser', function() {
  // Start pcap parser
  nodemon({
    script: 'backend/parser/pcap_parser.js',
    ext: 'js',
    ignore: ['app/**']
  }).on('restart', function () {
      console.log('restarted! ' + (new Date()));
    });
});

gulp.task('setcap',shell.task([
	// Add wireshark group
	// Add $USER to wireshark
	// set parser script group to wireshark
	// give parser script capture permissions
	'sudo ./backend/parser/cap_permission.sh'
]));

// Default task
gulp.task('default', ['meteor', 'parser', 'watch']);

// Permission task
gulp.task('permissions', ['setcap']);
