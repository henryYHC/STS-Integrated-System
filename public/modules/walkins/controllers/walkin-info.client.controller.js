'use strict';

angular.module('walkins').controller('WalkinInfoController', ['$scope', '$state', '$http',
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
            $scope.firstNameError = false;
            $scope.lastNameError = false;
            $scope.numberError = false;
            $scope.locationError = false;

            var firstName = $scope.formData.user.firstName,
                lastName = $scope.formData.user.lastName,
                phone = $scope.formData.user.phone,
                location = $scope.formData.user.location;

            // Remove phone format
            if(phone){ phone = phone.replace(/\D/g, ''); $scope.formData.user.phone = phone; }

            // Validate first and last name
            if      (!firstName){   $scope.$parent.$parent.error = 'Please put in your first name.'; $scope.firstNameError = true; return ; }
            else if (!lastName){    $scope.$parent.$parent.error = 'Please put in your last name.'; $scope.lastNameError = true; return; }

            // Validate phone number
            if(!phone || phone.length !== 10){  $scope.$parent.$parent.error = 'Please put in your phone number in the correct format (All digtis).'; $scope.numberError = true; return; }

            // Validate location
            if(!location){   $scope.$parent.$parent.error = 'Please select your residence hall or off campus.'; $scope.locationError = true; return; }

            delete $scope.$parent.$parent.error;
            $scope.formStatus.info = true;
            $state.go('createWalkin.device');
        };
    }
]);
