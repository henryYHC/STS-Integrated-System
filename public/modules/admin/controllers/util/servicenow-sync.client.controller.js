'use strict';

angular.module('admin').controller('ServicenowSyncController', ['$scope', '$http',
	function($scope, $http) {

        $scope.summary = { count : 0 };
        $scope.loading = false;

        $scope.getTickets = function(){
            $scope.loading = true; $scope.walkins = undefined;
            $http.get('/walkins/list/listUnSynced').success(function(entries){
                $scope.loading = false;
                $scope.summary.count = entries.length;
                $scope.walkins = entries;
            }).error(function(err){ $scope.summary.error = err; });
        };

        var logError = function(err){ console.log(err); };

        var syncWalkinTicketsAux = function(index, walkinIds){
            $http.put('/walkins/sync/' + walkinIds[index]).success(function(){
                $scope.summary.syncCount++;

                console.log(index + ' -> Success');
                if(++index < walkinIds.length)
                    syncWalkinTicketsAux(index, walkinIds);
            }).error(logError);
        };

        $scope.syncTickets = function(){
            $scope.summary.syncCount = 0;
            var walkinIds = [], walkins = $scope.walkins;
            for(var i in walkins)   walkinIds.push(walkins[i]._id);
            syncWalkinTicketsAux(0, walkinIds);
        };
	}
]);
