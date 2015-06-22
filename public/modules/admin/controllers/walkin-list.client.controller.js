'use strict';

angular.module('admin').controller('AdminWalkinListingController', ['$http', '$scope', '$modal', '$location', 'Authentication',
    function($http, $scope, $modal, $location, Authentication){

        var user = Authentication.user;
        if (!user || user.roles.indexOf('customer') >= 0) $location.path('/');

        $scope.initListing = function(){ $http.get('/walkins').success(function(response){ $scope.walkins = response; }); };

        $scope.viewWalkin = function(id){
            $http.get('/walkins/'+id).success(function(response){
                $modal.open({
                    animation: true,
                    templateUrl: 'modules/admin/views/walkin-view-modal.client.view.html',
                    controller: 'AdminWalkinViewModalCtrl',
                    size: 'lg',
                    resolve: { walkin : function() { return response; } }
                });
            });
        };

        $scope.editWalkin = function(id){ if(id !== undefined){ $location.path('/admin/walkins/'+id); } };
        $scope.deleteWalkin = function(id){ if(confirm('Are you sure you want to delete this instance?')) $http.delete('/walkins/'+id).success(function(){ $scope.initListing(); }); };
    }
]);
