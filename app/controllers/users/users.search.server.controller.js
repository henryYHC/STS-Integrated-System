'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    _ = require('lodash'),
    User = mongoose.model('User'),
    UserEntry = mongoose.model('UserEntry');

var selectedFields = '-password -salt -provider -providerData -resetPasswordToken -resetPasswordExpires';

exports.listInvalid = function(req, res){
    User.find({isActive : false})
        .select(selectedFields)
        .exec(function(err, users){
            if(err) return res.status(400).send(err);
            res.json(users);
        });
};

exports.listBySearch = function(req, res){
    var query = req.body;

    User.find(query).select(selectedFields)
        .exec(function(err, users){
            if(err) return res.status(400).send(err);
            res.json(users);
        });
};
