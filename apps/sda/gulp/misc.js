const gulp = require('gulp');
const del = require('del');

const conf = require('../conf/gulp.conf');

gulp.task('clean', clean);

function clean() {
  return del([conf.paths.dist, conf.paths.tmp]);
}
