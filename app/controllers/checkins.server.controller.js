'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    _ = require('lodash'),
    User = mongoose.model('User'),
    Walkin = mongoose.model('Walkin'),
    Checkin = mongoose.model('Checkin');

/**
 * Create a Checkin
 */
exports.create = function(req, res) {
    var checkin = new Checkin(req.body), walkin = req.walkin;

    checkin.save(function(err, response){
        if(err) return res.status(400).send(err);

        // Resolve walkin
        walkin.status = 'Completed';
        walkin.resolutionType = 'Other';
        walkin.otherResolution = 'Check-in';
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
exports.read = function(req, res) {

};

/**
 * Update a Checkin
 */
exports.update = function(req, res) {

};

/**
 * Delete an Checkin
 */
exports.delete = function(req, res) {

};

/**
 * List of Checkins
 */
exports.list = function(req, res) {

};
