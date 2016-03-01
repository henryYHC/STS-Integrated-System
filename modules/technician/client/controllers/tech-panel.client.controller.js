'use strict';

angular.module('technician').controller('TechPanelController', ['$state', 'SystemPermission',
  function ($state, SystemPermission) {
    if(!SystemPermission.hasTechnicianPerm()) $state.go('login');
  }
]);
