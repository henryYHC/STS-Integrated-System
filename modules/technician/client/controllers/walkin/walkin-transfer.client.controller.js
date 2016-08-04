'use strict';

angular.module('technician').controller('WalkinTransferController', ['$scope', '$http', 'Authentication', 'ModalLauncher', '$state', '$stateParams',
  function($scope, $http, Authentication, ModalLauncher, $state, $stateParams) {

    $scope.init = function() {
      var walkinId = $stateParams.walkinId;
      $http.get('/api/technician/walkin/view/'+walkinId)
        .error(function() { alert('Request failed. Please check console for error.'); })
        .success(function(walkin) { $scope.walkin = walkin; console.log(walkin); });
    };

    $scope.viewWalkin = function(){
      ModalLauncher.launchWalkinViewModal($scope.walkin);
    };
  }
]);
