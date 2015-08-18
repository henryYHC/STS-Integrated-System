'use strict';

//Setting up route
angular.module('walkins').config(['$stateProvider',
	function($stateProvider) {
		// Walkins state routing
		$stateProvider.
		state('create-walkin-success', {
			url: '/success',
			templateUrl: 'modules/walkins/views/create-walkin-success.client.view.html'
		}).
        state('createWalkin', {
            abstract: true,
            url: '/walkins',
            templateUrl: 'modules/walkins/views/create-walkin.client.view.html',
            css: 'modules/walkins/css/new-walkin.css'
        }).

        // Multi-page walkin form route
        state('createWalkin.netid', {
            url: '',
            templateUrl: 'modules/walkins/views/create-walkin-netid.client.view.html'
        }).
        state('createWalkin.confirmNetId', {
            url: '/confirmNetId',
            templateUrl: 'modules/walkins/views/create-walkin-netid-confirm.client.view.html'
        }).
        state('createWalkin.info', {
            url: '/info',
            templateUrl: 'modules/walkins/views/create-walkin-info.client.view.html'
        }).
        state('createWalkin.device', {
            url: '/device',
            templateUrl: 'modules/walkins/views/create-walkin-device.client.view.html'
        }).
        state('createWalkin.problem', {
            url: '/problem',
            templateUrl: 'modules/walkins/views/create-walkin-problem.client.view.html'
        }).
        state('createWalkin.review', {
            url: '/review',
            templateUrl: 'modules/walkins/views/create-walkin-review.client.view.html'
        }).

        // Walkin form functions
		state('listWalkins', {
			url: '/walkins/list',
			templateUrl: 'modules/walkins/views/list-walkins-queue.client.view.html'
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
