'use strict';

angular.module('technician').controller('LibraryGuidanceController', ['$scope', '$http', '$timeout',
  function ($scope, $http, $timeout) {

    $scope.logLibraryGuidance = function(type){
      $http.post('/api/tech/library-guidance/log', { task : type })
        .success(function(){ $scope.success = 'Log Successfully'; })
        .error(function(){ $scope.error = 'System error'; });
      $timeout(function(){ $scope.error = $scope.success = undefined; }, 3000);
    };
  }
]);
