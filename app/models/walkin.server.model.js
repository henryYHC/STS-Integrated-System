'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema,
    autoIncrement = require('mongoose-auto-increment');

/*
 * Field validations
 */
var validateDevice = function(){
    var device = this.deviceCategory
    if(device === 'Computer' || device === 'Phone/Tablet')
        return this.os;
    else if(device === 'Gaming System' || device === 'TV/Media Device')
        return this.deviceType;
    else
        return this.otherDevice;
};

var validateLiability = function(){
  return this.liabilityAgreement;
};

/**
 * Walkin Schema
 */
var WalkinSchema = new Schema({
	//Basic instance information
    user: {
		type: Schema.ObjectId,
		ref: 'User'
	},
    deviceCategory: {
        type: String,
        required: 'Please fill in the category of your device',
        enum: ['', 'Computer', 'Phone/Tablet', 'Gaming System', 'TV/Media Device', 'Other']
    },
    deviceType: {
        type: String,
        enum: ['TV', 'Roku', 'Apple TV', 'Fire Stick', 'Xbox', 'Playstation', 'Nintendo', 'Other'],
        validate: [validateDevice, 'Please fill in the type of your device']
    },
    os: {
      type: String,
      enum: ['Windows 10', 'Windows 8/8.1', 'Windows 7', 'Mac OSX 10.10 (Yosemite)', 'Mac OSX 10.9 (Mavericks)', 'Mac OSX 10.8 (Mountain Lion)', 'Mac OSX 10.7 (Lion)', 'iOS', 'Android', 'Windows', 'Other'],
      validate: [validateDevice, 'Please fill in the operating system type of your device']
    },
    otherDevice: {
        type: String,
        default: '',
        trim: true
    },
    description: {
        type: String,
        required: 'Please fill in the description of your problem',
        trim: true
    },
    liabilityAgreement:{
      type: Boolean,
      validate: [validateLiability, 'Unable to proceed if you do not agree with STS liability statement']
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
      enum: ['In queue', 'Pending', 'Work in progress', 'Completed', 'Unresolved'],
      default: ['In queue']
    },
    technician: {
        type: Schema.ObjectId,
        ref: 'User'
    },
    workNote: {
        type: String,
        default: '',
        trim: true
    },
    resolution: {
      type: String,
        default: '',
        trim: true
    },
    serviceStartTime: {
        type: Date
    },
    resolutionTime: {
      type: Date
    }

});

PostSchema.plugin(autoIncrement.plugin, 'Walkin');
mongoose.model('Walkin', WalkinSchema);
