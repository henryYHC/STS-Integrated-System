'use strict';

angular.module('system').controller('SubtaskCreateModalController', ['$scope', '$uibModalInstance', 'data', 'Authentication', '$http',
  function ($scope, $uibModalInstance, data, Authentication, $http) {
    $scope.data = data;
    $scope.user = Authentication.getUser();
    
    // Modal functions
    $scope.cancel = function(){
      $uibModalInstance.close(false);
    };
    
  }
]);
