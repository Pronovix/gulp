# Gulp Theme task runner

## Usage

### Configuration

1. Copy `gulpsettings.js.dist` as `gulpsettings.js` to the folder where `Jenkinsfile` resides.
2. Configure the newly copied `gulpsettings.js`. Path can be either relative or absolute. See [Gulp src](https://gulpjs.com/docs/en/api/src)'s `cwd` option documentation for further information.

### gulpsettings.js example

```javascript
/**
 * @file
 * Provide configuration for the task runner.
 */

module.exports = {
  scss: [
    {
      path: "/path/to/source",
      globs: [
        "scss/**/*.scss",
        "!scss/01-vendor/**"
      ]
    }
  ],
  js: [
    {
      path: "/path/to/source",
      globs: [
        "js/**/*.es6.js"
      ]
    }
  ]
};

```

## Debugging

If you want to have non-minified CSS with sourcemaps, run
`npm run gulp -- --debug` or `npm run gulp watch -- --debug`.

## Troubleshooting

* You get `No gulpsettings.js file detected.` error when running `npm run gulp`: You have
copied your `gulpsettings.js` file to a wrong folder.
* `npm run gulp` runs with no issues, but you still don't have the compiled CSS:
Make sure to give the correct path to your theme.
