# Gulp Theme task runner

## Usage

### Configuration

Copy `.env.js` as `env.js` to your project and set your local theme paths 

### Standlone container

Run the container: 
`docker run --rm pronovix/gulp -v $PWD:/build/app npm run gulp`

### Part of a compose project

```yaml
services:
  gulp:
    image: pronovix/gulp
    volumes:
      - .:/build/app:delegated
```

Then run the container: `docker-compose run --rm gulp sh -c 'npm run gulp'`.

## Debugging

If you want to have non-minified CSS with sourcemaps, run 
`npm run gulp -- --debug` or `npm run gulp watch -- --debug`.

## Troubleshooting

* You get `No env file detected.` error when running `npm run gulp`: You have
copied your `env.js` file to a wrong folder. It should be located next to your
`docker-compose.yml` file.
* `npm run gulp` runs with no issues, but you still don't have the compiled CSS:
Make sure to give the correct path to your theme, the path should start with
`app/...`.
