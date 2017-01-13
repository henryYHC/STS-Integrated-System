'use strict';

angular.module('technician').controller('TaskCenterController', ['$scope', '$state', '$http', 'ModalLauncher',
  function ($scope, $state, $http, ModalLauncher) {

    $scope.init = function() {
      $scope.listChores();
      $scope.listSITasks();
    };

    $scope.createSITaskChore = function(sitaskIdx, sitask) {
      var modal = ModalLauncher.launchChoreCreateModal();
      modal.result.then(function(chore) {
        if(chore) {
          sitask.chores.push(chore);
          console.log(chore);

          $http.post('/api/tech/sitask/update/' + sitask._id, sitask)
            .success(function(sitask) {
              $scope.sitasks.splice(sitaskIdx, 1, sitask);
              $scope.chores.unshift(chore);
            })
            .error(function() { alert('Server error when creating sitask chore.'); });
        }
      });
    };

    $scope.listChores = function() {
      $http.get('/api/tech/chore/list')
        .success(function(chores) { $scope.chores = chores; })
        .error(function() { alert('Server error when fetching chores.'); });
    };

    $scope.completeChore = function(choreIdx) {
      var chore = $scope.chores[choreIdx];

      if(chore.note) {
        $http.post('/api/tech/chore/complete/' + chore._id, chore)
          .success(function(chore) { $scope.chores.splice(choreIdx, 1, chore); })
          .error(function() { alert('Server error when completing chores.'); });
      }
      else ModalLauncher.launchDefaultMessageModal('Invalid Note', 'Please enter note (work done) to complete chore.');
    };

    $scope.showChoreNote = function(choreId) {
      var chore = $scope.chores[choreId];
      ModalLauncher.launchDefaultMessageModal('Chore Note', chore.note);
    };

    $scope.listSITasks = function() {
      $http.get('/api/tech/sitask/list')
        .success(function(sitasks) { $scope.sitasks = sitasks; })
        .error(function() { alert('Server error when fetching STS tasks.'); });
    };

    $scope.viewSITask = function(sitask) {
      $http.get('/api/tech/sitask/view/' + sitask._id)
        .success(function(sitask) { ModalLauncher.launchSITaskViewModal(sitask); })
        .error(function() { alert('Server error when fetching STS task.'); });

    };
  }
]);
