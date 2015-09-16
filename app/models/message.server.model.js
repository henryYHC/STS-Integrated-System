'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    //User = mongoose.model('User'),
	Schema = mongoose.Schema;

/**
 * Message Schema
 */
var MessageSchema = new Schema({
    netid: {
        type: String,
        trim: true,
        required: true
    },
    message: {
        type: String,
        required: true
    },
    urgency: {
        type: String,
        enum: ['Information', 'Notification', 'Requirement'],
        required: true
    },
    created:{
        type: Date,
        default: Date.now()
    }
});

MessageSchema.pre('save', function(next) {
    this.netid = this.netid.toLowerCase();
    next();
});

//MessageSchema.post('save', function(message){
//    User.findOne({username : message.netid}, function(err, user){
//        if(!err && message) user.messages.push(message._id);
//    })
//});

mongoose.model('Message', MessageSchema);
