'use strict';

angular.module('technician.admin').controller('TechAdminController', ['$state', 'Authentication',
  function ($state, Authentication) {
    if(!Authentication.hasAdminPerm()){
      if(Authentication.hasTechnicianPerm())
        $state.go('tech.home');
      else $state.go('login');
    }
  }
]);
