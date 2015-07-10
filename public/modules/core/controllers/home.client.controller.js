'use strict';


angular.module('core').controller('HomeController', ['$scope', '$http', 'Authentication',
	function($scope, $http, Authentication) {
		$scope.authentication = Authentication;

        $http.get('/test/servicenow/createWalkin');
	}
]);
