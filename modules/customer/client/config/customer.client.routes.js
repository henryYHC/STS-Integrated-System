'use strict';

// Setting up route
angular.module('customer').config(['$stateProvider', '$urlRouterProvider',
  function ($stateProvider, $urlRouterProvider) {

    // Home state routing
    $stateProvider
      .state('customer', {
        abstract: true,
        url: '/customer',
        templateUrl: 'modules/customer/client/views/template.client.view.html'
      })
      .state('customer.home', {
        url: '/home',
        templateUrl: 'modules/customer/client/views/home.client.view.html'
      })
      .state('customer.walkin', {
        abstract: true,
        url: '/walkin',
        templateUrl: 'modules/customer/client/views/walkin-template.client.view.html'
      })
      .state('customer.walkin.netid', {
        url: '/netid'
      });

    $urlRouterProvider.when('/', '/customer/home');
    $urlRouterProvider.when('/customer', '/customer/home');

    $urlRouterProvider.when('/customer/walkin', '/customer/walkin/netid');
  }
]);
