'use strict';

var fs = require('fs'),
  _ = require('lodash'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  Walkin = mongoose.model('Walkin'),
  Checkin = mongoose.model('Checkin'),
  ContactLog = mongoose.model('ContactLog');

var popOpt = [
  { path : 'user', model : 'User', select : 'firstName lastName displayName username phone location verified isWildcard' },
  { path : 'walkin', model : 'Walkin', select : 'description resoluteTechnician deviceCategory deviceType os otherDevice' },
  { path : 'serviceLog', model : 'ServiceEntry', select : 'type description createdBy createdAt' },
  { path : 'completionTechnician', model : 'User', select : 'username displayName' },
  { path : 'verificationTechnician', model : 'User', select : 'username displayName' },
  { path : 'checkoutTechnician', model : 'User', select : 'username displayName' },
  { path : 'contactLog', model : 'ContactLog' }
];

exports.getCheckinSetting = function(req, res) {
  var system = req.setting, setting = {};
  
  setting.computer_os_editions = system.computer_os_editions;
  setting.checkin_items = system.checkin_items;

  res.json(setting);
};

exports.view = function(req, res) {
  res.json(req.checkin);
};

exports.hasTransferred = function(req, res) {
  var walkin = req.walkin;

  if(walkin.status != 'Check-in') {
    Checkin.find({ walkin : walkin._id }).count(function(err, count) {
      if(err) { console.error(err); return res.sendStatus(500); }
      else res.json(count > 0);
    });
  }
  else res.json(true);
};

exports.create = function(req, res) {
  var user = req.user, checkin = new Checkin(req.body);

  // Resolve walk-in
  Walkin.findOne({ _id : checkin.walkin }).exec(function(err, walkin) {
    if(err) { console.error(err); return res.sendStatus(500); }
    else {
      walkin.status = 'Completed';
      walkin.resolutionType = 'Check-in';
      walkin.resolution = 'Ticket has been transferred into a check-in instance.';

      if(!walkin.resoluteTechnician || !walkin.resolutionTime)
        walkin = _.extend(walkin , { resoluteTechnician : user, resolutionTime : Date.now() });
      walkin.save(function(err){ if(err) { console.error(err); return res.sendStatus(500); }});

      checkin.save(function(err, checkin) {
        if(err) { console.error(err); return res.sendStatus(500); }
        else res.json(checkin);
      });
    }
  });
};

exports.queue = function(req, res) {
  var working = [], pending = [];

  Checkin.find({ status : { $ne : 'Completed' }, isActive : true })
    .sort('created').populate(popOpt).exec(function(err, checkins) {
      if(err) { console.error(err); return res.sendStatus(500); }
      else {
        for(var i in checkins) {
          switch (checkins[i].status) {
            case 'Work in progress': working.push(checkins[i]); break;
            default: pending.push(checkins[i]);
          }
        }
        res.json({ working : working, pending : pending });
      }
    });
};

/*----- Instance middlewares -----*/
exports.checkinById = function(req, res, next, id) {
  Checkin.findOne({ _id : id }).populate(popOpt)
    .exec(function(err, checkin) {
      if(err) console.error(err);
      else {
        req.checkin = checkin; next();
      }
    });
};
