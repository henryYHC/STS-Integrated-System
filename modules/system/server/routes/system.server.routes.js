'use strict';

module.exports = function (app) {
  // Root routing
  var system = require('../controllers/system.server.controller.js');

  app.route('/system/setting')
    .get(system.setting, system.getSetting)
    .put(system.setting, system.update);
};
