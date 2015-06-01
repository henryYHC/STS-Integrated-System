'use strict';

angular.module('admin').controller('AdminController', ['$scope',
	function($scope) {
		// Controller Logic
		// ...
	}
]).controller('AdminWalkinsController', ['$http', '$scope',
    function($http, $scope){

        $scope.initQueue = function(){
            $http.get('/walkins/queue').success(function(response){
                $scope.queueCount = 0;
                $scope.queueItems = response;
            });
        };

        $scope.initListing = function(){
            $http.get('/walkins').success(function(response){
                $scope.walkins = response;
            });
        };

        $scope.viewWalkin = function(id){
            $('#WalkinView').show();
        };
    }
]);
