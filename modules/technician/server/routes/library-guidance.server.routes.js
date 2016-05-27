'use strict';

/**
 * Module dependencies
 */
var users = require('../../../users/server/controllers/users.server.controller'),
  library_guidance = require('../controllers/library-guidance.server.controller');

module.exports = function (app) {
  app.route('/api/tech/library-guidance/log').post(users.hasTechnicianPermission, library_guidance.log);
};
