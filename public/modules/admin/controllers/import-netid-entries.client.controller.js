'use strict';

angular.module('admin').controller('ImportNetIdEntriesController', ['$scope', '$location', 'Authentication', '$http', '$timeout',
	function($scope, $location, Authentication, $http, $timeout) {
        $scope.authentication = Authentication;

        //If user is signed in then redirect back home
        if ($scope.authentication.user && $scope.authentication.user.roles.indexOf('admin') < 0)
            $location.path('/');

        var processTextFile = function(file){
            var reader = new FileReader();
            reader.onloadend = function(e){
                var entry, entries = [], lines = e.target.result.split('\n');
                for(var lineId in lines) {
                    entry = lines[lineId].replace(/\"/g, '').split(',');

                    if(entry.length === 5){
                        entry[2] += entry[3];
                        entry.splice(3,1);
                    }
                    entries.push(entry);

                    if(entry.length !== 4){
                        $scope.summary.error = 'Entries are wrongly formatted.';
                    }
                }
                $scope.$apply(function(){
                    $scope.loading = false;
                    $scope.entries = entries;
                    $scope.summary.count = entries.length;
                    $scope.summary.importCount = 0;
                });
            };
            reader.readAsText(file);
        };

        $scope.$watch('file', function () {
            var file = $scope.file;
            if(file){
                $scope.loading = true;
                $scope.summary = {};
                processTextFile(file);
            }
        });

        var logError = function(err){ console.log(err); };
        var importAux = function(index, entries){
            var entry = entries[index], obj = { netid : entry[0], firstName : entry[1], lastName : entry[2], type : entry[3] };
            $http.post('/userEntries', obj).success(function(){
                $scope.summary.importCount++;
                if(++index < entries.length)
                    importAux(index, entries);
            }).error(logError);
        };

        $scope.import = function(){
            $scope.summary.importCount = 0;
            var entries = $scope.entries, error = $scope.summary.error;
            if(!error && entries){
                importAux(0, entries);
            }
        };
	}
]);
