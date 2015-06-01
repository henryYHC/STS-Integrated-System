'use strict';

//Setting up route
angular.module('admin').config(['$stateProvider',
	function($stateProvider) {
		// Admin state routing
		$stateProvider.
		state('walkins', {
			url: '/admin/walkins',
			templateUrl: 'modules/admin/views/walkins.client.view.html'
		}).
		state('admin', {
			url: '/admin',
			templateUrl: 'modules/admin/views/admin.client.view.html'
		});
	}
]);
