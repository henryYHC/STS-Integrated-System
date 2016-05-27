'use strict';

angular.module('technician').controller('TechHeaderController', ['$rootScope', '$scope', '$state', 'SystemPermission', '$http', 'Authentication',
  function ($rootScope, $scope, $state, SystemPermission, $http, Authentication) {
    // Expose view variables
    $scope.user = SystemPermission.getUser();
    $scope.user.isAdmin = SystemPermission.hasAdminPerm();
    $scope.breadcrumb = $state.current.data.breadcrumb;

    // Logout
    $scope.logout = function() {
      $http.get('/api/auth/signout')
        .success(function(){
          delete Authentication.user;
          $state.go('login');
        });
    };

    // Sidebar toggle function
    //$scope.toggleSidebar = function(){
    //    console.log(angular.element(document.querySelector('.app-container')));
    //  angular.element(document.querySelector('.app-container'))[0].toggleClass('expanded');
    //  angular.element(document.querySelector('.navbar-expand-toggle'))[0].toggleClass('fa-rotate-90');
    //  angular.element(document.querySelector('.navbar-right'))[0].toggleClass('expanded');
    //  angular.element(document.querySelector('.navbar-right-expand-toggle'))[0].toggleClass('fa-rotate-90');
    //};
  }
]);
