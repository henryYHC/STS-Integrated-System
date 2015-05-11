'use strict';

// Walkins controller
angular.module('walkins').controller('WalkinsController', ['$scope', '$state', '$stateParams', '$location', 'Authentication', 'Walkins',
	function($scope, $state,  $stateParams, $location, Authentication, Walkins) {
		//$location.path('walkins/netid');
        $scope.authentication = Authentication;

        $scope.formData = {};

		// Create new Walkin
		$scope.createWalkin = function() {
			// Create new Walkin object
			var walkin = new Walkins ({
				name: this.name
			});

			// Redirect after save
			walkin.$save(function(response) {
				$location.path('walkins/' + response._id);

				// Clear form fields
				$scope.name = '';
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Remove existing Walkin
		$scope.remove = function(walkin) {
			if ( walkin ) { 
				walkin.$remove();

				for (var i in $scope.walkins) {
					if ($scope.walkins [i] === walkin) {
						$scope.walkins.splice(i, 1);
					}
				}
			} else {
				$scope.walkin.$remove(function() {
					$location.path('walkins');
				});
			}
		};

		// Update existing Walkin
		$scope.update = function() {
			var walkin = $scope.walkin;

			walkin.$update(function() {
				$location.path('walkins/' + walkin._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Find a list of Walkins
		$scope.find = function() {
			$scope.walkins = Walkins.query();
		};

		// Find existing Walkin
		$scope.findOne = function() {
			$scope.walkin = Walkins.get({ 
				walkinId: $stateParams.walkinId
			});
		};

        // Validation
        $scope.validateNetID = function() {
            var netid = $scope.formData.netid;
        }
	}
]).controller('WalkinNetidController', ['$scope', '$state', '$http',
        function($scope, $state, $http) {

        }
]);
