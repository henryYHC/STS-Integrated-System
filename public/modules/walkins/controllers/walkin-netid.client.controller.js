'use strict';

angular.module('walkins').controller('WalkinNetidController', ['$scope', '$state', '$http',
    function($scope, $state, $http) {
        $scope.validateNetID = function(){
            var user = $scope.formData.user,  netid = user.username;

            $scope.formStatus.netid = false;

            if(!user || !netid || netid === '') {
                $scope.$parent.$parent.error = 'Please put in your NetID.';
            }
            else if(!isNaN(netid.charAt(0)) || !(/^\w+$/.test(netid))){
                $scope.$parent.$parent.error = 'Please put in your NetID correctly.';
            }
            else{
                $http.get('/user/validate/'+netid)
                    .success(function(response){
                        delete $scope.$parent.$parent.error;
                        $scope.formStatus.netid = true;

                        switch(response.status){
                            // User record found
                            case 'Found':
                                $scope.formData.userExisted = true;
                                $scope.formData.user = response.user;
                                $state.go('createWalkin.info');
                                break;
                            // User record not found
                            case 'Not found':
                                $scope.formData.userExisted = false;
                                $scope.formData.user = {'username' : netid};
                                $state.go('createWalkin.confirmNetId');
                                break;
                            // User NetId invalid
                            case 'Invalid':
                                $scope.$parent.$parent.error = 'User NetId is invalid';
                                return;
                            default:
                                $scope.$parent.$parent.error = 'Something is wrong with user record query.';
                                return;
                        }
                    })
                    .error(function(response){
                        $scope.$parent.$parent.error = response;
                    });
            }
        };
    }
]);
