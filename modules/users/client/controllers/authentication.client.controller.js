'use strict';

angular.module('users').controller('LoginController', ['$scope', '$state', '$http', '$location', 'Authentication',
  function ($scope, $state, $http, $location, Authentication) {
    $scope.authentication = Authentication;

    // Get an eventual error defined in the URL query string:
    $scope.error = $location.search().err;

    // If user is signed in then redirect back home
    if ($scope.authentication.user) {
      $location.path('/tech');
    }

    $scope.signin = function() {
      $scope.error = null;

      if (!$scope.credentials || !$scope.credentials.username || !$scope.credentials.password){
        $scope.error = 'Missing required login credentials.';
        return false;
      }

      $http.post('/api/auth/signin', $scope.credentials).success(function (response) {
        $scope.authentication.user = response; $location.url('/tech');
      }).error(function (response) { $scope.error = response.message; });
    };
  }
]);
