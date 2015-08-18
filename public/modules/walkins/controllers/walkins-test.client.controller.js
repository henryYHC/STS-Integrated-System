'use strict';

angular.module('walkins').controller('WalkinsTestController', ['$scope', '$http',
	function($scope, $http) {
        $scope.importDemoUserEntry = function(){
            var entry1 = {
                netid: 'AAADEDI',
                firstName: 'Azizat',
                lastName: 'Adediran',
                type: 'Staff/Student'
                },
                entry2 = {
                    netid: 'AAAUGUS',
                    firstName: 'Abel',
                    lastName: 'Augusthy',
                    type: 'Student/Staff'
                };

            $http.post('/userEntries', entry1);
            $http.post('/userEntries', entry2);
        };
	}
]);
