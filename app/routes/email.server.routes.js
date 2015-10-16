'use strict';

module.exports = function(app) {
    var users = require('../../app/controllers/users.server.controller');
    var email = require('../controllers/utils/email-util.server.controller.js');

    app.route('/email').post(users.hasPermission, email.sendEmail_REST);
};
