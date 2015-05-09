'use strict';

//Setting up route
angular.module('walkins').config(['$stateProvider',
	function($stateProvider) {
		// Walkins state routing
		$stateProvider.
		state('listWalkins', {
			url: '/walkins',
			templateUrl: 'modules/walkins/views/list-walkins.client.view.html'
		}).
		state('createWalkin', {
			url: '/walkins/create',
			templateUrl: 'modules/walkins/views/create-walkin.client.view.html'
		}).
		state('viewWalkin', {
			url: '/walkins/:walkinId',
			templateUrl: 'modules/walkins/views/view-walkin.client.view.html'
		}).
		state('editWalkin', {
			url: '/walkins/:walkinId/edit',
			templateUrl: 'modules/walkins/views/edit-walkin.client.view.html'
		});
	}
]);