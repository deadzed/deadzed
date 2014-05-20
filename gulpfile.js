var gulp = require('gulp');
var $ = require('gulp-load-plugins')({ lazy: false, camelize: true });
var exec = require('child_process').exec;
var browserify = require('browserify');
var source = require('vinyl-source-stream');

$.grunt(gulp, {base: './'});

gulp.task('run', function (cb) {
	exec('./node_modules/.bin/nodewebkit public', function (err, stdo, stde) {
		console.log(stdo);
		console.log(stde);
		cb(err);
	});
});

gulp.task('html', function() {
	gulp.src('src/index.html')
	.pipe($.minifyHtml())
	.pipe(gulp.dest('public'))
	.on('error', $.util.log);
});

gulp.task('scripts', function() {
	browserify('./src/scripts/zed.js')
	.bundle()
	.pipe(source('app.js'))
	.pipe(gulp.dest('public'))
	.on('error', $.util.log);
});

gulp.task('worker', function() {
	gulp.src('./src/worker/*.js')
	.pipe($.concat('worker.js'))
	.pipe(gulp.dest('public'))
	.on('error', $.util.log);
});

gulp.task("vendor", function(){
	$.bowerFiles()
	.pipe(gulp.dest('public'))
	.on('error', $.util.log);
});

gulp.task('styles', function() {
	gulp.src('src/styles/**')
	.pipe($.concat('app.css'))
	.pipe($.csso())
	.pipe(gulp.dest('public'))
	.on('error', $.util.log);
});

gulp.task('assets', function () {
	gulp.src('src/assets/**/*')
	.pipe(gulp.dest('public'))
	.on('error', $.util.log);

	gulp.src('src/package.json')
	.pipe(gulp.dest('public'))
	.on('error', $.util.log);
});

gulp.task('connect', $.connect.server({
	root: ['public'], port: 8080, livereload: true
}));

gulp.task('clean', function () {
	gulp.src('public', {read: false})
	.pipe($.clean({force: true}))
	.on('error', $.util.log);
});

gulp.task('watch', function() {
	gulp.watch('src/index.html', ['html']);
	gulp.watch('src/scripts/**/*', ['scripts']);
	gulp.watch('src/styles/**/*', ['styles']);
	gulp.watch('src/assets/**/*', ['assets']);
	gulp.watch('src/worker/**/*', ['worker']);
	gulp.watch('public/*', function (e) {
		gulp.src(e.path)
		.pipe($.connect.reload());
	});
});

gulp.task('build', ['html', 'scripts', 'worker', 'vendor', 'styles', 'assets']);

gulp.task('nodewebkit', ['build', 'grunt-nodewebkit']);

gulp.task('default', ['build', 'connect', 'watch']);
