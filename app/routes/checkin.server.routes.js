'use strict';

module.exports = function(app) {
    var users = require('../../app/controllers/users.server.controller');
    var walkins = require('../../app/controllers/walkins.server.controller');
    var checkins = require('../../app/controllers/checkins.server.controller');
    var templateLoader = require('../controllers/utils/template-loader.server.controller.js');
    var contactLogs = require('../../app/controllers/contact-log.server.controller');

    app.route('/checkins/getTemplates').get(users.hasPermission, templateLoader.getTemplates);
    app.route('/checkins/workQueue').get(users.hasPermission, checkins.workQueue);
    app.route('/checkins/pendingQueue').get(users.hasPermission, checkins.pendingQueue);
    app.route('/checkins/log/:checkinId').post(users.hasPermission, checkins.logService);
    app.route('/checkins/log/logContact/:checkinId').post(users.hasPermission, contactLogs.logCheckin);
    app.route('/checkins/setStatus/:checkinId').post(users.hasPermission, checkins.setStatus);
    app.route('/checkins/printLabel/:checkinId').get(users.hasPermission, checkins.printLabel);

    app.route('/checkins/list/metadata').get(users.hasPermission, checkins.getListingMetadata);
    app.route('/checkins/list/:year/:month').get(users.hasPermission, checkins.listByMonth);

    app.route('/checkins/:checkinId')
        .get(users.hasPermission, checkins.view)
        .put(users.hasPermission, checkins.update);
    app.route('/checkins/:walkinId').post(users.hasPermission, checkins.create);

    app.param('walkinId', walkins.walkinByID);
    app.param('checkinId', checkins.checkinByID);
    app.param('month', checkins.parseMonth);
    app.param('year', checkins.parseYear);
};
