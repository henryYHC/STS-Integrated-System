'use strict';

// Setting up route
angular.module('technician.admin').config(['$stateProvider', '$urlRouterProvider',
  function ($stateProvider, $urlRouterProvider) {

    // Home state routing
    $stateProvider
      .state('admin', {
        abstract: true,
        url: '/admin',
        controller: 'TechAdminController',
        templateUrl: 'modules/technician/client/views/template.client.view.html'
      })
      .state('admin.users', {
        url: '/users',
        templateUrl: 'modules/technician/client/views/admin/admin-users.client.view.html',
        data: { breadcrumb: 'Register/Reset User' }
      })
      .state('admin.setting', {
        url: '/setting',
        templateUrl: 'modules/technician/client/views/admin/admin-setting.client.view.html',
        data: { breadcrumb: 'System Setting' }
      });

    $urlRouterProvider.when('/admin', '/tech/home');
  }
]);
