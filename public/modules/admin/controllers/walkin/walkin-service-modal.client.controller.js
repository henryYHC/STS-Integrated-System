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

        $scope.duplicate = function(){
            if(confirm('Are you sure you want to duplicate this instance?')){
                $http.post('/walkins/duplicate', $scope.walkin).success(function(){
                    alert('Instance duplicated');
                }).error(function(){ alert('Duplication failed.'); });
            }
        };

        $scope.invalidUser = function(){
            var netid = prompt('Please enter the new NetID that this instance belong to:', $scope.walkin.user.username);
            $http.get('/user/validate/'+ netid).success(function(response){

                var user, data;
                switch(response.status){
                    case 'Valid':
                        if(confirm('User information found! Do you want to reassign NetID to this instance?')){
                            user = $scope.walkin.user;
                            data = { create : true, user: response.user };
                            data.user.location = user.location;
                            data.user.phone = user.phone;
                            data.user.displayName = response.user.firstName + ' ' + response.user.lastName;

                            $http.post('/walkins/reassign/netid/' + $scope.walkin._id, data).success(function(walkin){
                                if(confirm('Do you want to set the current user as invalid')){
                                    $http.delete('/users/setInactive/' + $scope.walkin.user.username).error(function(){
                                        alert('Something is wrong with setting user to inactive.');
                                    });
                                }
                                $scope.walkin = walkin;
                                alert('Update successfully.');
                            });
                        }
                        break;
                    case 'Found':
                        if(confirm('User information found! Do you want to reassign NetID to this instance?')){
                            user = $scope.walkin.user;
                            data = { create : false, user : response.user };

                            $http.post('/walkins/reassign/netid/' + $scope.walkin._id, data).success(function(walkin){
                                if(confirm('Do you want to set the current user as invalid')){
                                    $http.delete('/users/setInactive/' + $scope.walkin.user.username).error(function(){
                                        alert('Something is wrong with setting user to inactive.');
                                    });
                                }
                                $scope.walkin = walkin;
                                alert('Update successfully.');
                            });
                        }
                        break;
                    case 'Not found':
                        if(confirm('User information NOT found! Are you sure the customer is eligible for assistance?')){
                            user = $scope.walkin.user; delete user._id;
                            user.username = netid; user.verified = true;
                            data = { create : true, user : user };

                            $http.post('/walkins/reassign/netid/' + $scope.walkin._id, data).success(function(walkin){
                                if(confirm('Do you want to set the current user as invalid')){
                                    $http.delete('/users/setInactive/' + $scope.walkin.user.username).error(function(){
                                        alert('Something is wrong with setting user to inactive.');
                                    });
                                }
                                $scope.walkin = walkin;
                                alert('Update successfully.');
                            });
                        }
                        break;
                    default:
                        alert('Invalid user NetID.');
                        return false;
                }
            }).error(function(){ alert('User assignment failed.'); });
        };

        $scope.toHouseCall = function(){
            var walkin = $scope.walkin;

            if(walkin.workNote){
                walkin.status = 'House call pending';
                walkin.resolution = 'House call technician: , MAC address: .';
                $http.put('/walkins/'+$scope.walkin._id, walkin).success(function(){ $modalInstance.close('saved'); });
            }
            else
                $scope.error = 'Please enter house call appointment date/time in Work Note.';
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
            if(!$scope.walkin.user.verified)
                $scope.error = 'Please verify customer\'s identity.';
            else {
                $scope.save();
                //$scope.error = 'Function under development.';
                //return false;
                $modalInstance.close('transfer');
            }
        };
        $scope.close = function () { $modalInstance.dismiss('cancel'); };
    }
]);
