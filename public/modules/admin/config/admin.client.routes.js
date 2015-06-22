'use strict';

//Setting up route
angular.module('admin').config(['$stateProvider', '$urlRouterProvider',
	function($stateProvider, $urlRouterProvider) {
        $urlRouterProvider.otherwise('/admin');

		// Admin state routing
		$stateProvider.
		state('walkin-view', {
			url: '/admin/walkins/:walkinId',
			templateUrl: 'modules/admin/views/walkin-edit.client.view.html'
		}).
		state('walkins-queue', {
			url: '/admin/walkins',
			templateUrl: 'modules/admin/views/walkins-queue.client.view.html'
		}).
        state('walkin-list', {
            url: '/admin/walkins-list',
            templateUrl: 'modules/admin/views/walkin-list.client.view.html'
        }).
		state('admin', {
			url: '/admin',
			templateUrl: 'modules/admin/views/admin.client.view.html'
		});
	}
]);
