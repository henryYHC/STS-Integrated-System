'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    DeskTask = mongoose.model('DeskTask'),
    DSUtil = require('../../app/controllers/utils/dsutil.server.controller'),
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
    // To be filled...
};

/**
 * List of Desk tasks
 */
exports.list = function(req, res) {
    // To be filled...
};

/**
 * Stats of Desk tasks
 */
exports.stats = function(req, res){
    var since = Date.now(),
        taskNames = DeskTask.schema.path('task').enumValues,
        counts = DSUtil.initArray(12, DSUtil.initArray(taskNames.length, 0));

    DeskTask.find({}, function(err, tasks){
        if(err) return res.status(400).send(err);

        var task, taskIndex;
        for(var i in tasks){
            task = tasks[i];
            taskIndex = taskNames.indexOf(task.task);

            // Update since time
            if(task.created < since) since = task.created;

            // Update stats
            if(taskIndex >= 0) counts[task.created.getMonth()][taskIndex]++;
        }

        // Get total count of tasks
        var totalCount = 0, totalCounts =  DSUtil.initArray(taskNames.length, 0);
        for(var i in counts){
            for(var j in counts[i]){
                totalCounts[j] += counts[i][j];
                totalCount += counts[i][j];
            }
        }

        res.json({names : taskNames, from : since, counts : counts, totalCounts : totalCounts, total : totalCount});
    });
};

/**
 * Desk Task utils
 */
exports.getTaskOptions = function (req, res) {
    res.json(DeskTask.schema.path('task').enumValues);
};
