'use strict';

angular.module('admin').controller('AdminWalkinListingController', ['$http', '$scope', '$modal', '$location', 'Authentication',
    function($http, $scope, $modal, $location, Authentication){

        $scope.search = { field: '', query: ''};
        var user = Authentication.user;
        if (!user)
            $location.path('/');
        else if(user.roles.indexOf('technician') < 0 && user.roles.indexOf('admin') < 0)
            $location.path('/');

        $scope.listAll = function(){ $http.get('/walkins/list/listAll').success(function(response){ $scope.walkins = response; }); };
        $scope.listToday = function(){ $http.get('/walkins/list/listToday').success(function(response){ $scope.walkins = response; console.log(response); }); };
        $scope.listUnresolved = function(){ $http.get('/walkins/list/listUnresolved').success(function(response){ $scope.walkins = response; }); };

        $scope.listBySearch = function(){
            var query = {};

            switch ($scope.search.field){
                case 'username':
                    query.username = { '$regex' : $scope.search.query.toLowerCase(), '$options': 'i' };
                    break;

                case 'displayName':
                    query.displayName = { '$regex' : $scope.search.query, '$options': 'i' };
                    break;

                case 'created':
                    query.created = $scope.search.query;
                    break;

                case 'incidentId':
                    $scope.search.query = 'INC' + $scope.search.query.replace(/\D/g, '');
                    query.snValue = { '$regex' : $scope.search.query, '$options': 'i' };
                    console.log(query);
                    break;

                default :
                    return false;
            }

            if($scope.search.query)
                $http.post('/walkins/list/listBySearch', query).success(function(response){ $scope.walkins = response; });
        };

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
