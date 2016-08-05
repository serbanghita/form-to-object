var gulp = require('gulp');
var concat = require('gulp-concat');
var jscs = require('gulp-jscs');
var rename = require('gulp-rename');
var util = require('gulp-util');
var uglify = require('gulp-uglify');
var jasmine = require('gulp-jasmine-phantom');
var runSequence = require('run-sequence');

// npm install phantomjs -g

gulp.task('js:concat', function () {
    return gulp.src(
        [
            'src/intro.js',
            'src/intro.class.js',
            'src/core.js',
            'src/outro.class.js',
            'src/outro.export.js',
            'src/outro.js'
        ])
        .pipe(concat('formToObject.js'))
        .pipe(gulp.dest('dist'));
});

gulp.task('js:fix', function() {
    return gulp.src('dist/formToObject.js')
        .pipe(jscs({fix: true}))
        .pipe(gulp.dest('dist'));
});

gulp.task('js:minify', function() {
    return gulp.src('dist/formToObject.js')
        .pipe(rename('formToObject.min.js'))
        .pipe(uglify())
        .pipe(gulp.dest('dist'));
});

var Server = require('karma').Server;

gulp.task('js:test:unit', function (done) {
    return new Server({
        configFile: __dirname + '/karma.unit.conf.js'
    }, done).start();
});

gulp.task('js:test:acceptance', function (done) {
    return new Server({
        configFile: __dirname + '/karma.acceptance.conf.js'
    }, done).start();
});

gulp.task('js:watch', function() {
    var watcher = gulp.watch('src/*.js', ['js:concat']);
    watcher.on('change', function(event) {
        util.log('File', event.path, 'was ' + event.type + ' ...');
        runSequence('js:test:unit', 'js:test:acceptance');
    });
});


gulp.task('build', function(cb) {
    runSequence('js:concat', 'js:fix', 'js:minify', cb);
});

gulp.task('test', function(cb) {
   runSequence('js:test:unit', 'js:test:acceptance', cb);
});