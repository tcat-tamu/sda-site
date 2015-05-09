var gulp = require('gulp');

var gutil = require('gulp-util');

var sass = require('gulp-sass');
var concat = require('gulp-concat');
var sourcemaps = require('gulp-sourcemaps');
var autoprefixer = require('gulp-autoprefixer');
var amdOptimize = require('amd-optimize');
var uglifyJS = require('gulp-uglify');
var uglifyCSS = require('gulp-cssmin');
var nunjucksCompile = require('gulp-nunjucks');
var nunjucksRender = require('gulp-nunjucks-render');
var merge = require('gulp-merge');
// var tap = require('gulp-tap');

var vendorPath = '../../build/vendor';


var buildPath = '../../build/web';
var jsBuildPath = buildPath + '/assets/js';
var cssBuildPath = buildPath + '/assets/css';
var fontsBuildPath = buildPath + '/assets/fonts';
var imgBuildPath = buildPath + '/assets/img';

var srcPath = '../../main/edu.tamu.tcat.sda.site.web/web';

gulp.task('fonts', function () {
   gulp.src(srcPath + '/fonts/**/*')
      .pipe(gulp.dest(fontsBuildPath));
});

gulp.task('icons', function () {
   gulp.src(srcPath + '/icons/**/*')
      .pipe(gulp.dest(buildPath));
});

gulp.task('images', function () {
   gulp.src(srcPath + '/img/**/*')
      .pipe(gulp.dest(imgBuildPath));
});

gulp.task('html', function () {
   nunjucksRender.nunjucks.configure(srcPath + '/html/', {
      watch: false
   });
   gulp.src(srcPath + '/html/**/*')
      .pipe(nunjucksRender({
         baseUrl: '/~matt.barry/sda-site/'
      }))
      .pipe(gulp.dest(buildPath));
});

gulp.task('templates', function () {
   gulp.src(srcPath + '/scripts/**/*.j2')
      .pipe(nunjucksCompile({
         name: function (file) {
            return file.relative.slice(0, -3);
         }
      }))
      .pipe(concat('templates.js'))
      .pipe(gulp.dest(jsBuildPath));
});

gulp.task('js', ['templates'], function () {
   // FIXME copy dependencies into
   gulp.src(srcPath + '/vendor/*.js')
      .pipe(gulp.dest(jsBuildPath + '/vendor'));

   var javascripts = gulp.src(srcPath + '/scripts/**/*.js')
      .pipe(amdOptimize('main', {
         findNestedDependencies: true,
         paths: {
            'backbone': vendorPath + '/backbone/backbone',
            'backbone.babysitter': vendorPath + '/backbone.babysitter/lib/backbone.babysitter',
            'backbone.radio': vendorPath + '/backbone.radio/build/backbone.radio',
            'backbone.wreqr': vendorPath + '/backbone.wreqr/lib/backbone.wreqr',
            'bootstrap': vendorPath + '/bootstrap/dist/js/bootstrap',
            'jquery': vendorPath + '/jquery/dist/jquery',
            'marionette': vendorPath + '/marionette/lib/core/backbone.marionette',
            'moment': vendorPath + '/moment/moment',
            'nunjucks': vendorPath + '/nunjucks/browser/nunjucks-slim',
            'promise': vendorPath + '/bluebird/js/browser/bluebird',
            // NOTE: quill cannot be shimmed; see src/quill.js
            'underscore': vendorPath + '/underscore/underscore',

            'trc-entries-biblio': vendorPath + '/trc-js-core/modules/trc-entries-biblio/dist/trc-entries-biblio',
            'trc-entries-bio': vendorPath + '/trc-js-core/modules/trc-entries-bio/dist/trc-entries-bio',
            //  'trc-entries-reln': vendorPath + '/trc-js-core/modules/trc-entries-reln/dist/trc-entries-reln',
            'trc-ui-widgets': vendorPath + '/trc-js-core/modules/trc-ui-widgets/dist/trc-ui-widgets',

            'trc-ui-widgets-templates': vendorPath + '/trc-js-core/modules/trc-ui-widgets/dist/templates',
            'templates': 'empty:'
         },

         map: {
            'controls/modal/views/layout_helper_view': {
               'templates': 'trc-ui-widgets-templates'
            }
         },

         shim: {
            'bootstrap': ['jquery']
         },

         exclude: ['config']
      }))
      .pipe(sourcemaps.init({
         loadMaps: true
      }))
      .pipe(concat('main.js'));

   var vendors = gulp.src([
         // quill must be included before almond because it does not use the runtime define() method properly
         vendorPath + '/quill/dist/quill.js',
         vendorPath + '/almond/almond.js'
      ])
      .pipe(sourcemaps.init({
         loadMaps: true
      }))
      .pipe(concat('vendors.js'));


   var minified = merge(vendors, javascripts)
      // .pipe(uglifyJS())
      .pipe(sourcemaps.write('.'));

   var config = gulp.src([
      srcPath + '/scripts/config.js'
   ]);

   return merge(minified, config)
      .pipe(gulp.dest(jsBuildPath));
});

gulp.task('stylesheets', function () {
   gulp.src(srcPath + 'styles/main.scss')
      .pipe(sourcemaps.init())
      .pipe(sass())
      .pipe(autoprefixer())
      .pipe(concat('main.css')).on('error', gutil.log)
      .pipe(uglifyCSS())
      .pipe(sourcemaps.write('.'))
      .pipe(gulp.dest(cssBuildPath));
});

gulp.task('watch', function () {
   gulp.watch(srcPath + '/styles/**/*.scss', ['stylesheets']);
   gulp.watch(srcPath + '/scripts/**/*.js', ['js']);
   gulp.watch(srcPath + '/scripts/**/*.j2', ['templates']);
   gulp.watch(srcPath + '/html/**/*.html', ['html']);
});

gulp.task('default', ['stylesheets', 'fonts', 'icons', 'images', 'html', 'js']);
