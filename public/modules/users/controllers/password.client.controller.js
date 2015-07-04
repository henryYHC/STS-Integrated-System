'use strict';

angular.module('users').controller('PasswordController', ['$scope', '$stateParams', '$http', '$location', 'Authentication',
	function($scope, $stateParams, $http, $location, Authentication) {
		$scope.authentication = Authentication;

		//If user is signed in then redirect back home
		if ($scope.authentication.user && $scope.authentication.user.roles.indexOf('admin') < 0)
            $location.path('/');

		// Submit forgotten password account id
		$scope.resetUserPassword = function() {
			$scope.success = $scope.error = null;
			$http.post('/admin/resetPassword/' + $scope.credentials.username).success(function(response) {
				// Show user success message and clear form
                $scope.credentials = null;
				$scope.success = 'New password is ' + response.token;
			}).error(function(response) {
				// Show user error message and clear form
				$scope.credentials = null;
				$scope.error = response.message;
			});
		};
	}
]);
