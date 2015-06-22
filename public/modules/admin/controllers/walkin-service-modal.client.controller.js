'use strict';

angular.module('admin').controller('AdminWalkinServiceModalCtrl', ['$http', '$scope', '$modalInstance', 'walkin',
    function ($http, $scope, $modalInstance, walkin) {
        $scope.walkin = walkin;

        $scope.resolve = function(){
            
            $modalInstance.close('resolved');
        };

        $scope.transfer = function () { $modalInstance.close('transfer'); };

        $scope.discard = function () {
            if(confirm('Are you sure you want to discard this instance?'))
                $http.delete('/walkins/'+walkin._id).success(function(){ $modalInstance.close(); });
        };

        $scope.close = function () { $modalInstance.dismiss('cancel'); };
    }
]);
