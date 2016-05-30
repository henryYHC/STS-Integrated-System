'use strict';

angular.module('technician').controller('TechPanelController', ['$location', 'Authentication',
  function ($location, Authentication) {
    if(!Authentication.hasTechnicianPerm()) $location.url('/login');
  }
]);
