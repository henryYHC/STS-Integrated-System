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
        i, j, size = taskNames.length,
        counts = DSUtil.initArray(12, DSUtil.initArray(size+1, 0));

    DeskTask.find({}, function(err, tasks){
        if(err) return res.status(400).send(err);

        var task, taskIndex;
        for(i in tasks){
            task = tasks[i];
            taskIndex = taskNames.indexOf(task.task);

            // Update since time
            if(task.created < since) since = task.created;

            // Update stats
            if(taskIndex >= 0){
                counts[task.created.getMonth()][taskIndex]++;
                counts[task.created.getMonth()][size]++;
            }
        }

        // Get total count of tasks
        var month, totalCount = 0, totalCounts =  DSUtil.initArray(size, 0);
        for(i in counts){
            month = counts[i];
            for(j in month)
                if(j < size) totalCounts[j] += month[j];
            totalCount += counts[i][size];
        }

        res.json({names : taskNames, from : since, counts : counts, totalCounts : totalCounts, total : totalCount});
    });
};

exports.reset = function(req, res){
    DeskTask.remove({}, function(err){
        if(err) return res.status(400).send(err);
        res.status(200).send('success');
    });
};

/**
 * Desk Task utils
 */
exports.getTaskOptions = function (req, res) {
    res.json(DeskTask.schema.path('task').enumValues);
};
