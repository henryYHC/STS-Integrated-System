'use strict';

angular.module('admin').controller('DeskTrackerController', ['$scope', '$http', '$timeout', 'Authentication',
	function($scope, $http, $timeout, Authentication) {
        if (Authentication.user.roles.indexOf('admin') >= 0)
            $scope.isAdmin = true;

        $scope.initTaskOptions = function(){
            $http.get('/task/util/loadTaskOptions').success(function(response){
                $scope.tasks = response;
            });
        };

        $scope.submitTask = function(task){
            $http.post('/task', {task : task}).success(function(){
                $scope.submitted = true;
                $timeout(function(){$scope.submitted = false;}, 5000);
            });
        };
	}
]);
