'use strict';

angular.module('walkins').controller('WalkinReviewController', ['$scope', '$state', '$http', '$location', '$modal',
    function($scope, $state, $http, $location, $modal){
        if(!$scope.formStatus.problem)     $state.go('createWalkin.problem');
        if(!$scope.formStatus.device)     $state.go('createWalkin.device');
        if(!$scope.formStatus.info)     $state.go('createWalkin.info');
        if(!$scope.formStatus.netid)    $state.go('createWalkin.netid');


        console.log($scope.formData);
        $scope.submitWalkin = function(){
            var viewLibaility = $modal.open({
                animation: true,
                templateUrl: 'modules/walkins/views/create-walkin-liability-modal.client.view.html',
                controller: 'LiabilityModalCtrl',
                size: 'lg'
            });

            viewLibaility.result.then(
                function(response){
                    if(response){
                        // Create instance
                        $scope.formData.liabilityAgreement = response;
                        $http.post('/walkins', $scope.formData)
                            .success(function(response){
                                alert('Walk in request submitted sucessfully!');
                                $location.path('/#!/');
                            })
                            .error(function(err){ $scope.error = err.message; });
                    }
                }
            );
        };
    }
]);
