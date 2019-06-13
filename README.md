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
