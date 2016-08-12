'use strict';

var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

// Schema
var MessageSchema = new Schema({
  type: {
    type: String,
    enum: ['flag', 'notification', 'technician'],
    required: true
  },
  to: {
    type: Schema.ObjectId,
    ref: 'User',
    required: true
  },
  from: {
    type: Schema.ObjectId,
    ref: 'User'
  },
  message:{
    type: String,
    trim: true,
    required: true
  },
  created: {
    type: Date,
    default: Date.now
  }
});

mongoose.model('Message', MessageSchema);
