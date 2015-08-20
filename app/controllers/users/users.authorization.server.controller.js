'use strict';

/**
 * Module dependencies.
 */
var _ = require('lodash'),
	mongoose = require('mongoose'),
	User = mongoose.model('User');

/**
 * User middleware
 */
exports.userByID = function(req, res, next, id) {
	User.findOne({
		_id: id
	}).exec(function(err, user) {
		if (err) return next(err);
		if (!user) return next(new Error('Failed to load User ' + id));

        req.profile = user;
		next();
	});
};

exports.userByNetId = function(req, res, next, username) {
    User.findOne({
        username: username.toLowerCase()
    }).exec(function(err, user) {
        if (err)    return next(err);
        if (!user)  req.netid = username;
        else        req.profile = user;
        next();
    });
};

/**
 * Require login routing middleware
 */
exports.requiresLogin = function(req, res, next) {
	if (!req.isAuthenticated()) {
		return res.status(401).send({ message: 'User is not logged in' });
	}
	next();
};

/**
 * User authorizations routing middleware
 */
exports.hasAdmin = function(req, res, next){
    User.find({ roles : { $in : ['admin'] } }, function(err, result){
        if(result.length)
            return res.status(400).send({ message: 'Admin account has been initialized' });

        req.body.roles = ['admin'];
        next();
    });
};

exports.hasAdminPermission = function(req, res, next){
    if (!req.isAuthenticated())
        return res.status(401).send({ message: 'User is not logged in' });

    if (_.intersection(req.user.roles, ['admin']).length)
        next();
    else
        res.status(403).send({ message: 'User is not authorized' });
};

exports.hasTechnicianPermission = function(req, res, next){
    if (!req.isAuthenticated())
        return res.status(401).send({ message: 'User is not logged in' });

    if (_.intersection(req.user.roles, ['technician']).length)
        next();
    else
        res.status(403).send({ message: 'User is not authorized' });
};

exports.hasPermission = function(req, res, next){
    if (!req.isAuthenticated())
        return res.status(401).send({ message: 'User is not logged in' });

    if (_.intersection(req.user.roles, ['admin', 'technician']).length === 0)
        return res.status(403).send({ message: 'User is not authorized' });
    else
        return next();
};

exports.hasAuthorization = function(roles) {
    var _this = this;

    return function(req, res, next) {
        _this.requiresLogin(req, res, function() {
            if (_.intersection(req.user.roles, roles).length) {
                return next();
            } else {
                return res.status(403).send({
                    message: 'User is not authorized'
                });
            }
        });
    };
};
