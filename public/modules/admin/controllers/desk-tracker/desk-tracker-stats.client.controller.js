'use strict';

angular.module('admin').controller('DeskTrackerStatsController', ['$scope', '$http', '$location', 'Authentication',
	function($scope, $http, $location, Authentication) {
		//If user is signed in then redirect back home
		if (Authentication.user && Authentication.user.roles.indexOf('admin') < 0)
			$location.path('/');
		$http.get('/task/stats').success(function(response){ $scope.stats = response; });

		$scope.resetStats = function(){
			if(confirm('Are you sure you want to reset the statistics?'))
				$http.delete('/task/reset').success(function(){ $scope.stats = undefined; });
		};
	}
]);
