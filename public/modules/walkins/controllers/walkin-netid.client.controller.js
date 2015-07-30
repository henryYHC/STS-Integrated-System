'use strict';

angular.module('walkins').controller('WalkinNetidController', ['$scope', '$state', '$http',
    function($scope, $state, $http) {
        $scope.validateNetID = function(){
            console.log($scope.formData);
            var user = $scope.formData.user,  netid = user.username;

            $scope.formStatus.netid = false;

            if(!user || !netid || netid === '') {
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
]);
