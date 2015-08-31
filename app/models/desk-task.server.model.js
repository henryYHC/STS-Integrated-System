'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * DeskTask Schema
 */
var DeskTaskSchema = new Schema({
    user: {
        type: Schema.ObjectId,
        ref: 'User'
    },
    task: {
        type: String,
        required: true,
        enum: ['Task 1', 'Task 2', 'Task 3', 'Task 4', 'Task 5']
    },
    created: {
        type: Date,
        default: Date.now
    }
});

mongoose.model('DeskTask', DeskTaskSchema);
