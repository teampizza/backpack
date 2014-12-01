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
  './backend/parser/env.sh',
	'nodemon backend/parser/pcap_parser.js --watch'
]));

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
