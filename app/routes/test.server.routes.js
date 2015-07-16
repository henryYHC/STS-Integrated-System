'use strict';

module.exports = function(app) {
    var walkins = require('../../app/controllers/walkins.server.controller');
    var servicenow = require('../../app/controllers/servicenow-requestor.server.controller');

    app.route('/test/servicenow/createWalkin').get(servicenow.createWalkinIncident);
};
