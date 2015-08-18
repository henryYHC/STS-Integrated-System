'use strict';

angular.module('admin').controller('ImportNetIdEntriesController', ['$scope', '$locaton', 'Authentication',
	function($scope, $location, Authentication) {
        $scope.authentication = Authentication;

        //If user is signed in then redirect back home
        if ($scope.authentication.user && $scope.authentication.user.roles.indexOf('admin') < 0)
            $location.path('/');
	}
]);
