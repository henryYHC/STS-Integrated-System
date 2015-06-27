'use strict';

// Walkins controller
angular.module('walkins').controller('WalkinsController', ['$scope', '$state', '$stateParams', '$location', 'Authentication', 'Walkins',
	function($scope, $state,  $stateParams, $location, Authentication, Walkins) {
        $scope.authentication = Authentication;

        $scope.formStatus = { };
        $scope.formData = { };
	}
]);
