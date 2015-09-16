'use strict';

angular.module('admin').controller('CheckinCreateController', ['$http', '$scope', '$stateParams', '$location', 'Authentication',
	function($http, $scope, $stateParams, $location, Authentication) {

		var user = Authentication.user;
		if (!user)
			$location.path('/');
		else if(user.roles.indexOf('technician') < 0 && user.roles.indexOf('admin') < 0)
			$location.path('/');
		else if(user.roles.indexOf('admin') >= 0)
			$scope.isAdmin = true;

		$scope.checkinInfo = { reformatConsent : true, deviceInfoOS : {'64bit': true}};
		$scope.loadDeviceInfoOSOptions = function(){
			$http.get('/checkins/util/loadDeviceInfoOSOptions').success(function(response){
				$scope.deviceInfoOSOptions = response;
			});
		};
		$scope.loadItemReceivedOptions = function(){
			$http.get('/checkins/util/loadItemReceivedOptions').success(function(response){
				$scope.itemReceivedOptions = response;
			});
		};
	}
]);
