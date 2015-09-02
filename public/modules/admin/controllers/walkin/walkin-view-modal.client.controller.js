'use strict';

angular.module('admin').controller('AdminWalkinViewModalCtrl', function ($scope, $modalInstance, walkin) {
    $scope.walkin = walkin;
    console.log(walkin);

    $scope.close = function () { $modalInstance.dismiss('cancel'); };
});
