'use strict';

/**
 * Module dependencies.
 */
var _ = require('lodash'),
	errorHandler = require('../errors.server.controller.js'),
	mongoose = require('mongoose'),
	passport = require('passport'),
	User = mongoose.model('User'),
	config = require('../../../config/config'),
	async = require('async'),
	crypto = require('crypto');

/**
 * Forgot for reset password (forgot POST)
 */
exports.resetPassword = function(req, res) {
    var user = req.profile;
    if(!user) return res.status(400).send({ message: 'Not such username exists.'});

    crypto.randomBytes(6, function(err, buffer) {
        var token = buffer.toString('hex');
        user.password = token;
        user.save(function(err){
            if(err) return res.status(400).send({ message: errorHandler.getErrorMessage(err) });
            return res.status(200).send({ token : token });
        });
    });
};

exports.forceResetPassword = function(req, res){
    var user = req.profile;
    if(!user) return res.status(400).send({ message: 'Not such username exists.'});
    user.password = 'password';
    user.save(function(err){
        if(err) return res.status(400).send({ message: errorHandler.getErrorMessage(err) });
        res.status(200).send('Success');
    });
};

/**
 * Change Password
 */
exports.changePassword = function(req, res) {
	// Init Variables
	var passwordDetails = req.body;

	if (req.user) {
        if (passwordDetails.newPassword && passwordDetails.newPassword.length > 6) {
            User.findById(req.user.id, function(err, user) {
                if (user.authenticate(passwordDetails.currentPassword)) {
                    if (passwordDetails.newPassword === passwordDetails.verifyPassword) {
                        user.password = passwordDetails.newPassword;
                        user.save(function (err) {
                            if (err)
                                return res.status(400).send({message: errorHandler.getErrorMessage(err)});
                            else
                                return res.status(200).send({message: 'Password changed successfully, you will be redirected in 3 seconds.'});
                        });
                    } else
                        return res.status(400).send({message: 'Passwords do not match'});
                } else
                    return res.status(400).send({ message: 'Current password is incorrect' });
            });
        } else
            return res.status(400).send({ message: 'Please provide a new password (at least 7 characters)' });
	} else
		return res.status(400).send({ message: 'User is not signed in' });
};
