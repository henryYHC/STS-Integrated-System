'use strict';

angular.module('technician').service('SystemPermission', ['$state', 'Authentication',
  function($state, Authentication){
    var user = Authentication.user;

    this.getUser = function() {
      return user;
    };

    this.isLogin = function() {
      return user !== undefined && user !== '';
    };

    this.hasAdminPerm = function() {
      return this.isLogin() && user.roles.indexOf('admin') >= 0;
    };

    this.hasTechnicianPerm = function(){
      return this.isLogin() && (this.hasAdminPerm() || user.roles.indexOf('technician') >= 0);
    };
  }
]);
