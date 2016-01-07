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
