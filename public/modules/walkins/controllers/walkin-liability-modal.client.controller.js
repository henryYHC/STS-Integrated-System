'use strict';

angular.module('walkins').controller('LiabilityModalCtrl', function ($scope, $modalInstance) {
    $scope.accept = function (response) {
        $modalInstance.close(response);
    };
    $scope.close = function () {
        $modalInstance.dismiss('cancel');
    };
});
