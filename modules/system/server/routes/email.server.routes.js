'use strict';

module.exports = function (app) {
  // Root routing
  var email = require('../controllers/mailer.server.controller.js').default();
  
  app.route('/api/technician/email/send')
    .post(email.send);
};
