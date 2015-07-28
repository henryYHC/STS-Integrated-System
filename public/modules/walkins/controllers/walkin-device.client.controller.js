'use strict';

angular.module('walkins').controller('WalkinDeviceController', ['$scope', '$state', '$http',
    function($scope, $state, $http){
        // Form status check
        if(!$scope.formStatus.info)     $state.go('createWalkin.info');
        if(!$scope.formStatus.netid)    $state.go('createWalkin.netid');

        $scope.formStatus.device = false;
        $scope.formData.deviceCategory = '';
        $scope.formData.deviceType = '';
        $scope.formData.os = '';
        $scope.formData.otherDevice = '';

        // State initialization
        $scope.state = { 'deviceCategory' : true, 'computerOS' : false, 'mobileOS' : false, 'TVMDevice' : false, 'GamingDevice' : false, otherDevice : false };

        $scope.selectDeviceCategory = function(category){
            $scope.formData.deviceCategory = category;

            if(category === 'Other'){
                setState('otherDevice');
                $scope.formData.deviceType = 'Other';
            }
            else                        setState(category);
        };

        $scope.selectOS = function(os){
            $scope.formData.os = os;

            if(os === 'Other')    setState('otherDevice');
            else                        validateDevice();
        };

        $scope.selectDeviceType = function(type){
            $scope.formData.deviceType = type;

            if(type === 'Other')    setState('otherDevice');
            else                        validateDevice();
        };

        // Validate device
        $scope.validateOtherDevice = function(){
            $scope.otherDeviceError = false;
            if(!$scope.formData.otherDevice)    {
                $scope.otherDeviceError = true;
                $scope.$parent.$parent.error = 'Please specify your device information.';
            }
            else                                validateDevice();
        };

        var validateDevice = function() {
            if ($scope.state.otherDevice || ($scope.formData.deviceCategory && ($scope.formData.os || $scope.formData.deviceType))) {
                delete $scope.$parent.$parent.error;
                $scope.formStatus.device = true;
                $state.go('createWalkin.problem');
            }
            else
                $scope.$parent.$parent.error = 'There is something wrong with your device selection.';
        };

        // State helper function
        $scope.resetState = function(){
            setState('deviceCategory');
        };

        var setState = function(state){
            $scope.state.deviceCategory = false;
            $scope.state.computerOS = false;
            $scope.state.mobileOS = false;
            $scope.state.TVMDevice = false;
            $scope.state.GamingDevice = false;
            $scope.state.otherDevice = false;

            switch(state){
                case 'deviceCategory':  $scope.state.deviceCategory = true; break;
                case 'Computer':      $scope.state.computerOS = true; break;
                case 'Phone/Tablet':        $scope.state.mobileOS = true; break;
                case 'TV/Media Device':       $scope.state.TVMDevice = true; break;
                case 'Gaming System':    $scope.state.GamingDevice = true; break;
                case 'otherDevice':     $scope.state.otherDevice = true; break;

            }
        };
    }
]);
