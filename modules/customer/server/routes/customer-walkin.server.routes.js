'use strict';

module.exports = function (app) {
  // Root routing
  var system = require('../../../system/server/controllers/system.server.controller.js');
  var customer_walkin = require('../controllers/customer.server.controller.js');

  app.route('/api/customer/setting')
    .get(system.setting, customer_walkin.getCustomerWalkinSetting);
};
