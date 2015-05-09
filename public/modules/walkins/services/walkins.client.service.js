'use strict';

//Walkins service used to communicate Walkins REST endpoints
angular.module('walkins').factory('Walkins', ['$resource',
	function($resource) {
		return $resource('walkins/:walkinId', { walkinId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);