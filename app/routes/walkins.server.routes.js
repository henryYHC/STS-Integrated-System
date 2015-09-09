'use strict';

module.exports = function(app) {
	var users = require('../../app/controllers/users.server.controller');
	var walkins = require('../../app/controllers/walkins.server.controller');

	// Walkins Routes
	app.route('/walkins').post(walkins.create);
    app.route('/walkins/queue').get(users.hasPermission, walkins.queue);

    app.route('/walkins/duplicate').post(users.hasPermission, walkins.duplicate);
    app.route('/walkins/duplicate/:walkinId').post(users.hasPermission, walkins.duplicateFromId);

    app.route('/walkins/reassign/netid/:walkinId').post(users.hasPermission, walkins.reassignNetId);

    app.route('/walkins/:walkinId')
        .get(users.hasPermission, walkins.read)
        .put(users.hasPermission, walkins.update)
        .delete(users.hasAdminPermission, walkins.delete);

    // Walkins list
    app.route('/walkins/list/listAll').get(users.hasPermission, walkins.listAll);
    app.route('/walkins/list/listToday').get(users.hasPermission, walkins.listToday);
    app.route('/walkins/list/listBySearch').post(users.hasPermission, walkins.listBySearch);
    app.route('/walkins/list/listUnresolved').get(users.hasPermission, walkins.listUnresolved);
    app.route('/walkins/list/listUnSynced').get(users.hasAdminPermission, walkins.listUnSynced);
    app.route('/walkins/list/listByNetId/:userNetId').post(users.hasPermission, walkins.listByNetId);

    // ServiceNow
    app.route('/walkins/sync/:walkinId').put(users.hasAdminPermission, walkins.syncWalkin);

    // Walkins logs
    app.route('/walkins/setUnresolved/:walkinId').post(users.hasPermission, walkins.setUnresolved);
    app.route('/walkins/log/logService/:walkinId').put(users.hasPermission, walkins.logService);
    app.route('/walkins/log/logResolution/:walkinId').put(users.hasPermission, walkins.logResolution);

    // Walkin util routes
    app.route('/walkins/util/loadDeviceOS').get(walkins.getDeviceOS);
    app.route('/walkins/util/loadDeviceInfo').get(walkins.getDeviceInfo);
    app.route('/walkins/util/loadDeviceType').get(walkins.getDeviceType);
    app.route('/walkins/util/loadLocationOptions').get(walkins.getLocationOptions);
    app.route('/walkins/util/loadResolutionOptions').get(users.hasPermission, walkins.getResolutionOptions);

	// Finish by binding the Walkin middleware
	app.param('walkinId', walkins.walkinByID);
    app.param('userNetId', users.userByNetId);
};
