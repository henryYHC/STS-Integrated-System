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

        $scope.popover = {
            templateUrl: 'popoverTemplate.html',
            adminPwd:''
        };

        $scope.verifyAdmin = function () {
            $scope.adminError = undefined;
            if (!$scope.adminVerified) {
                var pwd = $scope.popover.adminPwd;
                $http.post('/auth/authenticate', {password: pwd})
                    .success(function () {
                        $scope.adminVerified = true;
                        $scope.popover.adminPwd = '';
                        $timeout(function(){ $scope.adminVerified = false;}, 20000);
                    })
                    .error(function (err) { $scope.adminError = err; });
            }
        };
    }
]);
