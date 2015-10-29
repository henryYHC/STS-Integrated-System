'use strict';

angular.module('admin').controller('CheckinViewController', ['$http', '$scope', '$stateParams', '$location', 'Authentication', '$modal',
    function($http, $scope, $stateParams, $location, Authentication, $modal){

        var user = Authentication.user;
        if (!user)
            $location.path('/');
        else if(user.roles.indexOf('technician') < 0 && user.roles.indexOf('admin') < 0)
            $location.path('/');
        else if(user.roles.indexOf('admin') >= 0)
            $scope.isAdmin = true;

        $scope.initCheckin = function(){
            $http.get('/checkins/'+$stateParams.checkinId).success(
                function(response){ $scope.checkin = response; console.log(response);});
        };

        $scope.viewWalkin = function(id){
            $http.get('/walkins/'+id).success(function(response){
                $modal.open({
                    animation: true,
                    templateUrl: 'modules/admin/views/walkin/walkin-view-modal.client.view.html',
                    controller: 'AdminWalkinViewModalCtrl',
                    size: 'lg',
                    resolve: { walkin : function() { return response; } }
                });
            });
        };

        $scope.setLogStyle = function(type){
            switch(type){
                case 'Important':
                    return {'color' : 'red', 'font-weight': 'bold'};
                case 'Note':
                    return {'color' : 'blue', 'font-style': 'italic'};
            }
            return {};
        };
    }
]);
