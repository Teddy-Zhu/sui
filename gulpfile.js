var gulp = require('gulp'),
    less = require('gulp-less'),
    autopreFixer = require('gulp-autoprefixer'),
    concat = require('gulp-concat'),
    rename = require('gulp-rename'),
    minifyCss = require('gulp-minify-css'),
    clean = require('gulp-clean'),
    seQuence = require('run-sequence'),
    excludeFolder = ['extra', 'mixins', 'variables'],
    exclude = ['reset', 'variables', 'header', 'util', 'normalize'],//不包含编译的文件
    config = {
        /* Minified CSS Concat */
        minify: {
            processImport: false,
            restructuring: false,
            keepSpecialComments: 1
        },

        /* Minified JS Settings */
        uglify: {
            mangle: true,
            preserveComments: 'some'
        }
    };

gulp.task('buildCSS', function () {
    return gulp.src(['./src/less/*.less', '!./src/less/{' + excludeFolder.join(',') + '}/*.less', '!./src/less/**/{' + exclude.join(',') + '}.less'])
        .pipe(less())
        .pipe(autopreFixer({
            browsers: ['last 2 versions', 'last 4 Explorer versions'],
            cascade: true, //是否美化属性值 默认：true
            remove: true //是否去掉不必要的前缀 默认：true
        }))
        .on('error', function (e) {
            console.log(e);
        })
        .pipe(gulp.dest('./dist/css/'));
});

// 合并、压缩、重命名css
gulp.task('minCSS', function () {
    return gulp.src(['./dist/css/*.css'])
        .pipe(concat('sui.css')) // 合并文件
        .pipe(gulp.dest('./dist/')) // 输出
        .pipe(rename({suffix: '.min'})) // 重命名
        .pipe(minifyCss()) // 压缩css文件
        .pipe(gulp.dest('./dist/')); // 输出
});


// 清空dist
gulp.task('clean', function () {
    return gulp.src(['./dist/'], {read: false})
        .pipe(clean({force: true}));
});

// 将库文件对应到指定位置
gulp.task('buildLib', function () {
    return gulp.src(['./src/fonts/*'])
        .pipe(gulp.dest('./dist/fonts/'));
});

gulp.task('deploy', function (done) {
    seQuence('clean', 'buildCSS', 'minCSS', 'buildLib', done);
});

gulp.task('watch', function() {
    gulp.watch('src/**', ['deploy']);
});