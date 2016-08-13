'use strict';

var _ = require('lodash');

exports.getCustomerWalkinSetting = function(req, res) {
  var system = req.setting, setting = {};
  
  setting.location_options = system.location_options;
  setting.computer_options = system.computer_options;
  setting.device_options = system.device_options;

  res.json(setting);
};
