'use strict';

angular.module('admin').controller('ServicenowSyncController', ['$scope', '$http',
	function($scope, $http) {

        $scope.summary = { count : 0 };
        $scope.walkinIds = {};
        $scope.loading = false;
        $scope.syncing = false;

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
                if(++index < walkinIds.length)
                    syncWalkinTicketsAux(index, walkinIds);
                else {
                    $scope.syncing = false;
                }
            }).error(logError);
        };

        $scope.syncTickets = function(){
            $scope.summary.syncCount = 0;
            var i, selectedIds = $scope.walkinIds;
            var ids = [], walkins = $scope.walkins;

            if(selectedIds && selectedIds.length > 0){
                var key, keys = Object.keys(selectedIds);
                for(i in keys){
                    key = keys[i];
                    if(selectedIds[key]) ids.push(key);
                }
                $scope.summary.count = ids.length;
            }
            else    for(i in walkins)   ids.push(walkins[i]._id);

            $scope.syncing = true;
            syncWalkinTicketsAux(0, ids);
        };
	}
]);
