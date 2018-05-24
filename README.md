# boss #

## Running a server locally ##
* Install ruby version listed in `.ruby-version`
* Install bundler `gem install bundler`
* Install project gems `bundle install`
* Create a developement database `bundle exec rake db:create`
* Migrate the database `bundle exec rake db:migrate`
* Install node version specified `package.json` (possibly with nvm https://github.com/creationix/nvm)
* Install npm packages `npm install`
* Generate the frontend bundle `./node_modules/.bin/webpack`
* Run the rails server `bundle exec rails server`
* Enjoy

## Run development mode (server, webpack and livereload together)

* Make sure you have `foreman` installed. If not, run `gem install foreman`
* Make sure you have `webpack` installed globally. If not, run `npm i -g webpack` 
* Run `foreman start -f development.proc`

## Run server so it's accessible from the local network

`bundle exec rails server --binding=0.0.0.0`

## To pull down data from production

`bundle exec rake data:load_production_dump`

## Setting staff member PINs

```
bundle exec rails console  
$ staff_member = StaffMember.find(<put id here>)  
$ staff_member.update_attributes!(pin_code: "<put new pin here>")
```

## Running front-end tests

Run `npm test`.

### Debugging front-end tests

Change the `singleRun` property in "karma.conf.js" to false. Then run `npm test` and click the Debug button in the new Chrome window.

## Show backend routes

`bin/rake routes`

## Required Environment varibles

For this project to run properly the follow environment variables must be set

`ROLLBAR_API_ACCESS_TOKEN`

`ROLLBAR_POST_SERVER_ITEM_ACCESS_TOKEN`


`S3_ASSETS_BUCKET`

`SMTP_USERNAME`

`SMTP_PASSWORD`

`AWS_ACCESS_KEY_ID`

`AWS_SECRET_ACCESS_KEY`

`DARKSKY_API_KEY`

`NEW_RELIC_LICENSE_KEY`

`DATABASE_URL`

`REDIS_URL`

`ABLY_API_KEY`

`RERAISE_SSE_ERRORS` # When set to false errors in SSE updates will not cause a something went wrong page to appear but will be raised to rollball.

`BACKUP_TO_S3`

`S3_BACKUP_FOLDER`

`S3_BACKUP_REGION`

`USE_SUBDOMAINS` # when true assumes that each app's requests will come on a different subdomain based on our naming convention seen in `config/routes.rb`. When false apps requests will be mounted on the root. An example would be the `clock` subdomain which is mapped to `/clock` when this is false. Using `example.com` as the domain, `clock.example.com/foo` when true is the same as `example.com/clock/foo` when false)

`SECRET_KEY_BASE`
