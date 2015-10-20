'use strict';

angular.module('admin').controller('AdminFunctionController', ['$http', '$scope', '$modal',
    function($http, $scope, $modal) {
        $scope.sendCleanFieldEmail = function(){
            var service = $modal.open({
                animation: true,
                templateUrl: 'modules/admin/views/email/email-send-modal-admin.client.view.html',
                controller: 'LiabilityModalCtrl',
                size: 'lg',
                backdrop: 'static',
                resolve: { walkinInfo : function() { return null; } }
            });

            service.result.then(function(email){
                $http.post('/email', email).error(function(){
                    alert('Failed to send the email');
                });
            });
        };
    }
]);
