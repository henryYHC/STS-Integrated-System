'use strict';

var should = require('should'),
	request = require('supertest'),
	app = require('../../server'),
	mongoose = require('mongoose'),
	User = mongoose.model('User'),
	Walkin = mongoose.model('Walkin'),
	agent = request.agent(app);

/**
 * Globals
 */
var credentials, user, walkin;

/**
 * Walkin routes tests
 */
describe('Walkin CRUD tests', function() {
	beforeEach(function(done) {
		// Create user credentials
		credentials = {
			username: 'username',
			password: 'password'
		};

		// Create a new user
		user = new User({
			firstName: 'Full',
			lastName: 'Name',
			displayName: 'Full Name',
			email: 'test@test.com',
			username: credentials.username,
			password: credentials.password,
			provider: 'local'
		});

		// Save a user to the test db and create new Walkin
		user.save(function() {
			walkin = {
				name: 'Walkin Name'
			};

			done();
		});
	});

	it('should be able to save Walkin instance if logged in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Walkin
				agent.post('/walkins')
					.send(walkin)
					.expect(200)
					.end(function(walkinSaveErr, walkinSaveRes) {
						// Handle Walkin save error
						if (walkinSaveErr) done(walkinSaveErr);

						// Get a list of Walkins
						agent.get('/walkins')
							.end(function(walkinsGetErr, walkinsGetRes) {
								// Handle Walkin save error
								if (walkinsGetErr) done(walkinsGetErr);

								// Get Walkins list
								var walkins = walkinsGetRes.body;

								// Set assertions
								(walkins[0].user._id).should.equal(userId);
								(walkins[0].name).should.match('Walkin Name');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to save Walkin instance if not logged in', function(done) {
		agent.post('/walkins')
			.send(walkin)
			.expect(401)
			.end(function(walkinSaveErr, walkinSaveRes) {
				// Call the assertion callback
				done(walkinSaveErr);
			});
	});

	it('should not be able to save Walkin instance if no name is provided', function(done) {
		// Invalidate name field
		walkin.name = '';

		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Walkin
				agent.post('/walkins')
					.send(walkin)
					.expect(400)
					.end(function(walkinSaveErr, walkinSaveRes) {
						// Set message assertion
						(walkinSaveRes.body.message).should.match('Please fill Walkin name');
						
						// Handle Walkin save error
						done(walkinSaveErr);
					});
			});
	});

	it('should be able to update Walkin instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Walkin
				agent.post('/walkins')
					.send(walkin)
					.expect(200)
					.end(function(walkinSaveErr, walkinSaveRes) {
						// Handle Walkin save error
						if (walkinSaveErr) done(walkinSaveErr);

						// Update Walkin name
						walkin.name = 'WHY YOU GOTTA BE SO MEAN?';

						// Update existing Walkin
						agent.put('/walkins/' + walkinSaveRes.body._id)
							.send(walkin)
							.expect(200)
							.end(function(walkinUpdateErr, walkinUpdateRes) {
								// Handle Walkin update error
								if (walkinUpdateErr) done(walkinUpdateErr);

								// Set assertions
								(walkinUpdateRes.body._id).should.equal(walkinSaveRes.body._id);
								(walkinUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should be able to get a list of Walkins if not signed in', function(done) {
		// Create new Walkin model instance
		var walkinObj = new Walkin(walkin);

		// Save the Walkin
		walkinObj.save(function() {
			// Request Walkins
			request(app).get('/walkins')
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Array.with.lengthOf(1);

					// Call the assertion callback
					done();
				});

		});
	});


	it('should be able to get a single Walkin if not signed in', function(done) {
		// Create new Walkin model instance
		var walkinObj = new Walkin(walkin);

		// Save the Walkin
		walkinObj.save(function() {
			request(app).get('/walkins/' + walkinObj._id)
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Object.with.property('name', walkin.name);

					// Call the assertion callback
					done();
				});
		});
	});

	it('should be able to delete Walkin instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Walkin
				agent.post('/walkins')
					.send(walkin)
					.expect(200)
					.end(function(walkinSaveErr, walkinSaveRes) {
						// Handle Walkin save error
						if (walkinSaveErr) done(walkinSaveErr);

						// Delete existing Walkin
						agent.delete('/walkins/' + walkinSaveRes.body._id)
							.send(walkin)
							.expect(200)
							.end(function(walkinDeleteErr, walkinDeleteRes) {
								// Handle Walkin error error
								if (walkinDeleteErr) done(walkinDeleteErr);

								// Set assertions
								(walkinDeleteRes.body._id).should.equal(walkinSaveRes.body._id);

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to delete Walkin instance if not signed in', function(done) {
		// Set Walkin user 
		walkin.user = user;

		// Create new Walkin model instance
		var walkinObj = new Walkin(walkin);

		// Save the Walkin
		walkinObj.save(function() {
			// Try deleting Walkin
			request(app).delete('/walkins/' + walkinObj._id)
			.expect(401)
			.end(function(walkinDeleteErr, walkinDeleteRes) {
				// Set message assertion
				(walkinDeleteRes.body.message).should.match('User is not logged in');

				// Handle Walkin error error
				done(walkinDeleteErr);
			});

		});
	});

	afterEach(function(done) {
		User.remove().exec();
		Walkin.remove().exec();
		done();
	});
});