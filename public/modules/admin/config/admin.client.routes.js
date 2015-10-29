'use strict';

//Setting up route
angular.module('admin').config(['$stateProvider', '$urlRouterProvider',
	function($stateProvider, $urlRouterProvider) {
        $urlRouterProvider.otherwise('/admin');

		// Admin state routing
		$stateProvider.
		state('checkin-view', {
			url: '/admin/checkins/:checkinId',
			templateUrl: 'modules/admin/views/checkin/checkin-view.client.view.html'
		}).
		state('checkin-queue', {
			url: '/admin/checkins',
			templateUrl: 'modules/admin/views/checkin/checkin-queue.client.view.html'
		}).
		state('checkin-create', {
			url: '/admin/walkins/transfer/:walkinId',
			templateUrl: 'modules/admin/views/checkin/checkin-create.client.view.html'
		}).
		state('checkin-list', {
			url: '/admin/checkins-list',
			templateUrl: 'modules/admin/views/checkin/checkin-list.client.view.html'
		}).
		state('user-list', {
			url: '/admin/users-list',
			templateUrl: 'modules/admin/views/user/user-list.client.view.html'
		}).
		state('desk-tracker-stats', {
			url: '/admin/desktask/stats',
			templateUrl: 'modules/admin/views/desk-tracker/desk-tracker-stats.client.view.html'
		}).
		state('servicenow-sync', {
			url: '/admin/servicenowSync',
			templateUrl: 'modules/admin/views/util/servicenow-sync.client.view.html'
		}).
		state('import-netid-entries', {
			url: '/admin/importNetIdEntries',
			templateUrl: 'modules/admin/views/util/import-netid-entries.client.view.html'
		}).
		state('walkin-view', {
			url: '/admin/walkins/:walkinId',
			templateUrl: 'modules/admin/views/walkin/walkin-edit.client.view.html'
		}).
		state('walkins-queue', {
			url: '/admin/walkins',
			templateUrl: 'modules/admin/views/walkin/walkins-queue.client.view.html'
		}).
        state('walkin-list', {
            url: '/admin/walkins-list',
            templateUrl: 'modules/admin/views/walkin/walkin-list.client.view.html'
        }).
		state('admin', {
			url: '/admin',
			templateUrl: 'modules/admin/views/admin.client.view.html'
		});
	}
]);
