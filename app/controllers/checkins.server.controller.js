'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    _ = require('lodash'),
    User = mongoose.model('User'),
    Walkin = mongoose.model('Walkin'),
    ServiceEntry = mongoose.model('ServiceEntry'),
    Checkin = mongoose.model('Checkin');

var popOpt = [
    { path : 'user', model : 'User', select : 'firstName lastName displayName username phone location verified'},
    { path : 'walkin', model : 'Walkin', select : 'deviceCategory deviceType os otherDevice problem'},
    { path : 'serviceLog', model : 'ServiceEntry', select : 'type description createdBy createdAt'},
    { path : 'completionTechnician', model : 'User', select : 'username displayName'},
    { path : 'verificationTechnician', model : 'User', select : 'username displayName'},
    { path : 'checkoutTechnician', model : 'User', select : 'username displayName'}
];

var popOpt_entry = [
    { path : 'serviceLog.createdBy', model : 'User', select : 'displayName'}
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

        // Resolve walkin
        walkin.status = 'Completed';
        walkin.resolutionType = 'Check-in';
        walkin.resolution = 'Ticket has been transferred into a check-in instance.';
        if(!walkin.resoluteTechnician || !walkin.resolutionTime){
            walkin = _.extend(walkin , {resoluteTechnician : req.user, resolutionTime : Date.now() });
        }

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
    var checkin = req.checkin;
    checkin.status = req.body.status;

    switch (checkin.status){
        case 'Verification pending':
            checkin.completionTechnician = req.user;
            break;
        case 'Checkout pending':
            checkin.verificationTechnician = req.user;
            break;
        case 'Completed':
            checkin.checkoutTechnician = req.user;
            break;
    }

    checkin.save(function(err){
        if(err) return res.status(400).send(err);
        res.json(checkin);
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
            req.checkin = checkin;
            next();
        });
    });
};
