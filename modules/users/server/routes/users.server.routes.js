'use strict';

module.exports = function (app) {
  // User Routes
  var users = require('../controllers/users.server.controller.js');

  // Setting up the users profile api
  app.route('/api/users/me').get(users.me);
  app.route('/api/users').put(users.update);
  app.route('/api/users/password').post(users.changePassword);
  app.route('/api/users/picture').post(users.changeProfilePicture);

  // User validation
  app.route('/api/users/validate/:username').get(users.validate);
};
