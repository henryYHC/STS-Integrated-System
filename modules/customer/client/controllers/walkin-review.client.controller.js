'use strict';

angular.module('customer').controller('CustomerWalkinReviewController', ['$scope', '$state', 'ModalLauncher', '$http',
  function ($scope, $state, ModalLauncher, $http) {
    $scope.status.state = 'review';

    if(!$scope.walkin.user)
      $state.go('customer.walkin.netid');

    $scope.confirm = function() {
      console.log($scope.walkin);

      var modal = ModalLauncher.launchWalkinLiabilityModal();
      modal.result.then(function(liability) {
        if(liability){
          $scope.walkin.liabilityAgreement = liability;
          $http.post('/api/technician/walkin/create', $scope.walkin)
            .error(function() { alert('Request failed. Please check console for error.'); })
            .success(function() { $state.go('customer.walkin-success'); });
        }
      });
    };
  }
]);
