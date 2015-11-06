'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    _ = require('lodash'),
    Walkin = mongoose.model('Walkin'),
    ContactLog = mongoose.model('ContactLog'),
    Checkin = mongoose.model('Checkin');

/**
 * Create a Contact log
 */
exports.log = function(logObj, callback) {
    if(logObj.type && logObj.customer && logObj.technician){
        var log = new ContactLog(logObj);
        log.save(function(err, entry){
            if(callback)    callback(err, entry);
            else if(!err)   return entry;
            else            return null;
        });
    }
};

exports.logWalkin = function(req, res){
    var walkin = req.walkin, log = req.body;
    log.customer = walkin.user;
    log.technician = req.user;

    exports.log(log, function(err, entry){
        if(err)  return res.status(400).send(err);
        if(walkin.contactLog)   walkin.contactLog.push(entry);
        else                    walkin.contactLog = [entry];

        walkin.save(function(err, walkin){
            if(err) return res.status(400).send(err);
            else    res.jsonp(walkin);
        });
    });
};

exports.logCheckin = function(req, res){
    var checkin = req.checkin, log = req.body;
    log.customer = checkin.user;
    log.technician = req.user;

    exports.log(log, function(err, entry){
        if(err)  return res.status(400).send(err);
        if(checkin.contactLog)   checkin.contactLog.push(entry);
        else                    checkin.contactLog = [entry];

        checkin.save(function(err, checkin){
            if(err) return res.status(400).send(err);
            else    res.jsonp(checkin);
        });
    });
};


/**
 * List of Contact logs
 */
exports.list = function(req, res) {

};
