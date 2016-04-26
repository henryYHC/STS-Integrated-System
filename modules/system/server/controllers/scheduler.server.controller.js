'use strict';

var
  mongoose = require('mongoose'),
  format = require('string-format'),
  schedule = require('node-schedule');

// Module variables
exports.jobs = [];
exports.TASKS = {

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
  else console.log('No scheduler task found in system setting.');

  callback();
};
