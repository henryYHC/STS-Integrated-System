'use strict';

angular.module('admin').controller('AdminWalkinServiceModalCtrl', ['$http', '$scope', '$modalInstance', 'walkin', 'Authentication',
    function ($http, $scope, $modalInstance, walkin, Authentication) {
        $scope.walkin = walkin;

        var user = Authentication.user;
        if (!user)
            $modalInstance.dismiss('cancel');
        else if(user.roles.indexOf('technician') < 0 && user.roles.indexOf('admin') < 0)
            $modalInstance.dismiss('cancel');

        // log service start time
        if(!walkin.serviceTechnician || !walkin.serviceStartTime ||
            walkin.status !== 'Work in progress' || walkin.status !== 'House call pending'){
            $http.put('/walkins/log/logService/'+walkin._id).success(function(response){
                $scope.walkin = response;
            });
        }

        $scope.userUpdated = false; $scope.userVerified = $scope.walkin.user.verified;
        $scope.initDeviceType = function(){ $http.get('/walkins/util/loadDeviceType').success(function(response){ $scope.deviceTypeOptions = response; }); };
        $scope.initDeviceInfo = function(){ $http.get('/walkins/util/loadDeviceInfo').success(function(response){ $scope.deviceInfoOptions = response; }); };
        $scope.initDeviceOS = function(){ $http.get('/walkins/util/loadDeviceOS').success(function(response){ $scope.deviceOSOptions = response; }); };
        $scope.initResolutionType = function(){ $http.get('/walkins/util/loadResolutionOptions').success(function(response){ $scope.resolutionOptions = response; }); };
        $scope.initLocation = function(){ $http.get('/walkins/util/loadLocationOptions').success(function(response){ $scope.locationOptions = response; }); };

        $scope.updateName = function(){ $scope.walkin.user.displayName = $scope.walkin.user.firstName + ' ' + $scope.walkin.user.lastName; };
        $scope.updatePhone = function(){ $scope.walkin.user.phone = $scope.walkin.user.phone.replace(/\D/g, ''); };
        $scope.updateUser = function(){ $scope.updateName(); $scope.updatePhone(); $scope.userUpdated = true; };

        $scope.toHouseCall = function(){
            var walkin = $scope.walkin;

            if(walkin.workNote){
                walkin.status = 'House call pending';
                walkin.resolution = 'House call technician: , MAC address: .';
                $http.put('/walkins/'+$scope.walkin._id, walkin).success(function(){ $modalInstance.close('saved'); });
            }
            else
                $scope.error = 'Please enter house call appointment detail in Work Note.';
        };

        $scope.save = function(){
            if(walkin.resolutionType !== 'Other') walkin.otherResolution = '';
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

            if($scope.userUpdated)
                $http.put('/user/update/'+$scope.walkin.user.username, $scope.walkin.user);
            if(!$scope.userVerified && $scope.walkin.user.verified)
                $http.put('/user/verify/'+$scope.walkin.user.username);

            $http.put('/walkins/'+$scope.walkin._id, $scope.walkin).success(function(response){ $modalInstance.close('saved'); });
        };

        $scope.resolve = function(){
            walkin = $scope.walkin;
            if(walkin.resolutionType !== 'Other') walkin.otherResolution = '';
            switch(walkin.deviceCategory) {
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
            if(walkin.resolutionType === 'N/A')
                $scope.error = 'Please select a resolution type.';
            else if(walkin.resolutionType === 'Other' && !walkin.otherResolution)
                $scope.error = 'Please put in the resolution subject for other resolution.';
            else if(walkin.resolutionType === 'Other' && walkin.otherResolution.length > 20)
                $scope.error = 'Resolution subject has more than 20 characters.';
            else if(!resolution || resolution.replace(/ /g,'').length < 25)
                $scope.error = 'Resolution has to be at least 25 characters (excluding space)';
            else if(!$scope.walkin.user.verified)
                $scope.error = 'Please verify customer\'s identity.';
            else{
                $http.put('/walkins/'+walkin._id, walkin).success(function(){
                    if($scope.userUpdated) $http.put('/user/update/'+$scope.walkin.user.username, $scope.walkin.user);
                    if(!$scope.userVerified && $scope.walkin.user.verified) $http.put('/user/verify/'+$scope.walkin.user.username);
                    $http.put('/walkins/log/logResolution/'+walkin._id).success(function(){
                        $modalInstance.close('resolved');
                    });
                });
            }
        };

        $scope.transfer = function () {
            alert('Function under development.');
            return false;
            //$modalInstance.close('transfer');
        };
        $scope.close = function () { $modalInstance.dismiss('cancel'); };
    }
]);
