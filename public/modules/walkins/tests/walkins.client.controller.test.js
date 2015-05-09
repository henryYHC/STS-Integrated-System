'use strict';

(function() {
	// Walkins Controller Spec
	describe('Walkins Controller Tests', function() {
		// Initialize global variables
		var WalkinsController,
		scope,
		$httpBackend,
		$stateParams,
		$location;

		// The $resource service augments the response object with methods for updating and deleting the resource.
		// If we were to use the standard toEqual matcher, our tests would fail because the test values would not match
		// the responses exactly. To solve the problem, we define a new toEqualData Jasmine matcher.
		// When the toEqualData matcher compares two objects, it takes only object properties into
		// account and ignores methods.
		beforeEach(function() {
			jasmine.addMatchers({
				toEqualData: function(util, customEqualityTesters) {
					return {
						compare: function(actual, expected) {
							return {
								pass: angular.equals(actual, expected)
							};
						}
					};
				}
			});
		});

		// Then we can start by loading the main application module
		beforeEach(module(ApplicationConfiguration.applicationModuleName));

		// The injector ignores leading and trailing underscores here (i.e. _$httpBackend_).
		// This allows us to inject a service but then attach it to a variable
		// with the same name as the service.
		beforeEach(inject(function($controller, $rootScope, _$location_, _$stateParams_, _$httpBackend_) {
			// Set a new global scope
			scope = $rootScope.$new();

			// Point global variables to injected services
			$stateParams = _$stateParams_;
			$httpBackend = _$httpBackend_;
			$location = _$location_;

			// Initialize the Walkins controller.
			WalkinsController = $controller('WalkinsController', {
				$scope: scope
			});
		}));

		it('$scope.find() should create an array with at least one Walkin object fetched from XHR', inject(function(Walkins) {
			// Create sample Walkin using the Walkins service
			var sampleWalkin = new Walkins({
				name: 'New Walkin'
			});

			// Create a sample Walkins array that includes the new Walkin
			var sampleWalkins = [sampleWalkin];

			// Set GET response
			$httpBackend.expectGET('walkins').respond(sampleWalkins);

			// Run controller functionality
			scope.find();
			$httpBackend.flush();

			// Test scope value
			expect(scope.walkins).toEqualData(sampleWalkins);
		}));

		it('$scope.findOne() should create an array with one Walkin object fetched from XHR using a walkinId URL parameter', inject(function(Walkins) {
			// Define a sample Walkin object
			var sampleWalkin = new Walkins({
				name: 'New Walkin'
			});

			// Set the URL parameter
			$stateParams.walkinId = '525a8422f6d0f87f0e407a33';

			// Set GET response
			$httpBackend.expectGET(/walkins\/([0-9a-fA-F]{24})$/).respond(sampleWalkin);

			// Run controller functionality
			scope.findOne();
			$httpBackend.flush();

			// Test scope value
			expect(scope.walkin).toEqualData(sampleWalkin);
		}));

		it('$scope.create() with valid form data should send a POST request with the form input values and then locate to new object URL', inject(function(Walkins) {
			// Create a sample Walkin object
			var sampleWalkinPostData = new Walkins({
				name: 'New Walkin'
			});

			// Create a sample Walkin response
			var sampleWalkinResponse = new Walkins({
				_id: '525cf20451979dea2c000001',
				name: 'New Walkin'
			});

			// Fixture mock form input values
			scope.name = 'New Walkin';

			// Set POST response
			$httpBackend.expectPOST('walkins', sampleWalkinPostData).respond(sampleWalkinResponse);

			// Run controller functionality
			scope.create();
			$httpBackend.flush();

			// Test form inputs are reset
			expect(scope.name).toEqual('');

			// Test URL redirection after the Walkin was created
			expect($location.path()).toBe('/walkins/' + sampleWalkinResponse._id);
		}));

		it('$scope.update() should update a valid Walkin', inject(function(Walkins) {
			// Define a sample Walkin put data
			var sampleWalkinPutData = new Walkins({
				_id: '525cf20451979dea2c000001',
				name: 'New Walkin'
			});

			// Mock Walkin in scope
			scope.walkin = sampleWalkinPutData;

			// Set PUT response
			$httpBackend.expectPUT(/walkins\/([0-9a-fA-F]{24})$/).respond();

			// Run controller functionality
			scope.update();
			$httpBackend.flush();

			// Test URL location to new object
			expect($location.path()).toBe('/walkins/' + sampleWalkinPutData._id);
		}));

		it('$scope.remove() should send a DELETE request with a valid walkinId and remove the Walkin from the scope', inject(function(Walkins) {
			// Create new Walkin object
			var sampleWalkin = new Walkins({
				_id: '525a8422f6d0f87f0e407a33'
			});

			// Create new Walkins array and include the Walkin
			scope.walkins = [sampleWalkin];

			// Set expected DELETE response
			$httpBackend.expectDELETE(/walkins\/([0-9a-fA-F]{24})$/).respond(204);

			// Run controller functionality
			scope.remove(sampleWalkin);
			$httpBackend.flush();

			// Test array after successful delete
			expect(scope.walkins.length).toBe(0);
		}));
	});
}());