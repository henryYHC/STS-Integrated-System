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

/*
 * Checkin util
 */
exports.getDeviceInfoOSOptions = function (req, res) {
    res.json(Checkin.schema.path('deviceInfoOS').enumValues);
};
exports.getItemReceivedOptions = function (req, res) {
    res.json(Checkin.schema.path('itemReceived').enumValues);
};
