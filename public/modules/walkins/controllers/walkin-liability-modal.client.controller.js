'use strict';

angular.module('walkins').controller('LiabilityModalCtrl', function ($scope, $modalInstance) {
    $scope.accept = function () {
        $modalInstance.close(true);
    };
    $scope.close = function () {
        $modalInstance.dismiss('cancel');
    };
});
