bulbs-cms
=========

`grunt build` to compile

Development
-----------

Install [node.js](http://nodejs.org/download/)

Install dependencies:

    npm install
    npm install -g bower
    bower install

`grunt serve` to run the dev server

`grunt test` will jshint and unit test your code as you make changes

`grunt travis` will run unit tests once

Deploying
---------

1. git checkout release
2. git merge master
3. grunt publish
4. update bower versions on your site's bower.json
