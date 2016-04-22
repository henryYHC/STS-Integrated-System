'use strict';

// Setting up route
angular.module('technician').config(['$stateProvider', '$urlRouterProvider',
  function ($stateProvider, $urlRouterProvider) {

    // Home state routing
    $stateProvider
      .state('tech', {
        abstract: true,
        url: '/tech',
        controller: 'TechPanelController',
        templateUrl: 'modules/technician/client/views/template.client.view.html'
      })
      .state('tech.home', {
        url: '/home',
        templateUrl: 'modules/technician/client/views/home.client.view.html',
        data: { breadcrumb : 'Dashboard' }
      })
      .state('tech.password', {
        url: '/password',
        templateUrl: 'modules/technician/client/views/technician/technician-change-pwd.client.view.html',
        data: { breadcrumb : 'Change Password' }
      });

    $urlRouterProvider.when('/tech', '/tech/home');
  }
]);
