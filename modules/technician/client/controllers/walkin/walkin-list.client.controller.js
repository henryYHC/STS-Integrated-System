'use strict';

angular.module('technician').controller('WalkinListController', ['$scope', '$http', 'Authentication', 'ModalLauncher', '$timeout',
  function ($scope, $http, Authentication, ModalLauncher, $timeout) {
    $scope.query = { field: 'id' };

    $scope.$watch('query.field', function(n, o){
      $scope.textQuery = $scope.dateQuery = false;
      $timeout(function(){
        if(n === 'created' || n === 'resolved')
          $scope.dateQuery = true;
        else $scope.textQuery = true;
      }, 250);
    });
  }
]);
