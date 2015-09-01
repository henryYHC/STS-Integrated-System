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
        enum: ['Directions', 'Microform', 'Printer Error', 'Workstations', 'Other']
    },
    created: {
        type: Date,
        default: Date.now
    }
});

mongoose.model('DeskTask', DeskTaskSchema);
