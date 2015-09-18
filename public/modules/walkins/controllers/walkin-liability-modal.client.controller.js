'use strict';

angular.module('walkins').controller('LiabilityModalCtrl', ['$scope', '$modalInstance', 'walkinInfo',
    function ($scope, $modalInstance, walkinInfo) {
    $scope.walkinInfo = walkinInfo;

    $scope.accept = function (response) {
        $modalInstance.close(response);
    };
    $scope.close = function () {
        $modalInstance.dismiss('cancel');
    };
}]);
