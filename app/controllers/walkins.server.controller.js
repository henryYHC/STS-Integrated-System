'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors.server.controller'),
	User = mongoose.model('User'),
    Walkin = mongoose.model('Walkin'),
	_ = require('lodash'),
    servicenow = require('../../app/controllers/servicenow-requestor.server.controller');

var popOpt = [
    { path : 'user', model : 'User', select : 'displayName username phone location verified'},
    { path : 'lastUpdateTechnician', model : 'User', select : 'displayName username'},
    { path : 'serviceTechnician', model : 'User', select : 'displayName username'},
    { path : 'resoluteTechnician', model : 'User', select : 'displayName username'}
];

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
            user.lastWalkin = walkin;

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

                walkin.save(function(err) {
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
            if(walkin.snSysId)
                servicenow.updateWalkinIncident(walkin);
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

    if(walkin.status !== 'Completed')
        walkin.status = 'Unresolved';

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
    var d = new Date(), today = new Date(d.getFullYear()+','+(d.getMonth()+1)+','+d.getDate());
    Walkin.find({ isActive : true, $or : [ {status : 'In queue'}, {status : 'Work in progress'}], created : {$gt : today} }).sort('created').exec(function(err, walkins) {
        if (err) return res.status(400).send({ message: errorHandler.getErrorMessage(err) });

        Walkin.find({ isActive : true, status: 'House call pending'}).sort('created').exec(function(err, houseCalls) {
            if(err)return res.status(400).send({ message: errorHandler.getErrorMessage(err) });

            walkins = walkins.concat(houseCalls);
            Walkin.populate(walkins, popOpt, function(err, response){
                if(err) return res.status(400).send({ message: errorHandler.getErrorMessage(err) });
                res.jsonp(response);
            });
        });
    });
};

exports.listAll = function(req, res) {
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

exports.listToday = function(req, res) {
    var d = new Date(), today = new Date(d.getFullYear()+','+(d.getMonth()+1)+','+d.getDate());
    Walkin.find({ isActive : true, created : {$gt : today} }).sort('-created').populate('user', 'username displayName').exec(function(err, walkins) {
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            res.jsonp(walkins);
        }
    });
};

exports.listUnresolved = function(req, res) {
    Walkin.find({ isActive : true, status : { $ne : 'Completed' } }).sort('-created').populate('user', 'username displayName').exec(function(err, walkins) {
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            res.jsonp(walkins);
        }
    });
};

exports.listBySearch = function(req, res){
    var query = req.body;
    if(query.created){
        var d = new Date(query.created), nd = new Date((new Date(d)).setDate(d.getDate() + 1));
        query.created = { $gt : d, $lt: nd };
        Walkin.find(query).sort('-created').populate('user', 'username displayName').exec(function(err, walkins) {
            if (err) return res.status(400).send({ message: errorHandler.getErrorMessage(err) });
            res.jsonp(walkins);
        });
    }
    else{
        User.findOne(query, function(err, user){
            if(err) return res.status(400).send({ message: errorHandler.getErrorMessage(err) });
            Walkin.find({user : user}).sort('-created').populate('user', 'username displayName').exec(function(err, walkins) {
                if (err) return res.status(400).send({ message: errorHandler.getErrorMessage(err) });
                res.jsonp(walkins);
            });
        });
    }
};

/*
 * Walkin logs
 */

exports.logService = function(req, res){
    var walkin = req.walkin ;
    walkin = _.extend(walkin , {serviceTechnician : req.user, serviceStartTime : Date.now() });
    walkin.updated = Date.now();
    walkin.status = 'Work in progress';

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

exports.logResolution = function(req, res){
    var walkin = req.walkin ;
    walkin = _.extend(walkin , {resoluteTechnician : req.user, resolutionTime : Date.now() });
    walkin.updated = Date.now();
    walkin.status = 'Completed';

    walkin.save(function(err) {
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            console.log(walkin);
            servicenow.createWalkinIncident(walkin);
            res.jsonp(walkin);
        }
    });
};

/**
 * Walkin middleware
 */
exports.walkinByID = function(req, res, next, id) {
	Walkin.findById(id).exec(function(err, walkin) {
		if (err) return next(err);
		if (! walkin) return next(new Error('Failed to load Walkin ' + id));

        Walkin.populate(walkin, popOpt, function(err, walkin){
            if (err) return next(err);
            req.walkin = walkin;
            next();
        });
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
exports.getResolutionOptions = function(req, res){
    res.json(Walkin.schema.path('resolutionType').enumValues);
};
