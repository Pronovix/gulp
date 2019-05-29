/**
 * USAGE
 *
 * For the first time run `npm install`. This installs the node modules needed
 * from the 'package.json' file.
 *
 * Once you have installed the node modules, you can use the following commands:
 *  `npm run gulp`
 *    this will fire the default task, creating a minified css.
 *
 *  `npm run gulp watch`
 *    this will watch for changes in the sass files, and crates a minified css.
 */

(function() {
  "use strict";

  var fs = require("fs");

  // Load environment variables
  var localEnv = {};

  if (fs.existsSync('./env.js')) {
    localEnv = require('./env.js');
  }
  else {
    console.error('================\nNo env file detected.\n================');
    return process.exit();
  }

  if(localEnv.localThemePaths.length === 0) {
    console.error('================\nNo theme paths detected.\n================');
    return process.exit();
  }

  // Packages.
  var gulp = require("gulp");
  var sass = require("gulp-sass");
  var gulpif = require("gulp-if");
  var args = require("yargs").argv;
  var postcss = require("gulp-postcss");
  var sourcemaps = require("gulp-sourcemaps");
  var strip = require("gulp-strip-comments");
  var autoprefixer = require("autoprefixer");
  var path = require("path");
  var export_sass = require('node-sass-export');

  // Theme paths.
  var themePaths = localEnv.localThemePaths;
  var scss = 'scss/**/*.scss';

  function handleError(err) {
    console.error(
      "----------------------------------------\n" +
        "%s\n----------------------------------------",
      err
    );
    if (args.jenkins) {
      // If the task is run by jenkins, and something went wrong
      // we should exit.
      process.exit(1);
    }
    this.emit("end");
  }

  function compile(themePath) {
    return gulp
      .src(path.join(themePath, scss))
      .pipe(gulpif(args.debug, gulpif(!args.nosourcemap, sourcemaps.init())))
      .pipe(sass({
        outputStyle: args.debug ? "expanded" : "compressed",
        functions: export_sass(themePath)
      }).on("error", handleError))
      .pipe(gulpif(args.debug, gulpif(!args.nosourcemap, sourcemaps.write())))
      .pipe(postcss([autoprefixer({ grid: "true", browsers: ["last 2 version"] })]))
      .pipe(gulpif(!args.debug, strip.text()))
      .pipe(gulp.dest(path.join(themePath, 'css')));
  }

  function compileAllThemes(done) {
    themePaths.map(function(themePath) {
      return compile(themePath);
    });
    done();
  }

  function watch() {
    var themeScssPaths = [];
    for (var index = 0; index < themePaths.length; index++) {
      themeScssPaths[index] = path.join(themePaths[index], scss);
    }
    gulp.watch(themeScssPaths, compileAll);
  }

  var compileAll = gulp.series(compileAllThemes);
  var compileAllAndWatch = gulp.series(compileAllThemes, watch);

  exports.default = compileAll;
  exports.watch = compileAllAndWatch;
})();
