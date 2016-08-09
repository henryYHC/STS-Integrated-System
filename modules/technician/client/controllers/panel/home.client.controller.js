'use strict';

angular.module('technician').controller('TechHomeController', ['$scope', '$state', '$http', 'Authentication',
  function ($scope, $state, $http, Authentication) {
    $scope.stats = { walkin : {}, checkin : {} };

    $scope.init = function() {
      $http.get('/api/technician/dashboard/stats')
        .error(function() { alert('Request failed. Please check console for error.'); })
        .success(function(stats) { $scope.stats = stats; });
    };
  }
]);
