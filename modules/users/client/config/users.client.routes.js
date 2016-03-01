'use strict';

// Setting up route
angular.module('users').config(['$stateProvider',
  function ($stateProvider) {
    // Users state routing
    $stateProvider
      .state('login', {
        url: '/login',
        templateUrl: 'modules/users/client/views/login.client.view.html'
      });
  }
]);
