'use strict';

var mongoose = require('mongoose'),
  format = require('string-format'),
  schedule = require('node-schedule'),
  User = mongoose.model('User'),
  Walkin = mongoose.model('Walkin'),
  Checkin = mongoose.model('Checkin'),
  mailer = require('./mailer.server.controller.js'),
  sn = require('./service-now.server.controller.js');

var popOpt = [
  { path : 'user', model : 'User', select : 'displayName username isWildcard' }
];

var
  WalkinSurveyBroadcast = function() {
    return schedule.scheduleJob('0 15 18 * * 1-5', function(){
      var i, user, today = new Date(Date.now());
      today.setHours(0); today.setMinutes(0);

      Walkin.find({ status : 'Completed', isActive : true, updated : { $gte: today },
        resolutionType : { $nin : ['N/A', 'Check-in'] } }).select('user -_id')
        .populate(popOpt).exec(function(err, walkins){
          if(err) return console.error(err);

          for(i = 0; i < walkins.length; i++){
            user = walkins[i].user;
            if(!user.isWildcard)
              mailer.sendSurvey(mailer.WALKIN, user.username+'@emory.edu', user.displayName);
          }
        });
    });
  },
  CheckinSurveyBroadcast = function() {
    return schedule.scheduleJob('0 15 18 * * 1-5', function(){
      var i, user, today = new Date(Date.now());
      today.setHours(0); today.setMinutes(0);

      Checkin.find({ status : 'Completed', isActive : true, updated : { $gte: today } })
        .select('user -_id').populate(popOpt).exec(function(err, checkins){
          if(err) return console.error(err);

          for(i = 0; i < checkins.length; i++){
            user = checkins[i].user;
            if(!user.isWildcard)
              mailer.sendSurvey(mailer.CHECKIN, user.username+'@emory.edu', user.displayName);
          }
        });
    });
  },
  ServiceNowBatchSync = function() {
    return schedule.scheduleJob('0 0 18 * * 1-5', function(){
      sn.syncUnsyncedTickets(sn.CREATE, sn.WALKIN);
      sn.syncUnsyncedTickets(sn.CREATE, sn.CHECKIN);
    });
  };

// Module variables
exports.jobs = [];
exports.TASKS = {
  'Walk-in Survey Broadcast @ 6:15pm' : WalkinSurveyBroadcast,
  'Check-in Survey Broadcast @ 6:15pm' : CheckinSurveyBroadcast,
  'ServiceNow Batch Sync @ 6:00pm' : ServiceNowBatchSync
};

exports.init = function(setting, callback){
  console.log('#### System scheduler information');
  var task, scheduler_settings = setting.scheduler_settings;

  if(scheduler_settings.length > 0){
    for(var idx = 0; idx < scheduler_settings.length; idx++){
      task = scheduler_settings[idx];
      if(exports.TASKS[task]){
        exports.jobs.push(exports.TASKS[task]);

        exports.TASKS[task]();
        console.log(format('Scheduler task initialized: {}', task));
      }
      else console.error(format('Unrecognized scheduler task : {}', task));
    }
  }
  else console.log('No scheduler task found in templates setting.');

  callback();
};

