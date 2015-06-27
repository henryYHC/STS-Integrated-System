'use strict';

angular.module('admin').controller('AdminWalkinsQueueController', ['$http', '$scope', '$modal', '$location', 'Authentication', '$interval', '$rootScope',
    function($http, $scope, $modal, $location, Authentication, $interval, $rootScope){

        var user = Authentication.user;
        if (!user || user.roles.indexOf('customer') >= 0) $location.path('/');

        $scope.initQueue = function(){ $http.get('/walkins/queue').success(function(response){ $scope.queueCount = 0; $scope.queueItems = response; }); };
        $scope.quickviewWalkin = function(id){ $http.get('/walkins/'+id).success(function(response){ $scope.quickWalkin = response; }); };

        // Auto refresh
        $scope.autoRefresher = $interval(function(){ $scope.initQueue(); }, 5000);
        $rootScope.$on('$locationChangeSuccess', function() { $interval.cancel($scope.autoRefresher); });

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

        $scope.serviceWalkin = function(id){
            if(id !== undefined){
                $http.get('/walkins/'+id).success(function(response){
                    var service = $modal.open({
                        animation: true,
                        templateUrl: 'modules/admin/views/walkin-service-modal.client.view.html',
                        controller: 'AdminWalkinServiceModalCtrl',
                        size: 'lg',
                        resolve: { walkin : function() { return response; } }
                    });
                    service.result.then(function(result){
                        switch(result){
                            case 'resolved':
                                break;
                            case 'transfer':
                                alert('Function under development.');
                        }
                        // Re-init queue
                        $scope.initQueue();
                    });
                });
            }
        };
    }
]);
