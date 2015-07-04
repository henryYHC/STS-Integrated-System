'use strict';

angular.module('admin').controller('WalkinviewController', ['$http', '$scope', '$stateParams', '$location', 'Authentication',
    function($http, $scope, $stateParams, $location, Authentication){

        var user = Authentication.user;
        if (!user || user.roles.indexOf('customer') >= 0) $location.path('/');

        $scope.walkin = {};
        $scope.status = {
            editDeviceType : false, editDeviceInfo: false, editDeviceOS: false, editDeviceOther: false,
            editProblem: false, editWorkNote: false, editResolution: false
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
                    if($scope.walkin.os && $scope.walkin.os !== 'N/A' && $scope.walkin.os !== 'Other'){
                        $scope.walkin.otherDevice = undefined;
                        $http.put('/walkins/'+$scope.walkin._id, $scope.walkin).success(function(response){ console.log(response); });
                    }
                    else if($scope.walkin.os === 'Other' && !$scope.walkin.otherDevice)
                        $http.put('/walkins/'+$scope.walkin._id, $scope.walkin).success(function(response){ console.log(response); });

                    break;
                case 'Gaming System':
                case 'TV/Media Device':
                    $scope.walkin.os = 'N/A';
                    if($scope.walkin.deviceType && $scope.walkin.deviceType !== 'N/A' && $scope.walkin.deviceType !== 'Other'){
                        $scope.walkin.otherDevice = undefined;
                        $http.put('/walkins/'+$scope.walkin._id, $scope.walkin).success(function(response){ console.log(response); });
                    }
                    else if($scope.walkin.deviceType === 'Other' && !$scope.walkin.otherDevice)
                        $http.put('/walkins/'+$scope.walkin._id, $scope.walkin).success(function(response){ console.log(response); });

                    break;
                default:
                    $scope.walkin.deviceType = 'N/A'; $scope.walkin.os = 'N/A';
                    if($scope.walkin.otherDevice) $http.put('/walkins/'+$scope.walkin._id, $scope.walkin).success(function(response){ console.log(response); });
            }
        };

        $scope.updateWalkin = function(){
            switch($scope.walkin.deviceCategory){
                case 'Computer':
                case 'Phone/Tablet':
                    $scope.walkin.deviceType = 'N/A';
                    $scope.walkin.otherDevice = undefined;
                    break;
                case 'Gaming System':
                case 'TV/Media Device':
                    $scope.walkin.os = 'N/A';
                    $scope.walkin.otherDevice = undefined;
                    break;
                default:
                    $scope.walkin.deviceType = 'N/A';
                    $scope.walkin.os = 'N/A';
            }
            $http.put('/walkins/'+$scope.walkin._id, $scope.walkin).success(function(response){ });
        };

        $scope.deleteWalkin = function(id){ if(confirm('Are you sure you want to delete this instance?')) $http.delete('/walkins/'+id).success(function(){ $location.path('/admin'); }); };
    }
]);
