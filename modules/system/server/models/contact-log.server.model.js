'use strict';

var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

// Schema
var ContactLogSchema = new Schema({
  type: {
    type: String,
    trim: true,
    required: true,
    enum: ['email', 'phone']
  },
  customer: {
    type: Schema.ObjectId,
    ref: 'User',
    required: true
  },
  technician: {
    type: Schema.ObjectId,
    ref: 'User',
    required: true
  },
  detail:{
    type: String,
    trim: true,
    default: ''
  },
  contactedAt: {
    type: Date,
    default: Date.now
  }
});

mongoose.model('ContactLog', ContactLogSchema);
