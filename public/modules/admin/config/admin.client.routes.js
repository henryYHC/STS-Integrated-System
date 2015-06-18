'use strict';

//Setting up route
angular.module('admin').config(['$stateProvider',
	function($stateProvider) {
		// Admin state routing
		$stateProvider.
		state('walkin-view', {
			url: '/admin/walkins/:walkinId',
			templateUrl: 'modules/admin/views/walkin-view.client.view.html'
		}).
		state('walkins', {
			url: '/admin/walkins',
			templateUrl: 'modules/admin/views/walkins.client.view.html'
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
