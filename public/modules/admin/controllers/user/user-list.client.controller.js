'use strict';

angular.module('admin').controller('AdminUserListingController', ['$scope', '$http', '$location', 'Authentication',
	function($scope, $http, $location, Authentication) {

		var user = Authentication.user;
		if (!user)
			$location.path('/');
		else if(user.roles.indexOf('technician') < 0 && user.roles.indexOf('admin') < 0)
			$location.path('/');
		else if(user.roles.indexOf('admin') >= 0)
			$scope.isAdmin = true;

		$scope.listInactive = function(){
			$http.get('/user/list/invalid').success(function(response){ $scope.users = response; });
		};

		$scope.listBySearch = function(){
			if($scope.search.query){
				var query = {$or :
					[{ username : { '$regex' : $scope.search.query.toLowerCase(), '$options': 'i' } },
						{ displayName: { '$regex' : $scope.search.query, '$options': 'i' } }] };

				$http.post('/user/list/listBySearch', query).success(function(response){ $scope.users = response; });
			}
		};

		$scope.setActivity = function(user){
			var username = user.username;

			if(user.isActive)
				$http.delete('/users/setInactive/'+username).error(function(){ alert('Action failed.'); });
			else
				$http.post('/users/setActive/'+username).error(function(){ alert('Action failed.'); });

			user.isActive = !user.isActive;
		};
	}
]);
