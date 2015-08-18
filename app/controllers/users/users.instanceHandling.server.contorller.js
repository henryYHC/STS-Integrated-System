'use strict';

var _ = require('lodash'),
    errorHandler = require('../errors.server.controller'),
    mongoose = require('mongoose'),
    User = mongoose.model('User');

/*
 * User-Instance middleware
 */
exports.userByNetId = function(req, res, next, username) {
    User.findOne({
        username: username.toLowerCase()
    }).exec(function(err, user) {
        if (err) return next(err);

        if (!user) req.profile = null;
        else       req.profile = user;
        next();
    });
};

exports.updateUser = function(req, res){
    var user = _.extend(req.profile, req.body);
    user.updated = Date.now();
    user.displayName = user.firstName + ' ' + user.lastName;

    user.save(function(err){
        if(err) return res.status(400).send('Cannot save user object.');
        res.json(user);
    });
};

/*
 * Validation
 */
exports.validateNetId = function(req, res){
    var user = req.profile;

    if(!user)
        res.jsonp( { status : 'Not found', user : user });
    else{
        user.provider = undefined;
        user.password = undefined;
        user.roles = undefined;
        res.jsonp( { status : 'Found', user : user });
    }
};

exports.verifyNetId = function(req, res){
    var user = req.profile;

    if(user && !user.verified){
        user.verified = true;
        user.save(function(err) {
            if (err)    return res.status(400).send({ message: errorHandler.getErrorMessage(err) });
            res.jsonp(user);
        });
    }
    else
        res.jsonp(user);
};
