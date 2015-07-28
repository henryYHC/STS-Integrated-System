'use strict';

angular.module('admin').controller('AdminWalkinViewModalCtrl', function ($scope, $modalInstance, walkin) {
    $scope.walkin = walkin;

    var user = Authentication.user;
    if (!user)
        $modalInstance.dismiss('cancel');
    else if(user.roles.indexOf('technician') < 0 && user.roles.indexOf('admin') < 0)
        $modalInstance.dismiss('cancel');

    $scope.close = function () { $modalInstance.dismiss('cancel'); };
});
