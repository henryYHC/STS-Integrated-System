'use strict';

angular.module('admin').controller('AdminCheckinQueueController', ['$http', '$scope', '$location', 'Authentication',
	function($http, $scope, $location, Authentication){

		$http.get('/checkins/workQueue').success(function(workQueueItems){
			console.log(workQueueItems);
		});
	}
]);
