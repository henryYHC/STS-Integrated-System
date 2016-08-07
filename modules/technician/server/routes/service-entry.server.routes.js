'use strict';

module.exports = function (app) {
  // Root routing
  var entry = require('../controllers/service-entry.server.controller.js');

  app.route('/api/technician/service-entry/update')
    .put(entry.update).delete(entry.remove);
};
