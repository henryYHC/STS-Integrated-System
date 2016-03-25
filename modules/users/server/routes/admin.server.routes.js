'use strict';

/**
 * Module dependencies
 */
var admin = require('../controllers/admin.server.controller'),
  users = require('../controllers/users.server.controller');

module.exports = function (app) {

  app.route('/api/auth/registerTechnician').post(admin.registerTechnician);
  app.route('/api/auth/resetPwd/:username').put(admin.resetPwd);
  app.route('/api/auth/removeTechnician/:username').put(admin.removeTechnicianRole);

  // Finish by binding the user middleware
  app.param('username', users.userByUsername);
};
