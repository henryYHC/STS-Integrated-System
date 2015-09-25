'use strict';

angular.module('admin').controller('AdminCheckinQueueController', ['$http', '$scope', '$location', 'Authentication', '$modal',
	function($http, $scope, $location, Authentication, $modal){

		var user = Authentication.user;
		if (!user)	$location.path('/');
		else if(user.roles.indexOf('technician') < 0 && user.roles.indexOf('admin') < 0)
			$location.path('/');

		$scope.technician = user;

		$scope.initWorkQueue = function(){
			$http.get('/checkins/workQueue').success(function(workQueueItems){
				$scope.workQueueItems = workQueueItems;
			});
		};

		$scope.initPendingQueue = function(){
			$http.get('/checkins/pendingQueue').success(function(pendingQueueItems){
				$scope.pendingQueueItems = pendingQueueItems;
			});
		};

		$scope.viewCheckin = function(checkin){
			$scope.checkin = checkin;
		};

		$scope.viewWalkin = function(id){
			$http.get('/walkins/'+id).success(function(response){
				$modal.open({
					animation: true,
					templateUrl: 'modules/admin/views/walkin/walkin-view-modal.client.view.html',
					controller: 'AdminWalkinViewModalCtrl',
					size: 'lg',
					resolve: { walkin : function() { return response; } }
				});
			});
		};

		$scope.logService = function(log, type){
			if(log){
				$http.post('/checkins/log/'+$scope.checkin._id, {checkin : $scope.checkin, log : {description : log, type: type}})
					.success(function(){
						$http.get('/checkins/'+$scope.checkin._id).success(function(checkin){
							$scope.workQueueItems[$scope.workQueueItems.indexOf($scope.checkin)] = checkin;
							$scope.checkin = checkin;
							$scope.serviceLog = undefined;
						});
					}
				);
			}
		};

		$scope.setLogStyle = function(type){
			switch(type){
				case 'Important':
					return {'color' : 'red', 'font-weight': 'bold'};
				case 'Note':
					return {'color' : 'blue', 'font-style': 'italic'};
			}
			return {};
		};

		$scope.setStatus = function(status){
			if(confirm('Are you sure you want to set the status to ' + status)){
				if(status === 'User action pending'){
					var note = prompt('Reason for setting the status to pending', '');
					if(!note) return false;

					$scope.logService('Status changed to '+status, 'Note');
					$scope.logService('-->' + note, 'Note');
				}
				else $scope.logService('Status changed to '+status, 'Note');

				$http.post('/checkins/setStatus/'+$scope.checkin._id, {status: status})
					.success(function(){
						$http.get('/checkins/'+$scope.checkin._id).success(function(checkin){
							$scope.initWorkQueue();
							$scope.initPendingQueue();
							$scope.checkin = checkin;
							if(status === 'Completed')	$scope.checkin = undefined;
							else						$scope.checkin = checkin;
						});
					}
				);
			}
		};
	}
]);
