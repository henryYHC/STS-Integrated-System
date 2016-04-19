'use strict';

var schedule = require('node-schedule'),
    mongoose = require('mongoose'),
    async = require('async'),
    User = mongoose.model('User'),
    Walkin = mongoose.model('Walkin'),
    Checkin = mongoose.model('Checkin'),
    Email = require('./email-util.server.controller.js'),
    ServiceNow = require('./servicenow-requestor.server.controller.js');

var popOpt = [
    { path : 'user', model : 'User', select : 'firstName lastName username isWildcard'}
];

var
scheduledSurveyBroadCast_Walkin = function(){
    return schedule.scheduleJob('0 15 18 * * 1-5',
    function(){
        var i, user, today = new Date(Date.now());
        today.setHours(0); today.setMinutes(0);

        Walkin.find({status : 'Completed', isActive : true,
            resolutionType : { $nin :['N/A', 'Check-in']}, updated : {$gte: today} })
            .select('user -_id').populate(popOpt).exec(
            function(err, users){
                if(err) return console.error(err);

                for(i = 0; i < users.length; i++){
                    user = users[i].user;
                    Email.sendSurvey_routine(Email.WALKIN, user.username+'@emory.edu', user.firstName);
                }
            });
    });
},
scheduledSurveyBroadCast_Checkin = function(){
    return schedule.scheduleJob('0 15 18 * * 1-5',
        function(){
            var i, user, today = new Date(Date.now());
            today.setHours(0); today.setMinutes(0);

            Checkin.find({status : 'Completed', isActive : true, updated : {$gte: today} })
                .select('user -_id').populate(popOpt).exec(
                function(err, users){
                    if(err) return console.error(err);

                    for(i = 0; i < users.length; i++){
                        user = users[i].user;
                        if(!user.isWildcard)
                            Email.sendSurvey_routine(Email.CHECKIN, user.username+'@emory.edu', user.firstName);
                    }
                });
        });
},
scheduledServiceNowSync_Walkin = function(){
    return schedule.scheduleJob('0 0 18 * * 1-5', function(){
        ServiceNow.syncUnsyncedTickets(ServiceNow.CREATE, ServiceNow.WALKIN);
        ServiceNow.syncUnsyncedTickets(ServiceNow.CREATE, ServiceNow.CHECKIN);
    });
};

exports.initScheduledJobs = function(){
    console.log('Initializing Scheduled Jobs...');

    scheduledSurveyBroadCast_Walkin();
    console.log('---> Scheduled Routine Walk-in Survey Email BroadCast @ 6:15pm: Done.');

    scheduledSurveyBroadCast_Checkin();
    console.log('---> Scheduled Routine Check-in Survey Email BroadCast @ 6:15pm: Done.');

    scheduledServiceNowSync_Walkin();
    console.log('---> Scheduled ServiceNow Sync for Un-synced Ticket @ 6pm: Done.');
};



