'use strict';

angular.module('technician').controller('CheckinQueueController', ['$scope', '$http', 'Authentication', 'ModalLauncher', '$timeout', '$state',
  function ($scope, $http, Authentication, ModalLauncher, $timeout, $state) {
    var user = Authentication.getUser();

    /*----- Load instance functions -----*/
    $scope.init = function() {
      $http.get('/api/technician/checkin/queue')
        .error(function() { alert('Request failed. Please check console for error.'); })
        .success(function(queues) {
          $scope.queues = queues;
          $scope.selected = queues.working.length > 0? queues.working[0] : undefined;

          console.log(queues);
        });
    };
  }
]);
