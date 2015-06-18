'use strict';

angular.module('admin').controller('AdminController', ['$scope',
	function($scope) {
		// Controller Logic
		// ...
	}
]).controller('WalkinviewController', ['$http', '$scope', '$stateParams',
    function($http, $scope, $stateParams){
        $scope.initWalkin = function(){
            $http.get('/walkins/'+$stateParams.walkinId).success(function(response){
                $scope.walkin = response;

                console.log(response);
            });
        };
    }
]).controller('AdminWalkinsController', ['$http', '$scope', '$modal', '$location',
    function($http, $scope, $modal, $location){

        $scope.initQueue = function(){
            $http.get('/walkins/queue').success(function(response){
                $scope.queueCount = 0; $scope.queueItems = response;
            });
        };

        $scope.quickviewWalkin = function(id){
            $http.get('/walkins/'+id).success(function(response){ $scope.quickWalkin = response; });
        };

        $scope.viewWalkin = function(id){
            $http.get('/walkins/'+id).success(function(response){
                $modal.open({
                    animation: true,
                    templateUrl: 'modules/admin/views/walkin-modal.client.view.html',
                    controller: 'AdminWalkinViewModalCtrl',
                    size: 'lg',
                    resolve: { walkin : function() { return response; } }
                });
            });
        };

        $scope.editWalkin = function(id){
            if(id !== undefined){
                console.log('Editing ' + id);
            }
        };
    }
]).controller('AdminWalkinListingController', ['$http', '$scope', '$modal', '$location',
    function($http, $scope, $modal, $location){
        $scope.initListing = function(){ $http.get('/walkins').success(function(response){ $scope.walkins = response; }); };

        $scope.viewWalkin = function(id){
            $http.get('/walkins/'+id).success(function(response){
                $modal.open({
                    animation: true,
                    templateUrl: 'modules/admin/views/walkin-modal.client.view.html',
                    controller: 'AdminWalkinViewModalCtrl',
                    size: 'lg',
                    resolve: { walkin : function() { return response; } }
                });
            });
        };

        $scope.deleteWalkin = function(id){
            if(confirm('Are you sure you want to delete this instance?'))
                $http.delete('/walkins/'+id).success(function(){ $scope.initListing(); });
        };
    }
]).controller('AdminWalkinViewModalCtrl', function ($scope, $modalInstance, walkin) {
    $scope.walkin = walkin;
    $scope.close = function () { $modalInstance.dismiss('cancel'); };
});
