var gulp = require('gulp'),
    less = require('gulp-less'),
    autoprefixer = require('gulp-autoprefixer'),
    concat = require('gulp-concat'),
    rename = require('gulp-rename'),
    minifycss = require('gulp-minify-css'),
    exclude = ['reset', 'variables', 'header', 'util'],//不包含编译的文件
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
    gulp.src(['src/less/*.less', '!src/less/{mixins,variables}/*.less', '!src/less/**/{' + exclude.join(',') + '}.less'])
        .pipe(less())
        .pipe(autoprefixer({
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
gulp.task('minCSS', ['buildCSS'], function () {
    gulp.src(['./dist/css/*.css'])
        .pipe(concat('sui.css')) // 合并文件
        .pipe(gulp.dest('./dist/')) // 输出
        .pipe(rename({suffix: '.min'})) // 重命名
        .pipe(minifycss()) // 压缩css文件
        .pipe(gulp.dest('./dist/')); // 输出
});