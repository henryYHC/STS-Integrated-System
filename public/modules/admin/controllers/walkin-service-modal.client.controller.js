'use strict';

angular.module('admin').controller('AdminWalkinServiceModalCtrl', ['$http', '$scope', '$modalInstance', 'walkin', 'Authentication',
    function ($http, $scope, $modalInstance, walkin, Authentication) {
        $scope.walkin = walkin;

        var user = Authentication.user;
        if (!user || user.roles.indexOf('customer') >= 0)   $modalInstance.dismiss('cancel');

        // log service start time
        if(!walkin.serviceStartTime || walkin.status !== 'Work in progress'){
            $http.put('/walkins/log/logService/'+walkin._id).success(function(response){
                $scope.walkin = response;
            });
        }

        $scope.status = {
            editDeviceType : false, editDeviceInfo: false, editDeviceOS: false, editDeviceOther: false,
            editProblem: false, editWorkNote: false, editResolution: false
        };
        $scope.initDeviceType = function(){ $http.get('/walkins/util/loadDeviceType').success(function(response){ $scope.deviceTypeOptions = response; }); };
        $scope.initDeviceInfo = function(){ $http.get('/walkins/util/loadDeviceInfo').success(function(response){ $scope.deviceInfoOptions = response; }); };
        $scope.initDeviceOS = function(){ $http.get('/walkins/util/loadDeviceOS').success(function(response){ $scope.deviceOSOptions = response; }); };

        $scope.save = function(){
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
            $http.put('/walkins/'+$scope.walkin._id, $scope.walkin).success(function(response){ $modalInstance.close('saved'); });
        };

        $scope.resolve = function(){
            walkin = $scope.walkin;
            switch(walkin.deviceCategory){
                case 'Computer':
                case 'Phone/Tablet':
                    walkin.deviceType = 'N/A';
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

            var resolution = walkin.resolution;
            if(!resolution || resolution.replace(/ /g,'').length < 25)
                $scope.error = 'Resolution has to be at least 25 characters (excluding space)';
            else{
                $http.put('/walkins/'+walkin._id, walkin).success(function(){
                    $http.put('/walkins/log/logResolution/'+walkin._id).success(function(){
                        $modalInstance.close('resolved');
                    });
                });
            }
        };

        $scope.transfer = function () { $modalInstance.close('transfer'); };
        $scope.close = function () { $modalInstance.dismiss('cancel'); };
    }
]);
