'use strict';

angular.module('technician.admin').controller('TechAdminController', ['$state', 'SystemPermission',
  function ($state, SystemPermission) {
    if(!SystemPermission.hasAdminPerm()){
      if(SystemPermission.hasTechnicianPerm())
        $state.go('tech.home');
      else $state.go('login');
    }
  }
]);
