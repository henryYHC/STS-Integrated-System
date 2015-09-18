'use strict';

module.exports = function(app) {
    var users = require('../../app/controllers/users.server.controller');
    var walkins = require('../../app/controllers/walkins.server.controller');
    var checkins = require('../../app/controllers/checkins.server.controller');

    app.route('/checkins/:walkinId').post(users.hasPermission, checkins.create);

    app.param('walkinId', walkins.walkinByID);
};
