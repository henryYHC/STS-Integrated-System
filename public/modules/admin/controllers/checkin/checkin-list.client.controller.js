'use strict';

angular.module('admin').controller('AdminCheckinListingController', ['$http', '$scope', '$modal', '$location', 'Authentication',
    function($http, $scope, $modal, $location, Authentication){

        var user = Authentication.user;
        if (!user)
            $location.path('/');
        else if(user.roles.indexOf('technician') < 0 && user.roles.indexOf('admin') < 0)
            $location.path('/');

        $scope.currentDate = new Date(Date.now());
        $scope.month = $scope.currentDate.getMonth()+1;
        $scope.year  = $scope.currentDate.getFullYear();
        $scope.monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

        $scope.init = function(){
            $http.get('/checkins/list/metadata')
                .success( function(metadata){ $scope.metadata = metadata; })
                .error  ( function(){ $scope.metadata = null; });
        };

        $scope.$watch('[year, month]', function(){
            $http.get('/checkins/list/' + $scope.year + '/' + $scope.month).success(
                function(checkins){ $scope.checkins = checkins; });
        });
    }
]);
