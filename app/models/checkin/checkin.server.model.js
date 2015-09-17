'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema,
	autoIncrement = require('mongoose-auto-increment');

// Plugin initialization
autoIncrement.initialize(mongoose.connection);

/**
 * Checkin Schema
 */
var CheckinSchema = new Schema({
	//Basic instance information
	user: {
		type: Schema.ObjectId,
		ref: 'User'
	},
	preDiagnostic:{
		type: String,
		trim: true,
		required: 'Preliminary diagnostic information is required.'
	},
	sugggestedAction:{
		type: String,
		trim: true,
		required: 'Suggested action information is required.'
	},
	deviceManufacturer:{
		type: String,
		trim: true,
		required: 'Device manufacturer information is required'
	},
	deviceModel:{
		type: String,
		trim: true,
		required: 'Device model information is required'
	},
	deviceInfoUser:{
		type: String,
		trim: true,
		required: 'Device user information is required'
	},
	deviceInfoPwd:{
		type: String,
		trim: true,
		required: 'Device password information is required'
	},
	deviceInfoOS:{
		type: [String],
		trim: true,
		default: ['64bit']
	},
	itemReceived:{
		type: String,
		trim: true,
		enum: [],
		required: true
	},
	otherItem:{
		type: String,
		trim: true,
		default: ''
	},
	reformatConsent:{
		type: Boolean,
		required: true
	},
	liabilitySig:{
		type: String,
		trim: true,
		default: ''
	},
	pickupSig:{
		type: String,
		trim: true,
		default: ''
	},

	//Walkin information
	walkinId: {
		type: Number,
		required: true
	},
	deviceCategory: {
		type: String,
		required: true,
		enum: ['Computer', 'Phone/Tablet', 'Gaming System', 'TV/Media Device', 'Other']
	},
	deviceType: {
		type: String,
		required: true,
		enum: ['N/A', 'TV', 'Roku', 'Apple TV', 'Fire Stick', 'Xbox', 'Playstation', 'Nintendo', 'Other']
	},
	os: {
		type: String,
		required: true,
		enum: ['N/A', 'Windows 10', 'Windows 8/8.1', 'Windows 7', 'Mac OSX 10.10 (Yosemite)', 'Mac OSX 10.9 (Mavericks)', 'Mac OSX 10.8 (Mountain Lion)', 'Mac OSX 10.7 (Lion)', 'iOS', 'Android', 'Windows', 'Other']
	},
	otherDevice: {
		type: String,
		default: '',
		trim: true
	},
	problem: {
		type: String,
		required: true,
		trim: true
	},
	isActive: {
		type: Boolean,
		default: true
	},

	// Instance log
	created: {
		type: Date,
		default: Date.now
	},
	updated: {
		type: Date
	},

	// Service log
	status: {
		type: String,
		enum: ['Checkout pending', 'Verification pending', 'Work in progress', 'Completed', 'User action pending'],
		default: ['Work in progress']
	},
	serviceDuetTime: {
		type: Date
	},
	resolutionTime: {
		type: Date
	},

	// Service Now information
	snSysId: {
		type: String,
		trim: true,
		default: ''
	},
	snValue: {
		type: String,
		trim: true,
		default: ''
	}
});

CheckinSchema.pre('save', function(next) {
	this.updated = Date.now();
	next();
});

CheckinSchema.plugin(autoIncrement.plugin, 'Checkin');
mongoose.model('Checkin', CheckinSchema);
