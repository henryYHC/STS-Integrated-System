'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * UserEntry Schema
 */
var UserEntrySchema = new Schema({
    netid: {
        type: String,
        trim: true,
        required: true
    },
    type: {
        type: String,
        trim: true,
        required: true
    },
    firstName: {
        type: String,
        trim: true,
        default: ''
    },
    lastName: {
        type: String,
        trim: true,
        default: ''
    },
    updated: {
        type: Date,
        default: Date.now
    },
    isActive: {
        type: Boolean,
        default: true
    }
});

UserEntrySchema.pre('save', function(next) {
    this.netid = this.netid.toLowerCase();
    next();
});

mongoose.model('UserEntry', UserEntrySchema);
