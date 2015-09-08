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
	app.route('/users').put(users.hasAdminPermission, users.update);
	app.route('/users/accounts').delete(users.hasAdminPermission, users.removeOAuthProvider);
	app.route('/users/setInactive/:userNetId').delete(users.hasPermission, users.setInactive);

	// Setting up the users password api
	app.route('/users/password').post(users.hasPermission, users.changePassword);
	app.route('/admin/resetPassword/:userNetId').post(users.hasAdminPermission, users.resetPassword);
    app.route('/force/resetPassword/:userNetId').post(users.forceResetPassword);

	// Setting up the users authentication api
    app.route('/auth/initAdmin').post(users.hasAdmin, users.signup);
	app.route('/auth/signup').post(users.hasAdminPermission, users.signup);
	app.route('/auth/signin').post(users.signin);
    app.route('/auth/authenticate').post(users.hasPermission, users.authenticate);
	app.route('/auth/signout').get(users.signout);

    // Walkin
    app.route('/user/validate/:userNetId').get(users.validateNetId);
    app.route('/user/verify/:userNetId').put(users.hasPermission, users.verifyNetId);
    app.route('/user/update/:userNetId').put(users.hasPermission, users.updateUser);

	// Finish by binding the user middleware
	app.param('userId', users.userByID);
    app.param('userNetId', users.userByNetId);
};
