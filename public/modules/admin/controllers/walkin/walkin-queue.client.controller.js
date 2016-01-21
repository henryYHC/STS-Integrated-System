'use strict';

angular.module('admin').controller('AdminWalkinsQueueController', ['$http', '$scope', '$modal', '$location', 'Authentication', '$interval', '$rootScope', '$timeout',
    function($http, $scope, $modal, $location, Authentication, $interval, $rootScope, $timeout){

        var user = Authentication.user;
        if (!user)
            $location.path('/');
        else if(user.roles.indexOf('technician') < 0 && user.roles.indexOf('admin') < 0)
            $location.path('/');

        $scope.editWorkNote = false;

        $scope.initQueue = function(){
            $http.get('/walkins/queue').success(function(response){
                $scope.queueCount = 0;
                $scope.queueItems = response.incidents;
                $scope.queueInterval = response.interval;

                $scope.autoRefresher = $interval(function(){ $scope.refreshQueue(); }, $scope.queueInterval);
                $rootScope.$on('$locationChangeSuccess', function() { $interval.cancel($scope.autoRefresher); });
            });
        };

        $scope.refreshQueue = function(){
            $scope.queueItems = undefined;
            $http.get('/walkins/queue').success(function(response){
                $scope.queueCount = 0;
                $scope.queueItems = response.incidents;
                $scope.queueInterval = response.interval;

                $interval.cancel($scope.autoRefresher);
                $scope.autoRefresher = $interval(function(){ $scope.refreshQueue(); }, $scope.queueInterval);
            });
        };

        $scope.quickviewWalkin = function(id){
            $http.get('/walkins/'+id).success(function(response){
                $scope.quickWalkin = response;

                if(response.contactLog && response.contactLog.length > 0){
                    var last = response.contactLog[response.contactLog.length - 1];
                    $scope.quickWalkin.contactInfo ={
                        log:  'by ' + last.technician.displayName + ' via ' + last.type,
                        at:  last.contactedAt
                    };
                }
                else $scope.quickWalkin.contactInfo = {};
            });
        };

        $scope.viewWalkin = function(id){
            $http.get('/walkins/'+id).success(function(response){
                $modal.open({
                    animation: false,
                    templateUrl: 'modules/admin/views/walkin/walkin-view-modal.client.view.html',
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
                        templateUrl: 'modules/admin/views/walkin/walkin-service-modal.client.view.html',
                        controller: 'AdminWalkinServiceModalCtrl',
                        size: 'lg',
                        backdrop: 'static',
                        resolve: { walkin : function() { return response; } }
                    });
                    service.result.then(function(result){
                        switch(result){
                            case 'saved':
                                $scope.quickviewWalkin(id);
                                break;
                            case 'resolved':
                                $scope.quickWalkin = undefined;
                                break;
                            case 'transfer':
                                $location.path('/admin/walkins/transfer/'+id);
                        }
                        // Re-init queue
                        $scope.initQueue();
                    });
                });
            }
        };

        $scope.setUnresolved = function(id){
            if(id !== undefined){
                var note = prompt('Please input unresolved reason (as work note) of the incident.', '');
                if(note){
                    $http.post('/walkins/setUnresolved/'+id, {workNote : note}).success(function(){
                        $scope.quickWalkin = undefined;
                        $scope.initQueue();
                    });
                }
                else
                    alert('Invalid input.');
            }
        };

        $scope.sendEmail = function(id){
            if(id !== undefined){
                var service = $modal.open({
                    animation: true,
                    templateUrl: 'modules/admin/views/email/email-send-modal.client.view.html',
                    controller: 'LiabilityModalCtrl',
                    size: 'lg',
                    backdrop: 'static',
                    resolve: { walkinInfo : function() { return $scope.quickWalkin; } }
                });

                service.result.then(function(email){
                    email.email = $scope.quickWalkin.user.username + '@emory.edu';
                    email.name = $scope.quickWalkin.user.displayName;

                    $http.post('/email', email)
                        .success(function(){
                            $http.post('/walkins/log/logContact/'+id, { type : 'email', detail : email.body }).success(function(){
                                $scope.quickviewWalkin(id);
                            });
                        })
                        .error(function(){ alert('Failed to send the email');}
                    );
                });
            }
        };

        $scope.logContact = function(id){
            if(id !== undefined){
                $http.post('/walkins/log/logContact/'+id, { type : 'phone' }).success(function(){
                    alert('Contact instance logged.');
                    $scope.quickviewWalkin(id);
                });
            }
        };

        $scope.updateWorkNote = function(){
            $http.put('/walkins/'+$scope.quickWalkin._id, {workNote: $scope.quickWalkin.workNote})
                .error(function(){ alert('Update is not saved. Please try again.'); });
        };
    }
]);
