'use strict';

angular.module('admin').controller('DeskTrackerStatsController', ['$scope', '$http',
	function($scope, $http) {
		$http.get('/task/stats').success(function(response){ $scope.stats = response; console.log(response); });
	}
]);
