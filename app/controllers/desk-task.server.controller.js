'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    DeskTask = mongoose.model('DeskTask'),
    _ = require('lodash');

/**
 * Create a Desk task
 */
exports.create = function(req, res) {
    var task = new DeskTask(req.body);
    task.user = req.user;

    task.save(function(err){
        if(err) return res.status(300).send(err);
        else    res.json(task);
    });
};

/**
 * Show the current Desk task
 */
exports.read = function(req, res) {

};

/**
 * List of Desk tasks
 */
exports.list = function(req, res) {

};

/**
 * Desk Task utils
 */
exports.getTaskOptions = function (req, res) {
    res.json(DeskTask.schema.path('task').enumValues);
};
