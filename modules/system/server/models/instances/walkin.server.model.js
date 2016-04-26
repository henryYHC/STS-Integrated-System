'use strict';

var
  mongoose = require('mongoose'),
  Schema = mongoose.Schema,
  autoIncrement = require('mongoose-auto-increment');

autoIncrement.initialize(mongoose.connection);

// Field validations
var validateDevice = function(){
  var device = this.deviceCategory;
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

// Schema
var WalkinSchema = new Schema({
  user: {
    type: Schema.ObjectId,
    ref: 'User'
  },
  deviceCategory: {
    type: String,
    required: 'Please fill in the category of your device',
    enum: ['Computer', 'Phone/Tablet', 'Gaming System', 'TV/Media Device', 'Other']
  },
  deviceType: {
    type: String,
    default: 'N/A',
    trim: true,
    validate: [validateDevice, 'Please fill in the type of your device']
  },
  os: {
    type: String,
    default: 'N/A',
    trim: true,
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
    enum: ['In queue', 'Duplicate', 'House call pending', 'Work in progress', 'Completed', 'Unresolved'],
    default: ['In queue']
  },
  lastUpdateTechnician: {
    type: Schema.ObjectId,
    ref: 'User'
  },
  workNote: {
    type: String,
    default: '',
    trim: true
  },
  resolutionType: {
    type: String,
    default: 'N/A',
    trim: true
  },
  otherResolution: {
    type: String,
    default: '',
    trim: true
  },
  resolution: {
    type: String,
    default: '',
    trim: true
  },
  serviceTechnician: {
    type: Schema.ObjectId,
    ref: 'User'
  },
  resoluteTechnician: {
    type: Schema.ObjectId,
    ref: 'User'
  },
  serviceStartTime: {
    type: Date
  },
  resolutionTime: {
    type: Date
  },
  contactLog: {
    type: [Schema.ObjectId],
    ref: 'ContactLog',
    default: []
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

WalkinSchema.pre('save', function(next) {
  this.updated = Date.now(); next();
});

WalkinSchema.plugin(autoIncrement.plugin, 'Walkin');
mongoose.model('Walkin', WalkinSchema);
