'use strict';

angular.module('admin').controller('AdminController', ['$scope',
	function($scope) {
		// Controller Logic
		// ...
	}
]).controller('WalkinviewController', ['$http', '$scope', '$stateParams',
    function($http, $scope, $stateParams){

        $scope.walkin = {};
        $scope.status = {
            editDeviceType : false,
            editDeviceInfo: false,
            editDeviceOS: false,
            editDeviceOther: false,
            editProblem: false,
            editWorkNote: false,
            editResolution: false
        };

        $scope.initWalkin = function(){ $http.get('/walkins/'+$stateParams.walkinId).success(function(response){ $scope.walkin = response; console.log(response); }); };
        $scope.initDeviceType = function(){ $http.get('/walkins/util/loadDeviceType').success(function(response){ $scope.deviceTypeOptions = response; }); };
        $scope.initDeviceInfo = function(){ $http.get('/walkins/util/loadDeviceInfo').success(function(response){ $scope.deviceInfoOptions = response; }); };
        $scope.initDeviceOS = function(){ $http.get('/walkins/util/loadDeviceOS').success(function(response){ $scope.deviceOSOptions = response; }); };

        $scope.updateDevice = function(){
            switch($scope.walkin.deviceCategory){
                case 'Computer':
                case 'Phone/Tablet':
                    $scope.walkin.deviceType = 'N/A';
                    if($scope.walkin.os && $scope.walkin.os != 'N/A' && $scope.walkin.os != 'Other'){
                        $scope.walkin.otherDevice = undefined;
                        $http.put('/walkins/'+$scope.walkin._id, $scope.walkin).success(function(response){ console.log(response); });
                    }
                    else if($scope.walkin.os == 'Other' && !$scope.walkin.otherDevice)
                        $http.put('/walkins/'+$scope.walkin._id, $scope.walkin).success(function(response){ console.log(response); });

                    break;
                case 'Gaming System':
                case 'TV/Media Device':
                    $scope.walkin.os = 'N/A';
                    if($scope.walkin.deviceType && $scope.walkin.deviceType != 'N/A' && $scope.walkin.deviceType != 'Other'){
                        $scope.walkin.otherDevice = undefined;
                        $http.put('/walkins/'+$scope.walkin._id, $scope.walkin).success(function(response){ console.log(response); });
                    }
                    else if($scope.walkin.deviceType == 'Other' && !$scope.walkin.otherDevice)
                        $http.put('/walkins/'+$scope.walkin._id, $scope.walkin).success(function(response){ console.log(response); });

                    break;
                default:
                    $scope.walkin.deviceType = 'N/A';
                    $scope.walkin.os = 'N/A';
                    if($scope.walkin.otherDevice)
                        $http.put('/walkins/'+$scope.walkin._id, $scope.walkin).success(function(response){ console.log(response); });
            }
        };

        $scope.updateWalkin = function(){
            switch($scope.walkin.deviceCategory){
                case 'Computer':
                case 'Phone/Tablet':
                    $scope.walkin.deviceType = 'N/A';
                    break;
                case 'Gaming System':
                case 'TV/Media Device':
                    $scope.walkin.os = 'N/A';
                    break;
                default:
                    $scope.walkin.deviceType = 'N/A';
                    $scope.walkin.os = 'N/A';
            }
            $http.put('/walkins/'+$scope.walkin._id, $scope.walkin).success(function(response){ });
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
