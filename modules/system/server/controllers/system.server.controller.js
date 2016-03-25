'use strict';

var mongoose = require('mongoose'),
  User = mongoose.model('User'),
  SystemSetting = mongoose.model('SystemSetting'),
  KeyValueList = mongoose.model('KeyValueList'),
  _ = require('lodash'),
  async = require('async'),
  UserValidator = require('../../../users/server/controllers/users.validation.server.controller.js');

var popOpt = [
  { path: 'device_options', model: 'KeyValueList', select: 'key values' },
  { path: 'computer_options', model: 'KeyValueList', select: 'key values' }
];

// Initialize / System check for current setting
exports.init = function(){
  SystemSetting.find({}).sort({ updated : -1 }).exec(function(err, settings){
    if(err) return console.error('***System setting initialization failed***');

    // Initialize default setting
    var setting;
    if(settings.length === 0){
      setting = new SystemSetting();
      setting.save(function(err, setting){
        if(err) return console.error('***System setting initialization failed***');
        else console.log('Default system setting initialized.');
      });
    }
    else if(settings.length > 1){
      console.error('Found more than one setting. Using the latest one.');
      for(var i = 1; i < settings.length; i++) settings[i].remove();
      setting = settings[0];
    }
    else{
      console.log('System setting loaded.');
      setting = settings[0];
    }
  });

  // Initialize default user
  User.count({}, function(err, count){
    if(err) return console.error('***User count (initialization) failed***');
    if(!count){
      var user = new User(
          { firstName: 'System', lastName: 'Root', phone: '0000000000', location: 'N/A',
            username: 'root', password: 'password', roles: 'admin', provider: 'local' });

      user.save(function(err, user){
        if(err) return console.error('***Root user initialization failed***');
        else console.log('Root user initialized. (root/password)');
      });
    }
    else console.log('Existing user count: ' + count);
  });
};

exports.update = function(req, res){
  var i, old_setting = req.setting, new_setting = req.body;

  async.waterfall([
    async.apply(function(setting, callback){
      for(i = 0; i < setting.computer_options.length; i++)
        if(!setting.computer_options[i]._id)
          setting.computer_options[i] = new KeyValueList(setting.computer_options[i]);

      async.map(setting.computer_options, function(option, next){
        KeyValueList.update({ _id : option._id }, option, { upsert: true },
          function(err){ next(err, option); });
      }, function(err){ callback(err, setting); });
    }, new_setting),

    function(setting, callback){
      for(i = 0; i < setting.device_options.length; i++)
        if(!setting.device_options[i]._id)
          setting.device_options[i] = new KeyValueList(setting.device_options[i]);

      async.map(setting.device_options, function(option, next){
        KeyValueList.update({ _id : option._id }, option, { upsert: true },
          function(err){ next(err, option); });
      }, function(err){ callback(err, setting); });
    }
  ],
  function(err, setting){
    if(!err){
      old_setting = _.extend(old_setting, setting);
      old_setting.save(function(err, setting){
        if(err) {
          res.status(500).send('Failed to update system setting.');
          return console.error(err);
        }
        else res.jsonp(old_setting);
      });
    }
  });
};

exports.getSetting = function (req, res) {
  res.json(req.setting);
};

// Setting middleware
exports.setting = function(req, res, next){
  SystemSetting.findOne({}, '-updated').populate(popOpt).exec(function(err, setting){
    if(err) req.setting = null;
    else req.setting = setting;
    next();
  });
};
