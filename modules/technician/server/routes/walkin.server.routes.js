'use strict';

module.exports = function (app) {
  // Root routing
  var system = require('../../../system/server/controllers/system.server.controller.js');
  var walkin = require('../controllers/walkin.server.controller.js');

  app.route('/api/technician/walkin/setting')
    .get(system.setting, walkin.getTechnicianSetting);
};
