var gulp = require('gulp');

var gutil = require('gulp-util');

var sass = require('gulp-sass');
var concat = require('gulp-concat');
var sourcemaps = require('gulp-sourcemaps');
var autoprefixer = require('gulp-autoprefixer');
var uglifyJs = require('gulp-uglify');
var uglifyCSS = require('gulp-cssmin');
var tap = require('gulp-tap');

var buildPath = '../../build/web/';
var cssBuildPath = buildPath + 'assets/css/';
var fontsBuildPath = buildPath + 'assets/fonts/';
var imgBuildPath = buildPath + 'assets/img/';
var jsBuildPath = buildPath + 'assets/js/';

var srcPath = '../../main/edu.tamu.tcat.sda.site.web/web/';

gulp.task('fonts', function()
{
   gulp.src(srcPath + 'fonts/**/*')
       .pipe(gulp.dest(fontsBuildPath));
});

gulp.task('icons', function()
{
   gulp.src(srcPath + 'icons/**/*')
       .pipe(gulp.dest(buildPath));
});

gulp.task('images', function()
{
   gulp.src(srcPath + 'img/**/*')
       .pipe(gulp.dest(imgBuildPath));
});

gulp.task('html', function()
{
   gulp.src(srcPath + 'html/**/*')
       .pipe(gulp.dest(buildPath));
});


gulp.task('js', function()
{
   gulp.src([srcPath + 'scripts/plugins.js', srcPath + 'scripts/main.js'])
       .pipe(sourcemaps.init())
       .pipe(concat('main.js')).on('error', gutil.log)
       .pipe(uglifyJs())
       .pipe(sourcemaps.write('.'))
       .pipe(gulp.dest(jsBuildPath));

   // copy vendor libraries
   gulp.src(srcPath + 'vendor/**/*.js')
       .pipe(gulp.dest(jsBuildPath + 'vendor/'));
});
gulp.task('stylesheets', function()
{
   gulp.src(srcPath + 'styles/main.scss')
       .pipe(sourcemaps.init())
       .pipe(sass())
       .pipe(autoprefixer())
       .pipe(concat('main.css')).on('error', gutil.log)
       .pipe(uglifyCSS())
       .pipe(sourcemaps.write('.'))
       .pipe(gulp.dest(cssBuildPath));
});

gulp.task('default', ['stylesheets', 'fonts', 'icons', 'images', 'html', 'js']);
