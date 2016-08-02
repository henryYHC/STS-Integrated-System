'use strict';

angular.module('technician').controller('WalkinListController', ['$scope', '$http', 'Authentication', 'ModalLauncher', '$timeout',
  function ($scope, $http, Authentication, ModalLauncher, $timeout) {
    $scope.query = { field: 'id' };
    
    /*----- Query functions -----*/
    $scope.today = function() {
      $http.get('/api/technician/walkin/query/today')
        .error(function() { alert('Request failed. Please view console for error.'); })
        .success(function(walkins) {
          $scope.walkins = walkins;
        });
    };


    /*----- Watchers ----- */
    $scope.$watch('query.field', function(n, o){
      $scope.textQuery = $scope.dateQuery = false;
      $timeout(function(){
        if(n && o && (n === 'created' || n === 'resolved'))
          $scope.dateQuery = true;
        else $scope.textQuery = true;
      }, 250);
    });
  }
]);
