'use strict';

var _ = require('lodash'),
    errorHandler = require('../errors.server.controller.js'),
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

var wildcard_prefixes = ['conf', 'sihp'];

/*
 * Validation
 */
exports.validateNetId = function(req, res){
    var user = req.profile;
    var netid = (user)? user.username : req.netid.toLowerCase();

    for(var i = 0; i < wildcard_prefixes.length; i++){
        if(netid.lastIndexOf(wildcard_prefixes[i], 0) === 0)
            return res.jsonp({ status : 'Wildcard', user : { username: netid, verified : true }, userExisted : user !== undefined });
    }

    if(!user){
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

        if(!user.isActive || !user.verified)  res.jsonp( { status : 'Invalid', user : user });
        else                res.jsonp( { status : 'Found', user : user });
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
