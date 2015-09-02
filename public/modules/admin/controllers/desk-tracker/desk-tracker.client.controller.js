'use strict';

angular.module('admin').controller('DeskTrackerController', ['$scope', '$http', '$timeout',
	function($scope, $http, $timeout) {
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
