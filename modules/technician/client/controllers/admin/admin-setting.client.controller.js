'use strict';

angular.module('technician.admin').controller('AdminSettingController', ['$scope', '$state', '$http',
  function ($scope, $state, $http) {

    $scope.init = function(){
      $http.get('/system/setting')
        .success(function(setting){ $scope.setting = setting; })
        .error(function(){ $scope.setting = null; });
    };

  }
]);
