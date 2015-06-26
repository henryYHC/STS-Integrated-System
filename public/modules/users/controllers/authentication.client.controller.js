'use strict';

angular.module('users').controller('AuthenticationController', ['$scope', '$http', '$location', 'Authentication',
	function($scope, $http, $location, Authentication) {
		$scope.authentication = Authentication;

        $scope.initAdmin = function() {
            $http.post('/auth/initAdmin', $scope.credentials).success(function(response) {
                $scope.authentication.user = response;
                $location.path('/admin');
            }).error(function(response) {
                $scope.error = response.message;
            });
        };

		$scope.signup = function() {
			$http.post('/auth/signup', $scope.credentials).success(function(response) {
				$location.path('/admin');
			}).error(function(response) {
				$scope.error = response.message;
			});
		};

		$scope.signin = function() {
			$http.post('/auth/signin', $scope.credentials).success(function(response) {
				$scope.authentication.user = response;
				$location.path('/admin');
			}).error(function(response) {
				$scope.error = response.message;
			});
		};
	}
]);
