# Gulp Theme task runner

## Usage

- Rename `.env.js` as `env.js` to your project and set your local theme paths 
- Run the container: `docker run --rm pronovix/gulp -v $PWD:/build/app npm run gulp`
- Enjoy

## Debugging

- If you want to have non-minified CSS with sourcemaps, run `npm run gulp -- --debug` or `npm run gulp watch -- --debug`.
