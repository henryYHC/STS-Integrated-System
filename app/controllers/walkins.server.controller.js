'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors.server.controller'),
	Walkin = mongoose.model('Walkin'),
	_ = require('lodash');

/**
 * Create a Walkin
 */
exports.create = function(req, res) {
	var walkin = new Walkin(req.body);
	walkin.user = req.user;

	walkin.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(walkin);
		}
	});
};

/**
 * Show the current Walkin
 */
exports.read = function(req, res) {
	res.jsonp(req.walkin);
};

/**
 * Update a Walkin
 */
exports.update = function(req, res) {
	var walkin = req.walkin ;

	walkin = _.extend(walkin , req.body);

	walkin.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(walkin);
		}
	});
};

/**
 * Delete an Walkin
 */
exports.delete = function(req, res) {
	var walkin = req.walkin ;

	walkin.remove(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(walkin);
		}
	});
};

/**
 * List of Walkins
 */
exports.list = function(req, res) { 
	Walkin.find().sort('-created').populate('user', 'displayName').exec(function(err, walkins) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(walkins);
		}
	});
};

/**
 * Walkin middleware
 */
exports.walkinByID = function(req, res, next, id) { 
	Walkin.findById(id).populate('user', 'displayName').exec(function(err, walkin) {
		if (err) return next(err);
		if (! walkin) return next(new Error('Failed to load Walkin ' + id));
		req.walkin = walkin ;
		next();
	});
};

/**
 * Walkin authorization middleware
 */
exports.hasAuthorization = function(req, res, next) {
	if (req.walkin.user.id !== req.user.id) {
		return res.status(403).send('User is not authorized');
	}
	next();
};
