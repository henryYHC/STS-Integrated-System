'use strict';

angular.module('technician').controller('WalkinQueueController', ['$scope', '$http', 'Authentication',
  function ($scope, $http, Authentication) {
    var user = Authentication.getUser();

    $scope.walkins = [
      { _id: 0, user: { username : 'npari22', firstName : 'Nihar', lastName : 'Parikh', displayName: 'Nihar Parikh', phone : '1234567890', location : 'Off-campus', verified : true },
        serviceTechnician : { username : 'yche463', firstName : 'Henry', lastName : 'Chen', displayName: 'Henry Chen' },
        deviceCategory : 'Computer', deviceInfo : 'Windows 10',
        description : 'Computer is messed up.',
        status : 'Work in progress', created: Date.now(), serviceStartTime : Date.now() },
      { _id: 1, user: { username : 'sbanana', firstName : 'Stacy', lastName : 'Banana', displayName: 'Stacy Banana' }, created: Date.now(), status : 'In queue', description: 'Cannot connect to EmoryUnplugged.' },
      { _id: 2, user: { username : 'mbuchma', firstName : 'Michael', lastName : 'Buchmann', displayName: 'Michael Buchmann', verified : true }, created: Date.now(), status : 'House call pending' }
    ];
    $scope.avgWaitTime = 2.3;

    var option2Obj = function(val){
      return { text : val, value : val };
    };

    $scope.init = function(){
      var i, walkins = $scope.walkins;

      $http.get('/api/technician/walkin/setting').success(function(setting){
        // Push specs for computer os
        var os = [];
        for(i in setting.computer_options)
          os = os.concat(setting.computer_options[i].values.map(option2Obj));

        // Create map for type -> specs
        var options = $scope.device_options = { Computer : os };
        for(i in setting.device_options)
          options[setting.device_options[i].key] = setting.device_options[i].values.map(option2Obj);
        options.Other = [];

        $scope.device_categories = (Object.keys(options)).map(option2Obj);
        $scope.location_options = setting.location_options.map(option2Obj);

        // Initialize resolution template 
        $scope.resolutions_options = setting.resolutions_options;

        // Select current working walk-in instance
        for(i in walkins){
          if(walkins[i].status === 'House call pending') break;
          else if(walkins[i].serviceTechnician.username === user.username){
            $scope.loadWalkin(walkins[i]._id); break;
          }
        }
      });
    };

    $scope.loadWalkin = function(id){
      var selected = $scope.selected = $scope.walkins[id];

      if(!selected.resolutionType)
        selected.resolutionType = $scope.resolutions_options.default;
    };

    // Watch if customer name changed.
    $scope.$watchGroup(['selected', 'selected.user.displayName'], function(n, o){
      if(o[0] == n[0] && o[1] !== n[1]){
        var name = n[1], idx = name.lastIndexOf(' ');
        $scope.selected.user.firstName = name.substring(0, idx);
        $scope.selected.user.lastName = name.substring(idx+1);
      }
    });

    // Watch if device category changed.
    $scope.$watch('selected.deviceCategory', function(n, o){
      if(o && n !== o) $scope.selected.deviceInfo = $scope.selected.otherDevice = undefined;
    });
  }
]);
