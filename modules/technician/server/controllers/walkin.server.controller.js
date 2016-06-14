'use strict';

var _ = require('lodash'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  Walkin = mongoose.model('Walkin'),
  ContactLog = mongoose.model('ContactLog');

var populate_options = [
  { path : 'user', model : 'User', select : 'firstName lastName displayName username phone location verified isWildcard' },
  { path : 'lastUpdateTechnician', model : 'User', select : 'displayName username' },
  { path : 'serviceTechnician', model : 'User', select : 'displayName username' },
  { path : 'resoluteTechnician', model : 'User', select : 'displayName username' },
  { path : 'contactLog', model : 'ContactLog' }
];

exports.getTechnicianSetting = function(req, res){
  var setting = req.setting;

  // Remove irrelevant system setting
  setting._id = setting.computer_os_editions = setting.scheduler_settings = undefined;
  setting.user_wildcard_prefixes = setting.user_validation_method = setting.servicenow_liveSync = undefined;

  res.json(setting);
};

exports.create = function(req, res) {

};
