'use strict';

angular.module('admin').controller('CheckinCreateController', ['$http', '$scope', '$stateParams', '$location', 'Authentication', '$modal',
	function($http, $scope, $stateParams, $location, Authentication, $modal) {

		var user = Authentication.user;
		if (!user)
			$location.path('/');
		else if(user.roles.indexOf('technician') < 0 && user.roles.indexOf('admin') < 0)
			$location.path('/');
		else if(user.roles.indexOf('admin') >= 0)
			$scope.isAdmin = true;

		$scope.checkinInfo = { reformatConsent : true, deviceInfoOSAux : {'64bit': true}, itemReceivedAux : {'Laptop':true}};
		//$scope.loadDeviceInfoOSOptions = function(){
		//	$http.get('/checkins/util/loadDeviceInfoOSOptions').success(function(response){
		//		$scope.deviceInfoOSOptions = response;
		//	});
		//};
		//$scope.loadItemReceivedOptions = function(){
		//	$http.get('/checkins/util/loadItemReceivedOptions').success(function(response){
		//		$scope.itemReceivedOptions = response;
		//	});
		//};

		$scope.createCheckin= function(){
			$scope.error = {};
			var checkinInfo = $scope.checkinInfo,
				walkinInfo = $scope.walkinInfo;

			// Formulating string arrays
			var temp, deviceInfoOS = [], itemReceived = [];

			temp = Object.keys(checkinInfo.deviceInfoOSAux);
			for(var i in temp) if(checkinInfo.deviceInfoOSAux[temp[i]]) deviceInfoOS.push(temp[i]);
			temp = Object.keys(checkinInfo.itemReceivedAux);
			for(var j in temp) if(checkinInfo.itemReceivedAux[temp[j]]) itemReceived.push(temp[j]);
			checkinInfo.deviceInfoOS = deviceInfoOS;
			checkinInfo.itemReceived = itemReceived;

			// Validation
			if(!checkinInfo.preDiagnostic){ 		$scope.error.preDiagnosticError = true;	return false; }
			if(!checkinInfo.suggestedAction){ 		$scope.error.suggestedActionError = true;	return false; }
			if(!checkinInfo.deviceManufacturer){ 	$scope.error.manufacturerError = true;	return false; }
			if(!checkinInfo.deviceModel){ 			$scope.error.modelError = true;			return false; }
			if(!checkinInfo.deviceInfoUser){ 		$scope.error.usernameError = true; 		return false; }
			if(!checkinInfo.deviceInfoPwd){ 		$scope.error.passwordError = true; 		return false; }
			if(!checkinInfo.deviceInfoUser){ 		$scope.error.usernameError = true; 		return false; }
			if(walkinInfo.os.indexOf('Windows')>=0 && checkinInfo.deviceInfoOS.length <= 1){
				$scope.error.osError = true; return false;
			}
			if(checkinInfo.itemReceived.length <= 0){
				$scope.error.itemError = true; return false;
			}
			if(checkinInfo.itemReceived.indexOf('Other')>= 0 && !checkinInfo.otherItem){
				$scope.error.otherItemError = true; return false;
			}

			delete $scope.error;
			var viewLibaility = $modal.open({
				animation: true,
				templateUrl: 'modules/admin/views/checkin/checkin-create-liability-modal.client.view.html',
				controller: 'LiabilityModalCtrl',
				size: 'lg',
				resolve: { walkinInfo : function() { return walkinInfo; } }
			});

			viewLibaility.result.then(
				function(response){
					if(response){
						// Create instance
						checkinInfo.liabilitySig = response;
						$http.post('/checkins/'+walkinInfo._id, checkinInfo)
							.success(function(){ $location.path('/admin/checkins'); })
							.error(function(err){ $scope.error.message = err.message; });
					}
				}
			);
		};
	}
]);
