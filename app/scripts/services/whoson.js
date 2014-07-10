'use strict';

angular.module('bulbsCmsApp')
  .service('WhosOn', function WhosOn($location, $firebase) {

    var fbase = new Firebase('http://luminous-fire-8340.firebaseio.com');
    fbase.set({hi: '1'});
  });
