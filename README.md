# Gulp Theme task runner

## Usage

### Configuration

Copy `env.js.dist` as `env.js` and symlink `gulpfile.js`, `package.json` and `package-lock.json` to a Drupal theme's
root.

## Debugging

If you want to have non-minified CSS with sourcemaps, run 
`npm run gulp -- --debug` or `npm run gulp watch -- --debug`.

## Troubleshooting

* You get `No env file detected.` error when running `npm run gulp`: You have
copied your `env.js` file to a wrong folder.
* `npm run gulp` runs with no issues, but you still don't have the compiled CSS:
Make sure to give the correct path to your theme.
