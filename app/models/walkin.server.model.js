'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * Walkin Schema
 */
var WalkinSchema = new Schema({
	name: {
		type: String,
		default: '',
		required: 'Please fill Walkin name',
		trim: true
	},
	created: {
		type: Date,
		default: Date.now
	},
	user: {
		type: Schema.ObjectId,
		ref: 'User'
	}
});

mongoose.model('Walkin', WalkinSchema);