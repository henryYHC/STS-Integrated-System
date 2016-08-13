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
        templateUrl: 'modules/customer/client/views/home/home.client.view.html'
      })
      .state('customer.walkin', {
        abstract: true, url: '/walkin',
        templateUrl: 'modules/customer/client/views/walkin/walkin-template.client.view.html'
      })
      .state('customer.invalid-user', {
        url: '/invalid-user',
        templateUrl: 'modules/customer/client/views/walkin/walkin-invalidUser.client.view.html'
      })
      .state('customer.walkin.netid', {
        url : '/netid',
        templateUrl: 'modules/customer/client/views/walkin/walkin-netid.client.view.html'
      })
      .state('customer.walkin.first-name', {
        url: '/first-name',
        templateUrl: 'modules/customer/client/views/walkin/walkin-firstName.client.view.html'
      })
      .state('customer.walkin.last-name', {
        url: '/last-name',
        templateUrl: 'modules/customer/client/views/walkin/walkin-lastName.client.view.html'
      })
      .state('customer.walkin.phone', {
        url: '/phone',
        templateUrl: 'modules/customer/client/views/walkin/walkin-phone.client.view.html'
      })
      .state('customer.walkin.location', {
        url: '/location',
        templateUrl: 'modules/customer/client/views/walkin/walkin-location.client.view.html'
      });

    $urlRouterProvider.when('/', '/customer/home');
    $urlRouterProvider.when('/customer', '/customer/home');

    $urlRouterProvider.when('/customer/walkin', '/customer/walkin/netid');
  }
]);
