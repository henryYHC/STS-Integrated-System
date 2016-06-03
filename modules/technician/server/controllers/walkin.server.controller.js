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

exports.create = function(req, res) {

};
