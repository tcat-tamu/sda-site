var gulp = require('gulp');

var gutil = require('gulp-util');

var sass         = require('gulp-sass');
var concat       = require('gulp-concat');
var sourcemaps   = require('gulp-sourcemaps');
var autoprefixer = require('gulp-autoprefixer');
var amdOptimize  = require('amd-optimize');
var uglifyJS     = require('gulp-uglify');
var uglifyCSS    = require('gulp-cssmin');
var nunjucks     = require('gulp-nunjucks-render');
var merge = require('gulp-merge');
// var tap = require('gulp-tap');

var vendorPath     = '../../build/vendor';


var buildPath      = '../../build/web/';
var jsBuildPath    = buildPath + 'assets/js/';
var cssBuildPath   = buildPath + 'assets/css/';
var fontsBuildPath = buildPath + 'assets/fonts/';
var imgBuildPath   = buildPath + 'assets/img/';

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
   nunjucks.nunjucks.configure(srcPath + 'html/', {
      watch: false
   });
   gulp.src(srcPath + 'html/**/*')
       .pipe(nunjucks({
          baseUrl: '/sda'
       }))
       .pipe(gulp.dest(buildPath));
});

gulp.task('js', function() {
   // FIXME copy dependencies into
   gulp.src(srcPath + 'vendor/*.js')
       .pipe(gulp.dest(jsBuildPath + '/vendor'));

   // gulp.src([srcPat + '/'])
   var javascripts = gulp.src(srcPath + 'scripts/**/*.js')
        .pipe(amdOptimize('main', {
            findNestedDependencies: true,
            paths: {
                'backbone': vendorPath + '/backbone/backbone',
                'backbone.babysitter': vendorPath + '/backbone.babysitter/lib/backbone.babysitter',
                'backbone.wreqr': vendorPath + '/backbone.wreqr/lib/backbone.wreqr',
                'bootstrap': vendorPath + '/bootstrap/dist/js/bootstrap',
                'jquery': vendorPath + '/jquery/dist/jquery',
                'marionette': vendorPath + '/marionette/lib/core/backbone.marionette',
                'moment': vendorPath + '/moment/moment',
                'promise': vendorPath + '/bluebird/js/browser/bluebird',
                // NOTE: quill cannot be shimmed; see src/quill.js
                'underscore': vendorPath + '/underscore/underscore',

                'trc-entries-biblio': vendorPath + '/trc-js-core/modules/trc-entries-biblio/dist/trc-entries-biblio',
                'trc-entries-bio': vendorPath + '/trc-js-core/modules/trc-entries-bio/dist/trc-entries-bio',
                //  'trc-entries-reln': vendorPath + '/trc-js-core/modules/trc-entries-reln/dist/trc-entries-reln',
                'trc-ui-widgets': vendorPath + '/trc-js-core/modules/trc-ui-widgets/dist/trc-ui-widgets'
            },

            shim: {
                'bootstrap': ['jquery']
            }
        }))
        .pipe(sourcemaps.init({
            loadMaps: true
        }))
        .pipe(concat('main.js'));

    var vendors = gulp.src([
            // quill must be included before almond because it does not use the runtime define() method properly
            vendorPath + '/quill/dist/quill.js',
            vendorPath + '/prism/prism.js',
            vendorPath + '/almond/almond.js'
        ])
        .pipe(sourcemaps.init({
            loadMaps: true
        }))
        .pipe(concat('vendors.js'));


    return merge(vendors, javascripts)
      //   .pipe(uglifyJS())
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest(jsBuildPath));
});
// gulp.task('js', function()
// {
//    gulp.src([srcPath + 'scripts/plugins.js', srcPath + 'scripts/main.js'])
//        .pipe(sourcemaps.init())
//        .pipe(concat('main.js')).on('error', gutil.log)
//        .pipe(uglifyJS())
//        .pipe(sourcemaps.write('.'))
//        .pipe(gulp.dest(jsBuildPath));
//
//    // copy vendor libraries
//    gulp.src(srcPath + 'vendor/**/*.js')
//        .pipe(gulp.dest(jsBuildPath + 'vendor/'));
// });

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

gulp.task('watch', function() {
   gulp.watch(srcPath + 'styles/**/*.scss', ['stylesheets']);
   gulp.watch(srcPath + 'scripts/**/*.js', ['js']);
   gulp.watch(srcPath + 'html/**/*.html', ['html']);
});

gulp.task('default', ['stylesheets', 'fonts', 'icons', 'images', 'html', 'js']);
