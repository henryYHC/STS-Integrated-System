'use strict';

/**
 * Module dependencies
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

var SystemSettingSchema = new Schema({
  user_validation_method : {
    type: String,
    enum: ['Online Directory', 'User Entry', 'Manual'],
    default: 'Manual'
  },
  user_wildcard_prefixes : {
    type: [{
      type: String,
      trim: true
    }],
    default: []
  },
  location_options : {
    type: [{
      type: String,
      trim: true
    }],
    default: []
  },
  computer_options : {
    type: [{
      type: Schema.ObjectId,
      ref: 'KeyValueList'
    }],
    default: []
  },
  computer_os_editions : {
    type: [{
      type: String,
      trim: true
    }],
    default: []
  },
  device_options: {
    type: [{
      type: Schema.ObjectId,
      ref: 'KeyValueList'
    }],
    default: []
  },
  scheduler_settings : {
    type: [{
      type: String,
      trim: true
    }],
    default: []
  },
  servicenow_liveSync : {
    type: Boolean,
    default: false
  },
  updated : {
    type: Date,
    default: Date.now()
  }
});

SystemSettingSchema.pre('save', function (next) {
  this.updated = Date.now(); next();
});

mongoose.model('SystemSetting', SystemSettingSchema);
