'use strict';

module.exports = function (app) {
  // Root routing
  var dashboard = require('../controllers/dashboard.server.controller.js');

  app.route('/api/technician/dashboard/stats').get(dashboard.stats);

};
