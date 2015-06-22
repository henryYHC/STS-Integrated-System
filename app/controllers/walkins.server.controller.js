'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors.server.controller'),
	User = mongoose.model('User'),
    Walkin = mongoose.model('Walkin'),
	_ = require('lodash');

/**
 * Create a Walkin
 */
exports.create = function(req, res) {
	var user, data = req.body;

    if(!data.userExisted){
        data.user.provider = 'local';
        data.user.displayName = data.user.firstName + ' ' + data.user.lastName;
        data.user.lastWalkin = Date.now();
        user = new User(data.user);

        user.save(function(err){
            if (err) return res.status(400).send({   message: errorHandler.getErrorMessage(err) });

            delete data.user;   delete data.userExisted;
            var walkin = new Walkin(data);
            walkin.user = user._id;

            if(!walkin.deviceType) walkin.deviceType = 'N/A';
            if(!walkin.os)         walkin.os = 'N/A';

            walkin.save(function(err) {
                if (err){ return res.status(400).send({ message: errorHandler.getErrorMessage(err) }); }
                else     res.jsonp(walkin);
            });
        });
    }
    else{
        data.user.lastWalkin = Date.now();
        User.findOne({
            _id: data.user._id
        }).exec(function(err, foundUser) {
            if (!foundUser) return res.status(400).send({ message: 'Failed to load User ' + data.user._id });
            foundUser = _.extend(foundUser, data.user);

            foundUser.save(function(err){
                if (err) return res.status(400).send({   message: errorHandler.getErrorMessage(err) });

                delete data.user;   delete data.userExisted;
                var walkin = new Walkin(data);
                walkin.user = foundUser._id;

                if(!walkin.deviceType) walkin.deviceType = 'N/A';
                if(!walkin.os)         walkin.os = 'N/A';

                console.log(walkin);

                walkin.save(function(err) {
                    console.log(err);
                    if (err){ return res.status(400).send({ message: errorHandler.getErrorMessage(err) }); }
                    else{
                        res.jsonp(walkin);
                    }
                });
            });
        });
    }
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
    walkin.updated = Date.now();
    walkin.lastUpdateTechnician = req.user._id;

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
    walkin = _.extend(walkin , {isActive : false});

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
 * List of Walkins
 */
exports.queue = function(req, res){
    Walkin.find({ isActive : true, status : 'In queue' }).sort('-created').populate('user', 'username displayName').exec(function(err, walkins) {
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            res.jsonp(walkins);
        }
    });
};

exports.list = function(req, res) {
	Walkin.find({ isActive : true }).sort('-created').populate('user', 'username displayName').exec(function(err, walkins) {
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
	Walkin.findById(id).populate('user', 'displayName username phone location').exec(function(err, walkin) {
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
	if (req.walkin.user.id !== req.user.id && req.user.roles === 'customer') {
		return res.status(403).send('User is not authorized');
	}
	next();
};

/*
 * Walkin util
 */
exports.getLocationOptions = function (req, res) {
    res.json(User.schema.path('location').enumValues);
};
exports.getDeviceType = function (req, res) {
    res.json(Walkin.schema.path('deviceCategory').enumValues);
};
exports.getDeviceInfo = function (req, res) {
    res.json(Walkin.schema.path('deviceType').enumValues);
};
exports.getDeviceOS = function (req, res) {
    res.json(Walkin.schema.path('os').enumValues);
};
