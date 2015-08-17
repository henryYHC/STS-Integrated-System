'use strict';

angular.module('admin').controller('AdminController', ['$http', '$scope', '$location', 'Authentication', '$timeout',
    function($http, $scope, $location, Authentication, $timeout) {
        var user = Authentication.user;
        if (!user)
            $location.path('/');
        else if (user.roles.indexOf('technician') < 0 && user.roles.indexOf('admin') < 0)
            $location.path('/');
        else if (user.roles.indexOf('admin') >= 0)
            $scope.isAdmin = true;

        $scope.verifyAdmin = function () {
            if (!$scope.adminVerified) {
                var pwd = prompt('Please input your password again for verification:', '');
                $http.post('/auth/authenticate', {password: pwd})
                    .success(function () {
                        $scope.adminVerified = true;
                        $timeout(function(){ $scope.adminVerified = false;}, 20000);
                    })
                    .error(function (err) { alert(err); });
            }
        };
    }
]);
