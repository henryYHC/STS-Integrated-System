'use strict';

angular.module('customer').controller('CustomerWalkinCustomerController', ['$scope', '$state',
  function ($scope, $state) {
    $scope.status.state = 'customer';

    if(!$scope.walkin.user)
      $state.go('customer.walkin.netid');
    
    $scope.toLastName = function() {
      if($scope.walkin.user.firstName)
        $state.go('customer.walkin.last-name');
      else $scope.status.error = 'Please enter your first name correctly.';
    };

    $scope.toPhone = function() {
      if($scope.walkin.user.lastName)
        $state.go('customer.walkin.phone');
      else $scope.status.error = 'Please enter your last name correctly.';
    };

    $scope.toLocation = function() {
      if($scope.walkin.user.phone) {
        var phone = '', phone_chars = (''+$scope.walkin.user.phone).split('');

        for (var i in phone_chars) {
          if (phone_chars[i] >= '0' && phone_chars[i] <= '9')
            phone += phone_chars[i];
        }

        if (phone.length == 10) {
          $scope.walkin.user.phone = phone;
          $state.go('customer.walkin.location');
        }
        else $scope.status.error = 'Please enter your 10 digit phone number correctly.';
      }
      else $scope.status.error = 'Please enter your 10 digit phone number correctly.';
    };

    $scope.toDevice = function() {
      if($scope.walkin.user.location && $scope.walkin.user.location !== 'N/A') {
        // Format for wildcard user
        var user = $scope.walkin.user;
        if(user.isWildcard)
          $scope.walkin.workNote = 'Customer info: ' + user.firstName + ' ' + user.lastName +
            ' @ ' + user.location +' (phone: ' + user.phone + ')';

        $state.go('customer.walkin.device-category');
      }
      else $scope.status.error = 'Please enter your housing location correctly.';
    };
  }
]);
