'use strict';

var
  _ = require('lodash'),
  async = require('async'),
  mongoose = require('mongoose'),
  scheduler = require('./scheduler.server.controller.js'),

  User = mongoose.model('User'),
  KeyValueList = mongoose.model('KeyValueList'),
  SystemSetting = mongoose.model('SystemSetting');

// Module variables
var popOpt = [
  { path: 'device_options', model: 'KeyValueList', select: 'key values' },
  { path: 'computer_options', model: 'KeyValueList', select: 'key values' }
];

exports.init = function(){
  async.waterfall([
    exports.initSetting,
    scheduler.init
  ], function(err){
    if(err){
      console.error('**System initialization failed**');
      console.error(err);
    }
    else console.log();
  });
};

// Initialize / System check for current setting
exports.initSetting = function(callback){
  console.log('#### System setting information');
  SystemSetting.find({}).sort({ updated : -1 }).exec(function(err, settings){
    if(err){
      console.error('***System setting initialization failed***');
      if(callback){ callback(err, null); } return;
    }

    // Initialize default setting
    var setting;
    if(settings.length === 0){
      setting = new SystemSetting();
      setting.save(function(err, setting){
        if(err){
          console.error('***System setting initialization failed***');
          if(callback){ callback(err, null); } return;
        }
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

    // Initialize default user
    User.count({}, function(err, count){
      if(err){
        console.error('***User count (initialization) failed***');
        if(callback){ callback(err, null); } return;
      }
      if(!count){
        var user = new User(
          { firstName: 'System', lastName: 'Root', phone: '0000000000', location: 'N/A',
            username: 'root', password: 'password', roles: 'admin', provider: 'local' });

        user.save(function(err, user){
          if(err){
            console.error('***Root user initialization failed***');
            if(callback){ callback(err, null); } return;
          }
          else console.log('Root user initialized. (root/password)');
        });
      }
      else{
        console.log('Existing user count: ' + count); console.log();
        if(callback) callback(null, setting);
      }
    });
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
        if(option.values.length === 0) option.values.push('N/A');
        KeyValueList.update({ _id : option._id }, option, { upsert: true },
          function(err){ next(err, option); });
      }, function(err){ callback(err, setting); });
    }, new_setting),

    function(setting, callback){
      for(i = 0; i < setting.device_options.length; i++)
        if(!setting.device_options[i]._id)
          setting.device_options[i] = new KeyValueList(setting.device_options[i]);

      async.map(setting.device_options, function(option, next){
        if(option.values.length === 0) option.values.push('N/A');
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
