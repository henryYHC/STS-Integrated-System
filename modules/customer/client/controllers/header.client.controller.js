'use strict';

angular.module('customer').controller('CustomerHeaderController', ['$scope', '$state',
  function ($scope, $state) {
    // Expose view variables
    $scope.$state = $state;

  }
]);
