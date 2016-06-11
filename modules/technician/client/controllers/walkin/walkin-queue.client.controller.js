'use strict';

angular.module('technician').controller('WalkinQueueController', ['$scope', '$http',
  function ($scope, $http) {
    $scope.walkins = [
      { _id: 0, user: { firstName : 'Henry', lastName : 'Chen', displayName: 'Henry Chen' }, created: Date.now(), status : 'Work in progress', serviceTechnician : { firstName : 'Nihar', lastName : 'Parikh', displayName: 'Nihar Parikh' } },
      { _id: 1, user: { firstName : 'Stacy', lastName : 'Banana', displayName: 'Stacy Banana' }, created: Date.now(), status : 'In queue', description: 'Cannot connect to EmoryUnplugged.' },
      { _id: 2, user: { firstName : 'Michael', lastName : 'Buchmann', displayName: 'Michael Buchmann' }, created: Date.now(), status : 'House call pending' }
    ];
    $scope.avgWaitTime = 2.3;

    $scope.loadWalkin = function(id){
      $scope.selected = $scope.walkins[id];
    };
  }
]);
