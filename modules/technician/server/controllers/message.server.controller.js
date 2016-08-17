'use strict';

var _ = require('lodash'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  Message = mongoose.model('Message');

var popOpt = [
  { path: 'to', model : 'User', select : 'username displayName profileImageURL' },
  { path: 'from', model : 'User', select : 'username displayName profileImageURL' }
];

exports.create = function(req, res) {
  var from = req.user, to = req.profile;
  var message = new Message(_.extend(req.body, { from : from, to : to }));
  
  message.save(function(err, message) {
    if(err) { console.error(err); res.sendStatus(500); }
    else res.json(message);
  });
};

exports.technicians = function(req, res) {
  Message.find({ type : 'technician' }).sort('created')
    .populate(popOpt).exec(function(err, messages) {
      if(err) { console.error(err); res.sendStatus(500); }
      else res.json(messages);
    });
};
