'use strict';

angular.module('customer').controller('CustomerWalkinController', ['$scope', '$http',
  function ($scope, $http) {
    $scope.walkin = {};
    $scope.status = {};

    $scope.init = function() {
      $http.get('/api/customer/setting')
        .error(function() { alert('Request failed. Please check console for error.'); })
        .success(function(setting) { $scope.setting = setting; });
    };
  }
]);
