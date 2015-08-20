'use strict';

var _ = require('lodash'),
    errorHandler = require('../errors.server.controller'),
    mongoose = require('mongoose'),
    User = mongoose.model('User'),
    UserEntry = mongoose.model('UserEntry');

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

    if(!user){
        var netid = req.netid.toLowerCase();
        UserEntry.findOne({netid : netid}, function(err, entry){
            if(err) return res.status(400).send(err);

            if(entry){
                user = { username: entry.netid, firstName: entry.firstName, lastName: entry.lastName, verified: true };
                res.jsonp( { status : 'Valid', user : user });
            }
            else res.jsonp( { status : 'Not found', user : user });
        });
    }
    else{
        user.roles = undefined;
        user.provider = undefined;
        user.password = undefined;
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
