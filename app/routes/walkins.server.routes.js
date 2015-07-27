'use strict';

module.exports = function(app) {
	var users = require('../../app/controllers/users.server.controller');
	var walkins = require('../../app/controllers/walkins.server.controller');

	// Walkins Routes
	app.route('/walkins').post(walkins.create);

    app.route('/walkins/queue').get(walkins.queue);

	app.route('/walkins/:walkinId')
		.get(walkins.read)
		.put(walkins.update)
		.delete(walkins.delete);

    // Walkins list
    app.route('/walkins/list/listAll').get(walkins.listAll);
    app.route('/walkins/list/listToday').get(walkins.listToday);
    app.route('/walkins/list/listUnresolved').get(walkins.listUnresolved);
    app.route('/walkins/list/listBySearch').post(walkins.listBySearch);

    // Walkins logs
    app.route('/walkins/log/logService/:walkinId').put(users.hasAuthorization(['admin', 'technician']), walkins.logService);
    app.route('/walkins/log/logResolution/:walkinId').put(users.hasAuthorization(['admin', 'technician']), walkins.logResolution);

    // Walkin util routes
    app.route('/walkins/util/loadLocationOptions').get(walkins.getLocationOptions);
    app.route('/walkins/util/loadDeviceType').get(walkins.getDeviceType);
    app.route('/walkins/util/loadDeviceInfo').get(walkins.getDeviceInfo);
    app.route('/walkins/util/loadDeviceOS').get(walkins.getDeviceOS);
    app.route('/walkins/util/loadResolutionOptions').get(walkins.getResolutionOptions);

	// Finish by binding the Walkin middleware
	app.param('walkinId', walkins.walkinByID);
};
