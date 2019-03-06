var gulp = require('gulp'),
    assetRev = require('gulp-asset-rev'),
    cleanCSS = require('gulp-clean-css')
    uglify = require('gulp-uglify'),
    rev = require('gulp-rev'),
    revCollector = require('gulp-rev-collector');

var jsSrc = 'js/*.js';
var cssSrc = 'css/*.css'

gulp.task('mUglify',function(){
    return gulp.src(jsSrc)
		.pipe(uglify())
		.pipe(gulp.dest('dist/js'));
});
gulp.task('minifyCss', function(){
    return gulp.src(cssSrc)
    .pipe(cleanCSS())
    .pipe(gulp.dest('dist/css'));
})

gulp.task('default', function (done) {
    condition = false;
    runSequence(
        'revJs',
        done);
});