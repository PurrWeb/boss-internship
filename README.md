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
