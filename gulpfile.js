var gulp = require('gulp')
var webserver = require('gulp-webserver')
var browserify = require('browserify')
var babelify = require('babelify')
var source = require('vinyl-source-stream')
var del = require('del')
var jest = require('jest-cli')

gulp.task('server', function () {
  gulp.src('./build')
    .pipe(webserver({
      host: '0.0.0.0',
      port: 8080,
      fallback: 'index.html',
      livereload: false
    }))
})

gulp.task('test', function (done) {
  return jest.runCLI({
    config: {
      verbose: true,
      rootDir: '__tests__',
      scriptPreprocessor: '../node_modules/babel-jest',
      testFileExtensions: ['es6', 'js'],
      moduleFileExtensions: ['es6', 'js', 'json']
    }
  }, '.', function (success) {
    if (!success) {
      process.exit(1)
    }
    done()
  })
})

gulp.task('stylus', function () {
  gulp.src('./src/assets/**/*')
    .pipe(gulp.dest('./build/assets'))
})

gulp.task('build', ['stylus'], function () {
  browserify({
    entries: './src/app/app.js',
    extensions: ['.jsx'],
    debug: true
  })
  .transform(babelify)
  .bundle()
  .pipe(source('bundle.js'))
  .pipe(gulp.dest('./build'))
  gulp.src('./src/index.html')
  .pipe(gulp.dest('./build'))
  gulp.src('./src/app/**/*.jsx')
  .pipe(gulp.dest('./build/app'))
  gulp.src('./src/app/**/*.js')
  .pipe(gulp.dest('./build/app'))
  gulp.src('./src/app/**/*.json')
  .pipe(gulp.dest('./build/app'))
})

gulp.task('clean', function () {
  del('./build/**/*')
})

gulp.task('watch', function () {
  gulp.watch(['./src/index.html', './src/app/**/*.jsx', './src/app/**/*.js'], ['build'])
  gulp.watch('./src/assets/**/*', ['stylus'])
})

gulp.task('default', ['server', 'watch'])

gulp.task('run', ['build', 'server', 'watch'])

gulp.task('deploy', ['build', 'test', 'server'])
