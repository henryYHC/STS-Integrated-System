'use strict';

module.exports = function(app) {
	var users = require('../../app/controllers/users.server.controller');
	var walkins = require('../../app/controllers/walkins.server.controller');

	// Walkins Routes
	app.route('/walkins')
		.get(walkins.list)
		.post(walkins.create);

    app.route('/walkins/queue').get(walkins.queue);

	app.route('/walkins/:walkinId')
		.get(walkins.read)
		.put(walkins.update)
		.delete(walkins.delete);

    // Walkin util routes
    app.route('/walkins/util/loadLocationOptions').get(walkins.getLocationOptions);
    app.route('/walkins/util/loadDeviceType').get(walkins.getDeviceType);
    app.route('/walkins/util/loadDeviceInfo').get(walkins.getDeviceInfo);
    app.route('/walkins/util/loadDeviceOS').get(walkins.getDeviceOS);

	// Finish by binding the Walkin middleware
	app.param('walkinId', walkins.walkinByID);
};
