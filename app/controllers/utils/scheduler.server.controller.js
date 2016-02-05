'use strict';

var schedule = require('node-schedule'),
    mongoose = require('mongoose'),
    User = mongoose.model('User'),
    Walkin = mongoose.model('Walkin'),
    Email = require('./email-util.server.controller.js');

var popOpt = [
    { path : 'user', model : 'User', select : 'firstName lastName username'},
];

var scheduledSurveyBroadCast_Walkin = function(){
    return schedule.scheduleJob('0 8 12 * * 1-5',
    function(){
        var i, user, today = new Date(Date.now());
        today.setHours(0); today.setMinutes(0);

        Walkin.find({status : 'Completed', isActive : true, updated : {$gte: today} })
            .select('user -_id').populate(popOpt).exec(
            function(err, users){
                if(err) return console.error(err);

                for(i = 0; i < users.length; i++){
                    user = users[i].user;
                    Email.sendSurvey_routine(user.username+'@emory.edu', user.firstName);
                }
            });
    });
};

exports.initScheduledJobs = function(){
    console.log('Initializing Scheduled Jobs...');

    scheduledSurveyBroadCast_Walkin(); console.log('---> Scheduled Routine Walk-in Survery Email BroadCast @ 6pm: Done.');
};



