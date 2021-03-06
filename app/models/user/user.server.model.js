'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema,
	crypto = require('crypto');

/**
 * User Schema
 */
var UserSchema = new Schema({
    roles: {
        type: [{
            type: String,
            enum: ['admin', 'technician', 'customer']
        }],
        default: ['customer']
    },

    //Basic information
	firstName: {
		type: String,
		trim: true,
		default: '',
		required: 'Please fill in your first name'
	},
	lastName: {
		type: String,
		trim: true,
		default: '',
		required: 'Please fill in your last name'
	},
	displayName: {
		type: String,
		trim: true
	},
	isWildcard : {
		type: Boolean,
		default: false
	},
	username: {
		type: String,
		required: 'Please fill in your NetID',
		trim: true
	},
	password: {
		type: String,
		default: ''
	},
    phone: {
        type: String,
        required: 'Please fill in your phone number'
    },
    location: {
        type: String,
        enum: [ 'Alabama', 'Alpha Delta Pi', 'Alpha Epsilon Pi', 'Alpha Kappa Alpha', 'Art/Lit./Media House',
                'Alpha Tau Omega', 'Black Student Allience', 'Beta Theta Pi', 'Clairmont CRC', 'Clairmont Towers',
                'Clairmont URC', 'Clifton', 'Delta Delta Delta', 'Delta Phi Epsilon',
                'Delta Phi Lambda', 'Dobbs', 'Evans', 'Few', 'Gamma Phi Beta', 'German Hall',
                'Hamilton', 'Harris', 'Hopkins', 'Kappa Alpha Theta', 'Kappa Kappa Gamma',
                'Kappa Sigma', 'Longstreet', 'Pi Kappa Alpha', 'Raoul', 'Sigma Alpha Epsilon',
                'Sigma Chi', 'Sigma Delta Tau', 'Smith', 'Spanish House', 'Thomas', 'Turman',
                'Woodruff', 'Xi Kappa', 'Zeta Beta Tau', 'Off Campus'],
        required: 'Please fill in your residence hall (or off-campus)'
    },
    verified: {
        type: Boolean,
        default: false
    },
    //User log information
    updated: {
        type: Date
    },
    created: {
        type: Date,
        default: Date.now
    },
    lastWalkin: {
        type: Date
    },
    lastCheckin: {
        type: Date
    },
    //messages: {
    //    type: Schema.ObjectId,
    //    ref: 'Message'
    //},

    //System log information
	isActive: {
		type: Boolean,
		default: true
	},
	salt: {
		type: String
	},
	provider: {
		type: String,
		required: 'Provider is required'
	},
	providerData: {},
	additionalProvidersData: {},

	/* For reset password */
	resetPasswordToken: {
		type: String
	},
	resetPasswordExpires: {
		type: Date
	}
});

/**
 * Hook a pre save method to hash the password
 */
UserSchema.pre('save', function(next) {
	if (this.password) {
		this.salt = new Buffer(crypto.randomBytes(16).toString('base64'), 'base64');
		this.password = this.hashPassword(this.password);
	}

    this.username = this.username.toLowerCase();
	this.displayName = this.firstName + ' ' + this.lastName;
	next();
});

/**
 * Create instance method for hashing a password
 */
UserSchema.methods.hashPassword = function(password) {
	if (this.salt && password) {
		return crypto.pbkdf2Sync(password, this.salt, 10000, 64).toString('base64');
	} else {
		return password;
	}
};

/**
 * Create instance method for authenticating user
 */
UserSchema.methods.authenticate = function(password) {
	return this.password === this.hashPassword(password);
};

mongoose.model('User', UserSchema);
