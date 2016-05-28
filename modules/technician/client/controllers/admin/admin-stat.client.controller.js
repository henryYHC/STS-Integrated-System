'use strict';

angular.module('technician.admin').controller('StatisticsController', ['$scope', '$http', '$state',
  function ($scope, $http, $state) {
    require('randomColor');

    var options =  { maintainAspectRatio: true, responsive: true };
    
    var createChart = function(id, type, data, options){
      new Chart(document.querySelector('#'+id), { type: type, data: data, options: options});
    };

    var createBarDataset = function(label, data){
      var color = randomColor({ luminosity: 'dark', format: 'rgbArray'}).toString();
      return {
        label: label, data: data, borderWidth: 1,
        backgroundColor: 'rgba('+color+',0.6)',
        borderColor: 'rgba('+color+',1.0)',
        hoverBackgroundColor: 'rgba('+color+',0.8)',
        hoverBorderColor: 'rgba('+color+',1.0)'
      }
    };
    
    $scope.initLibraryGuidanceStat = function(){
      $scope.year = new Date().getFullYear();
    };
  }
]);
