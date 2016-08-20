'use strict';

var async = require('async'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  Walkin = mongoose.model('Walkin'),
  Checkin = mongoose.model('Checkin');

exports.stats = function(req, res) {
  var stats = { walkin: {}, checkin : {} };
  var today = new Date(Date.now()); today.setHours(0);
  var currentMonth = new Date(Date.now()); currentMonth.setDate(1); currentMonth.setHours(0);

  async.waterfall([
    function(callback) {
      Walkin.find({ isActive : true, liabilityAgreement : true,
        status: { $in : ['In queue'] }, created : { $gte: today } })
        .count(function(err, count){ stats.walkin.queue = count; callback(err); });
    },
    function(callback) {
      Walkin.find({ isActive : true, liabilityAgreement : true, 
        $or : [ { created : { $gte : today } }, { resolutionTime : { $gte : today } }] })
        .count(function(err, count){ stats.walkin.today = count; callback(err); });
    },
    function(callback) {
      Checkin.find({ status : { $ne : 'Completed' }, isActive : true })
        .count(function(err, count){ stats.checkin.queue = count; callback(err); });
    },
    function(callback) {
      Checkin.find({ isActive : true, completionTime : { $gte : currentMonth } })
        .count(function(err, count){ stats.checkin.month = count; callback(err); });
    }
  ], function(err){
    if(err) {
      console.error(err);
      return res.sendStatus(500);
    }
    else res.json(stats);
  });
};
