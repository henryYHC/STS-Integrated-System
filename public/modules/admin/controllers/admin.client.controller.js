'use strict';

angular.module('admin').controller('AdminController', ['$http', '$scope', '$location', 'Authentication',
    function($http, $scope, $location, Authentication){
        var user = Authentication.user;
        if(user.roles.indexOf('admin') >= 0) $scope.isAdmin = true;

        if (!user || user.roles.indexOf('customer') >= 0) $location.path('/');
    }
]);
