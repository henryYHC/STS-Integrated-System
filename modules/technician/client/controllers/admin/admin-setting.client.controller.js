'use strict';

angular.module('technician.admin').controller('AdminSettingController', ['$scope', '$state', '$http', 'ModalLauncher', '$timeout',
  function ($scope, $state, $http, ModalLauncher, $timeout) {
    $scope.message = {};

    $scope.init = function(){
      $http.get('/system/setting')
        .success(function(setting){
          $scope.setting = setting;
          console.log(setting);
        })
        .error(function(){ $scope.setting = null; });
    };

    $scope.newScheduler = function(schedulers){
      var name = ModalLauncher.launchDefaultInputModal(
        'New Scheduler Setting',
        'Please enter the name of the scheduler you wish to initialize.',
        'Name of the scheduler here');
      name.result.then(function(response){
        schedulers.push(response);
      });
    };

    $scope.newWildcardNetIDPrefix = function(prefixes){
      var prefix = ModalLauncher.launchDefaultInputModal(
          'New Wildcard NetID Prefix',
          'Please enter the prefix of the wildcard NetID you wish to add.',
          'Prefix of wildcard NetID here');
      prefix.result.then(function(response){
        prefixes.push(response);
      });
    };

    $scope.newLocationOption = function(options){
      var location = ModalLauncher.launchDefaultInputModal(
          'New Location Option',
          'Please enter the name of the location you wish to add.',
          'Name of location NetID here');
      location.result.then(function(response){
        options.push(response);
      });
    };

    $scope.newOSEdition = function(os_extras){
      var location = ModalLauncher.launchDefaultInputModal(
        'New OS edition',
        'Please enter the name of the OS edition you wish to add.',
        'Name of OS edition here');
      location.result.then(function(response){
        os_extras.push(response);
      });
    };

    $scope.newDeviceCategory = function(categories){
      var category = ModalLauncher.launchDefaultInputModal(
          'New Computer/Device Category',
          'Please enter the name of the computer/device category you wish to add.',
          'Name of the computer/device category here');
      category.result.then(function(response){
        categories.push({ key: response, values: [] });
      });
    };

    $scope.newDeviceType = function(category){
      var type = ModalLauncher.launchDefaultInputModal(
          'New Computer/Device Type',
          'Please enter the name of the computer/ device type you wish to add.',
          'Name of the computer/device type here');
      type.result.then(function(response){
        category.values.push(response);
      });
    };

    $scope.save = function(){
      $http.put('/system/setting', $scope.setting)
        .success(function(){
          $scope.message.success = 'Save successfully.'; $scope.init();
          $timeout(function(){ $scope.message.success = undefined; }, 5000);
        })
        .error(function(){
          $scope.message.error = 'Failed to save settings.';
        });
    };
  }
]);
