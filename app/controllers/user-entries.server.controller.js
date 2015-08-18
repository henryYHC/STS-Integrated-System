'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    errorHandler = require('./errors.server.controller'),
    _ = require('lodash'),
    UserEntry = mongoose.model('UserEntry');

/**
 * Create a User entry
 */
exports.create = function(req, res) {
    var entry = req.body;

    UserEntry.findOne({netid:entry.netid}, function(err, response){
        if(err) return res.status(400).send(err);
        if(response){
            entry = _.extend(response, entry);
            entry.updated = Date.now();
        }
        else
            entry = new UserEntry(entry);

        entry.save(function(err) {
            if (err) return res.status(400).send({ message: errorHandler.getErrorMessage(err) });
            else res.jsonp(entry);
        });
    });
};

/**
 * Show the current User entry
 */
exports.read = function(req, res) {
    var entry = req.entry;
    res.json(entry);
};

/**
 * Update a User entry
 */
exports.update = function(req, res) {
    var entry = _.extend(req.entry , req.body);
    entry.updated = Date.now();
    entry.save(function(err) {
        if (err) return res.status(400).send({ message: errorHandler.getErrorMessage(err) });
        else res.jsonp(entry);
    });
};

/**
 * Delete an User entry
 */
exports.delete = function(req, res) {
    var entry = _.extend(req.entry , {isActive:false});
    entry.updated = Date.now();
    entry.save(function(err) {
        if (err) return res.status(400).send({ message: errorHandler.getErrorMessage(err) });
        else res.jsonp(entry);
    });
};

/**
 * User entries middleware
 */
exports.userEntryByNetId = function(req, res, next, netid) {
    UserEntry.findOne({netid:netid}, function(err, entry){
        if (err) return next(err);
        if (!entry) req.entry = null;
        else        req.entry = entry;
        next();
    });
};
