'use strict';

module.exports = function(app) {
    var user = require('../../app/controllers/users.server.controller');
    var task = require('../../app/controllers/desk-task.server.controller');

    app.route('/task').post(user.hasPermission, task.create);

    // Desk Task util routes
    app.route('/task/util/loadTaskOptions').get(task.getTaskOptions);
};
