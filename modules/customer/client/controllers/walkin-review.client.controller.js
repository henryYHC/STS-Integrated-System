'use strict';

angular.module('customer').controller('CustomerWalkinReviewController', ['$scope', '$state', 'ModalLauncher',
  function ($scope, $state, ModalLauncher) {
    if(!$scope.walkin.user)
      $state.go('customer.walkin.netid');

    $scope.confirm = function() {
      var modal = ModalLauncher.launchWalkinLiabilityModal();
      modal.result.then(function(liability) {
        if(liability){
          $scope.walkin.liabilityAgreement = liability;
          var walkin = $scope.walkin;
          console.log(walkin);
        }
      });
    };
  }
]);
