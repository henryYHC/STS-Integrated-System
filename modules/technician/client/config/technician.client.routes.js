'use strict';

// Setting up route
angular.module('technician').config(['$stateProvider', '$urlRouterProvider',
  function ($stateProvider, $urlRouterProvider) {

    // Home state routing
    $stateProvider
      .state('login', {
        url: '/login',
        templateUrl: 'modules/technician/client/views/authentication/login.client.view.html'
      })
      // Main views and functions
      .state('tech', {
        abstract: true, url: '/tech',
        templateUrl: 'modules/technician/client/views/panel/template.client.view.html'
      })
      .state('tech.home', {
        url: '/home',
        templateUrl: 'modules/technician/client/views/panel/home.client.view.html',
        data: { breadcrumb : 'Dashboard' }
      })
      .state('tech.password', {
        url: '/password',
        templateUrl: 'modules/technician/client/views/technician/tech-change-pwd.client.view.html',
        data: { breadcrumb : 'Change Password' }
      })
      // Walk-in
      .state('tech.walkin', {
        abstract: true, url: '/walkin', template: '<ui-view>'
      })
      .state('tech.walkin.queue',{
        url: '/queue',
        templateUrl: 'modules/technician/client/views/walkin/walkin-queue.client.view.html',
        data: { breadcrumb : 'Walk-ins: Active Queue' }
      });

    $urlRouterProvider.when('/tech', '/tech/home');
  }
]);
