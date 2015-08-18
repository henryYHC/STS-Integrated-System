'use strict';

// Walkins controller
angular.module('walkins').controller('WalkinsController', ['$scope', '$state', '$stateParams', '$location', 'Authentication', '$timeout',
	function($scope, $state,  $stateParams, $location, Authentication, $timeout) {
        $scope.authentication = Authentication;
        $scope.formStatus = { };
        $scope.formData = { user: {} };

        $scope.homeRedirector = function(second){
            $timeout(function(){ $location.path('/'); }, second*1000);
        };
	}
]);
