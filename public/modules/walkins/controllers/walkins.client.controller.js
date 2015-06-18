'use strict';

// Walkins controller
angular.module('walkins').controller('WalkinsController', ['$scope', '$state', '$stateParams', '$location', 'Authentication', 'Walkins',
	function($scope, $state,  $stateParams, $location, Authentication, Walkins) {
        $scope.authentication = Authentication;

        $scope.formStatus = { };
        $scope.formData = { };
	}
]).controller('WalkinNetidController', ['$scope', '$state', '$http',
    function($scope, $state, $http) {
        $scope.validateNetID = function(){
            var netid = $scope.formData.user.username;

            $scope.formStatus.netid = false;

            if(netid === undefined || netid === '') {
                $scope.$parent.$parent.error = 'Please put in your NetID.';
            }
            else{
                $http.get('/user/validate/'+netid)
                    .success(function(response){
                        switch(response.status){
                            // User record found
                            case 'Found':
                                $scope.formData.userExisted = true;
                                $scope.formData.user = response.user;
                                break;
                            // User record not found
                            case 'Not found':
                                $scope.formData.userExisted = false;
                                $scope.formData.user = {'username' : netid};
                                break;
                            // User NetId invalid
                            case 'Invalid':
                                $scope.$parent.$parent.error = 'User NetId is invalid';
                                return;
                            default:
                                $scope.$parent.$parent.error = 'Something is wrong with user record query.';
                                return;
                        }

                        delete $scope.$parent.$parent.error;
                        $scope.formStatus.netid = true;
                        $state.go('createWalkin.info');
                    })
                    .error(function(response){
                        $scope.$parent.$parent.error = response;
                    });
            }
        };
    }
]).controller('WalkinInfoController', ['$scope', '$state', '$http',
    function($scope, $state, $http){
        // Form status check
        if(!$scope.formStatus.netid)    $state.go('createWalkin.netid');
        $scope.formStatus.info = false;

        // Load location options
        $scope.offCampus = false;
        $http.get('/walkins/util/loadLocationOptions').success(function(response){
            $scope.locationOptions = response;
            if($scope.formData.userExisted){
                var temp = $scope.formData.user.location;
                delete $scope.formData.user.location;

                if(temp === 'Off Campus') $scope.offCampus = true;
                $scope.formData.user.location = temp;
            }

        });

        // Off campus checkbox
        $scope.offCampusChecked = function(){
            $scope.offCampus = !$scope.offCampus;
            if($scope.offCampus)    $scope.formData.user.location = 'Off Campus';
        };

        // Validation
        $scope.validateInfo = function(){
            var firstName = $scope.formData.user.firstName,
                lastName = $scope.formData.user.lastName,
                phone = $scope.formData.user.phone,
                location = $scope.formData.user.location;

            // Validate first and last name
            if      (!firstName){   $scope.$parent.$parent.error = 'Please put in your first name.'; return; }
            else if (!lastName){    $scope.$parent.$parent.error = 'Please put in your last name.'; return; }

            // Validate phone number
            if(!phone){  $scope.$parent.$parent.error = 'Please put in your phone number in the correct format (All digtis).'; return; }

            // Validate location
            if(!location){   $scope.$parent.$parent.error = 'Please select your residence hall or off campus.'; return; }

            delete $scope.$parent.$parent.error;
            $scope.formStatus.info = true;
            $state.go('createWalkin.device');
        };
    }
]).controller('WalkinDeviceController', ['$scope', '$state', '$http',
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
            if(!$scope.formData.otherDevice)    $scope.$parent.$parent.error = 'Please specify your device information.';
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
]).controller('WalkinProblemController', ['$scope', '$state', '$http',
    function($scope, $state, $http){
        if(!$scope.formStatus.device)     $state.go('createWalkin.device');
        if(!$scope.formStatus.info)     $state.go('createWalkin.info');
        if(!$scope.formStatus.netid)    $state.go('createWalkin.netid');

        $scope.formStatus.problem = false;

        $scope.validateProblem = function(){
            if(!$scope.formData.description) {
                $scope.$parent.$parent.error = 'Please specify your problem.';
                return;
            }
            delete $scope.$parent.$parent.error;
            $scope.formStatus.problem = true;
            $state.go('createWalkin.review');
        };
    }
]).controller('WalkinReviewController', ['$scope', '$state', '$http', '$location', '$modal',
    function($scope, $state, $http, $location, $modal){
        if(!$scope.formStatus.problem)     $state.go('createWalkin.problem');
        if(!$scope.formStatus.device)     $state.go('createWalkin.device');
        if(!$scope.formStatus.info)     $state.go('createWalkin.info');
        if(!$scope.formStatus.netid)    $state.go('createWalkin.netid');

        $scope.submitWalkin = function(){
            var viewLibaility = $modal.open({
                animation: true,
                templateUrl: 'Liability.html',
                controller: 'LiabilityModalCtrl',
                size: 'lg'
            }).result.then(
                function(response){
                    if(response){
                        $scope.formData.liabilityAgreement = response;
                        $http.post('/walkins', $scope.formData)
                            .success(function(){
                                alert('Walk in request submitted sucessfully!');
                                $location.path('/#!/');
                            })
                            .error(function(err){
                                $scope.error = err.message;
                            });
                    }
                }
            );
        };
    }
]).controller('LiabilityModalCtrl', function ($scope, $modalInstance) {
    $scope.accept = function () {
        $modalInstance.close(true);
    };
    $scope.close = function () {
        $modalInstance.dismiss('cancel');
    };
});
