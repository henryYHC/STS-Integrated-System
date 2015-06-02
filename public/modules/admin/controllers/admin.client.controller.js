'use strict';

angular.module('admin').controller('AdminController', ['$scope',
	function($scope) {
		// Controller Logic
		// ...
	}
]).controller('AdminWalkinsController', ['$http', '$scope', '$modal',
    function($http, $scope, $modal){

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
            $http.get('/walkins/'+id).success(function(response){
                $modal.open({
                    animation: true,
                    templateUrl: 'WalkinView.html',
                    controller: 'AdminWalkinViewModalCtrl',
                    size: 'lg',
                    resolve: { walkin : function() { return response; } }
                });
            });
        };

        $scope.deleteWalkin = function(id){
            if(confirm("Are you sure you want to delete this instance?"))
                $http.delete('/walkins/'+id).success(
                    function(){
                        $scope.initQueue();
                        $scope.initListing();
                });
        }
    }
]).controller('AdminWalkinViewModalCtrl', function ($scope, $modalInstance, walkin) {
    $scope.walkin = walkin;

    $scope.close = function () {
        $modalInstance.dismiss('cancel');
    };
});
