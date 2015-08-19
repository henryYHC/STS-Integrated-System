'use strict';

angular.module('users').controller('PwdResetController', ['$scope', '$stateParams', '$http', '$location',
	function($scope, $stateParams, $http, $location) {
        $http.post('/force/resetPassword/'+$stateParams.netid)
            .success(function(){ $location.path('/staff'); })
            .error(function(response){ $scope.response = response; });
	}
]);
