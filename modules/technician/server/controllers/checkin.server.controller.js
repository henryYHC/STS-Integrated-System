'use strict';

var fs = require('fs'),
  _ = require('lodash'),
  async = require('async'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  Walkin = mongoose.model('Walkin'),
  Checkin = mongoose.model('Checkin'),
  ServiceEntry = mongoose.model('ServiceEntry'),
  ContactLog = mongoose.model('ContactLog');

var popOpt = [
  { path : 'user', model : 'User', select : 'firstName lastName displayName username phone location verified isWildcard' },
  { path : 'walkin', model : 'Walkin', select : 'description resoluteTechnician deviceCategory deviceInfo otherDevice' },
  { path : 'serviceLog', model : 'ServiceEntry', select : 'type description createdBy createdAt' },
  { path : 'completionTechnician', model : 'User', select : 'username displayName' },
  { path : 'verificationTechnician', model : 'User', select : 'username displayName' },
  { path : 'checkoutTechnician', model : 'User', select : 'username displayName' },
  { path : 'contactLog', model : 'ContactLog' }
];

var popOpt_entry = [
    { path : 'serviceLog.createdBy', model : 'User', select : 'username displayName' }
  ],
  popOpt_walkin = [
    { path : 'walkin.resoluteTechnician', model : 'User', select : 'username displayName' }
  ],
  popOpt_contactLog = [
    { path : 'contactLog.customer', model: 'User', select: 'displayName username' },
    { path : 'contactLog.technician', model: 'User', select: 'displayName username' }
  ];

var workflow_templates_path = 'config/templates/checkin/workflow_templates.json',
  workflow_templates = JSON.parse(fs.readFileSync(workflow_templates_path, 'utf8'));

exports.getCheckinTransferSetting = function(req, res) {
  var system = req.setting, setting = {};
  
  setting.computer_os_editions = system.computer_os_editions;
  setting.checkin_items = system.checkin_items;

  res.json(setting);
};

exports.getCheckinQueueSetting = function(req, res) {
  var system = req.setting, setting = {};

  setting.checkin_items = system.checkin_items;
  setting.templates = workflow_templates;
  
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

exports.update = function(req, res) {
  var checkin = req.checkin, updated = req.body;
  delete updated.__v;

  checkin = _.extend(checkin, updated);
  checkin.save(function(err, checkin) {
    if(err) { console.error(err); return res.sendStatus(500); }
    else res.json(checkin);
  });
};

exports.queue = function(req, res) {
  var working = [], pending = [];

  async.waterfall([
    function(callback){
      Checkin.find({ status : { $ne : 'Completed' }, isActive : true })
        .sort('created').populate(popOpt).exec(callback);
    },
    function(checkins, callback) {
      Walkin.populate(checkins, popOpt_walkin, callback);
    },
    function(checkins, callback) {
      ServiceEntry.populate(checkins, popOpt_entry, callback);
    },
    function(checkins, callback) {
      ContactLog.populate(checkins, popOpt_contactLog, callback);
    }
  ], function(err, checkins){
    if(err) { console.error(err); return res.sendStatus(500); }
    else {
      for (var i in checkins) {
        switch (checkins[i].status) {
          case 'Work in progress': working.push(checkins[i]); break;
          default: pending.push(checkins[i]);
        }
      }
      res.json({ working: working, pending: pending });
    }
  });
};

exports.logService = function(req, res) {
  var checkin = req.checkin, entry = new ServiceEntry(req.body);
  entry.createdBy = req.user;

  entry.save(function(err, entry) {
    if(err) { console.error(err); return res.sendStatus(500); }
    else {
      checkin.serviceLog.push(entry);
      checkin.save(function(err) {
        if(err) { console.error(err); return res.sendStatus(500); }
        else res.json(entry);
      });
    }
  });
};

/*----- Instance middlewares -----*/
exports.checkinById = function(req, res, next, id) {
  async.waterfall([
    function(callback) {
      Checkin.findOne({ _id : id }).populate(popOpt).exec(callback);
    },
    function(checkin, callback) {
      Walkin.populate(checkin, popOpt_walkin, callback);
    },
    function(checkin, callback) {
      ServiceEntry.populate(checkin, popOpt_entry, callback);
    },
    function(checkin, callback) {
      ContactLog.populate(checkin, popOpt_contactLog, callback);
    }
  ], function(err, checkin){ req.checkin = checkin; next(); });
};
