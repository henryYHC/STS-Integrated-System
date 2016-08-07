'use strict';

angular.module('technician').controller('CheckinQueueController', ['$scope', '$http', 'Authentication', 'ModalLauncher', '$timeout', '$state',
  function ($scope, $http, Authentication, ModalLauncher, $timeout, $state) {
    var user = Authentication.getUser();

    /*----- Load instance functions -----*/
    $scope.init = function() {
      $http.get('/api/technician/checkin/setting/queue')
        .error(function() { alert('Request failed. Please check console for error.'); })
        .success(function(setting) { $scope.setting = setting; });
      $scope.loadQueue();
    };

    $scope.loadQueue = function() {
      $http.get('/api/technician/checkin/queue')
        .error(function() { alert('Request failed. Please check console for error.'); })
        .success(function(queues) {
          $scope.queues = queues;

          if(queues.working.length > 0 && !$scope.selected)
            $scope.loadCheckin(queues.working[0]);
        });
    };
    
    $scope.loadCheckin = function(checkin) {
      $scope.selected = checkin;

      if(!checkin.templateApplied) $scope.templateViewing = 'N/A';
      else $scope.templateViewing = checkin.templateApplied;
    };

    $scope.updateCheckin = function(callback) {
      var checkin = $scope.selected;
      $http.put('/api/technician/checkin/update/'+checkin._id, checkin)
        .error(function() { alert('Request failed. Please check console for error.'); })
        .success(function(checkin){ if(callback) callback(checkin); });
    };

    /*----- Instance service log functions -----*/
    $scope.logService = function(content, level) {
      content = content.trim();
      if(content) {
        $http.post('/api/technician/checkin/logService/'+$scope.selected._id,
          { type : level, description : content })
          .error(function() { alert('Request failed. Please check console for error.'); })
          .success(function(entry) { $scope.selected.serviceLog.push(entry); $scope.record = undefined; });
      }
    };
    
    $scope.updateLog = function(log) {
      $http.put('/api/technician/service-entry/update', log)
        .error(function() { alert('Request failed. Please check console for error.'); });
    };
    
    $scope.removeLog = function(log) {
      var idx = $scope.selected.serviceLog.indexOf(log);
      if(idx >= 0) $scope.selected.serviceLog.splice(idx, 1);

      $scope.updateCheckin(function(){
        $http.delete('/api/technician/service-entry/update', log)
          .error(function() { alert('Request failed. Please check console for error.'); });
      });
    };

    $scope.applyTemplate = function() {
      var template = $scope.templateViewing;
      if(template && template !== 'N/A') {
        $scope.selected.templateApplied = template;
        $scope.updateCheckin(function(){
          $scope.logService('Apply template "' + template + '"', 'Normal');
        });
      }
    };

    /*----- Service log display functions -----*/
    $scope.getLogStyle = function(level) {
      switch (level) {
        case 'Important': return { 'color' : 'red', 'font-weight' : 'bold' };
        case 'Note': return { 'color' : 'grey', 'font-style' : 'italic' };
      }
      return {};
    };

    $scope.disableEditing = function(username, createdAt) {
      return !(Authentication.hasAdminPerm() || (username === user.username && Date.now() - new Date(createdAt).getTime() <= 300000));
    };

    $scope.showRemoval = function(username, createdAt) {
      return Authentication.hasAdminPerm() || (username === user.username && Date.now() - new Date(createdAt).getTime() < 60000);
    };

    $scope.showTemplateImport = function(task) {
      var logs = $scope.selected.serviceLog;
      for(var i in logs) {
        if(task === logs[i].description)
          return false;
      }
      return true;
    };
    
    /*----- Watchers -----*/
    // Watch if template selected changed
    $scope.$watch('templateViewing', function(n) {
      if(n && n !== 'N/A') {
        var templates = $scope.setting.templates;
        for(var i in templates)
          if(templates[i].name === n)
            $scope.setting.templateTasks = templates[i].tasks;
      }
      else if (n && n === 'N/A') delete $scope.setting.templateTasks;
    });
  }
]);
