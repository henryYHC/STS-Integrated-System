'use strict';

/**
 * Module dependencies
 */
var passport = require('passport');

module.exports = function (app) {
  // User Routes
  var users = require('../controllers/users.server.controller');

  app.route('/api/auth/signin').post(users.signin);
  app.route('/api/auth/signout').get(users.signout);
};
