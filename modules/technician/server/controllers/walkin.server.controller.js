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

/*----- Getters -----*/
exports.getWalkinSetting = function(req, res){
  var system = req.setting, setting = {};

  setting.location_options = system.location_options; setting.resolutions_options = resolution_templates;
  setting.device_options = system.device_options; setting.computer_options = system.computer_options;

  res.json(setting);
};

exports.view = function(req, res) {
  res.json(req.walkin);
};

exports.countWaiting = function(req, res, next) {
  Walkin.count({ isActive : true, liabilityAgreement : true, status : 'In queue' },
    function(err, count) {
      if(err) console.error(err);
      req.walkinCount = count;
      next();
    });
};

exports.getQueue = function(req, res) {
  var today = new Date(Date.now()); today.setHours(0);

  Walkin.find({ isActive : true, liabilityAgreement : true,
    $or: [{ status: { $in : ['In queue', 'Work in progress', 'House call pending'] } }, { created : { $gte: today } } ] })
    .sort('created').populate(populate_options).exec(function(err, walkins) {
      if(err) console.error(err);
      else {
        var queue = [], housecalls = [];
        var count = 0, sumTime = 0;

        for(var i in walkins) {
          switch (walkins[i].status) {
            case 'In queue' : case 'Work in progress': case 'Duplicate':
              queue.push(walkins[i]);
              break;

            case 'House call pending':
              housecalls.push(walkins[i]);
              break;

            case 'Completed':
              count++;
              sumTime += walkins[i].resolutionTime.getTime() - walkins[i].serviceStartTime.getTime();
          }
        }
        queue = queue.concat(housecalls);
        var avgTime = count !== 0? Math.round(sumTime / 60000.0 / count * 100) / 100.0 : 0;

        res.json({ walkins : queue, avgWaitTime : avgTime });
      }
    });
};

exports.previous = function(req, res) {
  var walkin = req.walkin, user = req.profile;
  Walkin.find({ user : user._id, created : { $lt: walkin.created } })
    .select('_id deviceCategory deviceInfo status resolutionType created')
    .sort('created').exec(function(err, previous) {
      if(err) {
        console.error(err);
        return res.sendStatus(500);
      }
      else res.json(previous);
    });
};

/*----- Instance queries -----*/
exports.query = function(req, res) {
  var query = req.body;

  if(query.username || query.displayName) {
    User.find(query).select('_id').exec(function(err, ids) {
      if(err) {
        console.error(err);
        return res.sendStatus(500);
      }

      ids = ids.map(function(obj){ return obj._id; });
      Walkin.find({ user : { $in : ids } })
        .select('_id user deviceCategory deviceInfo status resolutionType created resolutionTime')
        .populate([{ path : 'user', model : 'User', select : 'displayName username' }])
        .sort('created').exec(function(err, walkins) {
          if(err) {
            console.error(err);
            return res.sendStatus(500);
          }
          else res.json(walkins);
        });
    });
  }
  else {
    Walkin.find(query)
      .select('_id user deviceCategory deviceInfo status resolutionType created resolutionTime')
      .populate([{ path : 'user', model : 'User', select : 'displayName username' }])
      .sort('created').exec(function(err, walkins) {
        if(err) {
          console.error(err);
          return res.sendStatus(500);
        }
        else res.json(walkins);
      });
  }
};

exports.unresolved = function(req, res) {
  var today = new Date(Date.now()); today.setHours(0);
  Walkin.find({ isActive : true, liabilityAgreement : true,
    $or : [
      { status: { $in : ['In queue', 'Work in progress', 'House call pending'] } },
      { status : 'Unresolved', created : { $gte : today } } ] }
  ).select('_id user deviceCategory deviceInfo status resolutionType created resolutionTime')
    .populate([{ path : 'user', model : 'User', select : 'displayName username' }])
    .sort('created').exec(function(err, walkins) {
      if(err) {
        console.error(err);
        return res.sendStatus(500);
      }
      else res.json(walkins);
    });
};

exports.today = function(req, res) {
  var today = new Date(Date.now()); today.setHours(0);
  Walkin.find({ isActive : true, liabilityAgreement : true, $or : [ { created : { $gte : today } }, { resolutionTime : { $gte : today } }] })
    .select('_id user deviceCategory deviceInfo status resolutionType created resolutionTime')
    .populate([{ path : 'user', model : 'User', select : 'displayName username' }])
    .sort('created').exec(function(err, walkins) {
      if(err) {
        console.error(err);
        return res.sendStatus(500);
      }
      else res.json(walkins);
    });
};

exports.month = function(req, res) {
  var currentMonth = new Date(Date.now()); currentMonth.setDate(1); currentMonth.setHours(0);
  Walkin.find({ isActive : true, liabilityAgreement : true,
    $or : [{ created : { $gte : currentMonth } }, { resolutionTime : { $gte : currentMonth } }] })
    .select('_id user deviceCategory deviceInfo status resolutionType created resolutionTime')
    .populate([{ path : 'user', model : 'User', select : 'displayName username' }])
    .sort('created').exec(function(err, walkins) {
      if(err) {
        console.error(err);
        return res.sendStatus(500);
      }
      else res.json(walkins);
    });
};

/*----- Instance functions -----*/
exports.create = function(req, res) {

};

exports.duplicate = function(req, res) {
  var original = req.walkin,
    duplicate = new Walkin({
      status: 'Duplicate',
      user: original.user,
      lastUpdateTechnician: req.user,
      deviceInfo: original.deviceInfo,
      description: original.description,
      otherDevice: original.otherDevice,
      deviceCategory: original.deviceCategory,
      liabilityAgreement: original.liabilityAgreement
    });

  duplicate.save(function(err) {
    if(err) {
      console.error(err);
      return res.sendStatus(500);
    }
    else res.json(duplicate);
  });
};

exports.reassign = function(req, res) {
  var user = req.profile;
  if(!user) return res.status(500).send('User does not exist. Please submit a new walk-in ticket.');
  if(!user.isActive) return res.status(500).send('User is not active. User does not have access to service.');
  
  var walkin = req.walkin; walkin.user = user;
  walkin.save(function(err) {
    if(err) {
      console.error(err);
      return res.sendStatus(500);
    }
    res.json(walkin);
  });
};

exports.update = function(req, res) {
  var original = req.walkin, updated = req.body;
  var o_user = original.user, u_user = updated.user;

  // Check if user information changed
  if(o_user.displayName !== u_user.displayName ||
    o_user.phone !== u_user.phone ||
    o_user.location !== u_user.location ||
    o_user.verified !== u_user.verified) {

    o_user = _.extend(o_user, u_user);
    o_user.save(function(err) {
      if(err) {
        console.error(err);
        return res.sendStatus(500);
      }
    });
  }

  // Update walk-in information
  original = _.extend(original, updated);
  updated.lastUpdateTechnician = req.user;
  original.save(function(err) {
    if(err) {
      console.error(err);
      return res.sendStatus(500);
    }
  });
  res.json(original);
};

/*----- Instance status updates -----*/
exports.noshow = function(req, res) {
  var original = req.walkin, updated = req.body.walkin;

  original = _.extend(original, updated);
  original = _.extend(original, {
    resoluteTechnician : req.user,
    lastUpdateTechnician: req.user,
    status : 'Unresolved'
  });
  if(!original.resolutionTime)
    original.resolutionTime = Date.now();

  original.save(function(err) {
    if(err) {
      console.error(err);
      return res.sendStatus(500);
    }
  });
  res.sendStatus(200);
};

exports.toHouseCall = function(req, res) {
  var original = req.walkin, updated = req.body.walkin;

  original = _.extend(original, updated);
  original = _.extend(original, {
    lastUpdateTechnician: req.user,
    status : 'Unresolved'
  });
  if(!original.resolutionTime)
    original.resolutionTime = Date.now();

  original.save(function(err) {
    if(err) {
      console.error(err);
      return res.sendStatus(500);
    }
  });
  res.sendStatus(200);
};

exports.beginService = function(req, res) {
  var walkin = req.walkin;
  walkin = _.extend(walkin, {
    status: 'Work in progress',
    serviceTechnician: req.user,
    lastUpdateTechnician: req.user
  });
  if(!walkin.serviceStartTime)
    walkin.serviceStartTime = Date.now();

  walkin.save(function(err, walkin) {
    if(err) {
      console.error(err);
      return res.sendStatus(500);
    }
    else res.json(walkin);
  });
};

exports.resolve = function(req, res) {
  var walkin = req.walkin, resolved = req.body;

  resolved = _.extend(resolved, {
    status: 'Completed',
    resolutionTime: Date.now(),
    resoluteTechnician: req.user,
    lastUpdateTechnician: req.user
  });
  walkin = _.extend(walkin, resolved);

  walkin.save(function(err) {
    if(err) {
      console.error(err);
      return res.sendStatus(500);
    }
    else {
      res.sendStatus(200);
    }
  });
};

/*----- Instance middlewares -----*/
exports.walkinById = function(req, res, next, id) {
  Walkin.findOne({ _id : id }).populate(populate_options)
    .exec(function(err, walkin) {
      if(err) console.error(err);
      else {
        req.walkin = walkin; next();
      }
    });
};
