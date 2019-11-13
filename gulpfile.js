/**
 * @file
 * Gulpfile that builds the theme.
 *
 * Usage:
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

(function () {
  "use strict";

  const fs = require("fs");

  /* Load environment variables */
  let localEnv;

  if (fs.existsSync('./app/env.js')) {
    localEnv = require('./app/env.js');
  }
  else if (fs.existsSync('./env.js')) {
    localEnv = require('./env.js');
  }
  else {
    console.error('================\nNo env file detected.\n================');
    return process.exit(1);
  }

  function getConfig(configName) {
    let config = [];

    if (!(configName in localEnv) || localEnv[configName].length === 0) {
      log('===== No ' + configName + ' config detected. =====');
    }
    else {
      config = localEnv[configName];
    }

    return config;
  }

  // Common packages.
  const gulp = require("gulp");
  const strip = require("gulp-strip-comments");
  const log = require("fancy-log");

  // SCSS Packages.
  const sass = require("gulp-sass");
  const gulpif = require("gulp-if");
  const args = require("yargs").argv;
  const postcss = require("gulp-postcss");
  const postcssCustomProperties = require('postcss-custom-properties');
  const sourcemaps = require("gulp-sourcemaps");
  const autoprefixer = require("autoprefixer");
  const path = require("path");
  const export_sass = require('node-sass-export');

  // JS Packages.
  const babel = require("gulp-babel");
  const rename = require("gulp-rename");

  function handleError(err) {
    console.error(
      "----------------------------------------\n" +
      "%s\n----------------------------------------",
      err
    );
    if (args.ci) {
      // If the task is run by CI, and something went wrong
      // we should exit.
      process.exit(1);
    }
    this.emit("end");
  }

  const cutES6 = title => {
    log("File rename: " + title + " -> " + title.replace(".es6", ""));
    return title.replace(".es6", "");
  };

  function compileJs(globs, componentPath) {
    return gulp
      .src(globs, { cwd: componentPath })
      .pipe(
        babel({
          presets: ["@babel/preset-env"]
        }).on("error", handleError))
      .pipe(strip())
      .pipe(
        rename(function (path) {
          path.basename = cutES6(path.basename);
        })
      )
      .pipe(gulp.dest(path.join(componentPath, 'js')));
  }

  function compileAllJs(done) {
    let config = getConfig('js');
    config.map(function (value) {
      return compileJs(value.globs, value.path);
    });
    done();
  }

  function compileScss(globs, componentPath) {
    return gulp
      .src(globs, { cwd: componentPath })
      .pipe(gulpif(args.debug, gulpif(!args.nosourcemap, sourcemaps.init())))
      .pipe(sass({
        outputStyle: args.debug ? "expanded" : "compressed",
        functions: export_sass(componentPath)
      }).on("error", handleError))
      .pipe(postcss([postcssCustomProperties()]))
      .pipe(postcss([autoprefixer({ grid: "true" })]))
      .pipe(gulpif(!args.debug, strip.text()))
      .pipe(gulpif(args.debug, gulpif(!args.nosourcemap, sourcemaps.write())))
      .pipe(gulp.dest(path.join(componentPath, 'css')));
  }

  function compileAllScss(done) {
    let config = getConfig('scss');
    config.map(function (value) {
      return compileScss(value.globs, value.path);
    });
    done();
  }

  function watchScss() {
    let config = getConfig('scss');
    for (let i = 0; i < config.length; i++) {
      let globs = config[i].globs;
      let componentPath = config[i].path;
      gulp.watch(globs, { cwd: componentPath }, compileAllScss);
    }
  }

  function watchJs() {
    let config = getConfig('js');
    for (let i = 0; i < config.length; i++) {
      let globs = config[i].globs;
      let componentPath = config[i].path;
      gulp.watch(globs, { cwd: componentPath }, compileAllJs);
    }
  }

  exports.default = gulp.parallel(compileAllScss, compileAllJs);
  exports.scss = compileAllScss;
  exports.watchscss = watchScss;
  exports.js = compileAllJs;
  exports.watchjs = watchJs;
  exports.watch = gulp.parallel(watchScss, watchJs);
})();
