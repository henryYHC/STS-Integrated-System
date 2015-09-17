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
    var checkin = new Checkin(req.body);

    console.log(checkin);
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
