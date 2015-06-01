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
                    controller: 'ModalInstanceCtrl',
                    size: 'lg',
                    resolve: { walkin : function() { return response; } }
                });
            });
        };
    }
]).controller('ModalInstanceCtrl', function ($scope, $modalInstance, walkin) {
    $scope.walkin = walkin;
    console.log(walkin);

    $scope.close = function () {
        $modalInstance.dismiss('cancel');
    };
});
