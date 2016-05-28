'use strict';

angular.module('technician').controller('TechHeaderController', ['$rootScope', '$scope', '$state', 'SystemPermission', '$http', 'Authentication',
  function ($rootScope, $scope, $state, SystemPermission, $http, Authentication) {
    // Expose view variables
    $scope.$state = $state;
    $scope.user = SystemPermission.getUser();
    $scope.user.isAdmin = SystemPermission.hasAdminPerm();

    $scope.$watch('$state.current', function(toState){
      $scope.breadcrumb = toState.data.breadcrumb;
    });

    // Logout
    $scope.logout = function() {
      $http.get('/api/auth/signout').success(function(){
        delete Authentication.user;
        $state.go('login');
      });
    };
  }
]);
