const gulp = require('gulp')
const cleanCSS = require('gulp-clean-css')

const paths = {
  css: {
    src: 'styles/css/**/*.css',
    dest: 'styles/css/',
  },
}

function minifyCSS() {
  return gulp
    .src(paths.css.src)
    .pipe(cleanCSS())
    .pipe(gulp.dest(paths.css.dest))
}

function watchFiles() {
  gulp.watch(paths.css.src, minifyCSS)
}

const build = gulp.parallel(minifyCSS)
const watch = gulp.series(build, watchFiles)

exports.build = build
exports.watch = watch
exports.default = build
