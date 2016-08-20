'use strict';

angular.module('technician').controller('WalkinQueueController', ['$scope', '$http', 'Authentication', 'ModalLauncher', '$timeout', '$state', '$interval', '$rootScope',
  function ($scope, $http, Authentication, ModalLauncher, $timeout, $state, $interval, $rootScope) {
    var user = Authentication.getUser();

    var option2Obj = function(val){
      return { text : val, value : val };
    };

    /*----- Load instance functions -----*/
    $scope.init = function(){
      var i;
      $http.get('/api/technician/walkin/setting').success(function(setting){
        // Create map for type -> specs
        var options = $scope.device_options = {};
        // OS's
        for(i in setting.computer_options)
          options[setting.computer_options[i].key] = setting.computer_options[i].values.map(option2Obj);
        // Other devices
        for(i in setting.device_options)
          options[setting.device_options[i].key] = setting.device_options[i].values.map(option2Obj);
        options.Other = [];

        $scope.device_categories = (Object.keys(options)).map(option2Obj);
        $scope.location_options = setting.location_options.map(option2Obj);

        // Initialize resolution template 
        $scope.resolutions_options = setting.resolutions_options;

        $scope.initWalkin(function(walkins) {
          // Select current working walk-in instance
          for(i in walkins){
            if(walkins[i].status === 'House call pending') break;
            else if(walkins[i].serviceTechnician &&
              walkins[i].serviceTechnician.username === user.username){
              $scope.loadWalkin(walkins[i]); break;
            }
          }

          // Auto refresh queue
          $scope.autoRefresher = $interval(function(){ $scope.initWalkin(); }, 20000);

          $rootScope.$on('$locationChangeSuccess', function() {
            $interval.cancel($scope.autoRefresher);
          });
        });
      });
    };

    // Fetching queue instances ('In queue' & 'Work in progress' + 'House call pending') and average wait time
    $scope.initWalkin = function(callback) {
      $http.get('/api/technician/walkin/queue').success(function(result) {
        $scope.walkins = result.walkins;
        $scope.avgWaitTime = result.avgWaitTime;
        if(callback) callback(result.walkins);
      });
    };

    // Load additional walk-in information i.e. messages, etc
    $scope.loadWalkin = function(walkin){
      var selected = $scope.selected = walkin;

      if(!selected.resolutionType)
        $scope.selected.resolutionType = $scope.resolutions_options.default;

      // Force refresh select2 selection box (Work around)
      $timeout(function(){
        angular.element('#resolution').select2({ minimumResultsForSearch: Infinity });
      }, 10);
    };

    $scope.loadPrevious = function() {
      var selected = $scope.selected;
      if(selected.user.previous) return false;

      $scope.loading = true;
      $http.get('/api/technician/walkin/previous/'+selected._id+'/'+selected.user.username)
        .error(function() { alert('Request failed. Please check console for error.'); })
        .success(function(previous) {
          $scope.loading = false;
          $scope.selected.user.previous = previous;
        });
    };

    $scope.viewWalkin = function(id){
      $http.get('/api/technician/walkin/view/'+id)
        .error(function() { alert('Request failed. Please check console for error.'); })
        .success(function(walkin) {
          ModalLauncher.launchWalkinViewModal(walkin);
        });
    };

    /*----- Status change functions -----*/
    $scope.transfer = function() {
      var id = $scope.selected._id;
      $state.go('tech.walkin.transfer', { walkinId : id });
    };

    $scope.noshow = function() {
      var noshow = ModalLauncher.launchDefaultMessageModal('Confirmation: No show walk-in',
        'This will mark the instance as \'Unresolved\'. Only confirm if the customer is not present. ' +
        'Are you sure this is a no show instance? (This action is not reversible)');

      noshow.result.then(function(response) {
        if(response) {
          $http.put('/api/technician/walkin/noshow/'+$scope.selected._id, { walkin : $scope.selected })
            .error(function() { alert('Request failed. Please check console for error.'); })
            .success(function() {
              var idx = $scope.walkins.indexOf($scope.selected);
              $scope.walkins.splice(idx, 1); $scope.selected = undefined;
            });
        }
      });
    };
    
    $scope.notEligible = function() {
      var modal = ModalLauncher.launchDefaultMessageModal('Confirmation: Customer not eligible',
        'This will mark the instance as \'Unresolved\'. The customer will also be marked as invalid. ' +
        'Are you sure that the customer is not eligible for service? (This action is not reversible)');

      modal.result.then(function(response) {
        if(response) {
          $http.put('/api/technician/walkin/notEligible/'+$scope.selected._id)
            .error(function() { alert('Request failed. Please check console for error.'); })
            .success(function() {
              var idx = $scope.walkins.indexOf($scope.selected);
              $scope.walkins.splice(idx, 1); $scope.selected = undefined;
            });
        }
      });
    };
    
    $scope.toHouseCall = function() {
      var walkin = $scope.selected;
      if(!walkin.workNote){
        ModalLauncher.launchDefaultWarningModal('Action Failed: Missing Work Note',
          'Please input customer availability for housecall appointment as work note.');
        return false;
      }
      else {
        walkin.status = 'House call pending';
        $http.put('/api/technician/walkin/update/'+$scope.selected._id, walkin)
          .error(function() { alert('Request failed. Please view console for error.'); })
          .success(function() {
            var idx = $scope.walkins.indexOf($scope.selected);
            $scope.walkins = $scope.walkins.concat($scope.walkins.splice(idx, 1));
            $scope.selected = undefined;
          });
      }
    };

    $scope.recordCall = function(){
      var now = new Date(Date.now());
      $scope.selected.workNote += '\n' + 'Called customer at ' + now.toLocaleString();
      $scope.update();
    };
    
    /*----- Service functions -----*/
    $scope.beginService = function() {
      // Log service time
      $http.put('/api/technician/walkin/beginService/'+$scope.selected._id)
        .error(function() { alert('Request failed. Please view console for error.'); })
        .success(function(walkin) {
          walkin.resolutionType = $scope.resolutions_options.default;
          var idx = $scope.walkins.indexOf($scope.selected);
          $scope.walkins[idx] = $scope.selected = walkin;
        });
    };

    $scope.update = function() {
      $scope.error = $scope.success = undefined;
      $http.put('/api/technician/walkin/update/'+$scope.selected._id, $scope.selected)
        .error(function() { $scope.error = 'Saved failed.'; })
        .success(function() { $scope.success = 'Saved successfully.'; });

      $timeout(function(){ $scope.error = $scope.success = undefined; }, 3000);
    };
    
    $scope.duplicate = function() {
      $http.post('/api/technician/walkin/duplicate/'+$scope.selected._id)
        .error(function() { alert('Request failed. Please view console for error.'); })
        .success(function(duplicate) {
          for(var i = 1; i < $scope.walkins.length-1; i++)
            if($scope.walkins[i].status==='House call pending') break;
          $scope.walkins.splice(i, 0, duplicate);
        });
    };
    
    $scope.reassign = function() {
      var modal = ModalLauncher.launchDefaultInputModal(
        'Reassignment: NetID',
        'Please enter the NetID of which this walk-in instance will be reassigned to. Reassignment only works' +
        'for customer who has visited before since his/her information will be required for the visit.',
        'Enter customer\'s NetID here.' 
      );
      modal.result.then(function(netid) {
        if(!netid) ModalLauncher.launchDefaultWarningModal(
          'Action Failed: Missing NetID', 'Please input customer NetID for reassignment.');
        else {
          $http.post('/api/technician/walkin/reassign/'+$scope.selected._id+'/'+netid)
            .error(function(message) {
              if(!message) alert('Request failed. Please view console for error.');
              else ModalLauncher.launchDefaultWarningModal('Action Failed: User Error', message);
            })
            .success(function(walkin) {
              var idx = $scope.walkins.indexOf($scope.selected);
              $scope.walkins[idx] = $scope.selected = walkin;
            });
        }
      });
    };

    $scope.resolve = function() {
      $scope.error = $scope.success = undefined;

      var res = $scope.selected.res,
        type = $scope.selected.resolutionType,
        subject = $scope.selected.otherResolution,
        resolution = $scope.selected.resolution;

      if(((!$scope.selected.deviceInfo || $scope.selected.deviceInfo === 'N/A') && $scope.selected.deviceCategory !== 'Other')
        || ($scope.selected.deviceCategory === 'Other' && !$scope.selected.otherDevice)){
        $scope.error = 'Please specify the device information.';
        $timeout(function(){ $scope.error = $scope.success = undefined; }, 5000);
      }
      else if(type === $scope.resolutions_options.default){
        $scope.error = 'Please select a resolution type.';
        $timeout(function(){ $scope.error = $scope.success = undefined; }, 5000);
      }
      else if(type === 'Other') {
        if(!subject)
          $scope.error = 'Please input resolution subject for \'Other\'.';
        else if(subject.length > 20)
          $scope.error = 'Please limit resolution subject to under 20 characters.';
        else if(!resolution || (!(res && res.tasks) && resolution.trim().length < 25))
          $scope.error = 'Please provide more detail for resolution (at lease 25 characters).';

        $timeout(function(){ $scope.error = $scope.success = undefined; }, 5000);
      }
      else if(!resolution || (!(res && res.tasks) && resolution.trim().length < 25)) {
        $scope.error = 'Please provide more detail for resolution (at lease 25 characters).';
        $timeout(function(){ $scope.error = $scope.success = undefined; }, 5000);
      }
      else {
        $http.put('/api/technician/walkin/resolve/'+$scope.selected._id, $scope.selected)
          .error(function() { alert('Request failed. Please view console for error.'); })
          .success(function() {
            var idx = $scope.walkins.indexOf($scope.selected);
            $scope.walkins.splice(idx, 1); $scope.selected = undefined;
          });
      }
    };

    /*----- Watchers -----*/
    // Watch if customer name changed.
    $scope.onDisplayNameChange = function() {
      var name = $scope.selected.user.displayName, idx = name.lastIndexOf(' ');
      $scope.selected.user.firstName = name.substring(0, idx);
      $scope.selected.user.lastName = name.substring(idx+1);
    };
    
    // Watch if resolutionType changed
    $scope.onResolutionChange = function() {
      $scope.taskIdx = 0;
      if($scope.selected) $scope.selected.forward = false;
    };

    // Watch if resolution task clicked
    var checkedTasks = [], checkedTasksOffset = 0;
    $scope.onResolutionTaskClick = function(task) {
      var idx = checkedTasks.indexOf(task);
      var resolution = $scope.selected.resolution;

      if(!resolution) resolution = '';
      else resolution = resolution.substring(checkedTasksOffset);

      if(idx >= 0) checkedTasks.splice(idx, 1);
      else checkedTasks.push(task);

      var i, task_string = '';
      for(i in checkedTasks)
        task_string += (parseInt(i)+1) + '. ' + checkedTasks[i] + '\n';
      checkedTasksOffset = task_string.length;

      $scope.selected.resolution = task_string + resolution;
    };
  }
]);
