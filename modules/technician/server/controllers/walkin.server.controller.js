'use strict';

var fs = require('fs'),
  _ = require('lodash'),
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

var resolution_templates_path = 'config/templates/walkin/resolution_templates.json',
  resolution_templates = JSON.parse(fs.readFileSync(resolution_templates_path, 'utf8'));

exports.getTechnicianSetting = function(req, res){
  var system = req.setting, setting = {};

  setting.location_options = system.location_options; setting.resolutions_options = resolution_templates;
  setting.device_options = system.device_options; setting.computer_options = system.computer_options;

  res.json(setting);
};

exports.create = function(req, res) {

};
