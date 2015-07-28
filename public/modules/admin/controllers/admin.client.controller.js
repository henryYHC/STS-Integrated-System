'use strict';

angular.module('admin').controller('AdminController', ['$http', '$scope', '$location', 'Authentication',
    function($http, $scope, $location, Authentication){
        var user = Authentication.user;
        if (!user)
            $location.path('/');
        else if(user.roles.indexOf('technician') < 0 && user.roles.indexOf('admin') < 0)
            $location.path('/');
        else if(user.roles.indexOf('admin') >= 0)
            $scope.isAdmin = true;
    }
]);
