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
    { path : 'user', model : 'User', select : 'firstName lastName displayName username phone location verified'},
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
        data.user.username = data.user.username.toLowerCase();
        data.user.lastWalkin = Date.now();

        user = new User(data.user);
        user.lastWalkin = Date.now();

        user.save(function(err){
            if (err) return res.status(400).send({   message: errorHandler.getErrorMessage(err) });

            delete data.user;
            delete data.userExisted;

            var walkin = new Walkin(data);
            walkin.user = user._id;
            if(!walkin.deviceType) walkin.deviceType = 'N/A';
            if(!walkin.os)         walkin.os = 'N/A';

            walkin.save(function(err) {
                if (err){   return res.status(400).send({ message: errorHandler.getErrorMessage(err) }); }
                else        res.jsonp(walkin);
            });
        });
    }
    else{
        data.user.lastWalkin = Date.now();

        User.findOne({_id: data.user._id}).exec(function(err, foundUser) {
            if (!foundUser) return res.status(400).send({ message: 'Failed to load User ' + data.user._id });
            foundUser = _.extend(foundUser, data.user);

            foundUser.save(function(err){
                if (err) return res.status(400).send({   message: errorHandler.getErrorMessage(err) });

                delete data.user;
                delete data.userExisted;

                var walkin = new Walkin(data);
                walkin.user = foundUser._id;
                if(!walkin.deviceType) walkin.deviceType = 'N/A';
                if(!walkin.os)         walkin.os = 'N/A';

                walkin.save(function(err) {
                    if (err){   return res.status(400).send({ message: errorHandler.getErrorMessage(err) }); }
                    else{       res.jsonp(walkin); }
                });
            });
        });
    }
};

exports.reassignNetId = function(req, res){
    var user = req.body.user, walkin = req.walkin;

    if(req.body.create){
        user = new User(user);
        user.provider = 'local';
        user.lastWalkin = walkin._id;
        user.update = Date.now();

        user.save(function(err){

            console.log(user);
            console.log(err);


            if(err) return res.status(400).send(err);

            walkin.user = user;
            walkin.updated = Date.now();

            walkin.save(function(err){
                if(err) res.status(400).send(err);
                res.json(walkin);
            });
        });
    }
    else {
        User.findOne({username : user.username}, function(err, user){
            if(!user || err) if(err) return res.status(400).send(err);

            user.lastWalkin = walkin._id;
            user.update = Date.now();

            user.save(function(err){
                if(err) return res.status(400).send(err);

                walkin.user = user;
                walkin.updated = Date.now();

                walkin.save(function(err){
                    if(err) res.status(400).send(err);
                    res.json(walkin);
                });
            });
        });
    }
};

exports.duplicate = function(req, res){
    var walkin = req.body;

    // Log information
    delete walkin._id; walkin.status = 'Duplicate';
    walkin = _.extend(walkin , { created : Date.now(), updated : Date.now() });

    // Empty fields
    delete walkin.lastUpdateTechnician;
    delete walkin.snValue; delete walkin.snSysId;
    delete walkin.resolution; delete walkin.otherResolution;
    delete walkin.workNote; delete walkin.resolutionType;

    walkin = new Walkin(walkin);
    walkin.save(function(err){
        if(err) return res.status(400).send(err);
        res.json(walkin);
    });
};

exports.duplicateFromId = function(req, res){
    var walkin = req.walkin;

    // Log information
    delete walkin._id; walkin.status = 'Duplicate';
    walkin = _.extend(walkin , { created : Date.now(), updated : Date.now() });

    // Empty fields
    delete walkin.lastUpdateTechnician;
    delete walkin.snValue; delete walkin.snSysId;
    delete walkin.resolution; delete walkin.otherResolution;
    delete walkin.workNote; delete walkin.resolutionType;

    walkin = new Walkin(walkin);
    walkin.save(function(err){
        if(err) return res.status(400).send(err);
        res.json(walkin);
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
    walkin.updated = Date.now();
    walkin.lastUpdateTechnician = req.user._id;

	walkin.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
            if(walkin.snSysId) servicenow.updateWalkinIncident(walkin);
			res.jsonp(walkin);
		}
	});
};

exports.syncWalkin = function(req, res){
    var walkin = req.walkin;
    walkin.updated = Date.now();

    walkin.save(function(err) {
        if (err)    return res.status(400).send({ message: errorHandler.getErrorMessage(err) });
        else {
            servicenow.createWalkinIncident(walkin, function(updatedWalkin){
                res.jsonp(updatedWalkin);
            });
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

exports.setUnresolved = function(req, res){
    var walkin = req.walkin, workNote = req.body.workNote;

    if(walkin && workNote){
        walkin = _.extend(walkin ,
            {   resoluteTechnician : req.user,
                resolutionTime : Date.now(),
                workNote : workNote,
                updated : Date.now(),
                status : 'Unresolved' }
        );

        walkin.save(function(err) {
            if (err)    return res.status(400).send({message: errorHandler.getErrorMessage(err)});
            else        return res.jsonp(walkin);
        });
    }
    else
        res.status(400).send('Insufficient information to set incident to unresolved.');
};

/**
 * List of Walkins
 */
exports.queue = function(req, res){
    Walkin.find({ isActive : true, $or : [ {status : 'In queue'}, {status : 'Work in progress'}, {status : 'Duplicate'}] }).sort('created').exec(function(err, walkins) {
        if (err) return res.status(400).send({ message: errorHandler.getErrorMessage(err) });

        // Dynamic refresh interval ( 10s - 5min )
        var i, walkin, waitingCount = 0, totalCount = walkins.length;
        for(i = 0; i < totalCount; i++){
            walkin = walkins[i];
            if(walkin.status === 'In queue')
                waitingCount++;
        }

        var interval = 360000;
        //if(totalCount > 0)  interval -= 350 * (waitingCount / totalCount) * 1000;

        Walkin.find({ isActive : true, status: 'House call pending'}).sort('created').exec(function(err, houseCalls) {
            if(err)return res.status(400).send({ message: errorHandler.getErrorMessage(err) });

            walkins = walkins.concat(houseCalls);
            Walkin.populate(walkins, popOpt, function(err, response){
                if(err) return res.status(400).send({ message: errorHandler.getErrorMessage(err) });
                res.jsonp({incidents : response, interval : interval});
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
    Walkin.find({ isActive : true, $or : [ {status : 'In queue'}, {status : 'Work in progress'}, {status : 'House call pending'}, {status: 'Duplicate'}] }).sort('-created').populate('user', 'username displayName').exec(function(err, walkins) {
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            res.jsonp(walkins);
        }
    });
};

exports.listUnSynced = function(req, res) {
    Walkin.find({ isActive : true, snValue : '', snSysId : '', status : 'Completed' }).sort('-created').populate('user', 'username displayName').exec(function(err, walkins) {
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            res.jsonp(walkins);
        }
    });
};

exports.listByNetId = function(req, res){
    var user = req.profile;

    Walkin.find({user : user}).sort('-created').populate('user', 'username displayName').exec(function(err, walkins) {
        if (err) return res.status(400).send({ message: errorHandler.getErrorMessage(err) });
        res.jsonp(walkins);
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
    else if(query.snValue){
        Walkin.find(query).sort('-created').populate('user', 'username displayName').exec(function(err, walkins) {
            if (err) return res.status(400).send({ message: errorHandler.getErrorMessage(err) });
            res.jsonp(walkins);
        });
    }
    else{
        User.find(query, function(err, users){
            if(err) return res.status(400).send({ message: errorHandler.getErrorMessage(err) });

            var ids = [];
            for(var i in users) ids.push(users[i]._id);

            Walkin.find({user : { $in : ids } }).sort('-created').populate('user', 'username displayName').exec(function(err, walkins) {
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

    walkin.status = 'Work in progress';
    if(!walkin.serviceTechnician || ! walkin.serviceStartTime){
        walkin = _.extend(walkin ,
            {serviceTechnician : req.user, serviceStartTime : Date.now(), updated : Date.now() }
        );
    }

    walkin.save(function(err) {
        if (err)    return res.status(400).send({ message: errorHandler.getErrorMessage(err) });
        else        return res.jsonp(walkin);
    });
};

exports.logResolution = function(req, res){
    var walkin = req.walkin ;

    walkin.status = 'Completed';
    if(!walkin.resoluteTechnician || !walkin.resolutionTime){
        walkin = _.extend(walkin ,
            {resoluteTechnician : req.user, resolutionTime : Date.now(), updated : Date.now() }
        );
    }

    walkin.save(function(err) {
        if (err)    return res.status(400).send({message: errorHandler.getErrorMessage(err)});
        else {
            //servicenow.createWalkinIncident(walkin);
            return res.jsonp(walkin);
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
