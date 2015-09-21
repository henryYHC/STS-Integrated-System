'use strict';

angular.module('walkins').controller('LiabilityModalCtrl', ['$scope', '$modalInstance',
    function ($scope, $modalInstance) {

    //if(walkinInfo)  $scope.walkinInfo = walkinInfo;

    $scope.accept = function (response) {
        $modalInstance.close(response);
    };
    $scope.close = function () {
        $modalInstance.dismiss('cancel');
    };
}]);
