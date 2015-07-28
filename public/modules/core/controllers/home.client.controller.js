'use strict';

angular.module('core').controller('HomeController', ['$scope', '$http', 'Authentication',
	function($scope, $http, Authentication) {
		$scope.authentication = Authentication;

        $http.get('/test/servicenow/createWalkin');
	}
]).controller('HomeStaffController', ['$scope', '$http', '$location', 'Authentication',
    function($scope, $http, $location, Authentication) {
        var user = Authentication.user;

        if(!user) return false;
        if (user.roles.indexOf('technician') >= 0 || user.roles.indexOf('admin') >= 0)
            $location.path('/admin');
}]);
