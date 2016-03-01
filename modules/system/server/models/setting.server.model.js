'use strict';

/**
 * Module dependencies
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * User Schema
 */
var SettingSchema = new Schema({
  user_validation_method : {
    type: String,
    enum: ['Online Directory', 'User Entry', 'Manual'],
    default: 'Manual'
  },
  location_options : {
    type: [{
      type: String,
      trim: true
    }],
    default: []
  },
  device_options : {
    type: Schema.Types.Mixed,
    default: {}
  },
  scheduler_settings : {
    type: Schema.Types.Mixed,
    default: {}
  },
  servicenow_liveSync :{
    type: Boolean,
    default: false
  },
  updated : {
    type: Date,
    default: Date.now()
  }
});

/**
 * Hook a pre save method to hash the password
 */
SettingSchema.pre('save', function (next) {
  this.updated = Date.now();

  next();
});

mongoose.model('Setting', SettingSchema);
