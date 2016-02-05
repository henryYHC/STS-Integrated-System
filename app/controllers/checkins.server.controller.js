'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    _ = require('lodash'),
    User = mongoose.model('User'),
    Walkin = mongoose.model('Walkin'),
    ServiceEntry = mongoose.model('ServiceEntry'),
    Checkin = mongoose.model('Checkin'),
    ContactLog = mongoose.model('ContactLog'),
    label = require('./utils/label-util.server.controller.js'),
    Email = require('./utils/email-util.server.controller.js');

var popOpt = [
    { path : 'user', model : 'User', select : 'firstName lastName displayName username phone location verified'},
    { path : 'walkin', model : 'Walkin', select : 'description resoluteTechnician deviceCategory deviceType os otherDevice'},
    { path : 'serviceLog', model : 'ServiceEntry', select : 'type description createdBy createdAt'},
    { path : 'completionTechnician', model : 'User', select : 'username displayName'},
    { path : 'verificationTechnician', model : 'User', select : 'username displayName'},
    { path : 'checkoutTechnician', model : 'User', select : 'username displayName'},
    { path : 'contactLog', model : 'ContactLog'}
];

var popOpt_entry = [
    { path : 'serviceLog.createdBy', model : 'User', select : 'displayName'}
],
    popOpt_walkin = [
    { path : 'walkin.resoluteTechnician',  model : 'User', select : 'username displayName'}
],
    popOpt_contactLog = [
    { path : 'contactLog.customer', model: 'User', select: 'displayName username' },
    { path : 'contactLog.technician', model: 'User', select: 'displayName username' }
];

/**
 * Create a Checkin
 */
exports.create = function(req, res) {
    var checkin = new Checkin(req.body), walkin = req.walkin;

    checkin.user = walkin.user;
    checkin.walkin = walkin;

    checkin.save(function(err, response){
        if(err) return res.status(400).send(err);
        label.printCheckinLabel(checkin.itemReceived.length,
            walkin.user.displayName,
            walkin.user.username,
            checkin.created.toDateString());

        // Resolve walkin
        walkin.status = 'Completed';
        walkin.resolutionType = 'Check-in';
        walkin.resolution = 'Ticket has been transferred into a check-in instance.';
        if(!walkin.resoluteTechnician || !walkin.resolutionTime){
            walkin = _.extend(walkin , {resoluteTechnician : req.user, resolutionTime : Date.now() });
        }

        Email.sendCheckinReceipt(walkin.user.username+'@emory.edu', checkin._id, checkin.itemReceived, walkin.user.displayName);

        walkin.save(function(err){
            if(err) return res.status(400).send(err);
            res.json(response);
        });
    });
};

/**
 * Show the current Checkin
 */
exports.workQueue = function(req, res) {
    Checkin.find({$or :[{status: 'Work in progress'},  {status : 'Verification pending'}], isActive : true})
        .populate(popOpt).sort('created').exec(function(err, checkins){
        if(err) return res.status(400).send(err);

        ServiceEntry.populate(checkins, popOpt_entry, function(err, checkins){
            if(err) return res.status(400).send(err);
            res.json(checkins);
        });
    });
};

exports.pendingQueue = function(req, res) {
    Checkin.find({$or : [{status : 'Checkout pending'}, {status : 'User action pending'}], isActive : true})
        .populate(popOpt).sort('created').exec(function(err, checkins){
        if(err) return res.status(400).send(err);
        ServiceEntry.populate(checkins, popOpt_entry, function(err, checkins){
            if(err) return res.status(400).send(err);
            res.json(checkins);
        });
    });
};

/**
 * Update a Checkin
 */
exports.update = function(req, res) {
    var checkin = req.checkin ;
    checkin = _.extend(checkin , req.body);

    checkin.save(function(err) {
        if (err)
            return res.status(400).send(err);
        else
            res.jsonp(checkin);
    });
};

exports.logService = function(req, res){
    var checkin = req.checkin,
        entry = new ServiceEntry(req.body.log);

    entry.createdBy = req.user._id;

    entry.save(function(err){
        if(err) return res.status(400).send(err);

        checkin.serviceLog.push(entry);

        checkin.save(function(err){
            if(err) return res.status(400).send(err);
            res.json(entry);
        });
    });
};

exports.setStatus = function(req, res){
    var user, checkin = req.checkin;
    checkin.status = req.body.status;

    switch (checkin.status){
        case 'Verification pending':
            checkin.completionTechnician = req.user;
            break;
        case 'Checkout pending':
            checkin.verificationTechnician = req.user;
            user = checkin.user;
            Email.sendPickupReceipt(user.username+'@emory.edu', checkin._id, checkin.itemReceived, user.displayName);
            break;
        case 'Completed':
            checkin.checkoutTechnician = req.user;
            user = checkin.user;
            Email.sendServiceLog(user.username+'@emory.edu', checkin._id, checkin.itemReceived, checkin.serviceLog, user.displayName);
            break;
    }

    checkin.save(function(err){
        if(err) return res.status(400).send(err);
        return res.json(checkin);
    });
};

exports.printLabel = function(req, res){
    var checkin = req.checkin;
    label.printCheckinLabel(1,
        checkin.user.displayName,
        checkin.user.username,
        checkin.created.toDateString());
    res.status(200).send('Printed.');
};

exports.getListingMetadata = function(req, res){
    Checkin.find({isActive : true}).sort({created : 1}).exec(
    function(err, checkins){
        if(err) return res.status(500).send('Check-in query failed.');

        var metadata = {}, head = checkins[0], tail = checkins[checkins.length-1];

        var years = [], startYr = head.created.getFullYear(), endYr = tail.created.getFullYear();
        for(var i = startYr; i <= endYr; i++) years.push(i);
        metadata.years = years;

        res.jsonp(metadata);
    });
};

exports.listByMonth = function(req, res){
    var month = req.month, year = req.year;
    var start = new Date(year, month-1, 1), end = new Date(year, month, 1);

    Checkin.find({ created : {$gte: start, $lt: end}},
        function(err, checkins){
            if(err) return res.status(400).send('Failed to retrieved checkins');
            Checkin.populate(checkins, popOpt, function(err, checkins){
                if (err) return res.status(400).send('Failed to populate checkins');
                res.jsonp(checkins);
            });
    });
};

/**
 * Delete an Checkin
 */
exports.delete = function(req, res) {

};

exports.view = function(req, res) {
    ServiceEntry.populate(req.checkin, popOpt_entry, function(err, checkin){
        if(err) return res.status(400).send(err);
        res.json(checkin);
    });
};

exports.checkinByID = function(req, res, next, id) {
    Checkin.findById(id).exec(function(err, checkin) {
        if (err) return next(err);
        if (!checkin) return next(new Error('Failed to load Checkin ' + id));
        Checkin.populate(checkin, popOpt, function(err, checkin){
            if (err) return next(err);
            Walkin.populate(checkin, popOpt_walkin, function(err, checkin){
                if (err) return next(err);
                ContactLog.populate(checkin, popOpt_contactLog, function(err, checkin){
                    if (err) return next(err);  req.checkin = checkin; next();
                });
            });
        });
    });
};

exports.parseMonth = function(req, res, next, month){
    req.month = month; next();
};

exports.parseYear = function(req, res, next, year){
    req.year = year; next();
};
