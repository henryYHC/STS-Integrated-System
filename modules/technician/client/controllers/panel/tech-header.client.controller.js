'use strict';

angular.module('technician').controller('TechHeaderController', ['$scope', '$state', '$http', 'Authentication', 'EmailLauncher', 'ModalLauncher', '$interval', '$rootScope',
  function ($scope, $state, $http, Authentication, EmailLauncher, ModalLauncher, $interval, $rootScope) {
    // Expose view variables
    $scope.$state = $state; $scope.user = Authentication.getUser();
    $scope.user.isAdmin = Authentication.hasAdminPerm();

    $scope.$watch('$state.current', function(toState){
      $scope.breadcrumb = toState.data.breadcrumb;
    });

    $scope.sendEmail = function() {
      EmailLauncher.launchGeneralEmailModal();
    };

    $scope.createChore = function() {
      ModalLauncher.launchChoreCreateModal();
    };

    $scope.getNotificationCounts = function() {

      $http.get('/api/technician/dashboard/notification/counts')
        .error(function(){
          alert('Server error while retrieving notification counts.');
          $interval.cancel($scope.autoNotificationCountRetriever);
        })
        .success(function(counts) { $scope.notificationCounts = counts; });
    };
    $scope.getNotificationCounts();
    $scope.autoNotificationCountRetriever = $interval(function(){ $scope.getNotificationCounts(); }, 10000);

    // Logout
    $scope.logout = function() {
      $http.get('/api/auth/signout').success(function(){
        delete Authentication.user;

        $rootScope.$on('$locationChangeSuccess', function() {
          $interval.cancel($scope.autoNotificationCountRetriever);
        });

        $state.go('login');
      });
    };
  }
]);
