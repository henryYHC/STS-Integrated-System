'use strict';

angular.module('admin').controller('AdminCheckinQueueController', ['$http', '$scope', '$location', 'Authentication', '$modal',
	function($http, $scope, $location, Authentication, $modal){

		var user = Authentication.user;
		if (!user)	$location.path('/');
		else if(user.roles.indexOf('technician') < 0 && user.roles.indexOf('admin') < 0)
			$location.path('/');

		$scope.technician = user;

		$scope.initQueues = function(){
			$scope.workQueueItems = undefined;
			$scope.pendingQueueItems = undefined;
			$scope.initWorkQueue();
			$scope.initPendingQueue();
		};

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

		$scope.initTemplates = function(){
			$http.get('/checkins/getTemplates').success(function(templates){
				console.log(templates);
				$scope.templates = templates;
			});
		};

		$scope.viewCheckin = function(checkin){
			$scope.checkin = checkin;
			$scope.template = checkin.templateApplied;
			console.log(checkin);
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

		$scope.findLogWithAttr = function(attr, value) {
			var items = $scope.checkin.serviceLog;
			for(var i = 0; i < items.length; i ++) {
				if(items[i][attr] === value)	return i;
			}
			return -1;
		};

		$scope.logService = function(log, type, callback){
			if(log){
				$http.post('/checkins/log/'+$scope.checkin._id, {checkin : $scope.checkin, log : {description : log, type: type}})
					.success(function(){
						$http.get('/checkins/'+$scope.checkin._id).success(function(checkin){
							$scope.workQueueItems[$scope.workQueueItems.indexOf($scope.checkin)] = checkin;
							$scope.checkin = checkin;
							$scope.serviceLog = undefined;
							if(callback) callback(checkin);
						});
					}
				);
			}
		};

		$scope.applyTemplate = function(templateName){
			$http.put('/checkins/'+$scope.checkin._id, {templateApplied : templateName})
				.success(function(response){
					$scope.logService('Template (' + templateName + ') applied', 'Note', function(checkin){
						$scope.checkin = checkin;
					});
				});
		};

		$scope.reprintLabel = function(){
			if(confirm('Are you sure you want to reprint label for this instance?'))
				$http.get('/checkins/printLabel/' + $scope.checkin._id);
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
			if(status === 'Completed')
				$scope.checkout();
			else if(confirm('Are you sure you want to set the status to ' + status)){
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
							$scope.initQueues();
							$scope.checkin = checkin;
							$scope.checkin = checkin;
						});
					}
				);
			}
		};

		$scope.checkout = function(){
			var viewLibaility = $modal.open({
				animation: true,
				templateUrl: 'modules/admin/views/checkin/checkin-pickup-liability-modal.client.view.html',
				controller: 'LiabilityModalCtrl',
				size: 'lg',
				resolve: { walkinInfo : function() { return $scope.checkin.user.displayName; } }
			});

			viewLibaility.result.then(
				function(response){
					if(response){
						$http.put('/checkins/'+$scope.checkin._id, {pickupSig: response, status : 'Completed'})
							.success(function(){
								$http.post('/checkins/setStatus/'+$scope.checkin._id, {status: 'Completed'})
									.success(function(){
										$scope.logService('Status changed to Completed', 'Note',
											function(){ $scope.checkin = undefined; $scope.initQueues(); });
								});
							})
							.error(function(err){ alert('Action failed.'); });
					}
				}
			);

		};

		$scope.editItemReceived = function(){
			// Formulate current item received
			var itemReceived = {}, itemReceivedAux = {}, temp = $scope.checkin.itemReceived;
			for(var i in temp)	itemReceivedAux[temp[i]] = true;
			itemReceived.itemReceivedAux = itemReceivedAux;
			if($scope.checkin.otherItem) itemReceived.otherItem = $scope.checkin.otherItem;

			var updatedItems = $modal.open({
				animation: true,
				templateUrl: 'modules/admin/views/checkin/checkin-edit-itemReceived-modal.client.view.html',
				controller: 'LiabilityModalCtrl',
				size: 'sm',
				resolve: { walkinInfo : function() { return itemReceived; } }
			});

			updatedItems.result.then(
				function(response){
					var temp, obj = {itemReceived : []};
					temp = Object.keys(response.itemReceivedAux);
					for(var j in temp) if(response.itemReceivedAux[temp[j]]) obj.itemReceived.push(temp[j]);
					if(response.otherItem) obj.otherItem = response.otherItem;

					$http.put('/checkins/'+$scope.checkin._id, obj)
						.success(function(){
							$scope.logService('Item received updated.', 'Note', function(checkin){
								$scope.checkin = checkin;
							});
						});
				}
			);
		};

		$scope.sendEmail = function(){
			var service = $modal.open({
				animation: true,
				templateUrl: 'modules/admin/views/email/email-send-modal.client.view.html',
				controller: 'LiabilityModalCtrl',
				size: 'lg',
				backdrop: 'static',
				resolve: { walkinInfo : function() { return $scope.checkin; } }
			});

			service.result.then(function(email){
				email.email = $scope.checkin.user.username + '@emory.edu';
				email.name = $scope.checkin.user.displayName;

				$http.post('/email', email).error(function(){
					alert('Failed to send the email');
				});
			});
		};
	}
]);
