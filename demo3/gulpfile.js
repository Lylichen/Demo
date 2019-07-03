var gulp = require('gulp'),
	cleanCSS = require('gulp-clean-css'),
    uglify = require('gulp-uglify'),
    modify = require('modify-filename'),
    rev = require('gulp-rev'),
    through = require('through2'),
    setDev = require('./setDev'), //本地测试专用，可以动态修改公用文件（比如修改common.js的cookie）
    setHash = require('./setHash');//修改html引用到的资源文件的版本号

const jsSrc = 'js/*.js';
const htmlSrc = './*.html'
const cssSrc = 'css/*.css'
const imgSrc = ['img/**/*.png', 'img/**/*.jpg', 'img/**/*.jpeg', 'img/**/*.gif', 'img/**/*.svg']//只匹配img标签引用到的图片（可以优化，比如匹配所有使用到的图片资源）
const common = 'js/common.js'
const env = process.env.NODE_EDIT_ENV
const css_root = path.normalize(__dirname + '/css/');
const js_root =  path.normalize(__dirname + '/js/');
const img_root =  path.normalize(__dirname + '/');

//修改文件名
var resetName = function (type, src_root){
    var stream = through.obj(function(file, enc, cb){
        file.path = modify(file.revOrigPath, function(name, ext) {
            if(type){
                return name + ext + '?v=' + file.revHash
            }else{
                return name + ext
            }
        });
        file.path = type ? file.path.replace(src_root, '') : file.path
        cb(null, file);
    })
    return stream
}
gulp.task('setdev', () => {
    return gulp.src(common)
               .pipe(setDev({env:env, path: 'common.js'}))
               .pipe(gulp.dest('js'))
})
gulp.task('mUglify', () => {
    return gulp.src(jsSrc)
        .pipe(uglify())
        .pipe(rev())
        .pipe(resetName(false))
        .pipe(gulp.dest('dist/js'))
        .pipe(resetName(true, js_root))
        .pipe(rev.manifest())
        .pipe(gulp.dest('rev/js'));
});
gulp.task('minify-css', () => {
    return gulp.src(cssSrc)
        .pipe(cleanCSS({compatibility: 'ie8'}))
        .pipe(rev())
        .pipe(resetName(true, css_root))
        .pipe(rev.manifest())
        .pipe(gulp.dest('rev/css'))
});
gulp.task('image', () => {
    return gulp.src(imgSrc)
        .pipe(rev())
        .pipe(resetName(true, img_root))
        .pipe(rev.manifest())
        .pipe(gulp.dest('rev/img'));
})
gulp.task('rev', () => {
    return gulp.src(['rev/**/*.json', htmlSrc])
        .pipe(setHash())
        .pipe( gulp.dest('./') );
});
gulp.task('default', gulp.series('setdev', gulp.parallel('mUglify', 'minify-css', 'image'), 'rev'))