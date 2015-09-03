'use strict';

angular.module('admin').controller('DeskTrackerStatsController', ['$scope', '$http', '$location', 'Authentication',
	function($scope, $http, $location, Authentication) {
		//If user is signed in then redirect back home
		if (Authentication.user && Authentication.user.roles.indexOf('admin') < 0)
			$location.path('/');
		$http.get('/task/stats').success(function(response){ $scope.stats = response; });
	}
]);
