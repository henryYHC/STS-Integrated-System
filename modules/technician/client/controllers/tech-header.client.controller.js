'use strict';

angular.module('technician').controller('TechHeaderController', ['$scope', '$state', 'SystemPermission', '$http', 'Authentication',
  function ($scope, $state, SystemPermission, $http, Authentication) {
    // Expose view variables
    $scope.breadcrumb = $state.current.data.breadcrumb;
    $scope.user = SystemPermission.getUser();
    $scope.user.isAdmin = SystemPermission.hasAdminPerm();

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
