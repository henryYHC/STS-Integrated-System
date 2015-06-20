'use strict';

/**
 * Module dependencies.
 */
var passport = require('passport');

module.exports = function(app) {
	// User Routes
	var users = require('../../app/controllers/users.server.controller');

	// Setting up the users profile api
	app.route('/users/me').get(users.me);
	app.route('/users').put(users.hasAuthorization(['admin']), users.update);
	app.route('/users/accounts').delete(users.hasAuthorization(['admin']), users.removeOAuthProvider);

	// Setting up the users password api
	app.route('/users/password').post(users.hasAuthorization(['admin', 'technician']), users.changePassword);
	app.route('/auth/forgot').post(users.hasAuthorization(['admin', 'technician']), users.forgot);
	app.route('/auth/reset/:token').get(users.validateResetToken);
	app.route('/auth/reset/:token').post(users.reset);

	// Setting up the users authentication api
	app.route('/auth/signup').post(users.hasAuthorization(['admin']), users.signup);
	app.route('/auth/signin').post(users.signin);
	app.route('/auth/signout').get(users.signout);

    // Walkin
    app.route('/user/validate/:userNetId').get(users.validateNetId);

	// Finish by binding the user middleware
	app.param('userId', users.userByID);
    app.param('userNetId', users.userByNetId);
};
