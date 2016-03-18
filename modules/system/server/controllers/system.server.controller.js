'use strict';

var mongoose = require('mongoose'),
  User = mongoose.model('User'),
  SystemSetting = mongoose.model('SystemSetting'),
  KeyValueList = mongoose.model('KeyValueList'),
  _ = require('lodash');

var popOpt = [{ path: 'device_options', model: 'KeyValueList', select: 'key values' }];

// Initialize / System check for current setting
exports.init = function(){
  SystemSetting.find({}).sort({ updated : -1 }).exec(function(err, settings){
    if(err) return console.error('***System setting initialization failed***');

    // Initialize default setting
    var setting;
    if(settings.length === 0){
      setting = new SystemSetting();
      setting.save();
      console.log('Default system setting initialized.');
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
            username: 'root', password: 'password', role: 'admin' });
      user.save();
      console.log('Root user initialized. (root/password)');
    }
  });
};

exports.getSetting = function (req, res) {
  res.json(req.setting);
};

// Setting middleware
exports.setting = function(req, res, next){
  SystemSetting.findOne({}, '-_id -updated').populate(popOpt).exec(function(err, setting){
    if(err) req.setting = null;
    else req.setting = setting;
    next();
  });
};
