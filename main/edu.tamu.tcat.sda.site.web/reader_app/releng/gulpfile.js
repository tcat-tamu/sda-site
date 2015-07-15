var gulp = require('gulp');

var amdOptimize = require('amd-optimize');
var autoprefixer = require('gulp-autoprefixer');
var concat = require('gulp-concat');
var flatten = require('gulp-flatten');
var merge = require('gulp-merge');
var nunjucksCompile = require('gulp-nunjucks');
var nunjucksRender = require('gulp-nunjucks-render');
var rename = require('gulp-rename');
var sass = require('gulp-sass');
var sourcemaps = require('gulp-sourcemaps');
// var tap = require('gulp-tap');
// var uglifyJS = require('gulp-uglify');
// var uglifyCSS = require('gulp-cssmin');


var srcPath = '../src';
var stagingPath = '../build';
var vendorPath = stagingPath + '/vendor';
var distPath = '../dist';

var baseUrl = '/~matthew.barry/reader-app';

gulp.task('fonts', function () {
   var vendors = gulp.src([
         vendorPath + '/bootstrap/dist/fonts/*',
         vendorPath + '/font-awesome/fonts/*'
      ]);

   var customFonts = gulp.src(srcPath + '/fonts/**/*')
      .pipe(flatten());

   return merge(vendors, customFonts)
      .pipe(gulp.dest(distPath + '/fonts'));
});


gulp.task('images', function () {
   return gulp.src(srcPath + '/images/**/*')
      .pipe(gulp.dest(distPath + '/images'));
});


gulp.task('html', function () {
   nunjucksRender.nunjucks.configure(srcPath + '/html/', {
      watch: false
   });

   return gulp.src([
         srcPath + '/html/index.html.j2'
      ])
      .pipe(nunjucksRender({
         baseUrl: baseUrl
      }))
      .pipe(rename(function (path) {
         path.basename = path.basename.replace(/\.html$/i, '');
         path.ext = '.html';
      }))
      .pipe(gulp.dest(distPath));
});


gulp.task('templates', function () {
   var localTemplates = gulp.src(srcPath + '/templates/**/*.j2')
      .pipe(nunjucksCompile({
         name: function (file) {
            // remove trailing .j2
            return file.relative.slice(0, -3);
         }
      }));

   var externalTemplates = gulp.src([
      vendorPath + '/trc-js-core/modules/trc-ui-widgets/dist/templates.js'
   ]);

   // NOTE merge external then local templates to ensure locals override external defaults
   return merge(externalTemplates, localTemplates)
      .pipe(concat('templates.js'))
      .pipe(gulp.dest(distPath + '/js'));
});


gulp.task('javascripts', function () {
   var javascripts = gulp.src(srcPath + '/js/**/*.js')
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
            'underscore': vendorPath + '/underscore/underscore',

            'trc-entries-biblio': vendorPath + '/trc-js-core/modules/trc-entries-biblio/dist/trc-entries-biblio',
            'trc-entries-bio': vendorPath + '/trc-js-core/modules/trc-entries-bio/dist/trc-entries-bio',
            'trc-entries-reln': vendorPath + '/trc-js-core/modules/trc-entries-reln/dist/trc-entries-reln',
            'trc-ui-widgets': vendorPath + '/trc-js-core/modules/trc-ui-widgets/dist/trc-ui-widgets'
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
         vendorPath + '/quill/dist/quill.js',
         vendorPath + '/almond/almond.js'
      ])
      .pipe(sourcemaps.init({
         loadMaps: true
      }))
      .pipe(concat('vendors.js'));

   var ieVendors = gulp.src([
         vendorPath + '/selectivizr/selectivizr.js',
         vendorPath + '/respond/dest/respond.src.js'
      ])
      .pipe(concat('vendors-ie.js'));

   // modernizr likes to be loaded in the <head> of the HTML document, so it has to be a separate script
   var modernizr = gulp.src(vendorPath + '/modernizr/modernizr.js')
      .pipe(sourcemaps.init({
         loadMaps: true
      }));

   var minified = merge(modernizr, ieVendors, vendors, javascripts)
      // .pipe(uglifyJS())
      .pipe(sourcemaps.write('.'));


   var config = gulp.src([
      srcPath + '/js/config.js'
   ]);

   return merge(minified, config)
      .pipe(gulp.dest(distPath + '/js'));
});

gulp.task('stylesheets', function () {
   var vendors = gulp.src([
         vendorPath + '/bootstrap/dist/css/bootstrap.css',
         vendorPath + '/font-awesome/css/font-awesome.css'
      ])
      .pipe(sourcemaps.init({
         loadMaps: true
      }));

   var sassStylesheets = gulp.src(srcPath + '/sass/main.scss')
      .pipe(sourcemaps.init())
      .pipe(sass())
      .pipe(autoprefixer());

   return merge(vendors, sassStylesheets)
      .pipe(concat('style.css'))
      // .pipe(uglifyCSS())
      .pipe(sourcemaps.write('.'))
      .pipe(gulp.dest(distPath + '/css'));
});


gulp.task('default', ['stylesheets', 'fonts', 'images', 'html', 'templates', 'javascripts']);

gulp.task('watch', ['default'], function () {
   gulp.watch(srcPath + '/sass/**/*.scss', ['stylesheets']);
   gulp.watch(srcPath + '/js/**/*.js', ['javascripts']);
   gulp.watch(srcPath + '/templates/**/*.j2', ['templates']);
   gulp.watch(srcPath + '/html/**/*.j2', ['html']);
});
