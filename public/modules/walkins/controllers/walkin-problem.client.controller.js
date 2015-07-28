'use strict';

angular.module('walkins').controller('WalkinProblemController', ['$scope', '$state', '$http',
    function($scope, $state, $http){
        if(!$scope.formStatus.device)     $state.go('createWalkin.device');
        if(!$scope.formStatus.info)     $state.go('createWalkin.info');
        if(!$scope.formStatus.netid)    $state.go('createWalkin.netid');

        $scope.formStatus.problem = false;

        $scope.validateProblem = function(){
            $scope.problemError = false;
            if(!$scope.formData.description) {
                $scope.problemError = true;
                $scope.$parent.$parent.error = 'Please specify your problem.';
                return;
            }
            delete $scope.$parent.$parent.error;
            $scope.formStatus.problem = true;
            $state.go('createWalkin.review');
        };
    }
]);
