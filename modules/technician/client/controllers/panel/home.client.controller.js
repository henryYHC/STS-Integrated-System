'use strict';

angular.module('technician').controller('TechHomeController', ['$scope', '$state', '$http',
  function ($scope, $state, $http) {
    $scope.inputMessage = '';
    $scope.stats = { walkin : {}, checkin : {} };

    $scope.init = function() {
      $http.get('/api/technician/dashboard/stats')
        .error(function() { alert('Request failed. Please check console for error.'); })
        .success(function(stats) { $scope.stats = stats; });

      $http.get('/api/technician/message/query/bulletinboard')
        .error(function() { alert('Request failed. Please check console for error.'); })
        .success(function(messages) { $scope.messages = messages; });
    };
    
    $scope.newMessage = function() {
      var message = $scope.inputMessage;
      if(message) {
        $http.post('/api/technician/message/create/bulletinboard', { type : 'technician', message : message })
          .error(function() { alert('Request failed. Please check console for error.'); })
          .success(function(message) {
            $scope.inputMessage = '';
            $scope.messages.push(message);
          });
      }
    };
  }
]);
